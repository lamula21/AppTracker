// /
// /about

const express = require('express')
const router = express.Router()

/* ------------------------- ENDPOINTS -------------------------*/

// localhost:5001/
router.get('/', (request, response) => {
	response.render('home')
})

// localhost:5001/about
router.get('/about', (request, response) => {
	response.render('about')
})
module.exports = router
