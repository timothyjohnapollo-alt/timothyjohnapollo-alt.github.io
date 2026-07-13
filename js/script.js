document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.getElementById(this.getAttribute("href").substring(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  hamburger.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("active");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("active");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("visible"), (i % 4) * 90);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Carousel ---------- */
  const track = document.querySelector(".carousel-track");
  if (track) {
    let cards = Array.from(track.children);

    // Clone once for an infinite feel
    if (!track.dataset.cloned) {
      cards.forEach(card => track.appendChild(card.cloneNode(true)));
      track.dataset.cloned = "true";
      cards = Array.from(track.children);
    }

    let position = 0;
    let startX = 0;
    let isDragging = false;

    const cardWidth = () => cards[0].offsetWidth + 28;   // includes gap
    const totalWidth = () => cardWidth() * (cards.length / 2);

    function apply3DEffect() {
      const rect = track.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      cards.forEach(card => {
        const cRect = card.getBoundingClientRect();
        const cCenter = cRect.left + cRect.width / 2;
        const offset = cCenter - centerX;
        card.className = "carousel-card";
        if (Math.abs(offset) < cRect.width / 2) card.classList.add("center");
        else if (offset < 0) card.classList.add("left");
        else card.classList.add("right");
      });
    }

    function move(dir) {
      position += dir * cardWidth();
      if (Math.abs(position) >= totalWidth()) position = 0;
      if (position > 0) position = -(totalWidth() - cardWidth());
      track.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
      track.style.transform = `translateX(${position}px)`;
      apply3DEffect();
    }

    document.querySelector(".carousel-btn.next").addEventListener("click", () => move(-1));
    document.querySelector(".carousel-btn.prev").addEventListener("click", () => move(1));

    // Touch / drag
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = "none";
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const moveX = e.touches[0].clientX - startX;
      track.style.transform = `translateX(${position + moveX}px)`;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      position += e.changedTouches[0].clientX - startX;
      isDragging = false;
      if (position < -totalWidth()) position = 0;
      if (position > 0) position = -totalWidth();
      track.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
      track.style.transform = `translateX(${position}px)`;
      apply3DEffect();
    });

    // Autoplay (pauses on hover)
    let autoplay = setInterval(() => move(-1), 4500);
    const wrapper = document.querySelector(".carousel-wrapper");
    wrapper.addEventListener("mouseenter", () => clearInterval(autoplay));
    wrapper.addEventListener("mouseleave", () => { autoplay = setInterval(() => move(-1), 4500); });

    window.addEventListener("resize", apply3DEffect);
    apply3DEffect();
  }

  /* ---------- Contact form (mailto) ---------- */
  const form = document.querySelector(".contact-form");
  if (form) {
    const RECIPIENT = "radiumindustrial.supp@gmail.com";
    const notice = document.getElementById("formNotice");
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector("textarea");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();

      // Simple validation
      if (!name || !email || !message) {
        showNotice("Please fill in all fields before sending.", false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotice("Please enter a valid email address.", false);
        return;
      }

      // Build the email
      const subject = `Website Inquiry from ${name}`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}`;

      const mailtoUrl =
        `mailto:${RECIPIENT}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      // Open the visitor's email app
      window.location.href = mailtoUrl;

      showNotice("Opening your email app… just hit send to reach us.", true);
      form.reset();
    });

    function showNotice(text, ok) {
      notice.textContent = text;
      notice.style.display = "block";
      notice.style.color = ok ? "#7bd88f" : "#ff9b9b";
    }
  }
}); 