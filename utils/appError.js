// operational error
class AppError extends Error {
  // what going to pass into a new obj
  constructor(message, statusCode) {
    super(message); // call parent constructor -> only parameter that the built-in error accepte

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
