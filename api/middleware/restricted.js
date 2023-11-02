const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/secret')

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'token required' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'token invalid' });
    }

    req.token = decoded;
    next();
  });
};
