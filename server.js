const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const PORT = 80;
const api = require('./routes/api');
const app = express();
const https = require("https");

const privateKey = fs.readFileSync('/etc/letsencrypt/live/server.makosusa.com/privkey.pem');
const certificate = fs.readFileSync('/etc/letsencrypt/live/server.makosusa.com/cert.pem');
const credentials = {key: privateKey, cert: certificate};

app.use(cors());

var httpsServer = https.createServer(credentials, app);

app.use(bodyParser.json())

// app.use('/api', api)
// app.get('/', function (req, res) {
//     res.send("hello from server")
// })


// Displaying asset images as static
app.use("/assets/images", express.static('assets'))

// app.listen(PORT, function () {
//     console.log("Server running on localhost:" + PORT)
// })

httpsServer.listen(PORT, function() {
    console.log("Server running with https on port:" + PORT);
})