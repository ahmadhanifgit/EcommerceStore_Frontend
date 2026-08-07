const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Protects routes by verifying the JWT token in the Authorization header.
 *
 * Usage: app.get('/protected-route', authMiddleware, handler)
 *
 * Expected header format: Authorization: Bearer <token>
 *
 * On success: attaches decoded user data to req.user and calls next()
 * On failure: returns 401 Unauthorized
 */
const authMiddleware = (req, res, next) => {
  try {
    // Read the Authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is missing.'
      });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data (id, email) to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

module.exports = authMiddleware;
