const { Router } = require("express");
const validateProduct = require("../middlewares/validateProduct");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");

const router = Router();

// /api/products
router.get("/", getProducts);
router.get("/:pid", getProductById);
router.post("/", validateProduct, createProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);

module.exports = router;
