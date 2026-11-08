(() => {
  "use strict";

  /* Interactive loader */
  const loader = document.getElementById("pageLoader");
  const loaderStage = document.getElementById("loaderStage");
  const loaderGlow = document.getElementById("loaderGlow");
  const loaderProgress = document.getElementById("loaderProgress");
  const loaderPercent = document.getElementById("loaderPercent");
  const loaderEnter = document.getElementById("loaderEnter");
  const loaderCanvas = document.getElementById("loaderParticles");
  const ringLen = 615;
  const minShow = 750;
  const maxShow = 1800;
  const autoEnterDelay = 450;
  const start = performance.now();
  let exiting = false;
  let ready = false;
  let progress = 0;
  let pageLoaded = false;
  let pointer = { x: 0, y: 0 };

  function setProgress(value) {
    progress = Math.min(100, Math.max(progress, value));
    if (loaderProgress) {
      loaderProgress.style.strokeDashoffset = String(ringLen - (ringLen * progress) / 100);
    }
    if (loaderPercent) loaderPercent.textContent = `${Math.round(progress)}%`;
  }

  function markReady() {
    if (ready || exiting || !loader) return;
    const elapsed = performance.now() - start;
    const wait = Math.max(0, minShow - elapsed);
    setTimeout(() => {
      if (ready || exiting || !loader) return;
      ready = true;
      setProgress(100);
      loader.classList.add("is-ready");
      if (loaderEnter) loaderEnter.hidden = false;
      setTimeout(() => {
        if (!exiting) hideLoader();
      }, autoEnterDelay);
    }, wait);
  }

  function hideLoader() {
    if (exiting || !loader) return;
    exiting = true;
    loader.classList.add("is-exiting");
    document.body.classList.remove("is-loading");
    setTimeout(() => {
      loader.classList.add("is-done");
      loader.setAttribute("aria-busy", "false");
      setTimeout(() => loader.remove(), 500);
    }, 450);
  }

  function tryExit() {
    if (!ready || exiting) return;
    hideLoader();
  }

  // Simulated progress + load sync
  const tick = setInterval(() => {
    if (exiting) {
      clearInterval(tick);
      return;
    }
    const elapsed = performance.now() - start;
    const simulated = Math.min(92, (elapsed / maxShow) * 100);
    const target = pageLoaded ? 100 : simulated;
    setProgress(target);
    if (target >= 100) markReady();
  }, 40);

  window.addEventListener("load", () => {
    pageLoaded = true;
    setProgress(Math.max(progress, 96));
    setTimeout(markReady, 120);
  });

  setTimeout(() => {
    if (!ready) markReady();
  }, maxShow);

  loaderEnter?.addEventListener("click", (e) => {
    e.stopPropagation();
    tryExit();
  });

  loader?.addEventListener("click", tryExit);

  // Mouse / touch parallax
  function onPointerMove(e) {
    if (!loaderStage) return;
    const rect = loader.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = (e.clientX - rect.left - cx) / cx;
    const y = (e.clientY - rect.top - cy) / cy;
    pointer.x = x;
    pointer.y = y;
    loaderStage.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -5}deg)`;
    if (loaderGlow) {
      loaderGlow.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
    }
  }

  loader?.addEventListener("mousemove", onPointerMove);
  loader?.addEventListener("touchmove", (e) => {
    if (e.touches[0]) onPointerMove(e.touches[0]);
  }, { passive: true });

  // Gold particle canvas
  if (loaderCanvas) {
    const ctx = loaderCanvas.getContext("2d");
    let particles = [];
    let rafId;

    function resizeCanvas() {
      loaderCanvas.width = window.innerWidth;
      loaderCanvas.height = window.innerHeight;
    }

    function spawnParticle() {
      return {
        x: Math.random() * loaderCanvas.width,
        y: Math.random() * loaderCanvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.5 - 0.15,
        a: Math.random() * 0.5 + 0.15,
      };
    }

    function initParticles() {
      resizeCanvas();
      particles = Array.from({ length: 48 }, spawnParticle);
    }

    function drawParticles() {
      if (!ctx || exiting) return;
      ctx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
      for (const p of particles) {
        p.x += p.vx + pointer.x * 0.08;
        p.y += p.vy + pointer.y * 0.06;
        if (p.y < -10 || p.x < -10 || p.x > loaderCanvas.width + 10) Object.assign(p, spawnParticle(), { y: loaderCanvas.height + 10 });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 213, 163, ${p.a})`;
        ctx.fill();
      }
      rafId = requestAnimationFrame(drawParticles);
    }

    initParticles();
    drawParticles();
    window.addEventListener("resize", initParticles);

    const stopParticles = () => cancelAnimationFrame(rafId);
    loader?.addEventListener("transitionend", (e) => {
      if (e.target === loader && loader.classList.contains("is-done")) stopParticles();
    });
  }

  setProgress(8);

  const i18n = {
    de: {
      "nav.about": "Über mich",
      "nav.shop": "Shop",
      "nav.work": "Arbeit",
      "nav.clients": "Kunden",
      "nav.giveaway": "Gewinnspiel",
      "nav.location": "Standort",
      "nav.reserve": "Reservieren",
      "loader.hint": "Zürich · Schweiz",
      "loader.enter": "Studio betreten",
      "hero.eyebrow": "Make-up Artist · Zürich",
      "hero.lead": "Eleganz, Präzision und Soft Glam — zertifiziert von Sellma Academy.",
      "hero.cta": "Termin reservieren",
      "hero.secondary": "Mehr erfahren",
      "about.eyebrow": "Über mich",
      "about.title": "Zertifizierte Kunst der Schönheit",
      "about.p1": "Ich bin Anife Memeti, Make-up Artist aus Zürich. Mit Leidenschaft für natürliche Ausstrahlung und modernes Soft Glam gestalte ich Looks für Events, Shootings und besondere Momente.",
      "about.p2": "Meine Ausbildung habe ich bei Sellma Kasumoviq an der Sellma Academy absolviert — mit Fokus auf Technik, Hautpflege und zeitlose Eleganz.",
      "about.badge1": "Sellma Academy Certified",
      "about.badge2": "CH Zürich",
      "about.badge3": "Events & Soft Glam",
      "about.cap1": "Sellma Academy",
      "about.cap2": "Zertifiziert",
      "shop.eyebrow": "Beauty Shop",
      "shop.title": "Ausgewählte Produkte",
      "shop.lead": "Kuratierte Favoriten für den Alltag — Preise in CHF.",
      "shop.add": "In den Warenkorb",
      "shop.p1.name": "Soft Glow Serum",
      "shop.p1.desc": "Leichtes Glow-Serum für strahlende Haut.",
      "shop.p2.name": "Velvet Lip Tint",
      "shop.p2.desc": "Samtiger Nude-Ton für Soft Glam Looks.",
      "shop.p3.name": "Champagne Highlighter",
      "shop.p3.desc": "Feiner Champagner-Schimmer für Wangen & Dekolleté.",
      "shop.p4.name": "Lash Lift Kit Mini",
      "shop.p4.desc": "Zuhause-Set für offene, natürliche Wimpern.",
      "work.eyebrow": "Behind the Look",
      "work.title": "Während der Arbeit",
      "work.lead": "Einblicke in Sessions, Events und Studio-Momente.",
      "clients.eyebrow": "Ergebnisse",
      "clients.title": "Zufriedene Kundinnen",
      "clients.lead": "Looks, die strahlen — und bleiben.",
      "ig.eyebrow": "Live auf Instagram",
      "ig.title": "Neueste Posts",
      "ig.lead": "Folge @anifememeti für Looks, Behind-the-Scenes und Updates aus Zürich.",
      "ig.handle": "Make-up Artist · Zürich",
      "ig.follow": "Folgen",
      "ig.fallback": "Instagram Feed laden…",
      "ig.open": "Auf Instagram öffnen",
      "wheel.eyebrow": "Gewinnspiel",
      "wheel.title": "Dreh das Glücksrad",
      "wheel.lead": "Sichere dir Rabatte, Gratis-Beratung oder ein Soft Glam Upgrade. Ein Spin pro Besuch.",
      "wheel.spin": "Jetzt drehen",
      "wheel.again": "Bereits gedreht",
      "wheel.win": "Glückwunsch! Du hast gewonnen:",
      "map.eyebrow": "Standort",
      "map.title": "Zürich, Schweiz",
      "map.lead": "Termine nach Vereinbarung im Studio oder on location. Schreib mir für Soft Glam, Events oder Shootings.",
      "map.city": "Stadt",
      "map.ig": "Instagram",
      "map.cta": "Termin reservieren",
      "footer.copy": "© 2026 Anife Memeti. Alle Rechte vorbehalten.",
      "form.title": "Termin reservieren",
      "form.lead": "Erzähl mir kurz, was du brauchst — ich melde mich bei dir.",
      "form.name": "Name",
      "form.email": "E-Mail",
      "form.phone": "Telefon",
      "form.service": "Service",
      "form.servicePlaceholder": "Bitte wählen",
      "form.s1": "Soft Glam",
      "form.s2": "Event / Party",
      "form.s3": "Braut / Special",
      "form.s4": "Make-up Lesson",
      "form.date": "Wunschdatum",
      "form.note": "Nachricht",
      "form.notePh": "Anlass, Ort, Uhrzeit…",
      "form.submit": "Anfrage senden",
      "form.success": "Danke! Deine Anfrage ist angekommen.",
      "toast.cart": "Zum Warenkorb hinzugefügt",
      prizes: [
        { label: "10% Rabatt", color: "#2a211c" },
        { label: "Gratis Beratung", color: "#b8954a" },
        { label: "15% Rabatt", color: "#5c4033" },
        { label: "Soft Glam Upgrade", color: "#c9a48a" },
        { label: "CHF 20 Gutschein", color: "#8f6f2e" },
        { label: "Nochmal drehen", color: "#3d342c" },
        { label: "5% Rabatt", color: "#d4b56a" },
        { label: "Lip Tint gratis", color: "#6b5344" },
      ],
    },
    sq: {
      "nav.about": "Rreth meje",
      "nav.shop": "Dyqani",
      "nav.work": "Puna",
      "nav.clients": "Klientët",
      "nav.giveaway": "Giveaway",
      "nav.location": "Vendndodhja",
      "nav.reserve": "Rezervo",
      "loader.hint": "Zürich · Zvicër",
      "loader.enter": "Hyr në studio",
      "hero.eyebrow": "Make-up Artist · Zürich",
      "hero.lead": "Elegancë, saktësi dhe Soft Glam — e certifikuar nga Sellma Academy.",
      "hero.cta": "Rezervo termin",
      "hero.secondary": "Mëso më shumë",
      "about.eyebrow": "Rreth meje",
      "about.title": "Arti i certifikuar i bukurisë",
      "about.p1": "Unë jam Anife Memeti, make-up artist në Zürich. Me pasion për shkëlqim natyral dhe Soft Glam modern, krijoj look-e për evente, shooting-e dhe momente speciale.",
      "about.p2": "Jam e trajnuar te Sellma Kasumoviq në Sellma Academy — me fokus në teknikë, kujdesin e lëkurës dhe elegancë të përjetshme.",
      "about.badge1": "Sellma Academy Certified",
      "about.badge2": "CH Zürich",
      "about.badge3": "Evente & Soft Glam",
      "about.cap1": "Sellma Academy",
      "about.cap2": "E certifikuar",
      "shop.eyebrow": "Beauty Shop",
      "shop.title": "Produkte të zgjedhura",
      "shop.lead": "Favoritet e kuratuara për çdo ditë — çmime në CHF.",
      "shop.add": "Shto në shportë",
      "shop.p1.name": "Soft Glow Serum",
      "shop.p1.desc": "Serum i lehtë glow për lëkurë të ndritshme.",
      "shop.p2.name": "Velvet Lip Tint",
      "shop.p2.desc": "Nuancë nude e butë për Soft Glam.",
      "shop.p3.name": "Champagne Highlighter",
      "shop.p3.desc": "Shkëlqim champagne për faqe & dekolte.",
      "shop.p4.name": "Lash Lift Kit Mini",
      "shop.p4.desc": "Set shtëpie për qerpikë natyralë.",
      "work.eyebrow": "Pas look-ut",
      "work.title": "Gjatë punës",
      "work.lead": "Pamje nga sesionet, eventet dhe momenti në studio.",
      "clients.eyebrow": "Rezultatet",
      "clients.title": "Kliente të kënaqura",
      "clients.lead": "Look-e që shkëlqejnë — dhe mbeten.",
      "ig.eyebrow": "Live në Instagram",
      "ig.title": "Postimet e fundit",
      "ig.lead": "Ndiq @anifememeti për look-e, behind-the-scenes dhe update nga Zürich.",
      "ig.handle": "Make-up Artist · Zürich",
      "ig.follow": "Ndiq",
      "ig.fallback": "Po ngarkohet Instagram…",
      "ig.open": "Hape në Instagram",
      "wheel.eyebrow": "Giveaway",
      "wheel.title": "Rrotullo rrotën e fatit",
      "wheel.lead": "Fito zbritje, konsultë falas ose Soft Glam upgrade. Një rrotullim për vizitë.",
      "wheel.spin": "Rrotullo tani",
      "wheel.again": "Tashmë e rrotullove",
      "wheel.win": "Urime! Ke fituar:",
      "map.eyebrow": "Vendndodhja",
      "map.title": "Zürich, Zvicër",
      "map.lead": "Termine me marrëveshje në studio ose on location. Më shkruaj për Soft Glam, evente ose shooting.",
      "map.city": "Qyteti",
      "map.ig": "Instagram",
      "map.cta": "Rezervo termin",
      "footer.copy": "© 2026 Anife Memeti. Të gjitha të drejtat e rezervuara.",
      "form.title": "Rezervo termin",
      "form.lead": "Më trego shkurt çfarë të duhet — të kontaktoj unë.",
      "form.name": "Emri",
      "form.email": "Email",
      "form.phone": "Telefoni",
      "form.service": "Shërbimi",
      "form.servicePlaceholder": "Zgjidh",
      "form.s1": "Soft Glam",
      "form.s2": "Event / Party",
      "form.s3": "Nuse / Special",
      "form.s4": "Make-up Lesson",
      "form.date": "Data e dëshiruar",
      "form.note": "Mesazhi",
      "form.notePh": "Rasti, vendi, ora…",
      "form.submit": "Dërgo kërkesën",
      "form.success": "Faleminderit! Kërkesa jote u mor.",
      "toast.cart": "U shtua në shportë",
      prizes: [
        { label: "10% zbritje", color: "#2a211c" },
        { label: "Konsultë falas", color: "#b8954a" },
        { label: "15% zbritje", color: "#5c4033" },
        { label: "Soft Glam Upgrade", color: "#c9a48a" },
        { label: "Kupon CHF 20", color: "#8f6f2e" },
        { label: "Rrotullo sërish", color: "#3d342c" },
        { label: "5% zbritje", color: "#d4b56a" },
        { label: "Lip Tint falas", color: "#6b5344" },
      ],
    },
  };

  let lang = localStorage.getItem("am-lang") || "de";
  let prizes = i18n[lang].prizes;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function applyLang(next) {
    lang = next;
    localStorage.setItem("am-lang", lang);
    document.documentElement.lang = lang === "sq" ? "sq" : "de-CH";
    prizes = i18n[lang].prizes;

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = i18n[lang][key];
      if (typeof val === "string") el.textContent = val;
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = i18n[lang][key];
      if (typeof val === "string") el.setAttribute("placeholder", val);
    });

    $$(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    drawWheel();
  }

  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  /* Mobile nav */
  const menuToggle = $(".menu-toggle");
  const mobileNav = $(".mobile-nav");

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
  });

  $$(".mobile-nav a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileNav.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* Header scroll */
  const header = $(".site-header");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* Reserve modal */
  const modal = $("#reserveModal");
  const form = $("#reserveForm");
  const formOk = $("#formOk");

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    formOk.hidden = true;
    setTimeout(() => form?.querySelector("input")?.focus(), 50);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  $$(".open-reserve").forEach((btn) => btn.addEventListener("click", openModal));
  $$("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    formOk.hidden = false;
    form.reset();
    setTimeout(closeModal, 1600);
  });

  /* Cart toast */
  const toast = $("#toast");
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  $$(".add-cart").forEach((btn) => {
    btn.addEventListener("click", () => showToast(i18n[lang]["toast.cart"]));
  });

  /* Prize wheel */
  const canvas = $("#prizeWheel");
  const ctx = canvas?.getContext("2d");
  const spinBtn = $("#spinBtn");
  const resultEl = $("#wheelResult");
  let rotation = 0;
  let spinning = false;
  const SPUN_KEY = "am-wheel-spun";

  function drawWheel() {
    if (!ctx || !canvas) return;
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2;
    const r = width / 2 - 8;
    const n = prizes.length;
    const arc = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    for (let i = 0; i < n; i++) {
      const start = i * arc - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, start, start + arc);
      ctx.closePath();
      ctx.fillStyle = prizes[i].color;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,250,245,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = i % 2 === 0 ? "#f7f2ec" : "#1a140f";
      ctx.font = "600 15px Outfit, sans-serif";
      ctx.fillText(prizes[i].label, r - 18, 5);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#f7f2ec";
    ctx.fill();
    ctx.strokeStyle = "#b8954a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#2a211c";
    ctx.font = "600 14px Cormorant Garamond, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("AM", 0, 1);

    ctx.restore();
  }

  function prizeAtPointer() {
    const n = prizes.length;
    const arc = (Math.PI * 2) / n;
    const normalized = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const pointerAngle = (Math.PI * 1.5 - normalized + Math.PI * 2) % (Math.PI * 2);
    const index = Math.floor(pointerAngle / arc) % n;
    return prizes[index];
  }

  function spin() {
    if (spinning || !canvas) return;
    if (sessionStorage.getItem(SPUN_KEY) === "1") {
      spinBtn.textContent = i18n[lang]["wheel.again"];
      spinBtn.disabled = true;
      return;
    }

    spinning = true;
    spinBtn.disabled = true;
    const startRot = rotation;
    const extra = Math.PI * 2 * (5 + Math.random() * 3);
    const target = startRot + extra;
    const start = performance.now();
    const duration = 4200;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      rotation = startRot + (target - startRot) * eased;
      drawWheel();
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        spinning = false;
        const win = prizeAtPointer();
        resultEl.textContent = `${i18n[lang]["wheel.win"]} ${win.label}`;
        sessionStorage.setItem(SPUN_KEY, "1");
        spinBtn.textContent = i18n[lang]["wheel.again"];
      }
    }

    requestAnimationFrame(frame);
  }

  spinBtn?.addEventListener("click", spin);

  if (sessionStorage.getItem(SPUN_KEY) === "1") {
    spinBtn.disabled = true;
    spinBtn.textContent = i18n[lang]["wheel.again"];
  }

  /* Mobile carousels */
  function initCarousel(root) {
    const track = root.querySelector(".carousel__track");
    const slides = [...root.querySelectorAll(".carousel__slide")];
    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    if (!track || slides.length < 2) return;

    let index = 0;
    let startX = 0;
    let deltaX = 0;
    let dragging = false;

    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = () => [...dotsWrap.querySelectorAll(".carousel__dot")];

    function isDesktop() {
      return window.matchMedia("(min-width: 720px)").matches;
    }

    function goTo(i) {
      if (isDesktop()) {
        track.style.transform = "";
        return;
      }
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots().forEach((d, di) => d.classList.toggle("is-active", di === index));
    }

    prev?.addEventListener("click", () => goTo(index - 1));
    next?.addEventListener("click", () => goTo(index + 1));

    track.addEventListener(
      "touchstart",
      (e) => {
        if (isDesktop()) return;
        dragging = true;
        startX = e.touches[0].clientX;
        deltaX = 0;
        track.style.transition = "none";
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging || isDesktop()) return;
        deltaX = e.touches[0].clientX - startX;
        const pct = (deltaX / track.clientWidth) * 100;
        track.style.transform = `translateX(calc(-${index * 100}% + ${pct}%))`;
      },
      { passive: true }
    );

    track.addEventListener("touchend", () => {
      if (!dragging || isDesktop()) return;
      dragging = false;
      track.style.transition = "";
      if (Math.abs(deltaX) > 50) {
        goTo(deltaX < 0 ? index + 1 : index - 1);
      } else {
        goTo(index);
      }
    });

    window.addEventListener("resize", () => goTo(index));
    goTo(0);

    let auto = setInterval(() => {
      if (!document.hidden && !isDesktop() && !dragging) goTo(index + 1);
    }, 4500);

    root.addEventListener("pointerenter", () => clearInterval(auto));
    root.addEventListener("pointerleave", () => {
      clearInterval(auto);
      auto = setInterval(() => {
        if (!document.hidden && !isDesktop() && !dragging) goTo(index + 1);
      }, 4500);
    });
  }

  $$("[data-carousel]").forEach(initCarousel);

  /* Instagram embed fallback */
  const igWindow = $(".ig-window");
  const igFrame = igWindow?.querySelector("iframe");
  if (igFrame && igWindow) {
    let loaded = false;
    igFrame.addEventListener("load", () => {
      loaded = true;
    });
    setTimeout(() => {
      if (!loaded) igWindow.classList.add("is-fallback");
    }, 5000);
  }

  applyLang(lang);
})();
