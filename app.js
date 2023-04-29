// ------------ MODULES/DEPENDENCIES ------------
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash') // Session Flash
const csrf = require('csurf') // Security CSRF module
const session = require('express-session') // Express session
const passport = require('passport') // Handle Sessions
const User = require('./database/User')

// ----------------- BACKEND -----------------

// Set Environment Variable
require('dotenv').config()

// Import Database Connection
require('./database/db')

// Initialize express app
const app = express()

// Session Middleware
app.use(
	session({
		secret: 'somethingSecretHereDontShow', //use dotenv for secret thing
		resave: false,
		saveUninitialized: false,
	})
)

// Set up Passport with Session
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => {
	done(null, { id: user._id, username: user.username })
	// Creates a session by a given user id and username
	// store it in req.user
})
passport.deserializeUser(async (user, done) => {
	const userDB = await User.findById(user.id)
	return done(null, { id: userDB.id, username: userDB.username })
	// Check in DB for a user and 
	// keeps session of user when page reloads
})

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.ejs')

// App Configuration
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'))) // Read static files from `public` folder
app.use(express.urlencoded({ extended: true })) // middleware to active reading user input from forms
app.use(flash())
//app.use(csrf()) // Middleware for CSRF protection

app.use((req, res, next) => {
	res.locals.primary_messages = req.flash('primary');
	res.locals.success_messages = req.flash('success');
	res.locals.danger_messages = req.flash('danger');
	res.locals.warning_messages = req.flash('warning');
	res.locals.dark_messages = req.flash('dark');
	res.locals.user_login = req.user
	next();
	// The ALERTs will be sent to all rendered HTML pages as a '<option>_messages' variable
})

// Routes Middleware
app.use('/', require('./routes/home'))
app.use('/user', require('./routes/user'))
app.use('/auth', require('./routes/auth'))

// Initialize Project
const PORT = 5001
app.listen(PORT, () =>
	console.log(`Server working... http://localhost:${PORT}`)
)
