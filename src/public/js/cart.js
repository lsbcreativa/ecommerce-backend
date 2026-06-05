// Acciones del carrito: quitar un producto y vaciar el carrito.
const table = document.getElementById("cartTable");
const emptyBtn = document.getElementById("emptyCartBtn");
const cid = table?.dataset.cid;

// Quitar un producto puntual (DELETE /api/carts/:cid/products/:pid)
table?.addEventListener("click", async (e) => {
  const pid = e.target.dataset.remove;
  if (!pid) return;
  try {
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("No se pudo quitar el producto");
    location.reload();
  } catch (err) {
    alert("❌ " + err.message);
  }
});

// Vaciar el carrito completo (DELETE /api/carts/:cid)
emptyBtn?.addEventListener("click", async () => {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  try {
    const res = await fetch(`/api/carts/${cid}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo vaciar el carrito");
    location.reload();
  } catch (err) {
    alert("❌ " + err.message);
  }
});
