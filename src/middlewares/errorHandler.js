// Middleware central de manejo de errores.
// Captura cualquier error lanzado en los controllers (vía next(error))
// y responde con un formato uniforme.
const errorHandler = (err, req, res, next) => {
  console.error("⛔ Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  // ID con formato inválido (ej. ObjectId mal formado) -> 404
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Recurso no encontrado (ID inválido)";
  }

  // Error de validación de Mongoose -> 400
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Código duplicado (índice unique) -> 400
  if (err.code === 11000) {
    statusCode = 400;
    message = "Ya existe un registro con ese valor único (code)";
  }

  res.status(statusCode).json({
    status: "error",
    error: message,
  });
};

module.exports = errorHandler;
