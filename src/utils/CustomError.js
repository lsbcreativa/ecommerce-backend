// Error personalizado con código HTTP, usado para un manejo de errores limpio.
class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";
  }
}

module.exports = CustomError;
