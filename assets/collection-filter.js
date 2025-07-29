document.addEventListener('DOMContentLoaded', function () {
  const filtroForm = document.querySelector('form#filtro');
  const productContainer = document.querySelector('#product-container');

  if (!filtroForm || !productContainer) return; // ⛔ Evita ejecutar el script si no hay filtro o contenedor

  function fetchProducts(url = null) {
    const baseUrl = url || window.location.pathname;
    const params = new URLSearchParams(new FormData(filtroForm)).toString();
    const finalUrl = `${baseUrl}?section_id=collection-products&${params}`;

    fetch(finalUrl)
      .then(res => res.text())
      .then(html => {
        const newDoc = new DOMParser().parseFromString(html, 'text/html');
        const newSection = newDoc.querySelector('#product-container');
        if (newSection) {
          productContainer.innerHTML = newSection.innerHTML;
          window.scrollTo({ top: productContainer.offsetTop, behavior: 'smooth' });
        }
      });
  }

  filtroForm.addEventListener('change', function () {
    fetchProducts();
  });

  document.addEventListener('click', function (e) {
    const link = e.target.closest('.pagination a');
    if (link) {
      e.preventDefault();
      const url = link.getAttribute('href');
      fetchProducts(url);
    }
  });
});
