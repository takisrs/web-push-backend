const { __ } = require('i18n');

const constructError = (message, statusCode = 500, data = {}) => {
  const error = new Error(__(message));
  error.statusCode = statusCode;
  error.data = data;

  return error;
};

const throwError = (message, statusCode = 500, data = {}) => {
  throw constructError(message, statusCode, data);
};

// class ApiError extends Error {
//   constructor(message, statusCode = 500, data = {}) {
//     super(message);
//     this.statusCode = statusCode;
//     this.data = data;
//   }
// }

module.exports = { constructError, throwError };
