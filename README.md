# 🛒 E-commerce Backend — Node.js + Express + MongoDB

API de e-commerce que gestiona **productos** y **carritos de compra**, con
persistencia en **MongoDB (Mongoose)** y **FileSystem**, vistas con
**Handlebars** y actualización en **tiempo real con WebSockets (Socket.IO)**.

Proyecto final de Backend.

---

## 🚀 Tecnologías

- **Node.js** + **Express 5** (servidor y Express Router)
- **MongoDB** + **Mongoose** (persistencia principal)
- **mongoose-paginate-v2** (paginación)
- **FileSystem** (persistencia alternativa, no eliminada)
- **Express-Handlebars** (motor de vistas)
- **Socket.IO** (WebSockets / tiempo real)
- **dotenv**, **cors**

---

## 📁 Estructura del proyecto

```
ecommerce-backend/
├── src/
│   ├── app.js                      # Servidor principal (puerto 8080)
│   ├── config/
│   │   ├── config.js               # Variables de entorno
│   │   └── db.js                   # Conexión a MongoDB
│   ├── controllers/                # Lógica de negocio
│   │   ├── products.controller.js
│   │   └── carts.controller.js
│   ├── dao/                        # Data Access Object
│   │   ├── factory.js              # Selecciona Mongo o FS según .env
│   │   ├── models/                 # Modelos de Mongoose
│   │   │   ├── product.model.js
│   │   │   └── cart.model.js
│   │   ├── mongo/                  # DAO MongoDB
│   │   │   ├── ProductDaoMongo.js
│   │   │   └── CartDaoMongo.js
│   │   └── fs/                     # DAO FileSystem
│   │       ├── ProductDaoFS.js
│   │       └── CartDaoFS.js
│   ├── data/                       # Persistencia FS (JSON)
│   ├── middlewares/                # Middlewares (errores, validación)
│   ├── routes/                     # Express Routers
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── sockets/                    # Configuración de Socket.IO
│   ├── public/                     # CSS y JS de cliente
│   ├── utils/                      # Helpers, seed, errores
│   └── views/                      # Plantillas Handlebars
└── package.json
```

### Arquitectura

Se utiliza el patrón **DAO + Factory**: los *controllers* nunca saben si los
datos vienen de MongoDB o de archivos. El `factory.js` decide qué DAO instanciar
según la variable `PERSISTENCE` del archivo `.env`. Esto desacopla la lógica de
negocio de la persistencia (inyección de dependencias).

```
Cliente → Router → Controller → DAO (Mongo | FS) → Base de datos
```

---

## ⚙️ Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (.env ya incluido)
#    PORT=8080
#    MONGO_URL=mongodb://127.0.0.1:27017/ecommerce
#    PERSISTENCE=mongo      # "mongo" o "fs"

# 3. (Opcional) Cargar productos de ejemplo
npm run seed

# 4. Iniciar el servidor
npm start          # producción
npm run dev        # desarrollo (nodemon)
```

Servidor en: **http://localhost:8080**

| Recurso            | URL                                   |
| ------------------ | ------------------------------------- |
| API Productos      | http://localhost:8080/api/products    |
| API Carritos       | http://localhost:8080/api/carts       |
| Vista Productos    | http://localhost:8080/products        |
| Detalle Producto   | http://localhost:8080/products/:pid   |
| Vista Carrito      | http://localhost:8080/carts/:cid      |
| Tiempo Real        | http://localhost:8080/realtimeproducts|

---

## 📦 Endpoints — Productos `/api/products`

| Método | Ruta              | Descripción                                    |
| ------ | ----------------- | ---------------------------------------------- |
| GET    | `/`               | Lista con `limit`, `page`, `query`, `sort`     |
| GET    | `/:pid`           | Obtiene un producto por ID                     |
| POST   | `/`               | Crea un producto (ID autogenerado)             |
| PUT    | `/:pid`           | Actualiza un producto (no modifica el ID)      |
| DELETE | `/:pid`           | Elimina un producto                            |

**Query params del GET:**
- `limit` (def. 10), `page` (def. 1)
- `query`: filtro por categoría o disponibilidad
  (`category:tecnologia`, `status:true`, o texto simple = categoría)
- `sort`: `asc` | `desc` (por precio)

**Formato de respuesta del GET /api/products:**

```json
{
  "status": "success",
  "payload": [],
  "totalPages": 0,
  "prevPage": null,
  "nextPage": null,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevLink": null,
  "nextLink": null
}
```

### Body para crear/actualizar producto

```json
{
  "title": "Notebook Lenovo",
  "description": "14'' Ryzen 5, 16GB RAM",
  "code": "NB-001",
  "price": 850,
  "status": true,
  "stock": 12,
  "category": "tecnologia",
  "thumbnails": ["https://..."]
}
```

---

## 🛒 Endpoints — Carritos `/api/carts`

| Método | Ruta                          | Descripción                                  |
| ------ | ----------------------------- | -------------------------------------------- |
| POST   | `/`                           | Crea un carrito (ID autogenerado)            |
| GET    | `/:cid`                       | Lista productos del carrito (con `populate`) |
| POST   | `/:cid/products/:pid`         | Agrega producto (si existe, suma cantidad)   |
| DELETE | `/:cid/products/:pid`         | Elimina un producto del carrito              |
| PUT    | `/:cid`                       | Reemplaza todos los productos del carrito    |
| PUT    | `/:cid/products/:pid`         | Actualiza solo la cantidad de un producto    |
| DELETE | `/:cid`                       | Vacía el carrito completo                    |

**Body PUT `/:cid`** (reemplaza todo):
```json
{ "products": [ { "product": "<idProducto>", "quantity": 2 } ] }
```

**Body PUT `/:cid/products/:pid`** (solo cantidad):
```json
{ "quantity": 5 }
```

---

## ⚡ Tiempo real (WebSockets)

La vista `/realtimeproducts` permite **crear y eliminar productos**, y la lista
se actualiza automáticamente en todos los navegadores conectados sin recargar,
mediante el evento `products:updated` emitido por el servidor.

---

## 🗄️ Persistencia

- **MongoDB** (por defecto): base de datos `ecommerce`, colecciones `products`
  y `carts`. El carrito guarda referencias a productos y usa `populate` para
  traer la información completa.
- **FileSystem**: cambiando `PERSISTENCE=fs` en `.env`, los datos se guardan en
  `src/data/products.json` y `src/data/carts.json`.

---

## ✅ Requisitos técnicos cubiertos

- [x] Servidor Node.js + Express en el puerto 8080
- [x] Express Router (`/api/products`, `/api/carts`, vistas)
- [x] Middlewares (manejo de errores y validación)
- [x] Asincronía con `async/await`
- [x] Mongoose con modelos y relaciones (`populate`)
- [x] CRUD completo de productos y carritos
- [x] Paginación, filtros y ordenamiento
- [x] WebSockets para tiempo real
- [x] Persistencia dual MongoDB + FileSystem (DAO + Factory)
- [x] Código modular y organizado
