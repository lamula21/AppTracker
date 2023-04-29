const mongoose = require('mongoose')

mongoose
	.connect(process.env.URI)
	.then(() => console.log(`Connected DB 🔥`))
	.catch((e) => console.log(`Connection to DB failed 🤡` + e))
