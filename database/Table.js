const mongoose = require('mongoose')
const { Schema } = mongoose

const tableSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: `User`,
		required: true,
	},

	company: {
		type: String,
		index: true,
		required: true,
	},

	title: {
		type: String,
		index: true,
		required: true,
	},

	link: {
		type: String,
		required: true,
	},

	date: {
		type: String,
		required: true,
	},

	location: {
		type: String,
		index: true,
		required: true,
	},

	status: {
		type: String,
		index: true,
		required: true,
	},

	notes: {
		type: String,
		required: false,
	},
})

// .model() takes two param:
// schema name that will be created in MongoDBAtlas,
// schema instance object
const Table = mongoose.model('Table', tableSchema)

module.exports = Table
