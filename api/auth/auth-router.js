const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../users/users-model');
const { JWT_SECRET } = require('../secrets/secret');

const router = express.Router();



router.post('/register', async (req, res, next) => {
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */

   const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }
  try {
    const existingUser = await User.findByUsername(username);
    
    if (existingUser) {
      return res.status(400).json({ message: 'username taken' });
    }

    const hash = bcrypt.hashSync(password, 8);
    const newUser = { username, password: hash };
     const result = await User.add(newUser);
    res.status(201).json({
      id: result.id,
      username: result.username,
      password: result.password
    });
  } catch (err) {
    next(err);
  }
 
});



router.post('/login', async (req, res) => {
      /*
      IMPLEMENT
      You are welcome to build additional middlewares to help with the endpoint's functionality.
      
      1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }
      
      2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }
      
      3- On FAILED login due to `username` or `password` missing from the request body,
          the response body should include a string exactly as follows: "username and password required".
          
          4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
          the response body should include a string exactly as follows: "invalid credentials".
          */
      const { username, password } = req.body;
    
      if (!username || !password) {
        return res.status(400).json({message: "username and password required"});
      }
    
      try {
        const users = await User.findByUsername(username);
    
        if (!users || !users.password) {
          return res.status(401).json({
            message: 'invalid credentials'
          });
        }
    
        const passwordMatch = await bcrypt.compare(password, users.password);
    
        if (passwordMatch) {
          const token = jwt.sign({ username: users.username, userId: users.id }, JWT_SECRET, { expiresIn: '1h' });
    
          res.json({
            message: `welcome, ${users.username}`,
            token,
          });
        } else {
          res.status(401).json({ message: "invalid credentials"});
        }
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    
module.exports = router;
