const themeToggle = document.getElementById("theme-toggle");
const yearNode = document.getElementById("year");
const yearRange = document.getElementById("year-range");
const selectedYear = document.getElementById("selected-year");

// Theme Logic
function setTheme(mode) {
  document.body.classList.toggle("light", mode === "light");
  localStorage.setItem("portfolio-theme", mode);
}

function toggleTheme() {
  const isLight = document.body.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
}

function setupTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved === "light") {
    setTheme("light");
  } else if (!saved && window.matchMedia("(prefers-color-scheme: light)").matches) {
    setTheme("light");
  }
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
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
