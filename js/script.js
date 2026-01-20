document.addEventListener("DOMContentLoaded", function() {
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function(e) {
      const target = document.getElementById(this.getAttribute("href").substring(1));
      if(target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    hamburger.classList.toggle("open");
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      hamburger.classList.remove("open");
    });
  });

  // Testimonial infinite scroll
  const track = document.querySelector(".testimonial-track");
  let scrollPos = 0;

  function scrollTestimonials() {
    if(track) {
      scrollPos += 1;
      if (scrollPos >= track.scrollWidth / 2) scrollPos = 0;
      track.style.transform = `translateX(-${scrollPos}px)`;
      requestAnimationFrame(scrollTestimonials);
    }
  }
  requestAnimationFrame(scrollTestimonials);
});
