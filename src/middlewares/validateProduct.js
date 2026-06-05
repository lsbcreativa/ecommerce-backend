const CustomError = require("../utils/CustomError");

// Middleware que valida los campos obligatorios al crear un producto.
const validateProduct = (req, res, next) => {
  const { title, description, code, price, stock, category } = req.body;

  const missing = [];
  if (!title) missing.push("title");
  if (!description) missing.push("description");
  if (!code) missing.push("code");
  if (price === undefined || price === null) missing.push("price");
  if (stock === undefined || stock === null) missing.push("stock");
  if (!category) missing.push("category");

  if (missing.length > 0) {
    return next(
      new CustomError(
        `Faltan campos obligatorios: ${missing.join(", ")}`,
        400
      )
    );
  }

  next();
};

module.exports = validateProduct;
