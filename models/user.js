const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String, 
    password: String,
})

// mongoose.model params (name, schemaUsed, db_collectionName)
module.exports = mongoose.model('user', userSchema, 'users')