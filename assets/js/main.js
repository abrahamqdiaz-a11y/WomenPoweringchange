/* ==========================================================================
   Women Powering Change Florida — site behaviour

   SITE_CONFIG is the one place to update links. Any element with
   data-link="<key>" gets its href from here. Leave a value as "" until the
   real URL is ready: buttons then show as "coming soon" and organization
   "Learn More" links are hidden, so visitors never hit a dead link.
   ========================================================================== */

const SITE_CONFIG = {
  // Contact email (used for every data-link="email" button)
  email: "contactwpc941@gmail.com",

  // Volunteer sign-up form (volunteer.html). Leave "" when hosting on
  // Netlify: Netlify Forms collects submissions automatically. On any other
  // host, paste a form-service endpoint here, e.g. "https://formspree.io/f/abcd1234".
  volunteerFormEndpoint: "",

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
  window.matchMedia("(min-width: 1271px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
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

/* ---------- Volunteer sign-up form ---------- */
(function volunteerForm() {
  const form = document.getElementById("volunteer-form");
  if (!form) return;
  const success = document.getElementById("form-success");
  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  const showSuccess = () => {
    form.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ block: "center" });
  };

  // Non-JS submissions on Netlify land back here with ?submitted=1
  if (new URLSearchParams(location.search).has("submitted")) showSuccess();

  // Ask for a business name only when "Yes" is chosen
  const businessField = document.getElementById("business-name-field");
  form.querySelectorAll('input[name="business_owner"]').forEach((radio) => {
    radio.addEventListener("change", () => { businessField.hidden = radio.value !== "Yes" || !radio.checked; });
  });

  const MESSAGES = {
    full_name: "Please enter your full name.",
    street: "Please enter your street address.",
    city: "Please enter your city.",
    state: "Please enter your state.",
    zip: { valueMissing: "Please enter your ZIP code.", patternMismatch: "Please enter a 5-digit ZIP code." },
    phone: { valueMissing: "Please enter your phone number.", patternMismatch: "Please enter a phone number with area code." },
    email: { valueMissing: "Please enter your email address.", typeMismatch: "Please enter a valid email address." },
    hours: "Please choose how many hours you can volunteer.",
    business_owner: "Please choose Yes or No.",
    time_preference: "Please choose mornings, evenings, or either.",
  };

  const messageFor = (key, validity) => {
    const m = MESSAGES[key];
    if (typeof m === "string") return m;
    if (validity.patternMismatch) return m.patternMismatch;
    if (validity.typeMismatch) return m.typeMismatch;
    return m.valueMissing;
  };

  // Returns true when valid; shows/clears the message for one field or radio group.
  const validate = (el) => {
    if (el.type === "radio") {
      const group = document.getElementById(el.name + "-group");
      const ok = !!form.querySelector(`input[name="${el.name}"]:checked`);
      group.classList.toggle("is-invalid", !ok);
      document.getElementById(el.name + "-error").textContent = ok ? "" : MESSAGES[el.name];
      return ok;
    }
    const value = el.value.trim();
    if (value !== el.value) el.value = value;
    const ok = el.checkValidity();
    el.setAttribute("aria-invalid", String(!ok));
    const error = document.getElementById(el.id + "-error");
    if (error) {
      error.textContent = ok ? "" : messageFor(el.id, el.validity);
      if (ok) el.removeAttribute("aria-describedby"); else el.setAttribute("aria-describedby", error.id);
    }
    return ok;
  };

  const requiredFields = () => {
    const seen = new Set();
    return [...form.querySelectorAll("[required]")].filter((el) => {
      if (el.type !== "radio") return true;
      if (seen.has(el.name)) return false;
      seen.add(el.name);
      return true;
    });
  };

  // Re-check a field as the visitor fixes it, after they've tried once
  form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true") validate(e.target); });
  form.addEventListener("change", (e) => { if (e.target.type === "radio") validate(e.target); });
  form.addEventListener("focusout", (e) => { if (e.target.required && e.target.type !== "radio" && e.target.value) validate(e.target); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    const invalid = requiredFields().filter((el) => !validate(el));
    if (invalid.length) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      invalid[0].focus();
      return;
    }

    // Spam bots fill the hidden field; quietly pretend it worked
    if (form.company_website.value) { showSuccess(); return; }

    submitBtn.disabled = true;
    status.textContent = "Sending…";
    const data = new FormData(form);

    try {
      const endpoint = (SITE_CONFIG.volunteerFormEndpoint || "").trim();
      const res = endpoint
        ? await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        : await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString(),
          });
      if (!res.ok) throw new Error("HTTP " + res.status);
      showSuccess();
    } catch (err) {
      const email = (SITE_CONFIG.email || "").replace(/^mailto:/, "");
      status.textContent = "Sorry, we couldn't send your sign-up. Please try again" + (email ? ` or email us at ${email}.` : " in a moment.");
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
    }
  });
})();

/* ---------- Get-involved form on the QR info page (info.html) ---------- */
(function infoForm() {
  const form = document.getElementById("info-form");
  if (!form) return;
  const success = document.getElementById("info-success");
  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  const showSuccess = () => {
    form.hidden = true;
    success.hidden = false;
    success.focus();
    success.scrollIntoView({ block: "center" });
  };

  // Non-JS submissions on Netlify land back here with ?sent=1
  if (new URLSearchParams(location.search).has("sent")) showSuccess();

  const MESSAGES = {
    name: { valueMissing: "Please enter your name." },
    email: { valueMissing: "Please enter your email address.", typeMismatch: "Please enter a valid email address." },
  };

  const validate = (el) => {
    const value = el.value.trim();
    if (value !== el.value) el.value = value;
    const ok = el.checkValidity();
    el.setAttribute("aria-invalid", String(!ok));
    const error = document.getElementById(el.id + "-error");
    error.textContent = ok ? "" : (el.validity.typeMismatch ? MESSAGES[el.id].typeMismatch : MESSAGES[el.id].valueMissing);
    if (ok) el.removeAttribute("aria-describedby"); else el.setAttribute("aria-describedby", error.id);
    return ok;
  };

  form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true") validate(e.target); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");

    const invalid = [...form.querySelectorAll("[required]")].filter((el) => !validate(el));
    if (invalid.length) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      invalid[0].focus();
      return;
    }

    // Spam bots fill the hidden field; quietly pretend it worked
    if (form.company_website.value) { showSuccess(); return; }

    submitBtn.disabled = true;
    status.textContent = "Sending…";
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      showSuccess();
    } catch (err) {
      status.textContent = "Sorry, we couldn't send that. Please try again or email us at " + SITE_CONFIG.email + ".";
      status.classList.add("is-error");
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
