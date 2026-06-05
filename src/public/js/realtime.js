// Cliente de WebSockets para la vista de productos en tiempo real.
const socket = io();

const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");
const formMsg = document.getElementById("formMsg");

// Renderiza la lista cada vez que el servidor emite "products:updated"
socket.on("products:updated", (products) => {
  productList.innerHTML = "";
  if (!products.length) {
    productList.innerHTML = "<li>No hay productos cargados.</li>";
    return;
  }
  products.forEach((p) => {
    const id = p._id || p.id;
    const li = document.createElement("li");
    li.dataset.id = id;
    li.innerHTML = `
      <span>
        <strong>${p.title}</strong> — $${Number(p.price).toFixed(2)}
        <small>(${p.category}, stock ${p.stock})</small>
      </span>
      <button class="btn danger small" data-delete="${id}">Eliminar</button>`;
    productList.appendChild(li);
  });
});

// Crear producto (POST a la API REST; el server emite la actualización)
productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(productForm);
  const body = Object.fromEntries(formData.entries());
  if (body.thumbnails) body.thumbnails = [body.thumbnails];

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al crear");

    productForm.reset();
    formMsg.style.color = "#059669";
    formMsg.textContent = "✅ Producto creado";
  } catch (err) {
    formMsg.style.color = "#dc2626";
    formMsg.textContent = "❌ " + err.message;
  }
});

// Eliminar producto (delegación de eventos sobre la lista)
productList.addEventListener("click", async (e) => {
  const id = e.target.dataset.delete;
  if (!id) return;

  if (!confirm("¿Eliminar este producto?")) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo eliminar");
  } catch (err) {
    formMsg.style.color = "#dc2626";
    formMsg.textContent = "❌ " + err.message;
  }
});
