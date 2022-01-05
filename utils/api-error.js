class ApiError extends Error {
  constructor(message, statusCode = 500, data = {}) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

module.exports = ApiError;
