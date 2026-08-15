const themeToggle = document.getElementById("theme-toggle");
const yearNode = document.getElementById("year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;
const isCinematicDesktop = () => window.innerWidth > 1024 && !isTouch;
let rafSetStretch = null;
const MOTION = {
  easePrimary: "power3.inOut",
  easeSoft: "power2.out",
  scrubFast: 0.85,
  scrubSlow: 1.35
};
const ABOUT_HORIZONTAL_IDS = new Set([
  "journey-scroll"
]);

function setTheme(mode) {
  document.body.classList.toggle("light", mode === "light");
  localStorage.setItem("portfolio-theme", mode);
}

function toggleTheme(event) {
  const transition = document.querySelector(".theme-transition");
  if (!transition) {
    const isLight = document.body.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
    return;
  }
  const x = event?.clientX || window.innerWidth / 2;
  const y = event?.clientY || window.innerHeight / 2;
  document.documentElement.style.setProperty("--mouse-x", `${x}px`);
  document.documentElement.style.setProperty("--mouse-y", `${y}px`);
  transition.classList.add("active");

  window.setTimeout(() => {
    const isLight = document.body.classList.contains("light");
    setTheme(isLight ? "dark" : "light");
  }, 280);

  window.setTimeout(() => {
    transition.classList.remove("active");
  }, 760);
}

function setupTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  if (saved === "light") {
    setTheme("light");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", (event) => toggleTheme(event));
  }
}

function setupYear() {
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

function setupReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;
  if (reduceMotion) {
    targets.forEach((node) => node.classList.add("active"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  targets.forEach((target) => observer.observe(target));
}

function setupJourneyScroll() {
  const sections = document.querySelectorAll(".journey-section");
  if (!sections.length || reduceMotion) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sections.forEach((section) => section.classList.remove("active"));
        entry.target.classList.add("active");
      });
    },
    { threshold: 0.45 }
  );
  sections.forEach((section) => observer.observe(section));
}

function setupMobileNav() {
  const toggle = document.getElementById("mobile-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
}

function setupChapterIndicator() {
  const sections = [...document.querySelectorAll(".chapter-section[data-chapter]")];
  const chapterNumber = document.getElementById("chapter-number");
  const chapterName = document.getElementById("chapter-name");
  const progressBar = document.getElementById("chapter-progress-bar");
  if (!sections.length || !chapterNumber || !chapterName || !progressBar) return;
  const chapterMax = sections.reduce((max, section) => {
    const value = Number(section.getAttribute("data-chapter") || 1);
    return Math.max(max, value);
  }, 1);
  const chapterMaxText = String(chapterMax).padStart(2, "0");

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.height = `${Math.min(100, Math.max(0, ratio))}%`;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const chap = entry.target.getAttribute("data-chapter") || "01";
        const name = entry.target.getAttribute("data-name") || "INTRO";
        chapterNumber.textContent = `${String(chap).padStart(2, "0")} / ${chapterMaxText}`;
        chapterName.textContent = name;
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((section) => observer.observe(section));
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
}

function setupNavReveal() {
  const nav = document.querySelector(".cinematic-nav");
  if (!nav) return;
  const onMove = (event) => {
    if (event.clientY < 120) {
      nav.classList.add("nav-reveal");
    } else {
      nav.classList.remove("nav-reveal");
    }
  };
  window.addEventListener("mousemove", onMove);
}

function setupPageTransitions() {
  const transition = document.getElementById("page-transition");
  if (!transition || reduceMotion) return;
  document.querySelectorAll("a[href]").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const isExternal =
        anchor.target === "_blank" || href.startsWith("http");
      if (isExternal) return;
      event.preventDefault();
      transition.classList.add("active");
      window.setTimeout(() => {
        window.location.href = href;
      }, 480);
    });
  });
}

function setupCursorAndMagnet() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring || reduceMotion || isTouch) return;

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;
  const ringHalfW = ring.offsetWidth / 2;
  const ringHalfH = ring.offsetHeight / 2;
  dot.style.opacity = "1";
  ring.style.opacity = "1";

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
  });

  const loop = () => {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.transform = `translate3d(${ringX - ringHalfW}px, ${ringY - ringHalfH}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();

  const interactive = document.querySelectorAll(
    "a, button, .magnetic, .project-scene, .project-panel, .build-block"
  );

  interactive.forEach((node) => {
    node.addEventListener("mouseenter", () => {
      ring.classList.add("cursor-hover");
    });
    node.addEventListener("mouseleave", () => {
      ring.classList.remove("cursor-hover");
      if (node.classList.contains("magnetic")) {
        node.style.transform = "";
      }
    });
    if (!node.classList.contains("magnetic")) return;
    let magRaf = null;
    let lastX = 0;
    let lastY = 0;
    let bounds = null;
    const applyMagnet = () => {
      if (!bounds) {
        magRaf = null;
        return;
      }
      const x = lastX - (bounds.left + bounds.width / 2);
      const y = lastY - (bounds.top + bounds.height / 2);
      node.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
      magRaf = null;
    };
    node.addEventListener("mouseenter", () => {
      bounds = node.getBoundingClientRect();
    });
    node.addEventListener("mousemove", (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (magRaf) return;
      magRaf = window.requestAnimationFrame(applyMagnet);
    });
    node.addEventListener("mouseleave", () => {
      bounds = null;
    });
  });
}

function setupPortraitHover() {
  if (reduceMotion || isTouch) return;
  const portraitWrap = document.querySelector(".portrait-hover-layer");
  const portraitImage = portraitWrap?.querySelector(".intro-portrait-image");
  if (!portraitWrap || !portraitImage) return;

  let portraitRaf = null;
  let nextDx = 0;
  let nextDy = 0;
  const applyPortrait = () => {
    portraitWrap.style.transform = `translate3d(${nextDx * 12}px, ${nextDy * 8}px, 0) scale(1.01)`;
    portraitImage.style.transform = `translate3d(${nextDx * 8}px, ${nextDy * 6}px, 0) scale(1.03)`;
    portraitRaf = null;
  };

  portraitWrap.addEventListener("mousemove", (event) => {
    const bounds = portraitWrap.getBoundingClientRect();
    nextDx = (event.clientX - bounds.left) / bounds.width - 0.5;
    nextDy = (event.clientY - bounds.top) / bounds.height - 0.5;
    if (portraitRaf) return;
    portraitRaf = window.requestAnimationFrame(applyPortrait);
  });

  portraitWrap.addEventListener("mouseleave", () => {
    if (portraitRaf) {
      window.cancelAnimationFrame(portraitRaf);
      portraitRaf = null;
    }
    portraitWrap.style.transform = "";
    portraitImage.style.transform = "";
  });
}

function setupSelectedWorkScroller(gsap, ScrollTrigger) {
  const wrap = document.getElementById("work-scroll");
  const track = wrap?.querySelector(".h-track");
  const section = wrap?.closest(".scene");
  const progressFill = document.getElementById("work-scroll-fill");
  if (!wrap || !track || !section) return;

  const setProgress = (progress) => {
    if (!progressFill) return;
    progressFill.style.transform = `scaleX(${Math.max(0, Math.min(1, progress)).toFixed(3)})`;
  };

  const syncNativeProgress = () => {
    const max = wrap.scrollWidth - wrap.clientWidth;
    setProgress(max > 0 ? wrap.scrollLeft / max : 0);
  };

  // Always keep a real horizontal scroller as base behavior.
  wrap.classList.add("native-horizontal");
  wrap.addEventListener("scroll", syncNativeProgress, { passive: true });
  syncNativeProgress();

  if (isTouch) return;

  // Convert vertical wheel into horizontal while this row has room.
  let wheelRaf = null;
  let pendingDelta = 0;
  wrap.addEventListener(
    "wheel",
    (event) => {
      if (wrap.classList.contains("is-pinned")) return;
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const maxScrollLeft = wrap.scrollWidth - wrap.clientWidth;
      const canScrollRight = wrap.scrollLeft < maxScrollLeft - 1;
      const canScrollLeft = wrap.scrollLeft > 0;
      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;
      if ((scrollingDown && !canScrollRight) || (scrollingUp && !canScrollLeft)) return;
      event.preventDefault();
      pendingDelta += event.deltaY;
      if (wheelRaf) return;
      wheelRaf = window.requestAnimationFrame(() => {
        wrap.scrollLeft += pendingDelta;
        pendingDelta = 0;
        wheelRaf = null;
      });
    },
    { passive: false }
  );

  if (!gsap || !ScrollTrigger || !isCinematicDesktop()) return;

  const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
  if (distance() < 10) return;

  wrap.classList.add("is-pinned");
  wrap.classList.remove("native-horizontal");
  wrap.scrollLeft = 0;

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
      onRefresh: () => {
        if (distance() < 10) {
          wrap.classList.remove("is-pinned");
          wrap.classList.add("native-horizontal");
          gsap.set(track, { clearProps: "x" });
        }
      }
    }
  });
}

function enableNativeHorizontal() {
  document.querySelectorAll(".h-scroll").forEach((wrap) => {
    if (wrap.id === "work-scroll") return;
    wrap.classList.add("native-horizontal");
  });
}

function setupHorizontalWheelForAbout() {
  if (isTouch) return;
  ABOUT_HORIZONTAL_IDS.forEach((id) => {
    const wrap = document.getElementById(id);
    if (!wrap) return;
    wrap.classList.add("native-horizontal");
    let wheelRaf = null;
    let pendingDelta = 0;
    wrap.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
        const maxScrollLeft = wrap.scrollWidth - wrap.clientWidth;
        const canScrollLeft = wrap.scrollLeft > 0;
        const canScrollRight = wrap.scrollLeft < maxScrollLeft - 1;
        const scrollingDown = event.deltaY > 0;
        const scrollingUp = event.deltaY < 0;

        // Let normal page scroll continue once horizontal edge is reached.
        if ((scrollingDown && !canScrollRight) || (scrollingUp && !canScrollLeft)) {
          return;
        }

        event.preventDefault();
        pendingDelta += event.deltaY;
        if (wheelRaf) return;
        wheelRaf = window.requestAnimationFrame(() => {
          wrap.scrollLeft += pendingDelta;
          pendingDelta = 0;
          wheelRaf = null;
        });
      },
      { passive: false }
    );
  });
}

function flashLight() {
  const flash = document.getElementById("light-flash");
  if (!flash || reduceMotion || !window.gsap) return;
  window.gsap.killTweensOf(flash);
  window.gsap.set(flash, { opacity: 0, scaleX: 0.08 });
  window.gsap
    .timeline()
    .to(flash, { opacity: 0.42, scaleX: 1, duration: 0.32, ease: MOTION.easeSoft })
    .to(flash, { opacity: 0, scaleX: 1.3, duration: 0.48, ease: "power1.in" });
}

function setupMaskLineReveals(gsap, ScrollTrigger) {
  document.querySelectorAll(".mask-reveal-inner").forEach((node) => {
    gsap.to(node, {
      yPercent: 0,
      ease: MOTION.easeSoft,
      duration: 1.1,
      scrollTrigger: {
        trigger: node.closest(".scene") || node,
        start: "top 82%",
        toggleActions: "play none none reverse"
      }
    });
  });

  document.querySelectorAll(".line-reveal").forEach((line) => {
    gsap.to(line, {
      scaleX: 1,
      duration: 0.95,
      ease: MOTION.easeSoft,
      scrollTrigger: {
        trigger: line.closest(".scene") || line,
        start: "top 84%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

function setupMobileMotion(gsap, ScrollTrigger) {
  setupMaskLineReveals(gsap, ScrollTrigger);
  gsap.utils.toArray(".project-visual").forEach((node) => {
    gsap.to(node, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 1.2,
      ease: MOTION.easeSoft,
      scrollTrigger: {
        trigger: node,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Gentle mobile-only vertical parallax for depth without pinned complexity.
  gsap.utils.toArray(".depth-layer").forEach((node) => {
    gsap.to(node, {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: node.closest(".scene") || node,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.65
      }
    });
  });
}

function setupGsapScenes() {
  if (reduceMotion) return;
  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap) {
    enableNativeHorizontal();
    setupSelectedWorkScroller(null, null);
    return;
  }

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  document.body.classList.add("motion-ready");

  if (!isCinematicDesktop()) {
    enableNativeHorizontal();
    setupSelectedWorkScroller(gsap, ScrollTrigger);
    setupMobileMotion(gsap, ScrollTrigger);
    return;
  }

  setupMaskLineReveals(gsap, ScrollTrigger);
  setupSelectedWorkScroller(gsap, ScrollTrigger);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-scene",
      start: "top top",
      end: "+=1100",
      scrub: MOTION.scrubSlow
    }
  });
  tl.to(".hero-line-1", { y: -170, scale: 1.03 }, 0)
    .to(".hero-line-2", { x: 45, scaleX: 1.12, transformOrigin: "left center" }, 0)
    .to(".hero-left", { xPercent: -110 }, 0)
    .to(".hero-right", { xPercent: 115 }, 0)
    .to(".hero-kicker", { opacity: 0.25 }, 0.08)
    .to(".hero-strips span", { yPercent: (_, i) => (i % 2 ? -18 : 16), stagger: 0.03 }, 0);

  ScrollTrigger.create({
    trigger: ".hero-scene",
    start: "top top",
    end: "bottom top",
    scrub: MOTION.scrubFast,
    onUpdate: (self) => {
      const velocity = Math.min(1.4, Math.abs(self.getVelocity()) / 1800);
      const stretch = 1 + velocity * 0.14;
      if (rafSetStretch) return;
      rafSetStretch = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--stretch-x", stretch.toFixed(3));
        rafSetStretch = null;
      });
    }
  });

  const morphWords = ["TECHNOLOGY", "BUSINESS", "BUILDING"];
  let morphIndex = 0;
  const morphNode = document.getElementById("txb-morph");
  if (morphNode) {
    ScrollTrigger.create({
      trigger: ".txb-scene",
      start: "top center",
      end: "bottom center",
      scrub: MOTION.scrubFast,
      onUpdate: (self) => {
        const idx = Math.min(2, Math.floor(self.progress * 3));
        if (idx !== morphIndex) {
          morphIndex = idx;
          morphNode.textContent = morphWords[morphIndex];
        }
      }
    });
  }

  gsap.utils.toArray(".with-particles").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: MOTION.scrubFast,
      onUpdate: (self) => {
        const intensity = Math.max(0.05, Math.min(0.2, 0.05 + self.progress * 0.16));
        section.style.setProperty("--particle-alpha", intensity.toFixed(3));
      }
    });
  });

  gsap.utils.toArray(".depth-layer").forEach((node) => {
    const speed = Number(node.getAttribute("data-parallax") || "0.15");
    gsap.to(node, {
      yPercent: -speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: node.closest(".scene") || node,
        start: "top bottom",
        end: "bottom top",
        scrub: MOTION.scrubFast
      }
    });
  });

  gsap.utils.toArray(".project-visual").forEach((node) => {
    const isCircle = node.classList.contains("circle-clip");
    gsap.to(node, {
      clipPath: isCircle
        ? "circle(72% at 50% 50%)"
        : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ease: MOTION.easePrimary,
      duration: 1.45,
      scrollTrigger: {
        trigger: node,
        start: "top 84%",
        toggleActions: "play none none reverse"
      }
    });
  });

  gsap.fromTo(
    ".intro-portrait-wrap",
    { clipPath: "inset(100% 0 0 0)", opacity: 0, scale: 1.08 },
    {
      clipPath: "inset(0% 0 0 0)",
      opacity: 1,
      scale: 1,
      ease: MOTION.easePrimary,
      scrollTrigger: {
        trigger: ".intro-scene",
        start: "top 80%",
        end: "top 48%",
        scrub: MOTION.scrubSlow
      }
    }
  );

  gsap.to(".intro-portrait-wrap", {
    xPercent: -8,
    scale: 0.94,
    opacity: 0.72,
    ease: MOTION.easePrimary,
    scrollTrigger: {
      trigger: ".experience-scene",
      start: "top bottom",
      end: "top 60%",
      scrub: MOTION.scrubSlow
    }
  });

  gsap.fromTo(
    ".experience-card",
    { yPercent: 14, opacity: 0.2 },
    {
      yPercent: 0,
      opacity: 1,
      stagger: 0.12,
      ease: MOTION.easeSoft,
      scrollTrigger: {
        trigger: ".experience-scene",
        start: "top 78%",
        end: "top 52%",
        scrub: MOTION.scrubFast
      }
    }
  );

  document.querySelectorAll(".h-scroll").forEach((wrap) => {
    if (wrap.id === "work-scroll") return;
    const track = wrap.querySelector(".h-track");
    if (!track) return;
    const section = wrap.closest(".scene");
    if (!section) return;

    if (ABOUT_HORIZONTAL_IDS.has(wrap.id)) {
      wrap.classList.add("native-horizontal");
      return;
    }
    const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
    if (distance() < 10) {
      wrap.classList.add("native-horizontal");
      return;
    }

    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance() + window.innerHeight * 0.55}`,
        scrub: MOTION.scrubSlow,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  });

  gsap.fromTo(
    ".global-word",
    { xPercent: -25, opacity: 0.45, scale: 0.82 },
    {
      xPercent: 0,
      opacity: 1,
      scale: 1.04,
      scrollTrigger: {
        trigger: ".global-sync-scene",
        start: "top 78%",
        end: "top 18%",
        scrub: MOTION.scrubSlow
      }
    }
  );
  gsap.fromTo(
    ".sync-word",
    { xPercent: 28, opacity: 0.25 },
    {
      xPercent: -8,
      opacity: 1,
      scrollTrigger: {
        trigger: ".global-sync-scene",
        start: "top 70%",
        end: "bottom top",
        scrub: MOTION.scrubSlow
      }
    }
  );

  gsap.to(".global-role", {
    letterSpacing: "0.12em",
    scrollTrigger: {
      trigger: ".global-sync-scene",
      start: "top 65%",
      end: "top 30%",
      scrub: MOTION.scrubFast
    }
  });

  ScrollTrigger.create({
    trigger: ".global-sync-scene",
    start: "top 58%",
    onEnter: () => flashLight(),
    onEnterBack: () => flashLight()
  });

  gsap.utils.toArray(".outline-year").forEach((glyph) => {
    gsap.fromTo(
      glyph,
      { scale: 0.84, opacity: 0.35 },
      {
        scale: 1.08,
        opacity: 1,
        scrollTrigger: {
          trigger: glyph.closest(".timeline-panel") || glyph,
          start: "left 85%",
          end: "right 25%",
          scrub: MOTION.scrubSlow,
          horizontal: true
        }
      }
    );
  });

  gsap.to(".kinetic-words span", {
    yPercent: -22,
    stagger: 0.08,
    scrollTrigger: {
      trigger: ".explore-scene",
      start: "top 85%",
      end: "bottom top",
      scrub: MOTION.scrubFast
    }
  });

  ScrollTrigger.create({
    trigger: ".final-scene",
    start: "top 75%",
    onEnter: () => flashLight()
  });

  // Add light streak punctuation at major chapter boundaries.
  gsap.utils.toArray(".chapter-section").forEach((section) => {
    const chapter = Number(section.getAttribute("data-chapter") || 0);
    if (!chapter || chapter === 1) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top 68%",
      onEnter: () => flashLight(),
      onEnterBack: () => flashLight()
    });
  });

  gsap.utils.toArray(".scene").forEach((scene, index, all) => {
    if (index === 0) return;
    // Don't transform the pinned Selected Work section — breaks horizontal scroll.
    if (scene.id === "selected-work") return;
    const prev = all[index - 1];
    if (prev?.id === "selected-work") return;
    gsap.fromTo(
      scene,
      { opacity: 0.72, yPercent: 6 },
      {
        opacity: 1,
        yPercent: 0,
        ease: MOTION.easePrimary,
        scrollTrigger: {
          trigger: scene,
          start: "top 86%",
          end: "top 58%",
          scrub: MOTION.scrubFast
        }
      }
    );
    gsap.to(prev, {
      opacity: 0.62,
      scale: 0.985,
      ease: MOTION.easePrimary,
      scrollTrigger: {
        trigger: scene,
        start: "top 92%",
        end: "top 62%",
        scrub: MOTION.scrubFast
      }
    });
  });

  gsap.fromTo(
    ".final-content",
    { opacity: 0.2, y: 30 },
    {
      opacity: 1,
      y: 0,
      ease: MOTION.easeSoft,
      scrollTrigger: {
        trigger: ".final-scene",
        start: "top 78%",
        end: "top 50%",
        scrub: MOTION.scrubFast
      }
    }
  );

  // Subtle chapter glyph depth motion.
  gsap.utils.toArray(".chapter-glyph").forEach((glyph) => {
    gsap.fromTo(
      glyph,
      { scale: 0.82, opacity: 0.35 },
      {
        scale: 1.06,
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: glyph.closest(".scene") || glyph,
          start: "top bottom",
          end: "bottom top",
          scrub: MOTION.scrubFast
        }
      }
    );
  });

  // Editorial heading scale-in moments.
  gsap.utils.toArray(".section-title, .display-heading").forEach((heading) => {
    gsap.fromTo(
      heading,
      { scale: 0.94, yPercent: 7 },
      {
        scale: 1,
        yPercent: 0,
        ease: MOTION.easeSoft,
        scrollTrigger: {
          trigger: heading.closest(".scene") || heading,
          start: "top 88%",
          end: "top 58%",
          scrub: MOTION.scrubFast
        }
      }
    );
  });

  let resizeTimer = null;
  let lastViewportWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    const widthChange = Math.abs(window.innerWidth - lastViewportWidth);
    if (widthChange < 40) return;
    lastViewportWidth = window.innerWidth;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 220);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!reduceMotion) {
    document.body.classList.add("motion-ready");
  }
  setupTheme();
  setupYear();
  setupReveal();
  setupJourneyScroll();
  setupMobileNav();
  setupChapterIndicator();
  setupNavReveal();
  setupPageTransitions();
  setupCursorAndMagnet();
  setupPortraitHover();
  setupHorizontalWheelForAbout();
  if (reduceMotion) {
    setupSelectedWorkScroller(null, null);
  } else {
    setupGsapScenes();
  }
});
