const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/secret')

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.
      
    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 const authHeader = req.headers.authorization;

 if(!authHeader){
  return res.json({ status: 401, message: 'token required'})
 }
 const token = authHeader.split(' ')[1];

 if(!isValidToken(token)){
  return res.json({ status: 401, message: 'token invalid'})
 }
 
 req.token = token; 
 next()

 function isValidToken(token) {
  try{
    jwt.verify(token, JWT_SECRET)
    return true;
  } catch(err){
  return false;
 }
 } 
};
