const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const users = [];

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
    return res.status(400).send("username and password required");
  }

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(400).send("username taken");
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
    res.status(500).send("Internal Server Error");
  }
});




router.post('/login', (req, res) => {
  res.end('implement login, please!');
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
});

module.exports = router;
