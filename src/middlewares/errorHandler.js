// Middleware central de manejo de errores.
// Captura cualquier error lanzado en los controllers (vía next(error))
// y responde con un formato uniforme.
const errorHandler = (err, req, res, next) => {
  console.error("⛔ Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    status: "error",
    error: message,
  });
};

module.exports = errorHandler;
