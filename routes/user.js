// GET          /user/dashboard         display HTML with all rows      
// POST         /user/dashboard         create and add row

// GET          /user/api/:id           get single row and return json
// GET          /user/api/v2/:id        get all rows and return json
// PUT          /user/api/edit/:id      update single row in DB
// DELETE       /user/api/delete/:id    delete single row in DB

// GET          /user/calendar               get calendar



const express = require('express')
const { readRows, addRow, fetchRow, fetchRows, editRow, deleteRow, automata } = require('../routeControllers/userController')
const router = express.Router()

const loginValidator = require('../middlewares/loginValidation')

/* ---------------- MAIN Routes ---------------- */

// localhost:5001/user/dashboard
router.get('/dashboard', loginValidator, readRows)
router.post('/dashboard', loginValidator, addRow)

// localhost:5001/user/calendar
// router.get('/calendar')


/* ---------------- API Routes ---------------- */

// localhost:5001/user/api/:id
router.get('/api/:id', fetchRow)

// localhost:5001/user/api/v2/:id
router.get('/api/v2/:id', fetchRows)

// localhost:5001/user/api/edit/:id
router.put('/api/edit/:id', editRow)

// localhost:5001/user/api/delete/:id
router.delete('/api/delete/:id', deleteRow)

router.put('/api/automata', automata)

module.exports = router
