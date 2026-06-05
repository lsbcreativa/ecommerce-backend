const { cartDao } = require("../dao/factory");
const CustomError = require("../utils/CustomError");

// POST /api/carts  -> crea carrito con id autogenerado
const createCart = async (req, res, next) => {
  try {
    const cart = await cartDao.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// GET /api/carts/:cid  -> lista productos del carrito (con populate)
const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// POST /api/carts/:cid/products/:pid  -> agrega producto (o suma cantidad)
const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const quantity = req.body?.quantity ? Number(req.body.quantity) : 1;

    const cart = await cartDao.addProductToCart(cid, pid, quantity);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/carts/:cid/products/:pid  -> elimina un producto del carrito
const removeProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.removeProductFromCart(cid, pid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /api/carts/:cid  -> reemplaza todos los productos del carrito
const updateCartProducts = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      throw new CustomError(
        "Se espera un arreglo 'products' con { product, quantity }",
        400
      );
    }

    const cart = await cartDao.updateCartProducts(cid, products);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /api/carts/:cid/products/:pid  -> actualiza solo la cantidad
const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 1) {
      throw new CustomError("La cantidad (quantity) debe ser >= 1", 400);
    }

    const cart = await cartDao.updateProductQuantity(cid, pid, Number(quantity));
    if (!cart) {
      throw new CustomError("Carrito o producto no encontrado", 404);
    }

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/carts/:cid  -> vacía el carrito completo
const clearCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.clearCart(cid);
    if (!cart) throw new CustomError("Carrito no encontrado", 404);

    res.json({ status: "success", message: "Carrito vaciado", payload: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateCartProducts,
  updateProductQuantity,
  clearCart,
};
