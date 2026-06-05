const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const dataPath = path.join(__dirname, "..", "..", "data", "products.json");

// DAO de Productos con persistencia en FileSystem (JSON)
class ProductDaoFS {
  constructor() {
    this.path = dataPath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (error) {
      // Si el archivo no existe, devolvemos arreglo vacío
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
  }

  // Replica la estructura de mongoose-paginate-v2 para mantener un único formato
  async getProducts({ limit = 10, page = 1, query, sort } = {}) {
    let products = await this.#readFile();

    // Filtro
    if (query) {
      if (query.includes(":")) {
        const [field, value] = query.split(":");
        if (field === "status") {
          products = products.filter((p) => String(p.status) === value);
        } else if (field === "category") {
          products = products.filter((p) => p.category === value);
        }
      } else if (query === "true" || query === "false") {
        products = products.filter((p) => String(p.status) === query);
      } else {
        products = products.filter((p) => p.category === query);
      }
    }

    // Orden por precio
    if (sort === "asc") products.sort((a, b) => a.price - b.price);
    if (sort === "desc") products.sort((a, b) => b.price - a.price);

    limit = Number(limit);
    page = Number(page);
    const totalDocs = products.length;
    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const start = (page - 1) * limit;
    const docs = products.slice(start, start + limit);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs,
      totalDocs,
      limit,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    };
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find((p) => p.id === id) || null;
  }

  async createProduct(productData) {
    const products = await this.#readFile();
    const newProduct = {
      id: crypto.randomUUID(),
      status: true,
      thumbnails: [],
      ...productData,
    };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.#readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    if (updateData.id) delete updateData.id; // No se modifica el id
    products[index] = { ...products[index], ...updateData };
    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const [deleted] = products.splice(index, 1);
    await this.#writeFile(products);
    return deleted;
  }
}

module.exports = ProductDaoFS;
