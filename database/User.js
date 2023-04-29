const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

const userSchema = new Schema({
	username: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
		index: true,
	},

	email: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
	},
})

// Pre functionality for the model - Hashing Password
userSchema.pre('save', async function (next) {
	const user = this

	// If password is HASHED, then omit
	if (!user.isModified('password')) return next()

	try {
		const salt = await bcrypt.genSalt(10) // Config - generate random words length 10
		const hash = await bcrypt.hash(user.password, salt) // Hash password length 10
		user.password = hash
	} catch (error) {
		// If encryption fails
		throw new Error('Error encrypting password')
	}
})

// Method to compare user entered password (from forms) with its hashed password from DB
userSchema.methods.comparePassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password)
}

// .model() takes two param:
// name for the model in MongoDBAtlas,
// schema created
const User = mongoose.model('User', userSchema)

module.exports = User
