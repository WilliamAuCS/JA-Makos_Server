const mongoose = require('mongoose');
const fs = require('fs');
const DB_LINK = fs.readFileSync('./db_credentials/db_link.key', { encoding: 'utf-8' });

var user_connection = mongoose.createConnection(DB_LINK, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err) {
      console.error('Error!' + err);
    }
    else {
      console.log('Connected to mongodb: [User Information]');
    }
  })


const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String, 
    password: String,
})

// mongoose.model params (name, schemaUsed, db_collectionName)
module.exports = user_connection.model('user', userSchema, 'users')