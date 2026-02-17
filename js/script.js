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






const track = document.querySelector('.carousel-track');
let cards = Array.from(track.children);

// Duplicate cards for infinite loop (desktop + mobile)
if (!track.dataset.cloned) {
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
  });
  track.dataset.cloned = true;
  cards = Array.from(track.children);
}

let position = 0;
let startX = 0;
let isDragging = false;

// Apply 3D effect or simple scaling
function apply3DEffect() {
  const trackRect = track.getBoundingClientRect();
  const centerX = trackRect.left + trackRect.width / 2;

  cards.forEach(card => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const offset = cardCenter - centerX;

    if (window.innerWidth > 768) {
      // Desktop 3D effect
      if (Math.abs(offset) < cardRect.width / 2) card.className = 'carousel-card center';
      else if (offset < 0) card.className = 'carousel-card left';
      else card.className = 'carousel-card right';
    } else {
      // Tablet/Mobile: simple scaling
      card.className = 'carousel-card';
      if (Math.abs(offset) < cardRect.width / 2) card.classList.add('center');
    }
  });
}

// --- Helper ---
function getCardWidth() {
  return cards[0].offsetWidth + 32;
}

function getTotalWidth() {
  return getCardWidth() * (cards.length / 2);
}

// --- Desktop Buttons Infinite Loop ---
document.querySelector('.carousel-btn.next').addEventListener('click', () => {
  if (window.innerWidth > 768) {
    position -= getCardWidth();
    if (Math.abs(position) >= getTotalWidth()) position = 0; // loop
    track.style.transition = 'transform 0.3s ease';
    track.style.transform = `translateX(${position}px)`;
    apply3DEffect();
  }
});

document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
  if (window.innerWidth > 768) {
    position += getCardWidth();
    if (position > 0) position = -(getTotalWidth() - getCardWidth()); // loop
    track.style.transition = 'transform 0.3s ease';
    track.style.transform = `translateX(${position}px)`;
    apply3DEffect();
  }
});

// --- Mobile/Tablet Touch Control with Infinite Loop ---
track.addEventListener('touchstart', (e) => {
  if (window.innerWidth <= 768) {
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
  }
});

track.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const moveX = currentX - startX;
  track.style.transform = `translateX(${position + moveX}px)`;
});

track.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  const endX = e.changedTouches[0].clientX;
  position += endX - startX;
  isDragging = false;

  // Mobile infinite loop
  const totalWidth = getTotalWidth();
  if (position < -totalWidth) position = 0;        // dragged past last card
  if (position > 0) position = -totalWidth;       // dragged before first card

  track.style.transition = 'transform 0.3s ease';
  track.style.transform = `translateX(${position}px)`;
  apply3DEffect();
});

// Recalculate 3D effect on resize
window.addEventListener('resize', apply3DEffect);
apply3DEffect();



