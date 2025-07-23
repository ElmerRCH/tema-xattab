async function updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const cartCountElement = document.getElementById('cart-count');
      if (cartCountElement) {
        cartCountElement.textContent = cart.item_count;
      }
    } catch (error) {
      console.error('Error al actualizar el contador del carrito:', error);
    }
}

document.querySelectorAll('.add-to-cart-form').forEach(form => {
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    

    try {
    const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
        await updateCartCount();
        setTimeout(() => {
        alert('productos agregados correctamente')
        }, 1000);
    } else {
        console.error('Error al agregar producto');
    }
    } catch (error) {
    console.error('Error de red', error);
    }
});
});