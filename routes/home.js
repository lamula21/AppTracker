// /
// /about

const express = require('express')
const router = express.Router()

/* ------------------------- ENDPOINTS -------------------------*/

// localhost:5001/
router.get('/', (request, response) => {
	console.log(request.user)
	response.render('home', { layout: 'layouts/main' })
})

// localhost:5001/about
router.get('/about', (request, response) => {
	response.render('about', { layout: 'layouts/main' })
})
module.exports = router
