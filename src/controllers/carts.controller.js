const cartsService = require("../services/carts.service");

// POST /api/carts  -> crea carrito con id autogenerado
const createCart = async (req, res, next) => {
  try {
    const cart = await cartsService.createCart();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// GET /api/carts/:cid  -> lista productos del carrito (con populate)
const getCartById = async (req, res, next) => {
  try {
    const cart = await cartsService.getCartById(req.params.cid);
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
    const cart = await cartsService.addProductToCart(cid, pid, quantity);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/carts/:cid/products/:pid  -> elimina un producto del carrito
const removeProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsService.removeProductFromCart(cid, pid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /api/carts/:cid  -> reemplaza todos los productos del carrito
const updateCartProducts = async (req, res, next) => {
  try {
    const cart = await cartsService.updateCartProducts(
      req.params.cid,
      req.body.products
    );
    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// PUT /api/carts/:cid/products/:pid  -> actualiza solo la cantidad
const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsService.updateProductQuantity(
      cid,
      pid,
      req.body.quantity
    );
    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/carts/:cid  -> vacía el carrito completo
const clearCart = async (req, res, next) => {
  try {
    const cart = await cartsService.clearCart(req.params.cid);
    res.json({ status: "success", message: "Carrito vaciado", payload: cart });
  } catch (error) {
    next(error);
  }
};

// POST /api/carts/:cid/purchase  -> finaliza la compra y genera ticket
const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const purchaser = req.body?.email || "consumidor-final@ecommerce.com";
    const result = await cartsService.purchaseCart(cid, purchaser);
    res.json({
      status: "success",
      message: "Compra realizada con éxito",
      payload: result,
    });
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
  purchaseCart,
};
