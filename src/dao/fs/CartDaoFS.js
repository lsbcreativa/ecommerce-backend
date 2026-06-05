const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const dataPath = path.join(__dirname, "..", "..", "data", "carts.json");

// DAO de Carritos con persistencia en FileSystem (JSON)
class CartDaoFS {
  constructor() {
    this.path = dataPath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async #writeFile(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
  }

  async createCart() {
    const carts = await this.#readFile();
    const newCart = { id: crypto.randomUUID(), products: [] };
    carts.push(newCart);
    await this.#writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.#readFile();
    return carts.find((c) => c.id === cid) || null;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    const carts = await this.#readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return null;

    const item = cart.products.find((p) => p.product === pid);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await this.#writeFile(carts);
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    const carts = await this.#readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return null;

    cart.products = cart.products.filter((p) => p.product !== pid);
    await this.#writeFile(carts);
    return cart;
  }

  async updateCartProducts(cid, products) {
    const carts = await this.#readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return null;

    cart.products = products.map((p) => ({
      product: p.product,
      quantity: p.quantity || 1,
    }));
    await this.#writeFile(carts);
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const carts = await this.#readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return null;

    const item = cart.products.find((p) => p.product === pid);
    if (!item) return null;

    item.quantity = quantity;
    await this.#writeFile(carts);
    return cart;
  }

  async clearCart(cid) {
    const carts = await this.#readFile();
    const cart = carts.find((c) => c.id === cid);
    if (!cart) return null;

    cart.products = [];
    await this.#writeFile(carts);
    return cart;
  }
}

module.exports = CartDaoFS;
