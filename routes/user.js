// GET          /user/dashboard         display HTML with all rows      
// POST         /user/dashboard         create and add row

// GET          /user/api/:id           get single row and return json
// GET          /user/api/v2/:id        get all rows and return json
// PUT          /user/api/edit/:id      update single row in DB
// DELETE       /user/api/delete/:id    delete single row in DB
// GET          /user/api/event         get event based on day, month, year from DB
// POST         /user/api/event         adds event into DB

// GET          /user/calendar               get calendar



const express = require('express')
const { readRows, addRow, fetchRow, editRow, deleteRow, getEvent, addEvent, exportTable } = require('../routeControllers/userController')
const router = express.Router()

const loginValidator = require('../middlewares/loginValidation')

/* ---------------- MAIN Routes ---------------- */

// localhost:5001/user/dashboard
router.get('/dashboard', loginValidator, readRows)
router.post('/dashboard', loginValidator, addRow)

// localhost:5001/user/calendar
router.get('/calendar', loginValidator, (req, res) => {
    res.render('calendar');
})


/* ---------------- API Routes ---------------- */

// localhost:5001/user/api/:id
router.get('/api/:id', fetchRow)

// localhost:5001/user/api/edit/:id
router.put('/api/edit/:id', editRow)

// localhost:5001/user/api/delete/:id
router.delete('/api/delete/:id', deleteRow)

// localhost:5001/user/api/event
router.get('/api/event/:id', getEvent)

// localhost:5001/user/api/event
router.post('/api/event', addEvent)

// localhost:5001/user/api/export
router.post('/api/export/:id', exportTable)


module.exports = router

