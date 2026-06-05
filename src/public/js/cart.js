// Acciones del carrito: quitar producto, vaciar y finalizar compra (ticket).
const table = document.getElementById("cartTable");
const emptyBtn = document.getElementById("emptyCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const ticketArea = document.getElementById("ticketArea");
const cid = table?.dataset.cid || emptyBtn?.dataset.cid || checkoutBtn?.dataset.cid;

// Quitar un producto puntual (DELETE /api/carts/:cid/products/:pid)
table?.addEventListener("click", async (e) => {
  const pid = e.target.dataset.remove;
  if (!pid) return;
  try {
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo quitar el producto");
    window.showToast("Producto quitado del carrito");
    setTimeout(() => location.reload(), 600);
  } catch (err) {
    window.showToast("❌ " + err.message, "error");
  }
});

// Vaciar el carrito completo (DELETE /api/carts/:cid)
emptyBtn?.addEventListener("click", async () => {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  try {
    const res = await fetch(`/api/carts/${cid}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo vaciar el carrito");
    window.showToast("Carrito vaciado");
    setTimeout(() => location.reload(), 600);
  } catch (err) {
    window.showToast("❌ " + err.message, "error");
  }
});

// Finalizar compra (POST /api/carts/:cid/purchase) -> genera ticket
checkoutBtn?.addEventListener("click", async () => {
  checkoutBtn.disabled = true;
  try {
    const res = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "No se pudo finalizar la compra");

    const t = data.payload.ticket;
    const fecha = new Date(t.purchase_datetime).toLocaleString("es-AR");
    const filas = (t.products || [])
      .map(
        (p) =>
          `<div class="ticket-row"><span>${p.title} x${p.quantity}</span><span>$${(
            p.price * p.quantity
          ).toFixed(2)}</span></div>`
      )
      .join("");

    ticketArea.innerHTML = `
      <div class="ticket">
        <h3>✅ ¡Compra realizada con éxito!</h3>
        <div class="ticket-row"><span>Código</span><span class="ticket-code">${t.code}</span></div>
        <div class="ticket-row"><span>Fecha</span><span>${fecha}</span></div>
        <div class="ticket-row"><span>Comprador</span><span>${t.purchaser}</span></div>
        ${filas}
        <div class="ticket-row" style="font-weight:700;border:none;margin-top:.4rem">
          <span>TOTAL</span><span>$${Number(t.amount).toFixed(2)}</span>
        </div>
      </div>`;

    document.getElementById("cartContent").innerHTML =
      "<p class='subtitle'>El carrito quedó procesado.</p>";
    ticketArea.scrollIntoView({ behavior: "smooth" });
    window.showToast("🎉 Compra confirmada");
    await window.updateCartBadge();
  } catch (err) {
    window.showToast("❌ " + err.message, "error");
  } finally {
    checkoutBtn.disabled = false;
  }
});
