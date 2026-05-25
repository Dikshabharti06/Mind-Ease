
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Log headers for debugging
  console.log('Auth middleware - Request headers:', {
    'x-auth-token': req.header('x-auth-token') ? 'exists' : 'missing',
    'authorization': req.header('Authorization') ? 'exists' : 'missing'
  });
  
  // Get token from header - try both formats
  let token = req.header('x-auth-token');
  
  // Check Authorization header if x-auth-token not found
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    } else if (authHeader) {
      token = authHeader; // Use as-is if no Bearer prefix
    }
  }
  
  // Check if no token
  if (!token) {
    console.log('Auth middleware: No token provided');
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    console.log('Auth middleware: Attempting to verify token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded.user;
    console.log('Auth middleware: Valid token for user ID:', req.user.id);
    next();
  } catch (err) {
    console.error('Auth middleware: Invalid token:', err.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
