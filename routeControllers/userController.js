// NOTES:
// - Get current logged in User's properties (user session): 
//   - req.user.id, 
//   - req.user.username

//Export
const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN


const Table = require('../database/Table')
const Event = require('../database/Event')
const User = require('../database/User')
// ----------- CRUD operations -----------

// GET - Read all rows from DB
const readRows = async (req, res) => {

	try {
		const rows = await Table.find({ user: req.user.id }).lean()
		// lean() -> formatted js object
		// -> {company: _ , title: _, link: _, id: _, etc}
		// -> {company: _ , title: _, link: _, id: _, etc}
		// ...

		res.render('dashboard', { rows }) // send data to dashboard.ejs
	} catch (error) {
		req.flash('error', 'User does not exist!')
		return res.redirect('/auth/login')
	}
}

// GET - Send a Row based on an id to whoever fetch this URL (API!!!)
const fetchRow = async (req, res) => {
	try {
		const {id} = req.params
		const row = await Table.findById(id)
		// lean() -> formatted js object
		// -> {company: _ , title: _, link: _, id: _, etc}
		// -> {company: _ , title: _, link: _, id: _, etc}
		// ...
		res.json(row) // send data to be consumed by a fetch
	} catch (error) {
		return res.status('404')
	}
	
}


// POST - Creates and add new row to DB
const addRow = async (req, res) => {
	const { company, title, link, date, location, status, notes } = req.body

	try {
		// Creating Table Model
		const table = new Table({
			user: req.user.id,
			company: company,
			title: title,
			status: status,
			link: link,
			date: date,
			location: location,
			notes: notes,
		})
		await table.save() // Save to the database
		
		req.flash('success', 'Application added succesfully🔥')
		res.redirect('/user/dashboard')
	} catch (error) {
		req.flash('warning', 'Application is already in your list👎')
		return res.redirect('/user/dashboard')
	}
}


// PUT - Modifies a row in the DB
const editRow = async (req, res) => {
	
	try {
		const {id} = req.params
		const newData = req.body

		const updatedTable = await Table.findByIdAndUpdate(
			id,		  // ID of the table to updated
			newData,  // New data will replace the existing data
			{ new: true } // Return the updated document
		);

		res.json(updatedTable)	// Send back the updated table in json
		
	} catch (error) {
		res.status(500).json( { message: "Server is getting crazy"} )
	} 
}

const deleteRow = async (req, res) => {
	try {
		const { id } = req.params
		const row = await Table.findById(id)

		if (!row) 
			return res.statu(404).json({ error: "Application does not exist👎"})

		if(!row.user.equals(req.user.id)) 
			return res.status(401).json({error: "Application does not belong to you 🤡"})

		const rowDeleted = await Table.findByIdAndDelete(id)

		return res.json({ rowDeleted })
	} catch (error) {
		if (error.kind === 'ObjectId') {
			return res.status(403).json({ error: "ID format incorrect" })
		}
		return res.status(500).json({ error: "Server error"})
	}
}

// GET - get events based on date, month, year from DB
const getEvent = async (req, res) => {
	try {
		const { id } = req.params

		const events = await Event.find( { user: id } )

		res.json(events) // send data to be consumed by a fetch

	} catch (error) {
		res.status(500).json( { message: "We couldnt get your data. Our server is down 🤡"} )
	}
}


// POST - Add new event into DB
const addEvent = async (req, res) => {
	const { date, month, year, eventTitle, eventFrom, eventTo } = req.body
	
	try {
		// Create an Event Model
		const event = new Event({
			user: req.user.id,
			date: date,
			month: month,
			year: year,
			eventTitle: eventTitle,
			eventFrom: eventFrom,
			eventTo: eventTo
		})

		await event.save()	// Save event into the DB
		req.flash('success', 'Event added succesfully🔥')
		res.redirect('/user/calendar')

	} catch (error) {
			req.flash('warning', 'We coudlnt add your event 👎')
			return res.redirect('/user/calendar')
	}
}

async function sendMail(table, userEmail) {
	try {
		const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
		oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'jeij98268@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: 'AppTracker <no-reply@apptracker.onrender.com>',
            to: userEmail,
            subject: 'Export Data from AppTracker',
            text: 'Error!',
            html: table
        };

        const result = await transport.sendMail(mailOptions);

        return result;
    } catch (e) {
        return e;
    }
}

const exportTable = async (req, res) => {
	let table = `<table border="1">
							<thead>
								<tr>
									<th>Company Name</th>
									<th>Title</th>
									<th>Status</th>
									<th>Link</th>
									<th>Date</th>
									<th>Location</th>
									<th>Notes</th>
								</tr>
							</thead>
							<tbody>`;

	try {
		const userRows = await Table.find({user: req.user.id})
		const user = await User.findById( req.user.id )

		userRows.forEach( each => {
			table += `<tr>
									<td>${each.company}</td>
									<td>${each.title}</td>
									<td>${each.status}</td>
									<td>${each.link}</td>
									<td>${each.date}</td>
									<td>${each.location}</td>
									<td>${each.notes}</td>
								</tr>
								`
		})

		table += `</tbody></table>`

		sendMail(table, user.email)
			.then(result => console.log('Email send...', result))
			.catch(error => console.log(error.message))
		
		return res.json({msg:'Your table was exported. Check your email 😀'})


	} catch (error) {
		req.flash('warning', 'We couldnt export 👎')
		return res.redirect('/user/dashboard')
	}
}

module.exports = { readRows, addRow, fetchRow, editRow, deleteRow, getEvent, addEvent, exportTable}
