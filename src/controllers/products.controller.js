const { productDao } = require("../dao/factory");
const CustomError = require("../utils/CustomError");

// Helper: construye prevLink / nextLink conservando los query params actuales.
const buildLink = (req, page) => {
  if (!page) return null;
  const url = new URL(
    `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`
  );
  // Copiamos los query params actuales y reemplazamos la página
  Object.entries(req.query).forEach(([key, value]) => {
    if (key !== "page") url.searchParams.set(key, value);
  });
  url.searchParams.set("page", page);
  return url.pathname + url.search;
};

// GET /api/products  -> listado con limit, page, query, sort
const getProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;

    const result = await productDao.getProducts({ limit, page, query, sort });

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
    const { pid } = req.params;
    const product = await productDao.getProductById(pid);
    if (!product) throw new CustomError("Producto no encontrado", 404);

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

    const newProduct = await productDao.createProduct({
      title,
      description,
      code,
      price: Number(price),
      status: status !== undefined ? status : true,
      stock: Number(stock),
      category,
      thumbnails: thumbnails || [],
    });

    // Notificamos a los clientes conectados por WebSocket
    await emitUpdatedProducts(req);

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    // Manejo de código duplicado (índice unique)
    if (error.code === 11000) {
      return next(new CustomError("El código (code) ya existe", 400));
    }
    next(error);
  }
};

// PUT /api/products/:pid  -> actualiza (sin modificar id)
const updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const updated = await productDao.updateProduct(pid, req.body);
    if (!updated) throw new CustomError("Producto no encontrado", 404);

    await emitUpdatedProducts(req);

    res.json({ status: "success", payload: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:pid
const deleteProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const deleted = await productDao.deleteProduct(pid);
    if (!deleted) throw new CustomError("Producto no encontrado", 404);

    await emitUpdatedProducts(req);

    res.json({ status: "success", message: "Producto eliminado", payload: deleted });
  } catch (error) {
    next(error);
  }
};

// Emite la lista actualizada de productos a todos los sockets conectados.
const emitUpdatedProducts = async (req) => {
  const io = req.app.get("io");
  if (!io) return;
  const result = await productDao.getProducts({ limit: 100, page: 1 });
  io.emit("products:updated", result.docs);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
