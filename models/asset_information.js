const mongoose = require('mongoose');
const fs = require('fs');
const DB_LINK_ASSETS = fs.readFileSync("./db_credentials/db-asset-link.key", { encoding: "utf-8"});

var asset_connection = mongoose.createConnection(DB_LINK_ASSETS, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if(err) {
      console.error("Error!" + err);
    }
    else {
      console.log("Connected to mongodb: [Assets]");
    }
  })


const Schema = mongoose.Schema
const asset_informationSchema = new Schema({
    category: String, 
    color: String,
    description: String, 
    price: String, 
    quantity: String, 
    img_amount: String,
    img_link: String, 
})

// mongoose.model params (name, schemaUsed, db_collectionName)
module.exports = asset_connection.model('asset_information', asset_informationSchema, 'asset_information')