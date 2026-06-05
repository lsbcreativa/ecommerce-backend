const { productDao } = require("../dao/factory");

// Configura los eventos de Socket.IO.
// Al conectarse un cliente, le enviamos la lista actual de productos.
const initSockets = (io) => {
  io.on("connection", async (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    try {
      const result = await productDao.getProducts({ limit: 100, page: 1 });
      socket.emit("products:updated", result.docs);
    } catch (error) {
      console.error("Error enviando productos por socket:", error.message);
    }

    socket.on("disconnect", () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
};

module.exports = initSockets;
