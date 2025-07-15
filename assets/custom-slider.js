document.addEventListener("DOMContentLoaded", function () {

  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-track]");
  const slides = slider.querySelectorAll("[data-slide]");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  // Cambiado: buscar el contenedor de dots fuera del slider
  const dotsContainer = document.querySelector("[data-dots]");
  const dots = dotsContainer ? dotsContainer.querySelectorAll("button") : [];
  let current = 0;
  const total = slides.length;

  function showSlide(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    current = index;

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("bg-red-500");
        dot.classList.remove("bg-red-300");
      } else {
        dot.classList.remove("bg-red-500");
        dot.classList.add("bg-red-300");
      }
    });
  }

  nextBtn.addEventListener("click", function () {
    let newIndex = (current + 1) % total;
    showSlide(newIndex);
  });

  prevBtn.addEventListener("click", function () {
    let newIndex = (current - 1 + total) % total;
    showSlide(newIndex);
  });

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.dataset.dot, 10);
      showSlide(index);
    });
  });

  // Auto-play every 5 seconds
  setInterval(function () {
    let newIndex = (current + 1) % total;
    showSlide(newIndex);
  }, 5000);

  // Inicializar
  showSlide(current);
});
