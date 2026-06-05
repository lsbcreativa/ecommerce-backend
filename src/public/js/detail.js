// Lógica del botón "Agregar al carrito" en la vista de detalle.
// Reutiliza un carrito guardado en localStorage; si no existe, lo crea.
const addBtn = document.getElementById("addToCartBtn");
const cartMsg = document.getElementById("cartMsg");

async function getOrCreateCart() {
  let cartId = localStorage.getItem("cartId");
  if (cartId) return cartId;

  const res = await fetch("/api/carts", { method: "POST" });
  const data = await res.json();
  cartId = data.payload._id || data.payload.id;
  localStorage.setItem("cartId", cartId);
  return cartId;
}

addBtn.addEventListener("click", async () => {
  try {
    const pid = addBtn.dataset.pid;
    const cartId = await getOrCreateCart();

    const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 }),
    });

    if (!res.ok) throw new Error("No se pudo agregar el producto");

    cartMsg.innerHTML = `✅ Agregado. <a href="/carts/${cartId}">Ver carrito</a>`;
  } catch (err) {
    cartMsg.style.color = "#dc2626";
    cartMsg.textContent = "❌ " + err.message;
  }
});
