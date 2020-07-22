// All database requests managed here

const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')

const mongoose = require('mongoose')

// File containing connection link to database
const db = require('./db_credentials')


mongoose.connect(db.DB_CRED, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if(err)
    {
        console.error('Error!' + error)
    }
    else
    {
        console.log('Connected to mongodb')
    }
        
})

router.get('/', (req, res) => {
    res.send('From API route')
})

function verifyToken(req, res, next) {
  // If header is not present
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(" ")[1];
  if(token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  
  // Verifying token
  try {
    let payload = jwt.verify(token, db.JWT_SECRETKEY)
  } 
  // If token does not match, throw error
  catch(err) {
    return res.status(401).send('Unauthorized request');
  }
  

  // If token does not exist, it did not pass verification
  if(!payload) {
    return res.status(401).send('Unauthorized request');
  }

  // If verification passes, assign payload subject as the user id
  req.userID = payload.subject;
  next();
}

router.post('/register', (req, res) => {

    // Extracting user data from request object
    let userData = req.body
    // Converting into mongoose model
    let user = new User(userData)
    // Saving to database
    user.save((error, registeredUser) => 
    {
        if(error)
        {
            console.log(error)
        }
        else
        {
          // Implementing JWT
          let payload = { subject: registeredUser._id }
          let token = jwt.sign(payload, db.JWT_SECRETKEY)
          
          res.status(200).send({token})
        }
    })
})

// Post request to the endpoint 'login'
router.post('/login', (req, res) => {

    // Extracting user data
    let userData = req.body

    // Check if given email/pass combo exists
    User.findOne({email: userData.email}, (error, user) => {
        if(error)
        {
            console.log(error)
        }
        else
        {
            // Throw error if email does not exist
            if(!user)
            {
                res.status(401).send('Invalid email')
            }
            else
            {
                // Throw error if password does not match
                if(user.password !== userData.password)
                {
                    res.status(401).send('Invalid password')
                }
                // If email/pass match, return user data
                else
                {
                  // Implementing JWT
                  let payload = { subject: user._id }
                  let token = jwt.sign(payload, db.JWT_SECRETKEY)
                  
                  res.status(200).send({token})
                }
            }
        }
    })
})

router.get('/gallery', verifyToken, (req, res) => {
  let category1 = [
    {
      "_id": "1", 
      "name": "Example1",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "2", 
      "name": "Example2",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "3", 
      "name": "Example3",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "3", 
      "name": "Example3",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "3", 
      "name": "Example3",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "1", 
      "name": "Example1",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
  ];

  let category2 = [
    {
      "_id": "4", 
      "name": "Example4",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "5", 
      "name": "Example5",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
    {
      "_id": "6", 
      "name": "Example6",
      "description": "This is the first examiple",
      "date": "2020-07-16T21:58:50.271Z"
    },
  ];

  let response = 
  {
    first: category1, 
    second: category2,
  }

  res.json(response)
})

router.get('/events', (req,res) => {
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
  
  router.get('/special', (req,res) => {
    let specialEvents = [
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
    res.json(specialEvents)
  })

module.exports = router