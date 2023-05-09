// NOTES:
// - Get current logged in User's properties (user session): 
//   - req.user.id, 
//   - req.user.username

const { application } = require('express')
const Table = require('../database/Table')
const puppeteer = require('puppeteer')

/* twilio stuff (arushi) 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
*/

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

// GET - Send a Row based on an id to whoever fetch this URL (API!!!)
const fetchRows = async (req, res) => {
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
		console.error(error)
		res.status(500).json( { message: "Server is getting crazy"} )
	} 
}

const deleteRow = async (req, res) => {
	try {
		const { id } = req.params
		const row = await Table.findById(id)
		console.log(row)

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

// GET - Send a Row based on an id to whoever fetch this URL (API!!!)
const automata = async (req, res) => {
	try {
		const user_id = req.user.id
		const table = await Table.find({user: user_id})
		let relevantItem;
		let link;
		table.forEach(elem=> {
			if (elem.link === 'https://umd-csm.symplicity.com/sso/students/login') { 
				relevantItem = elem;
				link = elem.link;
		 	}
		});
		 //console.log(relevantItem);
		// console.log(link);
		//let newRow;
		
		await automateLogin("jvaldiv8", "Starcraft14021099.", relevantItem);
		

		//let newRow = await automateLogin("atibrew1", "ARUumd17112002!", relevantItem);
		//console.log("HERERERERE:" + newRow);
		//So, ideally, login will be called for all applications but for now, we're only implementing one website -> c4t
		//const newRow = mapDbToAutomated(table)

		//code to update db


		res.send('HERE: UPDATES CORRECTLY!!!!!!')
	} catch (error) {
		return res.send(error)
	}
}

async function automateLogin(username, password, itemFromDB) {
    try {
		let visibleText = "";
    	const browser = await puppeteer.launch({ headless: false });
	    const page = await browser.newPage();
	    
	    await page.goto('https://umd-csm.symplicity.com/sso/students/login');
	    
	    // Find the login elements by attribute
	    const usernameInput = await page.$('input[type="text"]');
	    const passwordInput = await page.$('input[type="password"]');
	    const loginButton = await page.$('button[type="submit"]');
	    
	    // Fill in the login form and submit
	    await usernameInput.type(username);
	    await passwordInput.type(password);
	    await loginButton.click();
	    
	    // Wait for the login to complete
	    await page.waitForNavigation();

	    //Since login uses DUO Mobile, seeting a timeout so that user can approve login from duo
    	setTimeout(async () => {
	        //extracting text from page
	        const url = 'https://umd-csm.symplicity.com/students/index.php?s=jobs&ss=applied&mode=list&subtab=nocr';
	        await page.goto(url);
	      
	        visibleText = await page.evaluate(() => {
	          // This function extracts the text content of all visible nodes in the DOM
	          const walker = document.createTreeWalker(
	            document.body,
	            NodeFilter.SHOW_TEXT,
	            null,
	            false
	          );
	          let node;
	          let text = '';
	          while ((node = walker.nextNode())) {
	            if (node.parentElement.offsetWidth > 0 && node.parentElement.offsetHeight > 0) {
	              text += node.textContent.trim() + ' ';
	            }
	          }
	          return text.trim();
	        });
			console.log("VISIBLE TEXT : " + visibleText);
			let newRow = mapDbToAutomated(visibleText, itemFromDB);
			await Table.findByIdAndUpdate( { _id: itemFromDB._id.toString()} , {status: newRow.status} );
	    console.log("AUTOMATA WORKED :)))))");
			await browser.close();
			return newRow;
      }, 30000);
		
    } catch (error){
        console.log("AUTOMATA FAILED :((" + error);
    }
}

function mapDbToAutomated(text, itemFromDB) {
	let oldStatus = itemFromDB.status;
	let newStatus = getStatus(text, itemFromDB.positionName, oldStatus);

	if (oldStatus === newStatus) {
		console.log("NO CHANGES WERE RECORDED")
		return itemFromDB;
	} else {
		//edit row with new staus
		//console.log(itemFromDB)
		let newRow = itemFromDB;
		//console.log(newRow)
		newRow.status = newStatus;
		//console.log(newStatus);
		console.log("HERE:"+ newRow)
		console.log("CHANGE RECORDED!")

		/*
		// using twilio to send an update !! 
		client.messages
		  .create({
		     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
		     from: '+18449512235',
		     to: '+4152971972'
		   })
		  .then(message => console.log(message.sid));*/
		return newRow;
	}
}

function getStatus(text, positionName, prevStatus) {
    text = text.trim();
	//console.log("HEREERER" + text);
	let matchedStringStatus;
	if (text.includes(positionName)) {
		//very basic regex but will work for now
		const re = new RegExp("Application Submitted", "In Review", "Accepted", "Application Rejected");
		matchedStringStatus = text.match(re);
		if (matchedStringStatus == "Application submitted") { matchedStringStatus = "Submitted";}
		console.log(matchedStringStatus);
 	}
	if (text.includes("Application submitted")) {
		matchedStringStatus = "Submitted";
		//console.log(matchedStringStatus);
		return matchedStringStatus;
 	} else {
		return matchedStringStatus === undefined ? prevStatus : matchedStringStatus;
	}

	/* CODE TO JUST SEE THE PARSED INFORMATION CLEARLY - DON'T NEED
	let count = 0;
    let arr = text.split(" ");
    arr = arr.filter( elem => elem.length > 2 );
    arr.forEach(element => {
       //console.log(`COUNT HERE: ${count++}`);
       console.log(element); 
    });
	*/
}

//automateLogin("atibrew1","ARUumd17112002!")

module.exports = { readRows, addRow, fetchRow, fetchRows, editRow, deleteRow, automata}
