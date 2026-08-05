const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.isOperational = true;
    const errors = Object.values(err.errors).map((el) => el.message);
    err.message = `Invalid input data: ${errors.join('. ')}`;
  }

  // Handle Mongoose Duplicate Key Errors (E11000)
  if (err.code === 11000) {
    err.statusCode = 400;
    err.isOperational = true;
    const value = Object.keys(err.keyValue || {})[0];
    err.message = `Duplicate field value for '${value || 'field'}'. Please use another value!`;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production response
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error('ERROR 💥:', err);
      res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong on the server!',
      });
    }
  }
};

module.exports = errorHandler;
