const CartModel = require("../models/cart.model");

// DAO de Carritos con persistencia en MongoDB (Mongoose)
class CartDaoMongo {
  // Helper: devuelve el carrito con los productos populados (info completa)
  async #getPopulated(cid) {
    return await CartModel.findById(cid).populate("products.product").lean();
  }

  async createCart() {
    const created = await CartModel.create({ products: [] });
    return created.toObject();
  }

  // Trae el carrito con los productos populados
  async getCartById(cid) {
    return await this.#getPopulated(cid);
  }

  // Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return await this.#getPopulated(cid);
  }

  // Elimina un producto puntual del carrito
  async removeProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();
    return await this.#getPopulated(cid);
  }

  // Reemplaza TODOS los productos del carrito por un nuevo arreglo
  // Se espera: [{ product: <id>, quantity: <n> }, ...]
  async updateCartProducts(cid, products) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = products.map((p) => ({
      product: p.product,
      quantity: p.quantity || 1,
    }));
    await cart.save();
    return await this.#getPopulated(cid);
  }

  // Actualiza únicamente la cantidad de un producto del carrito
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const item = cart.products.find((p) => p.product.toString() === pid);
    if (!item) return null;

    item.quantity = quantity;
    await cart.save();
    return await this.#getPopulated(cid);
  }

  // Vacía completamente el carrito
  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return await this.#getPopulated(cid);
  }
}

module.exports = CartDaoMongo;
