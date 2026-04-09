const { admin } = require('../config/firebase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token via Firebase Admin SDK
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Set the user property to the decoded user ID
      req.user = decodedToken.uid;
      
      next();
    } catch (error) {
      console.error('Token Failed:', error.message);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

module.exports = { protect };
