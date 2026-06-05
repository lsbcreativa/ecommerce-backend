const config = require("../config/config");

// Factory: según la variable PERSISTENCE (.env) devuelve los DAO
// de MongoDB o de FileSystem. Permite cambiar de motor sin tocar
// los controllers/services (patrón de inyección de dependencias).
let ProductDao;
let CartDao;
let TicketDao;

switch (config.persistence) {
  case "fs":
    ProductDao = require("./fs/ProductDaoFS");
    CartDao = require("./fs/CartDaoFS");
    TicketDao = require("./fs/TicketDaoFS");
    console.log("🗂️  Persistencia activa: FileSystem");
    break;
  case "mongo":
  default:
    ProductDao = require("./mongo/ProductDaoMongo");
    CartDao = require("./mongo/CartDaoMongo");
    TicketDao = require("./mongo/TicketDaoMongo");
    console.log("🍃 Persistencia activa: MongoDB");
    break;
}

module.exports = {
  productDao: new ProductDao(),
  cartDao: new CartDao(),
  ticketDao: new TicketDao(),
};
