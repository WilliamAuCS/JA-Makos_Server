const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 80;
const api = require('./routes/api');
const app = express();
app.use(cors());


app.use(bodyParser.json())

app.use('/api', api)
app.get('/', function (req, res) {
    res.send("hello from server")
})


// Displaying asset images as static
app.use("/assets/images", express.static('assets'))

app.listen(PORT, function () {
    console.log("Server running on localhost:" + PORT)
})