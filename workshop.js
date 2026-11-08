(() => {
  "use strict";

  const PHONE = "38348878780";
  const strings = {
    sq: {
      "brand.sub": "Workshop · Prishtinë",
      limited: "Vende të kufizuara",
      kicker: "Workshop i radhës",
      month: "Nëntor",
      title: "Rezervo vendin tënd",
      lead: "Workshop profesional i grimit me Sellma Kasumoviq. Prishtinë, e hënë 9 nëntor 2026. Grup i vogël — vendet janë të kufizuara.",
      "pill.city": "Prishtinë",
      "pill.cert": "Certifikatë",
      "pill.group": "Grup i vogël",
      "video.cap": "Prishtinë · 9 Nëntor 2026",
      "form.title": "Regjistrohu",
      "form.lead": "Shkruaj emrin dhe numrin. Të konfirmojmë vendin në WhatsApp.",
      "form.name": "Emri",
      "form.phone": "Telefoni (WhatsApp)",
      "form.city": "Qyteti",
      "form.cityPh": "Prishtinë",
      "form.ig": "Instagram",
      "form.level": "Niveli",
      "form.beginner": "Fillestare",
      "form.pro": "Jam duke punuar",
      "form.submit": "Rezervo vendin tënd",
      "form.fine": "Vendi ruhet pasi të konfirmohet në WhatsApp. Pa pagesë në këtë faqe.",
      "form.need": "Shkruaj emrin dhe një numër telefoni.",
      "ok.title": "Kërkesa u dërgua",
      "ok.lead": "Faleminderit. Hap WhatsApp që akademia ta marrë kërkesën. Vendi konfirmohet kur të të kthehemi.",
      "ok.wa": "Hap WhatsApp",
      "ok.again": "Regjistro dikë tjetër",
      "fact1.k": "Data",
      "fact1.h": "9 Nëntor 2026",
      "fact1.v": "E hënë · Prishtinë",
      "fact2.k": "Çfarë merr",
      "fact2.h": "Certifikatë",
      "fact2.v": "Mësim praktik për fillestare dhe për ata që punojnë.",
      "fact3.k": "Akademia",
      "fact3.v": "Studentë të certifikuar në botë.",
      "steps.title": "Si rezervohet",
      "steps.1": "Shkruaj emrin dhe numrin e WhatsApp.",
      "steps.2": "Shtyp «Rezervo vendin tënd».",
      "steps.3": "Të konfirmojmë vendin në WhatsApp. Hapësira është e kufizuar.",
      "wa.hello": "Përshëndetje Sellma Academy,",
      "wa.want": "Dua të rezervoj vendin për workshopin në Prishtinë, 9 Nëntor 2026.",
      "wa.name": "Emri",
      "wa.phone": "Telefoni",
      "wa.city": "Qyteti",
      "wa.level": "Niveli",
      "wa.ig": "Instagram",
      "wa.beginner": "Fillestare",
      "wa.pro": "Jam duke punuar",
    },
    en: {
      "brand.sub": "Workshop · Prishtina",
      limited: "Limited spots",
      kicker: "Next workshop",
      month: "November",
      title: "Reserve your spot",
      lead: "Professional makeup workshop with Sellma Kasumoviq. Prishtina, Monday 9 November 2026. Small group — space is limited.",
      "pill.city": "Prishtina",
      "pill.cert": "Certificate",
      "pill.group": "Small group",
      "video.cap": "Prishtina · 9 November 2026",
      "form.title": "Register",
      "form.lead": "Add your name and number. We confirm your spot on WhatsApp.",
      "form.name": "Name",
      "form.phone": "Phone (WhatsApp)",
      "form.city": "City",
      "form.cityPh": "Prishtina",
      "form.ig": "Instagram",
      "form.level": "Level",
      "form.beginner": "Beginner",
      "form.pro": "I already work",
      "form.submit": "Reserve your spot",
      "form.fine": "Your spot is held once we confirm on WhatsApp. No payment on this page.",
      "form.need": "Add your name and a phone number.",
      "ok.title": "Request sent",
      "ok.lead": "Thank you. Open WhatsApp so the academy receives your request. Your spot is confirmed when we reply.",
      "ok.wa": "Open WhatsApp",
      "ok.again": "Register someone else",
      "fact1.k": "Date",
      "fact1.h": "9 November 2026",
      "fact1.v": "Monday · Prishtina",
      "fact2.k": "You receive",
      "fact2.h": "Certificate",
      "fact2.v": "Hands-on class for beginners and working artists.",
      "fact3.k": "Academy",
      "fact3.v": "Students certified worldwide.",
      "steps.title": "How to reserve",
      "steps.1": "Write your name and WhatsApp number.",
      "steps.2": "Tap “Reserve your spot”.",
      "steps.3": "We confirm your spot on WhatsApp. Space is limited.",
      "wa.hello": "Hello Sellma Academy,",
      "wa.want": "I want to reserve my spot for the Prishtina workshop, 9 November 2026.",
      "wa.name": "Name",
      "wa.phone": "Phone",
      "wa.city": "City",
      "wa.level": "Level",
      "wa.ig": "Instagram",
      "wa.beginner": "Beginner",
      "wa.pro": "I already work",
    },
  };

  let lang = localStorage.getItem("sellma-lang") === "en" ? "en" : "sq";

  function t(key) {
    return (strings[lang] && strings[lang][key]) || strings.sq[key] || key;
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = lang === "en"
      ? "Reserve your spot · Sellma Academy · Prishtina 9 November 2026"
      : "Rezervo vendin · Sellma Academy · Prishtinë 9 Nëntor 2026";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll(".lang__btn").forEach((btn) => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    if (error && !error.hidden) error.textContent = t("form.need");
  }

  document.querySelectorAll(".hero__cta, .dock").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById("register");
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#register");
    });
  });

  document.querySelectorAll(".lang__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = btn.dataset.lang === "en" ? "en" : "sq";
      localStorage.setItem("sellma-lang", lang);
      applyLang();
    });
  });

  const form = document.getElementById("bookForm");
  const error = document.getElementById("formError");
  const success = document.getElementById("success");
  const waLink = document.getElementById("waLink");

  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function message(data) {
    const level = data.level === "pro" ? t("wa.pro") : t("wa.beginner");
    const lines = [
      t("wa.hello"),
      t("wa.want"),
      "",
      `${t("wa.name")}: ${data.name}`,
      `${t("wa.phone")}: ${data.phone}`,
    ];
    if (data.city) lines.push(`${t("wa.city")}: ${data.city}`);
    lines.push(`${t("wa.level")}: ${level}`);
    if (data.instagram) lines.push(`${t("wa.ig")}: ${data.instagram}`);
    return lines.join("\n");
  }

  function waUrl(text) {
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.hidden = true;

    const data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      city: form.city.value.trim(),
      instagram: form.instagram.value.trim(),
      level: form.level.value,
      website: form.website.value.trim(),
    };

    if (data.name.length < 2 || digits(data.phone).length < 8) {
      error.textContent = t("form.need");
      error.hidden = false;
      return;
    }

    const text = message(data);
    const url = waUrl(text);
    waLink.href = url;

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;

    try {
      await fetch("book.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      /* WhatsApp still carries the request if the server is offline. */
    }

    form.hidden = true;
    success.hidden = false;
    form.closest(".card").classList.add("is-done");
    button.disabled = false;
    window.open(url, "_blank", "noopener");
  });

  document.getElementById("again").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    form.closest(".card").classList.remove("is-done");
    form.name.focus();
  });

  const dockTargets = [document.querySelector(".hero__cta"), document.querySelector(".card")].filter(Boolean);
  if (dockTargets.length && "IntersectionObserver" in window) {
    const seen = new Set();
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) seen.add(entry.target);
        else seen.delete(entry.target);
      });
      document.body.classList.toggle("form-in-view", seen.size > 0);
    }, { threshold: 0.15 });
    dockTargets.forEach((target) => watcher.observe(target));
  }

  applyLang();
})();
