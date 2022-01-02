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

module.exports = { constructError, throwError };
