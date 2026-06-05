// Script para poblar la base con productos de ejemplo.
// Uso: npm run seed
const mongoose = require("mongoose");
const config = require("../config/config");
const ProductModel = require("../dao/models/product.model");

// Precios en Soles peruanos (PEN), valores de referencia del mercado local.
// Las imágenes provienen de LoremFlickr por palabra clave (acordes al producto).
const img = (keyword, lock) =>
  `https://loremflickr.com/600/450/${keyword}?lock=${lock}`;

const sampleProducts = [
  { title: "Notebook Lenovo IdeaPad", description: "14'' Ryzen 5, 16GB RAM", code: "NB-001", price: 2899, status: true, stock: 12, category: "tecnologia", thumbnails: [img("laptop,computer", 11)] },
  { title: "Mouse Logitech M170", description: "Mouse inalámbrico", code: "MS-002", price: 49, status: true, stock: 80, category: "accesorios", thumbnails: [img("computer,mouse", 22)] },
  { title: "Teclado Mecánico Redragon", description: "Switch red, RGB", code: "TC-003", price: 159, status: true, stock: 30, category: "accesorios", thumbnails: [img("keyboard", 33)] },
  { title: "Monitor Samsung 24''", description: "Full HD 75Hz", code: "MO-004", price: 599, status: true, stock: 18, category: "tecnologia", thumbnails: [img("monitor,screen", 44)] },
  { title: "Auriculares HyperX Cloud", description: "Gaming con micrófono", code: "AU-005", price: 279, status: true, stock: 25, category: "audio", thumbnails: [img("headphones", 55)] },
  { title: "Webcam Logitech C920", description: "1080p", code: "WC-006", price: 329, status: false, stock: 0, category: "tecnologia", thumbnails: [img("webcam", 66)] },
  { title: "SSD Kingston 480GB", description: "SATA III", code: "SD-007", price: 189, status: true, stock: 40, category: "componentes", thumbnails: [img("ssd,harddrive", 77)] },
  { title: "Silla Gamer", description: "Reclinable, ergonómica", code: "SL-008", price: 799, status: true, stock: 10, category: "muebles", thumbnails: [img("gaming,chair", 88)] },
  { title: "Parlante JBL Go 3", description: "Bluetooth portátil", code: "PL-009", price: 199, status: true, stock: 50, category: "audio", thumbnails: [img("speaker", 99)] },
  { title: "Pendrive SanDisk 64GB", description: "USB 3.0", code: "PD-010", price: 39, status: true, stock: 100, category: "componentes", thumbnails: [img("usb,flashdrive", 101)] },
  { title: "Router TP-Link AX1500", description: "WiFi 6", code: "RT-011", price: 239, status: true, stock: 22, category: "redes", thumbnails: [img("router,wifi", 111)] },
  { title: "Cámara Web 4K", description: "Autofoco", code: "CW-012", price: 419, status: true, stock: 8, category: "tecnologia", thumbnails: [img("camera", 121)] },
];

const seed = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Conectado a MongoDB. Limpiando colección products...");
    await ProductModel.deleteMany({});
    await ProductModel.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} productos insertados correctamente.`);
  } catch (error) {
    console.error("❌ Error en el seed:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
