function throwError(code, message) {
  const error = new Error(message);
  error.statusCode = code;
  throw error;
}

module.exports = throwError;
