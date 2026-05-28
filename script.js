const themeToggle = document.getElementById("theme-toggle");
const yearNode = document.getElementById("year");
const yearRange = document.getElementById("year-range");
const selectedYear = document.getElementById("selected-year");

// Theme Logic
function setTheme(mode) {
  document.body.classList.toggle("light", mode === "light");
  localStorage.setItem("portfolio-theme", mode);
}

function toggleTheme(e) {
  const transition = document.querySelector(".theme-transition");
  
  // Capture click coordinates for the radial transition
  const x = e.clientX || window.innerWidth / 2;
  const y = e.clientY || window.innerHeight / 2;
  
  document.documentElement.style.setProperty('--mouse-x', `${x}px`);
  document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  
  // Trigger portal effect
  transition.classList.add("active");
  
  setTimeout(() => {
    const isLight = document.body.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  }, 400); // Change theme halfway through transition
  
  setTimeout(() => {
    transition.classList.remove("active");
  }, 1000); // Wait for transition to complete
}

// Update setupTheme to pass event object
function setupTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved === "light") {
    setTheme("light");
  } else if (!saved && window.matchMedia("(prefers-color-scheme: light)").matches) {
    setTheme("light");
  }
  if (themeToggle) themeToggle.addEventListener("click", (e) => toggleTheme(e));
}

// Year Logic
function setupYear() {
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

// Reveal Animation Logic
function setupReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// Journey Scroll Logic
function setupJourneyScroll() {
  const sections = document.querySelectorAll(".journey-section");
  if (sections.length === 0) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "-100px 0px -20px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        sections.forEach(s => s.classList.remove("active"));
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// Mobile Navigation Logic
function setupMobileNav() {
  const toggle = document.getElementById("mobile-toggle");
  const menu = document.getElementById("mobile-menu");
  
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
      toggle.classList.toggle("active");
      document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "auto";
    });

    // Close menu when a link is clicked
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    });
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupTheme();
  setupYear();
  setupReveal();
  setupJourneyScroll();
  setupMobileNav();
});
