const config = require("../config/config");

// Factory: según la variable PERSISTENCE (.env) devuelve los DAO
// de MongoDB o de FileSystem. Permite cambiar de motor sin tocar
// los controllers (patrón de inyección de dependencias).
let ProductDao;
let CartDao;

switch (config.persistence) {
  case "fs":
    ProductDao = require("./fs/ProductDaoFS");
    CartDao = require("./fs/CartDaoFS");
    console.log("🗂️  Persistencia activa: FileSystem");
    break;
  case "mongo":
  default:
    ProductDao = require("./mongo/ProductDaoMongo");
    CartDao = require("./mongo/CartDaoMongo");
    console.log("🍃 Persistencia activa: MongoDB");
    break;
}

module.exports = {
  productDao: new ProductDao(),
  cartDao: new CartDao(),
};
