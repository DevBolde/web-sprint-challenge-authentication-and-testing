const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router();

const users = []

router.post('/register', async (req, res) => {
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

  // Check if username and password are present
  if (!username || !password) {
    return res.json({ status: 400, message: 'username and password required'})
  }

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.json({ status: 400, message: 'username taken'})
  }

  try {
    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 8); // Using 2^8 rounds of hashing

    // Create a new user object
    const newUser = {
      id: users.length + 1, // Replace with an appropriate way of generating IDs
      username,
      password: hashedPassword,
    };

    // Add the user to the database
    users.push(newUser);

    // Respond with the user details
    res.json({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password, // Note: In a real application, you wouldn't send the hashed password in the response
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.json({ status: 500, message: 'Internal Server Error'})
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
     // Check if username and password are present
  if (!username || !password) {
    return res.status(400).send("username and password required");
  }

  // Find the user in the database by username
  const user = users.find(user => user.username === username);

  // Check if the user exists
  if (!user) {
    return res.status(401).send("invalid credentials");
  }

  try {
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Password is correct, generate a token
      const token = jwt.sign({ username: user.username, userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

      // Respond with a welcome message and the token
      res.json({
        message: `welcome, ${user.username}`,
        token,
      });
    } else {
      // Password is incorrect
      res.status(401).send("invalid credentials");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
