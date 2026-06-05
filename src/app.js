const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");

const config = require("./config/config");
const connectMongoDB = require("./config/db");
const initSockets = require("./sockets/socketManager");
const handlebarsHelpers = require("./utils/handlebarsHelpers");

// Routers
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

// Middlewares
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ---------- Conexión a Base de Datos (si la persistencia es mongo) ----------
if (config.persistence === "mongo") {
  connectMongoDB();
}

// ---------- Middlewares globales ----------
app.use(cors());
app.use(morgan("dev")); // logger de requests HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- Motor de plantillas Handlebars ----------
app.engine(
  "handlebars",
  engine({
    helpers: handlebarsHelpers,
    // Permite acceder a propiedades de documentos de Mongoose en las vistas
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Servidor operativo",
    persistence: config.persistence,
    uptime: Math.round(process.uptime()) + "s",
  });
});

// ---------- Rutas de la API ----------
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// ---------- Rutas de Vistas ----------
app.use("/", viewsRouter);

// ---------- Ruta 404 ----------
app.use((req, res) => {
  res.status(404).json({ status: "error", error: "Ruta no encontrada" });
});

// ---------- Middleware de manejo de errores (siempre al final) ----------
app.use(errorHandler);

// ---------- Servidor HTTP + Socket.IO ----------
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Hacemos disponible io dentro de los controllers (req.app.get("io"))
app.set("io", io);
initSockets(io);

httpServer.listen(config.port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${config.port}`);
  console.log(`   • API Productos: http://localhost:${config.port}/api/products`);
  console.log(`   • API Carritos:  http://localhost:${config.port}/api/carts`);
  console.log(`   • Vistas:        http://localhost:${config.port}/products`);
  console.log(`   • Tiempo real:   http://localhost:${config.port}/realtimeproducts`);
});

module.exports = app;
