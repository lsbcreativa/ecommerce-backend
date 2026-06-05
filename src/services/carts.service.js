const { cartDao, productDao, ticketDao } = require("../dao/factory");
const CustomError = require("../utils/CustomError");
const crypto = require("crypto");

// Extrae el id de un producto sin importar la persistencia
const getProductId = (product) => {
  if (!product) return null;
  if (typeof product === "object") return String(product._id || product.id);
  return String(product);
};

// Capa de servicio de Carritos: lógica de negocio (incluye el proceso de compra).
class CartsService {
  createCart() {
    return cartDao.createCart();
  }

  async getCartById(cid) {
    const cart = await cartDao.getCartById(cid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);
    return cart;
  }

  async addProductToCart(cid, pid, quantity = 1) {
    // Validamos que el producto exista antes de agregarlo
    await productDao.getProductById(pid).then((p) => {
      if (!p) throw new CustomError("Producto no encontrado", 404);
    });
    const cart = await cartDao.addProductToCart(cid, pid, quantity);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);
    return cart;
  }

  async removeProductFromCart(cid, pid) {
    const cart = await cartDao.removeProductFromCart(cid, pid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);
    return cart;
  }

  async updateCartProducts(cid, products) {
    if (!Array.isArray(products)) {
      throw new CustomError(
        "Se espera un arreglo 'products' con { product, quantity }",
        400
      );
    }
    const cart = await cartDao.updateCartProducts(cid, products);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    if (quantity === undefined || Number(quantity) < 1) {
      throw new CustomError("La cantidad (quantity) debe ser >= 1", 400);
    }
    const cart = await cartDao.updateProductQuantity(cid, pid, Number(quantity));
    if (!cart) throw new CustomError("Carrito o producto no encontrado", 404);
    return cart;
  }

  async clearCart(cid) {
    const cart = await cartDao.clearCart(cid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);
    return cart;
  }

  /**
   * Proceso de compra (checkout):
   * - Verifica stock de cada producto.
   * - Compra los que tienen stock suficiente (descuenta stock).
   * - Genera un ticket con el total y el detalle.
   * - Deja en el carrito los productos sin stock (no comprados).
   */
  async purchaseCart(cid, purchaser = "consumidor-final@ecommerce.com") {
    const cart = await cartDao.getCartById(cid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);

    const items = cart.products || [];
    if (items.length === 0) {
      throw new CustomError("El carrito está vacío", 400);
    }

    const purchased = []; // detalle de lo comprado (para el ticket)
    const failed = []; // productos sin stock suficiente (quedan en el carrito)
    let amount = 0;

    for (const item of items) {
      const pid = getProductId(item.product);
      const product = await productDao.getProductById(pid);

      // Producto inexistente o sin stock suficiente -> queda pendiente
      if (!product || product.stock < item.quantity) {
        failed.push({ product: pid, quantity: item.quantity });
        continue;
      }

      // Hay stock: descontamos y sumamos al total
      await productDao.updateProduct(pid, {
        stock: product.stock - item.quantity,
      });
      amount += product.price * item.quantity;
      purchased.push({
        product: pid,
        title: product.title,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Si no se pudo comprar nada, no generamos ticket
    if (purchased.length === 0) {
      throw new CustomError(
        "No se pudo completar la compra: sin stock suficiente",
        409
      );
    }

    // Creamos el ticket
    const ticket = await ticketDao.createTicket({
      code: "TCK-" + crypto.randomUUID().split("-")[0].toUpperCase(),
      purchase_datetime: new Date(),
      amount,
      purchaser,
      products: purchased,
    });

    // El carrito queda solo con lo que no se pudo comprar
    await cartDao.updateCartProducts(cid, failed);

    return {
      ticket,
      purchased,
      failedProducts: failed.map((f) => f.product),
    };
  }
}

module.exports = new CartsService();
