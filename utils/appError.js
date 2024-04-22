// operational error
class AppError extends Error { // Error is base class in JS of error
  // what going to pass into a new obj
  constructor(message, statusCode) {
    super(message); // call parent constructor which is Error class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOperational = true; // mark that all error that we create is operational error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
