// Helpers personalizados para Handlebars
module.exports = {
  // Multiplica dos números (precio * cantidad)
  multiply: (a, b) => (Number(a) || 0) * (Number(b) || 0),
  // Comparación de igualdad
  eq: (a, b) => a === b,
  // Suma 1 (para mostrar índices base 1)
  inc: (value) => Number(value) + 1,
  // Formatea a precio con 2 decimales
  money: (value) => Number(value || 0).toFixed(2),
  // Devuelve el id correcto sin importar la persistencia:
  // MongoDB usa _id (ObjectId) y FileSystem usa id (string).
  getId: (obj) => String(obj?._id ?? obj?.id ?? ""),
};
