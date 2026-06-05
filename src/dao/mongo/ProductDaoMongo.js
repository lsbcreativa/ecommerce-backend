const ProductModel = require("../models/product.model");

// DAO de Productos con persistencia en MongoDB (Mongoose)
class ProductDaoMongo {
  /**
   * Obtiene productos con paginación, filtro y ordenamiento.
   * @param {Object} options - { limit, page, query, sort }
   * Devuelve el objeto nativo del plugin mongoose-paginate-v2.
   */
  async getProducts({ limit = 10, page = 1, query, sort } = {}) {
    // Construcción del filtro a partir del parámetro query.
    // Soporta: "category:algo", "status:true/false" o texto simple sobre category.
    const filter = {};
    if (query) {
      if (query.includes(":")) {
        const [field, value] = query.split(":");
        if (field === "status") {
          filter.status = value === "true";
        } else if (field === "category") {
          filter.category = value;
        }
      } else if (query === "true" || query === "false") {
        filter.status = query === "true";
      } else {
        filter.category = query;
      }
    }

    // Ordenamiento por precio: asc | desc
    const sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const paginateOptions = {
      limit: Number(limit),
      page: Number(page),
      lean: true,
      ...(Object.keys(sortOption).length ? { sort: sortOption } : {}),
    };

    return await ProductModel.paginate(filter, paginateOptions);
  }

  async getProductById(id) {
    return await ProductModel.findById(id).lean();
  }

  async createProduct(productData) {
    const created = await ProductModel.create(productData);
    return created.toObject();
  }

  async updateProduct(id, updateData) {
    // Nunca permitimos modificar el _id
    if (updateData._id) delete updateData._id;
    return await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id).lean();
  }
}

module.exports = ProductDaoMongo;
