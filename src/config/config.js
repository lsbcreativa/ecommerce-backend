const dotenv = require("dotenv");

dotenv.config();

// Configuración centralizada leída desde variables de entorno (.env)
const config = {
  port: process.env.PORT || 8080,
  mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce",
  // "mongo" (por defecto) o "fs"
  persistence: (process.env.PERSISTENCE || "mongo").toLowerCase(),
};

module.exports = config;
