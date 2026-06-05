const mongoose = require("mongoose");
const config = require("./config");

// Conexión a MongoDB usando Mongoose. Base de datos: ecommerce
const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("✅ MongoDB conectado correctamente (base: ecommerce)");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    // No cortamos el proceso: el modo FileSystem puede seguir funcionando.
  }
};

module.exports = connectMongoDB;
