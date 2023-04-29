// Note: Always use `return` when using `res` to avoid error when having double `res` in the code
// Also note by convention we always use `return` inside of {} in arrow function

const User = require('../database/User')
const { validationResult } =  require('express-validator')

// --------- MIDDLEWARES CONTROLLERS ---------

// GET - display register.ejs
const registerForm = async (req,res) => {
    return res.render('register')
}

// POST - process user input to register.ejs
const registerUser = async (req, res) => {

    //Express Validation Results after running FormValidators middlewares
    const errors =  validationResult(req)
    if (!errors.isEmpty()) {
        errors.array().forEach( e => {
            req.flash('warning', e.msg)  
        })

        return res.redirect('/auth/register')
    }

    const { username, email, password} = req.body;

    try {

        // Check User already exist in DB
        let user = await User.findOne( {username: username} )
        if (user) {
            throw new Error('User alreaedy exists')
        }

        // If not, create user and save to DB
        user = new User({ username, email, password})
        await user.save(); // save into DB

        req.flash('success', 'New account created🔥')
        res.redirect('/auth/login')

    } catch (error) {
        req.flash('warning', error.message)
        return res.redirect('/auth/register')
    }
}

// GET - Display Login.ejs
const loginForm = async (req, res) => { 
    res.render('login')  
}

// POST - process user input to Login.ejs
const loginUser = async (req, res) => {

    // Express Validation Results after running FormValidators middlewares
    const errors =  validationResult(req)
    if (!errors.isEmpty()) {
        errors.array().forEach( e => {
            req.flash('warning', e.msg)  
        })
        return res.redirect('/auth/login')
    }

    // get the user input from req.body, {username, password}
    const {username, password} = req.body

    // try catch
    try {
        // find user in the database by {username}
        const user = await User.findOne( {username: username})

        // validate user, if not user, throw error
        // validate password, if not, throw error
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('The username and password are not correct')
        }

        // Otherwise, good credentials, 
        // then create user session with Passport 
        // then login user
        req.login(user, (err) => {
            if (err) throw new Error('Error login session. This is very bad')
            req.flash('success', 'Succesfully Logged In')
            req.flash('primary', 'Try New Dark Mode Theme 🌚')
            return res.redirect('/user/dashboard') // log in user to its account
        })
        
    } catch (error) {
        // if any errors, send flash message, then redirect to login page
        req.flash('warning', error.message)
        return res.redirect('/auth/login')
    }
}

const logoutUser = async (req, res) => {
    // logout an user with Passport
    req.logout( err => {
        if (err) return next(err)
        // if throws error, this is smth bad
    })
    req.flash('success', 'Succesfully Logged Out')
    // otherwise, all good, logout then redirect
    return res.redirect('/auth/login')
}


module.exports = {registerForm, registerUser, loginForm, loginUser, logoutUser}

