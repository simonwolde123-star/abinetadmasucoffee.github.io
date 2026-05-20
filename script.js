/**
 * ABINET ADMASU COFFEE - MAIN JAVASCRIPT
 * Handles theme switching, animations, and interactive components
 */

// ==============================
// CONFIGURATION
// ==============================
const CONFIG = {
  LOADER_DURATION: 2000,
  ANIMATION_THRESHOLD: 0.1,
  SCROLL_TIMEOUT: 100,
};

// ==============================
// THEME SYSTEM
// ==============================
class ThemeManager {
  constructor() {
    this.htmlElement = document.documentElement;
    this.themeToggle = document.getElementById("themeToggle");
    this.storageKey = "theme-preference";
    this.init();
  }

  init() {
    this.loadSavedTheme();
    this.setupEventListeners();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const theme = savedTheme || systemPreference;
    this.setTheme(theme);
  }

  setTheme(theme) {
    this.htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem(this.storageKey, theme);
  }

  toggleTheme() {
    const currentTheme = this.htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }

  setupEventListeners() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }
}

// ==============================
// NAVIGATION
// ==============================
class Navigation {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.hamburger = document.getElementById("hamburger");
    this.mobileNav = document.getElementById("mobileNav");
    this.navLinks = document.querySelectorAll(".nav-links a");
    this.mobileNavLinks = document.querySelectorAll(".mobile-nav a");
    this.lastScrollY = 0;
    this.scrollTimeout = null;
    this.init();
  }

  init() {
    this.setupScrollListener();
    this.setupMobileMenu();
    this.setupSmoothScroll();
  }

  setupScrollListener() {
    window.addEventListener("scroll", () => {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.updateNavbarOnScroll();
      }, CONFIG.SCROLL_TIMEOUT);
    });
  }

  updateNavbarOnScroll() {
    const scrollY = window.scrollY;
    const isScrolled = scrollY > 50;

    if (isScrolled && !this.navbar.classList.contains("scrolled")) {
      this.navbar.classList.add("scrolled");
    } else if (!isScrolled && this.navbar.classList.contains("scrolled")) {
      this.navbar.classList.remove("scrolled");
    }

    this.lastScrollY = scrollY;
  }

  setupMobileMenu() {
    if (!this.hamburger || !this.mobileNav) return;

    this.hamburger.addEventListener("click", () => {
      this.hamburger.classList.toggle("open");
      this.mobileNav.classList.toggle("open");
    });

    this.mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.hamburger.classList.remove("open");
        this.mobileNav.classList.remove("open");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.mobileNav.contains(e.target) && !this.hamburger.contains(e.target)) {
        this.hamburger.classList.remove("open");
        this.mobileNav.classList.remove("open");
      }
    });
  }

  setupSmoothScroll() {
    [...this.navLinks, ...this.mobileNavLinks].forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }
}

// ==============================
// REVEAL ANIMATIONS
// ==============================
class RevealAnimations {
  constructor() {
    this.revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    this.observer = null;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: CONFIG.ANIMATION_THRESHOLD,
      rootMargin: "0px 0px -100px 0px",
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.revealElements.forEach((element) => {
      this.observer.observe(element);
    });
  }
}

// ==============================
// LANGUAGE SWITCHER
// ==============================
class LanguageSwitcher {
  constructor() {
    this.langOptions = document.querySelectorAll(".lang-option");
    this.langDropdown = document.querySelector(".lang-dropdown");
    this.storageKey = "language-preference";
    this.init();
  }

  init() {
    this.loadSavedLanguage();
    this.setupEventListeners();
  }

  loadSavedLanguage() {
    const savedLang = localStorage.getItem(this.storageKey) || "en";
    this.setLanguage(savedLang);
  }

  setLanguage(lang) {
    localStorage.setItem(this.storageKey, lang);
    this.updateActiveLanguage(lang);
    // Trigger language change event (for future i18n integration)
    document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
  }

  updateActiveLanguage(lang) {
    this.langOptions.forEach((option) => {
      option.classList.toggle("active", option.getAttribute("data-lang") === lang);
    });
  }

  setupEventListeners() {
    this.langOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const lang = option.getAttribute("data-lang");
        this.setLanguage(lang);
        this.langDropdown.classList.remove("open");
      });
    });
  }
}

// ==============================
// LOADING SCREEN
// ==============================
class LoadingScreen {
  constructor() {
    this.loader = document.getElementById("loader");
    this.init();
  }

  init() {
    if (this.loader) {
      window.addEventListener("load", () => {
        this.hide();
      });

      // Fallback: hide loader after timeout
      setTimeout(() => {
        this.hide();
      }, CONFIG.LOADER_DURATION);
    }
  }

  hide() {
    if (this.loader && !this.loader.classList.contains("hidden")) {
      this.loader.classList.add("hidden");
    }
  }
}

// ==============================
// COOKIE CONSENT
// ==============================
class CookieConsent {
  constructor() {
    this.banner = document.getElementById("cookie-banner");
    this.okButton = document.querySelector(".btn-cookie-ok");
    this.storageKey = "cookie-consent";
    this.init();
  }

  init() {
    if (!this.banner) return;

    // Check if consent was already given
    const hasConsented = localStorage.getItem(this.storageKey);

    if (hasConsented) {
      this.banner.classList.add("hide");
    } else {
      // Show banner
      setTimeout(() => {
        this.banner.classList.add("show");
      }, 1000);
    }

    if (this.okButton) {
      this.okButton.addEventListener("click", () => {
        this.acceptCookies();
      });
    }
  }

  acceptCookies() {
    localStorage.setItem(this.storageKey, "accepted");
    this.banner.classList.remove("show");
    this.banner.classList.add("hide");

    // Initialize analytics or tracking scripts here
    console.log("Cookies accepted");
  }
}

// ==============================
// STATS COUNTER
// ==============================
class StatsCounter {
  constructor() {
    this.statNumbers = document.querySelectorAll(".stat-number");
    this.hasAnimated = false;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.animateCounters();
        }
      });
    }, observerOptions);

    const statsSection = document.getElementById("stats");
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    this.statNumbers.forEach((element) => {
      const target = this.extractNumber(element.textContent);
      if (target) {
        this.animateNumber(element, target);
      }
    });
  }

  extractNumber(text) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  animateNumber(element, target) {
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = Date.now();
    const originalText = element.textContent;
    const suffix = originalText.replace(/\d+/g, "").trim();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-quart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const current = Math.floor(start + (target - start) * easeProgress);

      // Preserve the original suffix
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}

// ==============================
// MARQUEE ANIMATION
// ==============================
class MarqueeAnimation {
  constructor() {
    this.marqueeTrack = document.querySelector(".marquee-track");
    this.init();
  }

  init() {
    if (this.marqueeTrack) {
      // Clone marquee items for seamless loop
      const items = this.marqueeTrack.innerHTML;
      this.marqueeTrack.innerHTML = items + items;
    }
  }
}

// ==============================
// FORM HANDLER
// ==============================
class FormHandler {
  constructor() {
    this.form = document.querySelector("form");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Log form data (replace with actual API call)
    console.log("Form submitted:", data);

    // Show success message
    alert("Thank you for your message! We'll get back to you soon.");

    // Reset form
    this.form.reset();
  }
}

// ==============================
// INITIALIZATION
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  new LoadingScreen();
  new ThemeManager();
  new Navigation();
  new LanguageSwitcher();
  new RevealAnimations();
  new CookieConsent();
  new StatsCounter();
  new MarqueeAnimation();
  new FormHandler();

  console.log("✨ Abinet Admasu Coffee website initialized");
});

// ==============================
// UTILITY FUNCTIONS
// ==============================

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, duration = 1000) {
  const start = window.scrollY;
  const target = element.offsetTop;
  const distance = target - start;
  const startTime = Date.now();

  const scroll = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, start + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(scroll);
    }
  };

  scroll();
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get element's visibility in viewport
 */
function getElementVisibility(element) {
  const rect = element.getBoundingClientRect();
  return {
    isVisible: rect.top < window.innerHeight && rect.bottom > 0,
    percentVisible: Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))),
  };
}
