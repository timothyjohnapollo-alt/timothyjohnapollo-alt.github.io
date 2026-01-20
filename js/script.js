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
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("active"); // toggles menu
  hamburger.classList.toggle("open");   // optional if you have hamburger animation
});

// Close menu when a link is clicked
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

