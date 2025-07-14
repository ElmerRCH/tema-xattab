document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("predictive-search-form");
  const input = document.getElementById("predictive-search-input");
  const results = document.getElementById("predictive-search-results");

  let controller;

  input.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.trim();

    if (searchTerm.length < 1) {
      results.classList.add("hidden");
      return;
    }

    if (controller) controller.abort();
    controller = new AbortController();

    try {
      const res = await fetch(
        `/search/suggest.json?q=${encodeURIComponent(searchTerm)}&resources[type]=product&resources[limit]=5`,
        { signal: controller.signal }
      );
      const data = await res.json();

      const products = data.resources.results.products;

      if (products.length) {
        results.innerHTML = products
          .map(
            (product) => `
              <a href="${product.url}" class="block px-4 py-2 hover:bg-gray-100">
                <div class="flex items-center space-x-2">
                  <img src="${product.image}" class="w-10 h-10 object-cover rounded" />
                  <span>${product.title}</span>
                </div>
              </a>
            `
          )
          .join("");
        results.classList.remove("hidden");
        input.setAttribute("aria-expanded", "true");
      } else {
        results.innerHTML = `<p class="px-4 py-2 text-sm text-gray-500">No hay resultados</p>`;
        results.classList.remove("hidden");
        input.setAttribute("aria-expanded", "true");
      }
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  });

  document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) {
      results.classList.add("hidden");
      input.setAttribute("aria-expanded", "false");
    }
  });
});
