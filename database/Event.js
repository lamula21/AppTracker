const mongoose = require('mongoose')
const { Schema } = mongoose

const eventSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: `User`,
		required: true,
	},

	date: {
		type: String,
		index: true,
		required: true,
	},

	month: {
		type: String,
		index: true,
		required: true,
	},

	year: {
    index: true,
		type: String,
		required: true,
	},

	eventTitle: {
		type: String,
		required: true,
	},

	eventFrom: {
		type: String,
		index: true,
		required: true,
	},

	eventTo: {
		type: String,
		index: true,
		required: true,
	},
})

// .model() takes two param:
// schema name that will be created in MongoDBAtlas,
// schema instance object
const Event = mongoose.model('Event', eventSchema)

module.exports = Event