const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);

  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    console.log('Token missing');
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = decoded; // { id, username from token payload }
    next();
  } catch (err) {
    console.log('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authenticateToken;
