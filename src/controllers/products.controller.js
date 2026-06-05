const productsService = require("../services/products.service");

// Helper: construye prevLink / nextLink conservando los query params actuales.
const buildLink = (req, page) => {
  if (!page) return null;
  const url = new URL(
    `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`
  );
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== "page") url.searchParams.set(key, value);
  });
  url.searchParams.set("page", page);
  return url.pathname + url.search;
};

// Emite la lista actualizada de productos a todos los sockets conectados.
const emitUpdatedProducts = async (req) => {
  const io = req.app.get("io");
  if (!io) return;
  const result = await productsService.getProducts({ limit: 100, page: 1 });
  io.emit("products:updated", result.docs);
};

// GET /api/products  -> listado con limit, page, query, sort
const getProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    const result = await productsService.getProducts({ limit, page, query, sort });

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage ?? null,
      nextPage: result.nextPage ?? null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(req, result.prevPage),
      nextLink: buildLink(req, result.nextPage),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:pid
const getProductById = async (req, res, next) => {
  try {
    const product = await productsService.getProductById(req.params.pid);
    res.json({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};

// POST /api/products  -> crea producto (id autogenerado) y emite por WebSocket
const createProduct = async (req, res, next) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } =
      req.body;

    const newProduct = await productsService.createProduct({
      title,
      description,
      code,
      price: Number(price),
      status: status !== undefined ? status : true,
      stock: Number(stock),
      category,
      thumbnails: thumbnails || [],
    });

    await emitUpdatedProducts(req);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:pid  -> actualiza (sin modificar id)
const updateProduct = async (req, res, next) => {
  try {
    const updated = await productsService.updateProduct(req.params.pid, req.body);
    await emitUpdatedProducts(req);
    res.json({ status: "success", payload: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:pid
const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productsService.deleteProduct(req.params.pid);
    await emitUpdatedProducts(req);
    res.json({ status: "success", message: "Producto eliminado", payload: deleted });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
