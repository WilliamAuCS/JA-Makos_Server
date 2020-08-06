// All database requests managed here

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');
const Asset_information = require("../models/asset_information");
const argon2 = require('argon2');
const fs = require('fs');
const validator = require('validator');

// Files containing connection link to database and JWT secret key
const JWT_SECRETKEY = fs.readFileSync('./db_credentials/jwt_secret.key', { encoding: 'utf8' });


router.get('/', (req, res) => {
  res.send('From API route')
})


function verifyToken(req, res, next) {
  // If header is not present
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  let payload;
  // Verifying token
  try {
    payload = jwt.verify(token, JWT_SECRETKEY)
  }
  // If token does not match, throw error
  catch (err) {
    return res.status(401).send('Unauthorized request');
  }


  // If token does not exist, it did not pass verification
  if (!payload) {
    return res.status(401).send('Unauthorized request');
  }

  // If verification passes, assign payload subject as the user id
  req.userID = payload.subject;
  next();
}

// Sanitation for user email input 
function sanitizeEmail(email) {
  return validator.isEmail(email,
    {
      allow_utf8_local_part: false,
      ignore_max_length: false
    });
}
function sanitizePassword(userData) {
  let sanitizedPass = userData.password;

  // If password only contains whitespace
  if (validator.isEmpty(sanitizedPass, { ignore_whitespace: true })) {
    return false;
  }

  // Trimming whitespace on ends
  sanitizedPass = validator.trim(sanitizedPass);

  // Replacing key symbols with HTML entities
  sanitizedPass = validator.escape(sanitizedPass);
  userData.password = sanitizedPass;

  return true;
}

router.post('/register', (req, res) => {

  // Extracting user data from request object
  let userData = req.body

  // Sanitation for user email input 
  if (!sanitizeEmail(userData.email)) {
    res.status(400).send("Invalid Email Format");
    return;
  }
  else if (userData.password == "") {
    return;
  }

  // Sanitation for user password input
  if (!sanitizePassword(userData)) {
    res.status(400).send("Invalid Password Format");
    return;
  }

  // Converting into mongoose model
  let user = new User(userData)

  try {
    argon2.hash(user.password).then((hashed) => {

      // Setting user's password to its hashed version
      user.password = hashed;
      // Saving to database
      user.save((error, registeredUser) => {
        if (error) {
          console.log(error)
        }
        else {
          // Implementing JWT
          let payload = { subject: registeredUser._id }
          let token = jwt.sign(payload, JWT_SECRETKEY)

          res.status(200).send({ token })
        }
      })
    })
  }
  catch (err) {
    console.log(err);
  }

})

// Post request to the endpoint 'login'
router.post('/login', (req, res) => {

  // Extracting user data
  let userData = req.body

  // Sanitation for user email input 
  if (!sanitizeEmail(userData.email)) {
    res.status(400).send("Invalid Email Format");
    return;
  }

  // Check if given email/pass combo exists
  User.findOne({ email: userData.email }, (error, user) => {
    if (error) {
      console.log(error)
    }
    else {
      // Throw error if email does not exist
      if (!user) {
        res.status(401).send('Invalid email');
      }
      else {

        try {
          // If email/password match, return user data
          // Using Argon2i
          argon2.verify(user.password, userData.password).then(argon2Match => {
            if (argon2Match) {
              // Implementing JWT
              let payload = { subject: user._id };
              let token = jwt.sign(payload, JWT_SECRETKEY);
              res.status(200).send({ token });
            }
            else {
              // Throw error if password does not match
              res.status(401).send('Invalid password');
            }
          })
        }
        catch (err) {
          console.log(err);
        }
      }
    }
  })
})

router.put('/deleteAccount', (req, res) => {
  User.deleteOne({ email: req }, (err) => {
    if(err) {
      console.error(err);
    }
    else {
      res.status(200).send("Account deleted");
    }
  })
})

router.get('/gallery', verifyToken, (req, res) => {

  var gallery_response = [];

  Asset_information.find({category: "Watch Straps"}, (err, asset) => {
    if(err) {
      console.log("There was an error");
      console.log(err);
    }
    else {
      gallery_response = asset;
      res.json(gallery_response);
    }
  })
})

router.get('/events', (req, res) => {
  let events = [
    {
      "_id": "1",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "2",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "3",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "4",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "5",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    },
    {
      "_id": "6",
      "name": "Auto Expo",
      "description": "lorem ipsum",
      "date": "2012-04-23T18:25:43.511Z"
    }
  ]
  res.json(events)
})


module.exports = router