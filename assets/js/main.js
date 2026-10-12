/* ==========================================================================
   Women Powering Change Florida — site behaviour

   SITE_CONFIG is the one place to update links. Any element with
   data-link="<key>" gets its href from here. Leave a value as "" until the
   real URL is ready: buttons then show as "coming soon" and organization
   "Learn More" links are hidden, so visitors never hit a dead link.
   ========================================================================== */

const SITE_CONFIG = {
  // Contact email (used for every data-link="email" button)
  email: "",

  // Get Involved
  vendorRegistration: "", // Zeffy vendor registration form
  sponsorship: "",        // Sponsorship / donation page

  // Events
  eventRegistration: "",
  communityEvent: "",

  // Supported organizations — "Learn More" links
  orgHaven: "",
  orgMothersHelpingMothers: "",
  orgFeedingEmptyTummies: "",
  orgOneMission: "",
  orgSatchels: "",
  orgTerraNichol: "",
  orgTwigCares: "",
};

(function applyLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    let url = (SITE_CONFIG[key] || "").trim();

    if (url && key === "email" && !url.startsWith("mailto:")) url = "mailto:" + url;

    if (url) {
      el.href = url;
      if (/^https?:\/\//.test(url)) {
        el.target = "_blank";
        el.rel = "noopener";
      }
      return;
    }

    // No URL yet
    if (el.dataset.pending === "hide") {
      el.hidden = true;
    } else {
      el.removeAttribute("href");
      el.setAttribute("role", "link");
      el.setAttribute("aria-disabled", "true");
      el.classList.add("is-pending");
      if (el.dataset.pendingLabel) el.textContent = el.dataset.pendingLabel;
    }
  });
})();

/* ---------- Mobile navigation ---------- */
(function mobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
})();

/* ---------- Highlight the nav link for the section in view ---------- */
(function activeSection() {
  if (!("IntersectionObserver" in window)) return;
  const links = new Map();
  document.querySelectorAll('.primary-nav a[href^="#"]:not(.btn)').forEach((a) => {
    const section = document.querySelector(a.getAttribute("href"));
    if (section) links.set(section, a);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.removeAttribute("aria-current"));
      links.get(entry.target).setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  links.forEach((_, section) => observer.observe(section));
})();

/* ---------- Footer year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Header shadow once the page scrolls ---------- */
(function headerState() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  update();
  window.addEventListener("scroll", update, { passive: true });
})();

/* ---------- Photos fade in when loaded; missing files leave the branded fallback ---------- */
document.querySelectorAll(".photo img").forEach((img) => {
  const show = () => { if (img.naturalWidth) img.classList.add("is-loaded"); };
  if (img.complete) show(); else img.addEventListener("load", show);
});

/* ---------- Reveal sections on scroll ---------- */
(function reveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  items.forEach((el) => observer.observe(el));
})();
