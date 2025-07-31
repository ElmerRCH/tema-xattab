// ✅ Notificación reutilizable
function showNotification(message) {
    let notification = document.createElement("div");
    notification.textContent = message;
    notification.className = "fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ✅ Actualizar contador del carrito
async function updateCartCount() {
    try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        document.querySelectorAll('.cart-count').forEach(counter => {
            counter.textContent = cart.item_count;
        });
        return cart;
    } catch (error) {
        console.error('Error al actualizar el contador del carrito:', error);
    }
}


// ✅ Validación para botones "Agregar al carrito"
document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 🔹 Sincronizar cantidad desde input global si existe
        const globalQuantityInput = document.getElementById('quantity-input');
        const hiddenQuantity = form.querySelector('.quantity-field');
        if (globalQuantityInput && hiddenQuantity) {
            hiddenQuantity.value = globalQuantityInput.value;
        }

        const stock = parseInt(form.dataset.stock, 10) || 99999;
        const variantId = form.querySelector("input[name='id']").value;
        const quantityToAdd = parseInt(hiddenQuantity.value, 10) || 1;

        try {
            const cart = await updateCartCount();
            const existingItem = cart.items.find(item => item.variant_id == variantId);
            const currentQty = existingItem ? existingItem.quantity : 0;

            if ((currentQty + quantityToAdd) > stock) {
                showNotification("⚠️ Has alcanzado la cantidad máxima disponible para este producto.");
                return;
            }

            const formData = new FormData(this);
            const btn = this.querySelector("button");
            const text = btn.querySelector(".button-text");
            const spinner = btn.querySelector(".loading-spinner");

            btn.disabled = true;
            if (text) text.textContent = "Agregando...";
            if (spinner) spinner.classList.remove("hidden");

            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                await updateCartCount();
                setTimeout(() => {
                    btn.disabled = false;
                    if (text) text.textContent = "Agregar al carrito";
                    if (spinner) spinner.classList.add("hidden");
                }, 1000);
            } else {
                showNotification("❌ Error al agregar producto.");
                btn.disabled = false;
            }
        } catch (error) {
            console.error('Error de red', error);
        }
    });
});


// ✅ Validación del input en la página de producto
document.addEventListener("DOMContentLoaded", async () => {
    const quantityInput = document.getElementById("quantity-input");
    const incrementBtn = document.getElementById("increment-button");
    const decrementBtn = document.getElementById("decrement-button");
    const buyNowBtn = document.getElementById('buy-now-btn');

    if (!quantityInput) return; // Si no estamos en product.liquid, salir

    const maxStock = parseInt(quantityInput.dataset.stock, 10) || 1;
    const variantId = document.querySelector("input[name='id']").value;

    let alreadyInCart = 0;

    try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        const existingItem = cart.items.find(item => item.variant_id == variantId);
        alreadyInCart = existingItem ? existingItem.quantity : 0;
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
    }

    const getRemainingStock = () => maxStock - alreadyInCart;

    const updateQuantity = (change) => {
        let currentValue = parseInt(quantityInput.value, 10) || 1;
        let newValue = currentValue + change;

        if (newValue < 1) newValue = 1;
        if (newValue > getRemainingStock()) {
            newValue = getRemainingStock();
            showNotification("⚠️ Has alcanzado la cantidad máxima disponible para este producto.");
        }

        quantityInput.value = newValue;
    };

    incrementBtn.addEventListener("click", () => updateQuantity(1));
    decrementBtn.addEventListener("click", () => updateQuantity(-1));

    quantityInput.addEventListener("input", () => {
        let value = parseInt(quantityInput.value, 10);
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > getRemainingStock()) {
            quantityInput.value = getRemainingStock();
            showNotification("⚠️ Stock máximo alcanzado.");
        }
    });

    // ✅ Botón "Comprar ahora"
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function () {
            const quantity = document.getElementById('quantity-input').value;
            window.location.href = `/cart/${variantId}:${quantity}`;
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});