// Centralized Error Handling Middleware
// This catches all errors passed to next()
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`[Error] ${err.message}`, err.stack);

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    // Only send stack trace if we are in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// 404 Not Found handler
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
