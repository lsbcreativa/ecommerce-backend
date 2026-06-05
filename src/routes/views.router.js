const { Router } = require("express");
const productsService = require("../services/products.service");
const cartsService = require("../services/carts.service");

const router = Router();

// Home -> redirige al listado de productos
router.get("/", (req, res) => res.redirect("/products"));

// Vista de productos en tiempo real (WebSockets)
router.get("/realtimeproducts", async (req, res, next) => {
  try {
    const result = await productsService.getProducts({ limit: 100, page: 1 });
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
    const result = await productsService.getProducts({ limit, page, query, sort });

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
      sort: sort || "",
      query: query || "",
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
});

// /products/:pid -> detalle del producto con opción de agregar al carrito
router.get("/products/:pid", async (req, res, next) => {
  try {
    const product = await productsService.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).render("error", {
        title: "No encontrado",
        message: "Producto no encontrado",
      });
    }
    res.render("productDetail", { title: product.title, product });
  } catch (error) {
    // ID inválido u otro error -> mostramos la vista de error
    res.status(404).render("error", {
      title: "No encontrado",
      message: "Producto no encontrado",
    });
  }
});

// /carts/:cid -> visualización de un carrito específico
router.get("/carts/:cid", async (req, res, next) => {
  try {
    const cart = await cartsService.getCartById(req.params.cid);
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
    // ID inválido u otro error -> mostramos la vista de error
    res.status(404).render("error", {
      title: "No encontrado",
      message: "Carrito no encontrado",
    });
  }
});

module.exports = router;
