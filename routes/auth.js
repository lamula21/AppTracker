// GET          /auth/register      display register form      
// POST         /auth/register      submit register form
// GET          /auth/login         display login form
// POST         /auth/login         submit login form
// GET          /auth/logout        logout user

const express = require('express')
const router = express.Router()
const {
	registerForm,
	registerUser,
	loginForm,
	loginUser,
	logoutUser,
} = require('../routeControllers/authController')

const { registerFormValidator, loginFormValidator } = require('../middlewares/formValidation')

/* ------------------------- ENDPOINTS -------------------------*/

// Note: validatorsRules in /middlewars/formValidator.js

// localhost:5001/auth/register
router.get('/register', registerForm)
router.post('/register', registerFormValidator, registerUser)

// localhost:5001/auth/login
router.get('/login', loginForm)
router.post('/login', loginFormValidator, loginUser)

// localhost:5001/auth/logout
router.get('/logout', logoutUser)

module.exports = router
