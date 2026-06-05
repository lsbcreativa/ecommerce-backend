const { productDao } = require("../dao/factory");
const CustomError = require("../utils/CustomError");

// Capa de servicio de Productos: contiene la lógica de negocio y se apoya
// en el DAO (que abstrae si los datos están en MongoDB o FileSystem).
class ProductsService {
  getProducts(options) {
    return productDao.getProducts(options);
  }

  async getProductById(id) {
    const product = await productDao.getProductById(id);
    if (!product) throw new CustomError("Producto no encontrado", 404);
    return product;
  }

  createProduct(data) {
    return productDao.createProduct(data);
  }

  async updateProduct(id, data) {
    const updated = await productDao.updateProduct(id, data);
    if (!updated) throw new CustomError("Producto no encontrado", 404);
    return updated;
  }

  async deleteProduct(id) {
    const deleted = await productDao.deleteProduct(id);
    if (!deleted) throw new CustomError("Producto no encontrado", 404);
    return deleted;
  }
}

module.exports = new ProductsService();
