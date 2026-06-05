// Script para poblar la base con productos de ejemplo.
// Uso: npm run seed
const mongoose = require("mongoose");
const config = require("../config/config");
const ProductModel = require("../dao/models/product.model");

const sampleProducts = [
  { title: "Notebook Lenovo IdeaPad", description: "14'' Ryzen 5, 16GB RAM", code: "NB-001", price: 850, status: true, stock: 12, category: "tecnologia", thumbnails: ["https://picsum.photos/seed/nb1/400/300"] },
  { title: "Mouse Logitech M170", description: "Mouse inalámbrico", code: "MS-002", price: 15, status: true, stock: 80, category: "accesorios", thumbnails: ["https://picsum.photos/seed/ms2/400/300"] },
  { title: "Teclado Mecánico Redragon", description: "Switch red, RGB", code: "TC-003", price: 45, status: true, stock: 30, category: "accesorios", thumbnails: ["https://picsum.photos/seed/tc3/400/300"] },
  { title: "Monitor Samsung 24''", description: "Full HD 75Hz", code: "MO-004", price: 160, status: true, stock: 18, category: "tecnologia", thumbnails: ["https://picsum.photos/seed/mo4/400/300"] },
  { title: "Auriculares HyperX Cloud", description: "Gaming con micrófono", code: "AU-005", price: 70, status: true, stock: 25, category: "audio", thumbnails: ["https://picsum.photos/seed/au5/400/300"] },
  { title: "Webcam Logitech C920", description: "1080p", code: "WC-006", price: 90, status: false, stock: 0, category: "tecnologia", thumbnails: ["https://picsum.photos/seed/wc6/400/300"] },
  { title: "SSD Kingston 480GB", description: "SATA III", code: "SD-007", price: 50, status: true, stock: 40, category: "componentes", thumbnails: ["https://picsum.photos/seed/sd7/400/300"] },
  { title: "Silla Gamer", description: "Reclinable, ergonómica", code: "SL-008", price: 220, status: true, stock: 10, category: "muebles", thumbnails: ["https://picsum.photos/seed/sl8/400/300"] },
  { title: "Parlante JBL Go 3", description: "Bluetooth portátil", code: "PL-009", price: 40, status: true, stock: 50, category: "audio", thumbnails: ["https://picsum.photos/seed/pl9/400/300"] },
  { title: "Pendrive SanDisk 64GB", description: "USB 3.0", code: "PD-010", price: 12, status: true, stock: 100, category: "componentes", thumbnails: ["https://picsum.photos/seed/pd10/400/300"] },
  { title: "Router TP-Link AX1500", description: "WiFi 6", code: "RT-011", price: 65, status: true, stock: 22, category: "redes", thumbnails: ["https://picsum.photos/seed/rt11/400/300"] },
  { title: "Cámara Web 4K", description: "Autofoco", code: "CW-012", price: 120, status: true, stock: 8, category: "tecnologia", thumbnails: ["https://picsum.photos/seed/cw12/400/300"] },
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
