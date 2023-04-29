// Middlewares to validate input user in FORMS
const {body} = require('express-validator') // body(nameAttribute, errMsg)

const registerFormValidator = [
    body("username", "Enter a valid username")
        .trim() // delete trealinng and leading spaces
        .notEmpty() // checks if not empty, otherwise throw error with the err msg
        .escape(), // converts html scripts to string
    
    body('email', "Enter a valid email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .escape(),
    
    body('password', 'Enter a valid password')
        .trim()
        .isLength({min: 4})
        .escape()
        .custom( (value, {req}) => { // validation for re-password
            if(value !== req.body.repassword) {
                req.flash('danger', 'Password does not match')
            } else {
                return true
            }
        })
]

const loginFormValidator = [
    body('username', 'Enter a valid username').trim().notEmpty(),
    body('password', 'Enter a valid password').trim().isLength({min:4}).escape()
]

module.exports = { registerFormValidator, loginFormValidator }