// Utilidades globales: sistema de toasts y contador de carrito en la navbar.

// Formateo de precios en Soles peruanos (S/ 1,234.00)
window.soles = (value) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    Number(value || 0)
  );

// ---- Toasts (notificaciones) ----
window.showToast = (message, type = "success") => {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);
  // Animación de entrada
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

// ---- Carrito en navbar ----
// Mantiene el id del carrito activo en localStorage y actualiza el badge.
window.getActiveCartId = () => localStorage.getItem("cartId");

window.setActiveCartId = (id) => localStorage.setItem("cartId", id);

window.updateCartBadge = async () => {
  const badge = document.getElementById("cartCount");
  const cartLink = document.getElementById("cartLink");
  const cid = window.getActiveCartId();
  if (cartLink && cid) cartLink.setAttribute("href", `/carts/${cid}`);
  if (!badge || !cid) return;
  try {
    const res = await fetch(`/api/carts/${cid}`);
    if (!res.ok) return;
    const data = await res.json();
    const count = (data.payload.products || []).reduce(
      (acc, it) => acc + (it.quantity || 0),
      0
    );
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  } catch (_) {
    /* silencioso */
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("cartCount");
  if (badge) badge.style.display = "none";
  window.updateCartBadge();
});
