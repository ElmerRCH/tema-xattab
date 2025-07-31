// ✅ Actualiza el contador del carrito dinámicamente
async function updateCartCount() {
    try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        const cartCounters = document.querySelectorAll('.cart-count');
        
        cartCounters.forEach(counter => {
            counter.textContent = cart.item_count;
            if (cart.item_count > 0) {
                counter.parentElement.classList.remove("hidden");
            }
        });
    } catch (error) {
        console.error('Error al actualizar el contador del carrito:', error);
    }
}


// ✅ Maneja el envío de formularios "Agregar al carrito"
document.querySelectorAll('.add-to-cart-form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Buscar el input de cantidad global (solo en product.liquid)
        const quantityInput = document.getElementById('quantity-input');
        const hiddenQuantity = form.querySelector('.quantity-field');

        // Si existe un input de cantidad en la página, sincronizar su valor
        if (quantityInput && hiddenQuantity) {
            hiddenQuantity.value = quantityInput.value;
        }

        // Preparar datos para enviar al carrito
        const formData = new FormData(this);
        const btn = this.querySelector("button");
        const text = btn.querySelector(".button-text");
        const spinner = btn.querySelector(".loading-spinner");

        // Mostrar estado de carga en el botón
        btn.disabled = true;
        if (text) text.textContent = "Agregando...";
        if (spinner) spinner.classList.remove("hidden");

        try {
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // ✅ Actualizar contador dinámicamente
                await updateCartCount();

                // Restaurar el botón después de 1 segundo
                setTimeout(() => {
                    btn.disabled = false;
                    if (text) text.textContent = "Agregar al carrito";
                    if (spinner) spinner.classList.add("hidden");
                }, 1000);
            } else {
                console.error('Error al agregar producto');
                btn.disabled = false;
            }
        } catch (error) {
            console.error('Error de red', error);
            btn.disabled = false;
        }
    });
});

// ✅ Mantener el contador actualizado al cargar la página
document.addEventListener("DOMContentLoaded", updateCartCount);
