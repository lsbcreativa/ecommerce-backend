// Botón "Agregar al carrito": reutiliza el carrito guardado o crea uno nuevo.
const addBtn = document.getElementById("addToCartBtn");

async function getOrCreateCart() {
  let cartId = window.getActiveCartId();
  if (cartId) {
    // Verificamos que el carrito siga existiendo
    const check = await fetch(`/api/carts/${cartId}`);
    if (check.ok) return cartId;
  }
  const res = await fetch("/api/carts", { method: "POST" });
  const data = await res.json();
  cartId = data.payload._id || data.payload.id;
  window.setActiveCartId(cartId);
  return cartId;
}

addBtn?.addEventListener("click", async () => {
  addBtn.disabled = true;
  try {
    const pid = addBtn.dataset.pid;
    const cartId = await getOrCreateCart();

    const res = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 }),
    });
    if (!res.ok) throw new Error("No se pudo agregar el producto");

    await window.updateCartBadge();
    window.showToast(
      `✅ Producto agregado. <a href="/carts/${cartId}">Ver carrito</a>`
    );
  } catch (err) {
    window.showToast("❌ " + err.message, "error");
  } finally {
    addBtn.disabled = false;
  }
});
