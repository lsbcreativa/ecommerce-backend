const { Router } = require("express");
const { productDao, cartDao } = require("../dao/factory");

const router = Router();

// Home -> redirige al listado de productos
router.get("/", (req, res) => res.redirect("/products"));

// Vista de productos en tiempo real (WebSockets)
router.get("/realtimeproducts", async (req, res, next) => {
  try {
    const result = await productDao.getProducts({ limit: 100, page: 1 });
    res.render("realTimeProducts", {
      title: "Productos en tiempo real",
      products: result.docs,
    });
  } catch (error) {
    next(error);
  }
});

// /products -> listado con paginación
router.get("/products", async (req, res, next) => {
  try {
    const { limit = 10, page = 1, query, sort } = req.query;
    const result = await productDao.getProducts({ limit, page, query, sort });

    const buildLink = (p) => {
      if (!p) return null;
      const params = new URLSearchParams({ ...req.query, page: p });
      return `/products?${params.toString()}`;
    };

    res.render("products", {
      title: "Productos",
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage),
    });
  } catch (error) {
    next(error);
  }
});

// /products/:pid -> detalle del producto con opción de agregar al carrito
router.get("/products/:pid", async (req, res, next) => {
  try {
    const product = await productDao.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).render("error", {
        title: "No encontrado",
        message: "Producto no encontrado",
      });
    }
    res.render("productDetail", { title: product.title, product });
  } catch (error) {
    next(error);
  }
});

// /carts/:cid -> visualización de un carrito específico
router.get("/carts/:cid", async (req, res, next) => {
  try {
    const cart = await cartDao.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).render("error", {
        title: "No encontrado",
        message: "Carrito no encontrado",
      });
    }

    // Calculamos el total para mostrarlo en la vista
    const total = (cart.products || []).reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * item.quantity;
    }, 0);

    res.render("cart", { title: "Carrito", cart, total });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
