
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Avaa valikko");
  };

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Sulje valikko" : "Avaa valikko");
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach((s) => sectionObserver.observe(s));

  const revealEls = document.querySelectorAll(".card, .section-head, .lawyer, .pricing > *, .slideshow, .contact-grid > *");
  revealEls.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));

  const slides = document.querySelectorAll(".slide");
  const dotsWrap = document.querySelector(".dots");
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Vaihe ${i + 1}`);
    dot.addEventListener("click", () => { showSlide(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll(".dot");

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("active", i === current));
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => showSlide(current + 1), 6000);
  }

  document.querySelector(".slide-btn.prev").addEventListener("click", () => { showSlide(current - 1); restart(); });
  document.querySelector(".slide-btn.next").addEventListener("click", () => { showSlide(current + 1); restart(); });

  const slideshow = document.querySelector(".slideshow");
  let startX = 0;
  slideshow.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slideshow.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { showSlide(current + (dx < 0 ? 1 : -1)); restart(); }
  });

  slideshow.addEventListener("mouseenter", () => clearInterval(timer));
  slideshow.addEventListener("mouseleave", restart);
  restart();

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    form.querySelectorAll("input, textarea").forEach((el) => el.classList.remove("invalid"));
    const errors = [];

    if (!name) { errors.push("nimi"); form.name.classList.add("invalid"); }
    if (!message) { errors.push("asia"); form.message.classList.add("invalid"); }
    if (!phone && !email) {
      errors.push("puhelinnumero tai sähköposti");
      form.phone.classList.add("invalid");
      form.email.classList.add("invalid");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("toimiva sähköpostiosoite");
      form.email.classList.add("invalid");
    }

    if (errors.length) {
      status.textContent = "Täytä vielä: " + errors.join(", ") + ".";
      status.className = "form-status error";
      return;
    }

    const body = `Nimi: ${name}\nPuhelin: ${phone || "-"}\nSähköposti: ${email || "-"}\n\n${message}`;
    window.location.href =
      "mailto:antti.kortelainen@aaoy.fi" +
      "?subject=" + encodeURIComponent("Yhteydenotto verkkosivuilta: " + name) +
      "&body=" + encodeURIComponent(body);

    status.textContent = "Kiitos! Sähköpostiohjelmasi avautuu valmiiksi täytetyllä viestillä.";
    status.className = "form-status ok";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
