/* ==========================================================================
   ART BETSILEO GOSPEL — main.js
   ========================================================================== */

(() => {
  "use strict";

  /* --------------------------------------------------------------
     DATA
     -------------------------------------------------------------- */

  // YouTube videos from https://www.youtube.com/@artbets
  // Order is curated: Mandrakizay → Safidy → Tamagna (user preference)
  const VIDEOS = [
    {
      id: "90nNpzhv1nM",
      titleFallback: "Art Betsileo Gospel — Mandrakizay",
      views: "275",
      dateKey: { fr: "il y a 3 semaines", mg: "3 herinandro lasa", en: "3 weeks ago" }
    },
    {
      id: "MIJ_ZlKVljI",
      titleFallback: "Art Betsileo Gospel — Safidy",
      views: "1,5 k",
      dateKey: { fr: "il y a 1 an", mg: "1 taona lasa", en: "1 year ago" }
    },
    {
      id: "mroDImzh-Ec",
      titleFallback: "Art Bet's — Tamagna",
      views: "339",
      dateKey: { fr: "il y a 2 ans", mg: "2 taona lasa", en: "2 years ago" }
    }
  ];

  // Gallery — real ABG photos (from _Photos / Facebook)
  const GALLERY = [
    { src: "assets/images/gallery/482221229_954895073514333_7013478271384378151_n.jpg", alt: "Art Betsileo Gospel — louange" },
    { src: "assets/images/gallery/482208499_954895030181004_7525712971761988406_n.jpg", alt: "Art Betsileo Gospel — performance" },
    { src: "assets/images/gallery/482212733_954895140180993_1355029969141314952_n.jpg", alt: "Art Betsileo Gospel — chorale" },
    { src: "assets/images/gallery/482208660_954894696847704_754803377250753098_n.jpg", alt: "Art Betsileo Gospel — moment" },
    { src: "assets/images/gallery/489020186_973516791652161_1015199791961482312_n.jpg", alt: "Art Betsileo Gospel — portrait" },
    { src: "assets/images/gallery/608882611_1187267890277049_6131757507866268794_n.jpg", alt: "Art Betsileo Gospel — scène" },
    { src: "assets/images/gallery/611306237_1188352500168588_3488391236789675557_n.jpg", alt: "Art Betsileo Gospel — ensemble" },
    { src: "assets/images/gallery/607954815_1187953700208468_5119550517265565669_n.jpg", alt: "Art Betsileo Gospel — groupe" },
    { src: "assets/images/gallery/612099777_1187955120208326_2571695570968858664_n.jpg", alt: "Art Betsileo Gospel — ensemble" },
    { src: "assets/images/gallery/608198659_1187308810272957_6149300462057400297_n.jpg", alt: "Art Betsileo Gospel — portrait" }
  ];

  // Pillar & Reason icons (inline SVGs kept small)
  const ICONS = {
    art: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v9m0 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 3l7 2v6"/></svg>',
    youth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    love: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.8 6 6.2.6-4.7 4.3 1.4 6.1L12 16.8 6.3 20l1.4-6.1L3 9.6 9.2 9z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M8 8a2 2 0 0 1 0-4c2 0 4 4 4 4s2-4 4-4a2 2 0 0 1 0 4"/></svg>'
  };
  const PILLAR_ICONS = [ICONS.art, ICONS.youth, ICONS.love];
  const NEED_ICONS = [ICONS.check, ICONS.star, ICONS.check];
  const OFFER_ICONS = [ICONS.star, ICONS.gift, ICONS.star];

  /* --------------------------------------------------------------
     UTILITIES
     -------------------------------------------------------------- */

  // Escape HTML before injecting translated strings into innerHTML.
  // Keeps renderers safe if a translator ever adds `<` or `"` in strings.
  const ESC = /[&<>"']/g;
  const ESC_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = s => String(s ?? "").replace(ESC, c => ESC_MAP[c]);

  // Strip CR/LF and control chars — prevents mailto header injection.
  const oneLine = s => String(s ?? "").replace(/[\r\n\t\v\f]+/g, " ").replace(/\s+/g, " ").trim();

  /* --------------------------------------------------------------
     I18N
     -------------------------------------------------------------- */

  const STORAGE_LANG = "abg.lang";
  const SUPPORTED = ["fr", "mg", "en"];
  const deepGet = (obj, path) => path.split(".").reduce((o, k) => (o && k in o ? o[k] : null), obj);

  let currentLang = (() => {
    // Priority: ?lang= URL param > localStorage > browser > fr
    const url = new URLSearchParams(location.search).get("lang");
    if (url && SUPPORTED.includes(url)) return url;
    const saved = localStorage.getItem(STORAGE_LANG);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "fr").slice(0, 2);
    return SUPPORTED.includes(nav) ? nav : "fr";
  })();

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = "fr";
    currentLang = lang;
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang;

    const t = window.TRANSLATIONS[lang];

    // data-i18n attributes
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const val = deepGet(t, el.getAttribute("data-i18n"));
      if (typeof val === "string") el.textContent = val;
    });

    // Language switcher active state
    document.querySelectorAll(".lang-switch button").forEach(b => {
      b.classList.toggle("is-active", b.dataset.lang === lang);
    });

    // Re-render dynamic lists (which depend on language)
    renderPillars(t.about.pillars);
    renderStats(t.about.stats);
    renderReasons(t.event.reasons);
    renderVideos();
    renderPartners(t.partners.needs, t.partners.offers);
    renderBudget(t.partners.budget_items);
    renderSubjects(t.contact.form.subject_options);
    renderPartnershipChecks(t.contact.form.partnership_options);
    renderTicketMenu(t.contact.form.tickets_tiers);
  }

  /* --------------------------------------------------------------
     DYNAMIC RENDERERS
     -------------------------------------------------------------- */

  function renderPillars(pillars) {
    const host = document.getElementById("pillars");
    if (!host) return;
    host.innerHTML = pillars.map((p, i) => `
      <article class="pillar reveal">
        <div class="pillar__icon">${PILLAR_ICONS[i] || ICONS.art}</div>
        <h3 class="pillar__title">${esc(p.title)}</h3>
        <p class="pillar__body">${esc(p.body)}</p>
      </article>
    `).join("");
    observeReveals(host);
  }

  function renderStats(stats) {
    const host = document.getElementById("stats");
    if (!host) return;
    host.innerHTML = stats.map(s => `
      <div class="stat">
        <span class="stat__value">${esc(s.value)}</span>
        <span class="stat__label">${esc(s.label)}</span>
      </div>
    `).join("");
  }

  function renderReasons(reasons) {
    const host = document.getElementById("reasons");
    if (!host) return;
    host.innerHTML = reasons.map((r, i) => `
      <article class="reason reveal">
        <span class="reason__num">0${i + 1}</span>
        <div>
          <h4 class="reason__title">${esc(r.title)}</h4>
          <p class="reason__body">${esc(r.body)}</p>
        </div>
      </article>
    `).join("");
    observeReveals(host);
  }

  function renderVideos() {
    const host = document.getElementById("videosGrid");
    if (!host) return;
    const t = window.TRANSLATIONS[currentLang];
    const ytLabel = currentLang === "mg" ? "Hijery ao YouTube" : currentLang === "en" ? "Open on YouTube" : "Voir sur YouTube";
    host.innerHTML = VIDEOS.map(v => {
      const id = encodeURIComponent(v.id);
      const title = esc(v.titleFallback);
      const views = esc(v.views);
      const date = esc(v.dateKey[currentLang]);
      const label = esc(ytLabel);
      const ariaPlay = esc(`${t.videos.watch} — ${v.titleFallback}`);
      const thumb = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      return `
        <article class="video-card reveal">
          <div class="video-card__thumb" data-video-id="${id}" role="button" tabindex="0" aria-label="${ariaPlay}">
            <img src="${thumb}" data-video-thumb="${id}" alt="${title}" loading="lazy">
            <span class="video-card__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </span>
            <a class="video-card__yt" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" aria-label="${label}" title="${label}">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
            </a>
          </div>
          <div class="video-card__body">
            <h3 class="video-card__title">${title}</h3>
            <div class="video-card__meta">
              <span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
                ${views} ${esc(t.videos.views)}
              </span>
              <span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                ${date}
              </span>
            </div>
          </div>
        </article>
      `;
    }).join("");
    bindVideoThumbs(host);
    bindVideoPlay(host);
    observeReveals(host);
  }

  // Attach load/error handlers in JS (not inline) so the CSP script-src 'self'
  // policy on Vercel doesn't strip them. maxresdefault is missing for some
  // videos: either 404 (error) or a 120×90 gray placeholder (load) — both
  // need to fall back to hqdefault.
  function bindVideoThumbs(root) {
    root.querySelectorAll("img[data-video-thumb]").forEach(img => {
      const id = img.getAttribute("data-video-thumb");
      const fallback = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      let swapped = false;
      const swap = () => {
        if (swapped) return;
        swapped = true;
        img.src = fallback;
      };
      img.addEventListener("error", swap, { once: true });
      img.addEventListener("load", () => {
        if (!swapped && img.naturalWidth === 120) swap();
      }, { once: true });
      // If the request already finished (cached) before listeners attached,
      // catch it now.
      if (img.complete) {
        if (img.naturalWidth === 0 || img.naturalWidth === 120) swap();
      }
    });
  }

  function bindVideoPlay(root) {
    root.querySelectorAll(".video-card__thumb[data-video-id]").forEach(thumb => {
      const play = () => {
        const id = thumb.getAttribute("data-video-id");
        if (!id || thumb.dataset.playing === "1") return;
        thumb.dataset.playing = "1";
        // Keep the external YouTube link visible on top of the player
        const ytLink = thumb.querySelector(".video-card__yt");
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
        iframe.title = thumb.getAttribute("aria-label") || "YouTube video player";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.className = "video-card__iframe";
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        // Replace image + play button with iframe (keep the YT button)
        thumb.querySelectorAll("img, .video-card__play").forEach(n => n.remove());
        thumb.insertBefore(iframe, ytLink);
      };
      thumb.addEventListener("click", e => {
        if (e.target.closest(".video-card__yt")) return;
        play();
      });
      thumb.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      });
    });
  }

  function renderGallery() {
    const host = document.getElementById("galleryGrid");
    if (!host) return;
    host.innerHTML = GALLERY.map(g => `
      <figure class="gallery__item reveal">
        <img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">
      </figure>
    `).join("");
    observeReveals(host);
  }

  function renderPartners(needs, offers) {
    const needsHost = document.getElementById("partnerNeeds");
    const offersHost = document.getElementById("partnerOffers");
    if (needsHost) {
      needsHost.innerHTML = needs.map((n, i) => `
        <div class="partners__item">
          <div class="partners__item-icon">${NEED_ICONS[i] || ICONS.check}</div>
          <div>
            <h4 class="partners__item-title">${esc(n.title)}</h4>
            <p class="partners__item-body">${esc(n.body)}</p>
          </div>
        </div>
      `).join("");
    }
    if (offersHost) {
      offersHost.innerHTML = offers.map((o, i) => `
        <div class="partners__item">
          <div class="partners__item-icon">${OFFER_ICONS[i] || ICONS.star}</div>
          <div>
            <h4 class="partners__item-title">${esc(o.title)}</h4>
            <p class="partners__item-body">${esc(o.body)}</p>
          </div>
        </div>
      `).join("");
    }
  }

  // Stable keys for the subject options — index-based so language switches
  // never break the conditional panels below the select.
  const SUBJECT_KEYS = ["info", "partnership", "tickets", "invitation", "other"];

  // Format an integer Ariary amount with thin spaces (10000 → "10 000 Ar").
  // Uses a U+202F NARROW NO-BREAK SPACE so the price never wraps mid-number.
  function formatAr(n) {
    return Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Ar";
  }

  function renderSubjects(options) {
    const select = document.getElementById("c-subject");
    if (!select) return;
    const prevIdx = Math.max(0, select.selectedIndex);
    select.innerHTML = options
      .map((o, i) => `<option value="${esc(o)}" data-key="${SUBJECT_KEYS[i] || ""}">${esc(o)}</option>`)
      .join("");
    select.selectedIndex = Math.min(prevIdx, options.length - 1);
    syncSubjectExtra();
  }

  function syncSubjectExtra() {
    const select = document.getElementById("c-subject");
    const wrap = document.getElementById("subjectExtra");
    if (!select || !wrap) return;
    const opt = select.selectedOptions[0];
    const key = opt ? opt.dataset.key : "";
    let anyVisible = false;
    wrap.querySelectorAll("[data-extra-for]").forEach(panel => {
      const show = panel.getAttribute("data-extra-for") === key;
      panel.hidden = !show;
      if (show) anyVisible = true;
    });
    wrap.hidden = !anyVisible;
  }

  function renderPartnershipChecks(options) {
    const host = document.getElementById("partnershipChecks");
    if (!host || !Array.isArray(options)) return;
    host.innerHTML = options.map(o => `
      <label class="check-pill">
        <input type="checkbox" name="partnership_type" value="${esc(o)}">
        <span class="check-pill__label">${esc(o)}</span>
      </label>
    `).join("");
  }

  function renderTicketMenu(tiers) {
    const host = document.getElementById("ticketMenu");
    if (!host || !Array.isArray(tiers)) return;
    host.innerHTML = tiers.map((tier, i) => `
      <li class="menu-list__item">
        <span class="menu-list__name">${esc(tier.name)}</span>
        <span class="menu-list__leader" aria-hidden="true"></span>
        <span class="menu-list__price">${esc(formatAr(tier.price))}</span>
        <input
          class="menu-list__qty"
          type="number"
          inputmode="numeric"
          min="0"
          max="50"
          step="1"
          value="0"
          name="ticket_${i}"
          data-tier-name="${esc(tier.name)}"
          data-tier-price="${tier.price}"
          aria-label="${esc(tier.name)}">
      </li>
    `).join("");
    updateTicketTotal();
  }

  function updateTicketTotal() {
    const host = document.getElementById("ticketMenu");
    const out = document.getElementById("ticketTotal");
    if (!host || !out) return;
    let total = 0;
    host.querySelectorAll(".menu-list__qty").forEach(inp => {
      const qty = Math.max(0, parseInt(inp.value, 10) || 0);
      const price = parseInt(inp.dataset.tierPrice, 10) || 0;
      total += qty * price;
    });
    out.textContent = formatAr(total);
  }

  function renderBudget(items) {
    const host = document.getElementById("budgetList");
    if (!host || !Array.isArray(items)) return;
    host.innerHTML = items.map(it => `
      <li class="menu-list__item">
        <span class="menu-list__name">${esc(it.label)}</span>
        <span class="menu-list__leader" aria-hidden="true"></span>
        <span class="menu-list__price">${esc(formatAr(it.amount))}</span>
      </li>
    `).join("");
  }

  /* --------------------------------------------------------------
     COUNTDOWN (12 July 2026, 19:00 Madagascar / GMT+3)
     -------------------------------------------------------------- */

  const EVENT_DATE = new Date("2026-07-12T19:00:00+03:00").getTime();

  function tickCountdown() {
    const timer = document.getElementById("countdownTimer");
    if (!timer) return;
    const now = Date.now();
    const diff = EVENT_DATE - now;
    const t = window.TRANSLATIONS[currentLang];

    if (diff <= 0) {
      const status = diff > -6 * 60 * 60 * 1000 ? t.countdown.live : t.countdown.ended;
      timer.innerHTML = `<p style="grid-column: 1 / -1; font-family: var(--font-display); font-style: italic; font-size: 22px; color: var(--gold); margin: 0;">${status}</p>`;
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, "0");

    const set = (unit, val) => {
      const el = timer.querySelector(`[data-unit="${unit}"]`);
      if (el) el.textContent = pad(val);
    };
    set("days", days);
    set("hours", hours);
    set("minutes", minutes);
    set("seconds", seconds);
  }

  /* --------------------------------------------------------------
     NAV (scroll state + mobile toggle)
     -------------------------------------------------------------- */

  function initNav() {
    const nav = document.getElementById("nav");
    const burger = document.getElementById("navBurger");
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Move the lang-switch + CTA between the desktop pill (.nav__tools) and
    // the mobile dropdown (.nav__links) so we keep a single copy of each.
    const tools = nav.querySelector(".nav__tools");
    const links = nav.querySelector(".nav__links");
    const langSwitch = document.getElementById("langSwitch");
    const cta = document.getElementById("navCta");
    const MOBILE_MQ = window.matchMedia("(max-width: 980px)");

    function positionControls() {
      if (!tools || !links || !langSwitch || !cta || !burger) return;
      if (MOBILE_MQ.matches) {
        if (langSwitch.parentElement !== links) links.appendChild(langSwitch);
        if (cta.parentElement !== links) links.appendChild(cta);
      } else {
        if (langSwitch.parentElement !== tools) tools.insertBefore(langSwitch, burger);
        if (cta.parentElement !== tools) tools.insertBefore(cta, burger);
      }
    }
    positionControls();
    MOBILE_MQ.addEventListener("change", positionControls);

    const closeMenu = () => {
      nav.classList.remove("is-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
    };

    if (burger) {
      burger.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        burger.setAttribute("aria-expanded", String(open));
      });
    }
    // Close nav on link or CTA click inside the dropdown
    nav.addEventListener("click", (e) => {
      const link = e.target.closest(".nav__links a");
      if (link) closeMenu();
    });
  }

  /* --------------------------------------------------------------
     REVEAL ANIMATIONS
     -------------------------------------------------------------- */

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -80px 0px", threshold: 0.05 });

  function observeReveals(root = document) {
    (root.querySelectorAll ? root : document).querySelectorAll(".reveal:not(.is-visible)").forEach(el => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------
     LANGUAGE SWITCHER
     -------------------------------------------------------------- */

  function initLangSwitch() {
    document.querySelectorAll(".lang-switch button").forEach(b => {
      b.addEventListener("click", () => applyLang(b.dataset.lang));
    });
  }

  /* --------------------------------------------------------------
     CONTACT FORM
     - Sends real emails via FormSubmit (https://formsubmit.co) — no signup, free.
     - First submission triggers a one-time activation email to CONTACT_EMAIL;
       click the link inside to enable forwarding for all future messages.
     - If FORM_ENDPOINT is cleared, falls back to a mailto: link (dev mode).
     -------------------------------------------------------------- */

  const CONTACT_EMAIL = "artbetsileogospel@gmail.com";
  const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

  // Collect the conditional Partenariat / Réservation panels into structured
  // extras so we can include them in the email body sent to FormSubmit.
  function collectFormExtras(form) {
    const select = form.querySelector("#c-subject");
    const key = select && select.selectedOptions[0] ? select.selectedOptions[0].dataset.key : "";
    const out = { key, lines: [], details: {} };

    if (key === "partnership") {
      const checked = Array.from(form.querySelectorAll('input[name="partnership_type"]:checked'))
        .map(i => oneLine(i.value));
      if (checked.length) {
        out.details.partnership_types = checked;
        out.lines.push(`Soutien souhaité : ${checked.join(" · ")}`);
      }
    }

    if (key === "tickets") {
      const picks = [];
      let total = 0;
      form.querySelectorAll('.menu-list__qty').forEach(inp => {
        const qty = Math.max(0, parseInt(inp.value, 10) || 0);
        const price = parseInt(inp.dataset.tierPrice, 10) || 0;
        const name = oneLine(inp.dataset.tierName || "");
        if (qty > 0) {
          picks.push(`${qty} × ${name} (${formatAr(price * qty)})`);
          total += qty * price;
        }
      });
      if (picks.length) {
        out.details.ticket_selection = picks;
        out.details.ticket_total = formatAr(total);
        out.lines.push(`Billets : ${picks.join(" + ")}`);
        out.lines.push(`Total estimé : ${formatAr(total)}`);
      }
    }
    return out;
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");
    const btn = document.getElementById("submitBtn");
    if (!form) return;

    // Toggle the conditional Partenariat / Réservation panel on subject change.
    const subjectSelect = document.getElementById("c-subject");
    if (subjectSelect) subjectSelect.addEventListener("change", syncSubjectExtra);

    // Live total update for ticket quantity inputs (event delegation so it
    // survives language switches that re-render the menu).
    const ticketHost = document.getElementById("ticketMenu");
    if (ticketHost) ticketHost.addEventListener("input", e => {
      if (e.target.classList.contains("menu-list__qty")) updateTicketTotal();
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const t = window.TRANSLATIONS[currentLang].contact.form;

      // Honeypot: if the hidden field is filled, silently drop (bots only).
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) return;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const raw = Object.fromEntries(new FormData(form).entries());
      // Strip CR/LF from single-line fields to avoid header injection.
      const data = {
        name: oneLine(raw.name),
        email: oneLine(raw.email),
        phone: oneLine(raw.phone || ""),
        subject: oneLine(raw.subject || "Contact"),
        message: String(raw.message || "").trim()
      };

      // Pull conditional extras (partnership types, ticket quantities) and
      // prepend them to the message so they always reach the inbox.
      const extras = collectFormExtras(form);
      const enrichedMessage = extras.lines.length
        ? `${extras.lines.join("\n")}\n\n— — —\n\n${data.message}`
        : data.message;

      btn.disabled = true;
      status.textContent = t.sending;
      status.className = "form-status";

      if (FORM_ENDPOINT) {
        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              phone: data.phone || "—",
              message: enrichedMessage,
              ...extras.details,
              _subject: `[ABG] ${data.subject} — ${data.name}`,
              _replyto: data.email,
              _template: "table",
              _captcha: "false"
            })
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok || json.success === "false") throw new Error(json.message || "Network error");
          status.textContent = t.success;
          status.className = "form-status is-success";
          form.reset();
          updateTicketTotal();
          syncSubjectExtra();
        } catch (err) {
          status.textContent = t.error;
          status.className = "form-status is-error";
        }
      } else {
        // Mailto fallback — all header parts are already CR/LF-stripped above.
        const subject = encodeURIComponent(`[${data.subject}] — ${data.name}`);
        const body = encodeURIComponent(
          `Nom: ${data.name}\nEmail: ${data.email}\nTéléphone: ${data.phone || "—"}\nSujet: ${data.subject}\n\n${enrichedMessage}`
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        status.textContent = t.success;
        status.className = "form-status is-success";
        form.reset();
        updateTicketTotal();
        syncSubjectExtra();
      }
      btn.disabled = false;
    });
  }

  /* --------------------------------------------------------------
     YEAR
     -------------------------------------------------------------- */

  function setYear() {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------
     INIT
     -------------------------------------------------------------- */

  function init() {
    // Static-but-language-independent renders
    renderGallery();

    // Language + translations-driven renders
    applyLang(currentLang);

    initLangSwitch();
    initNav();
    initContactForm();
    setYear();

    // Reveal .section__head and top-level elements
    document.querySelectorAll(".section__head, .verse, .hero__content, .countdown__card, .contact__form, .contact__direct")
      .forEach(el => el.classList.add("reveal"));
    observeReveals();

    // Countdown
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
