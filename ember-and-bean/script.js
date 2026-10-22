/* ==========================================================================
   Ember & Bean  |  demo café website by Netra Dynamics
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIG: the one place to edit contact details and links.
   -------------------------------------------------------------------------- */
const CONFIG = {
  cafeName: "Ember & Bean",

  // WhatsApp number in international format, digits only (country code + number, no + or spaces).
  // Example for an Indian number: "919876543210". While this is a placeholder,
  // the WhatsApp button opens WhatsApp with the message ready and lets the user pick a contact.
  whatsappNumber: "91XXXXXXXXXX",

  // A verified Google Maps share link for the real café. Leave "" until you have one.
  mapsUrl: "",

  // Netra Dynamics website. Leave "" until the real URL is confirmed; links stay hidden until then.
  netraUrl: "",

  // Social profile URLs. Leave "" to keep them as inactive placeholders.
  social: { instagram: "", facebook: "", google: "" },

  // Reservation slots (24h, whole hours/half hours). Keep in step with the opening hours.
  firstSlot: "08:00",
  lastSlot: "22:30",
  bookAheadDays: 60,
};

/* -------------------------------------------------------------------------- */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- header: solid on scroll, mobile menu ---------- */
const header = $("#header");
const burger = $("#burger");
const nav = $("#nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", open);
}
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); burger.focus(); }
});
window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

const toTop = $("#to-top");
function onScroll() {
  header.classList.toggle("is-solid", window.scrollY > 40);
  toTop.hidden = window.scrollY < 900;
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));

/* ---------- reveal on scroll ---------- */
const revealEls = $$(".reveal");
if ("IntersectionObserver" in window && !prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- image fallback ---------- */
function markFailed(img) { img.closest(".media")?.classList.add("is-fallback"); }
$$("img").forEach((img) => {
  img.addEventListener("error", () => markFailed(img));
  if (img.complete && img.naturalWidth === 0 && img.currentSrc) markFailed(img);
});

/* ---------- menu tabs ---------- */
const tabs = $$('[role="tab"]');
function selectTab(tab, focus) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    $("#" + t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
  tab.scrollIntoView({ inline: "center", block: "nearest", behavior: prefersReduced ? "auto" : "smooth" });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); selectTab(tabs[n], true); }
  });
});

/* ---------- gallery lightbox ---------- */
const box = $("#lightbox");
const boxImg = $("#lightbox-img");
$$(".g-btn").forEach((b) => b.addEventListener("click", () => {
  boxImg.src = b.dataset.full;
  boxImg.alt = b.dataset.alt;
  if (typeof box.showModal === "function") box.showModal();
  else window.open(b.dataset.full, "_blank", "noopener");
}));
box.addEventListener("click", (e) => { if (e.target === box || e.target === boxImg) box.close(); });
box.addEventListener("close", () => { boxImg.src = ""; });

/* ---------- configurable links ---------- */
const isUrl = (u) => /^https?:\/\//i.test(u);

const dir = $("[data-directions]");
if (isUrl(CONFIG.mapsUrl)) {
  dir.href = CONFIG.mapsUrl; dir.target = "_blank"; dir.rel = "noopener";
} else {
  dir.setAttribute("aria-disabled", "true");
  dir.addEventListener("click", (e) => { e.preventDefault(); $("[data-directions-note]").hidden = false; });
}

$$("[data-netra]").forEach((a) => {
  if (isUrl(CONFIG.netraUrl)) { a.href = CONFIG.netraUrl; a.hidden = false; }
  else if (a.classList.contains("btn")) a.hidden = true;
  else a.removeAttribute("href"), a.removeAttribute("target"), a.removeAttribute("rel");
});

$$("[data-social]").forEach((a) => {
  const url = CONFIG.social[a.dataset.social];
  if (isUrl(url)) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
  else {
    a.removeAttribute("href");
    a.setAttribute("aria-disabled", "true");
    a.title = "Placeholder: add the profile URL in script.js";
  }
});

/* ---------- reservation form ---------- */
const form = $("#reserve-form");
const result = $("#result");
const fields = {
  name: $("#f-name"), phone: $("#f-phone"), date: $("#f-date"),
  time: $("#f-time"), guests: $("#f-guests"), note: $("#f-note"),
};

const pad = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const label12 = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
};

// Date limits
const today = new Date();
const maxDay = new Date(); maxDay.setDate(today.getDate() + CONFIG.bookAheadDays);
fields.date.min = isoDate(today);
fields.date.max = isoDate(maxDay);

// Time slots
for (let m = toMin(CONFIG.firstSlot); m <= toMin(CONFIG.lastSlot); m += 30) {
  const o = document.createElement("option");
  o.value = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  o.textContent = label12(m);
  fields.time.appendChild(o);
}

function setError(key, msg) {
  const field = fields[key].closest(".field");
  const out = $("#e-" + key);
  field.classList.toggle("has-error", !!msg);
  fields[key].setAttribute("aria-invalid", msg ? "true" : "false");
  if (out) out.textContent = msg || "";
  if (out) fields[key].setAttribute("aria-describedby", msg ? out.id : "");
}

function validate() {
  const v = Object.fromEntries(Object.entries(fields).map(([k, el]) => [k, el.value.trim()]));
  const errors = {};

  if (v.name.length < 2) errors.name = "Please enter your name.";
  else if (!/^[\p{L}][\p{L}\s.'-]+$/u.test(v.name)) errors.name = "Names can only contain letters and spaces.";

  const digits = v.phone.replace(/[\s()-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  if (!v.phone) errors.phone = "Please enter your phone number.";
  else if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = "Enter a valid 10-digit Indian mobile number.";

  if (!v.date) errors.date = "Please choose a date.";
  else if (v.date < fields.date.min) errors.date = "Please choose today or a future date.";
  else if (v.date > fields.date.max) errors.date = `Please choose a date within ${CONFIG.bookAheadDays} days.`;

  if (!v.time) errors.time = "Please choose a time.";
  else if (v.date === isoDate(today) && toMin(v.time) <= today.getHours() * 60 + today.getMinutes()) {
    errors.time = "That time has already passed today.";
  }

  if (!v.guests) errors.guests = "Please select the number of guests.";

  Object.keys(fields).forEach((k) => { if (k !== "note") setError(k, errors[k]); });
  return { ok: Object.keys(errors).length === 0, v, firstBad: Object.keys(errors)[0], digits };
}

["name", "phone", "date", "time", "guests"].forEach((k) => {
  fields[k].addEventListener("change", () => { if (fields[k].getAttribute("aria-invalid") === "true") validate(); });
});

function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function buildMessage(v) {
  const lines = [`Hello ${CONFIG.cafeName}! I would like to enquire about a table.`];
  if (v) {
    lines.push("", `Name: ${v.name}`, `Phone: ${v.phone}`, `Date: ${prettyDate(v.date)}`,
      `Time: ${label12(toMin(v.time))}`, `Guests: ${v.guests}`);
    if (v.note) lines.push(`Request: ${v.note}`);
  } else {
    lines.push("Could you please share availability?");
  }
  lines.push("", "(Sent from the demo website)");
  return lines.join("\n");
}

function whatsappUrl(message) {
  const num = /^\d{10,15}$/.test(CONFIG.whatsappNumber) ? CONFIG.whatsappNumber : "";
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

const waConfigured = () => /^\d{10,15}$/.test(CONFIG.whatsappNumber);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const r = validate();
  if (!r.ok) {
    result.hidden = true;
    fields[r.firstBad].focus();
    return;
  }
  const { v } = r;
  result.innerHTML = `
    <strong>Details look good.</strong>
    <p>This is a demo, so nothing has been sent and no table is booked. On a live website, this enquiry would go straight to the café.</p>
    <dl>
      <dt>Name</dt><dd>${esc(v.name)}</dd>
      <dt>Phone</dt><dd>${esc(v.phone)}</dd>
      <dt>When</dt><dd>${esc(prettyDate(v.date))}, ${label12(toMin(v.time))}</dd>
      <dt>Guests</dt><dd>${esc(v.guests)}</dd>
      ${v.note ? `<dt>Request</dt><dd>${esc(v.note)}</dd>` : ""}
    </dl>
    <a class="btn btn--wa" href="${whatsappUrl(buildMessage(v))}" target="_blank" rel="noopener">Preview on WhatsApp</a>`;
  result.hidden = false;
  result.focus();
  result.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
});

form.addEventListener("reset", () => {
  Object.keys(fields).forEach((k) => k !== "note" && setError(k, ""));
  result.hidden = true;
});

/* ---------- WhatsApp enquiry button ---------- */
$("#wa-btn").addEventListener("click", () => {
  const r = validate();
  // Use the form details if they are valid; otherwise send a general enquiry.
  const msg = r.ok ? buildMessage(r.v) : buildMessage(null);
  if (!r.ok) Object.keys(fields).forEach((k) => k !== "note" && setError(k, ""));
  window.open(whatsappUrl(msg), "_blank", "noopener");
  const note = $("#wa-note");
  note.hidden = waConfigured();
  note.textContent = "Demo: no WhatsApp number is configured yet, so you can choose any contact to preview the message. Set CONFIG.whatsappNumber in script.js.";
});
