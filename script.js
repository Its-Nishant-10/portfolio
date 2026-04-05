"use strict";

const formspree_url = "https://formspree.io/f/xdalqqgo";
const typewriter_phrases = [
  "I Love Building Things for Fun !!",
  "I Enjoy Taking Things Apart — not to Destroy, but to understand.",
  "Creating Something out of Mess is my Thing 🤓.",
];

/* ─── Console Easter Egg ─── */
console.log(
  "%c NN ",
  "font-size:40px;font-weight:900;background:#FFE000;color:#0A0A0A;padding:6px 12px;border:3px solid #0A0A0A;"
);
console.log("%cHey curious dev 👋  You found the console.", "font-weight:700;color:#1d4ed8;");
console.log(
  "%cThings worth knowing: try the Konami Code ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️ B A",
  "color:#15803d;font-style:italic;"
);
console.log("%cBuilt with love, caffeine, and way too many CSS variables.", "color:#888;");

/* ─── Utility ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const is_touch = () => window.matchMedia("(hover: none)").matches;
const reduce_motion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {

  /* ─── 1. Footer year ─── */
  const yr = $("#footer_year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ─── 2. Scroll progress + back-to-top ─── */
  const progress_bar = $("#scroll_progress");
  const back_to_top_btn = $("#back_to_top");

  const on_scroll = () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (progress_bar) progress_bar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + "%";
    if (back_to_top_btn) back_to_top_btn.classList.toggle("visible", st > 320);
  };
  window.addEventListener("scroll", on_scroll, { passive: true });
  on_scroll();
  back_to_top_btn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ─── 3. Typewriter ─── */
  const tw_el = $("#typewriter_text");
  if (tw_el) {
    let pi = 0, ci = 0, del = false;
    const TYPE = 68, DEL = 42, PAUSE_END = 1800, PAUSE_START = 300;
    const tick = () => {
      const phrase = typewriter_phrases[pi];
      if (del) ci--; else ci++;
      tw_el.textContent = phrase.slice(0, ci);
      let d = del ? DEL : TYPE;
      if (!del && ci === phrase.length) { d = PAUSE_END; del = true; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % typewriter_phrases.length; d = PAUSE_START; }
      setTimeout(tick, d);
    };
    setTimeout(tick, PAUSE_START);
  }

  /* ─── 4. Active nav on scroll ─── */
  const sections = $$("main section[id]");
  const nav_links = $$(".nav_link");
  new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting)
        nav_links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }),
    { rootMargin: "-40% 0px -55% 0px" }
  ).observe; // apply per section
  const sect_obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting)
        nav_links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    }),
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach(s => sect_obs.observe(s));

  /* ─── 5. Hamburger menu ─── */
  const ham = $("#hamburger");
  const nav_ul = $("#nav_links");
  if (ham && nav_ul) {
    ham.addEventListener("click", () => {
      const open = nav_ul.classList.toggle("open");
      ham.classList.toggle("open", open);
      ham.setAttribute("aria-expanded", String(open));
    });
    $$(".nav_link", nav_ul).forEach(l => l.addEventListener("click", () => {
      nav_ul.classList.remove("open");
      ham.classList.remove("open");
      ham.setAttribute("aria-expanded", "false");
    }));
  }

  /* ─── 6. Project filter ─── */
  const filter_btns = $$(".filter_btn");
  const cards = $$(".project_card");
  if (filter_btns.length && cards.length) {
    const apply = (sel) => {
      let n = 0;
      cards.forEach(c => {
        const show = (sel === "all" || c.dataset.category === sel) && n < 99;
        if (show) { n++; c.classList.remove("hidden"); c.style.animation = "none"; void c.offsetHeight; c.style.animation = ""; }
        else c.classList.add("hidden");
      });
    };
    filter_btns.forEach(b => b.addEventListener("click", () => {
      filter_btns.forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      apply(b.dataset.filter);
    }));
    apply($(".filter_btn.active")?.dataset.filter || "all");
  }

  /* ─── 7. Project image carousel ─── */
  $$(".card_image[data-images]").forEach(wrap => {
    const images = wrap.dataset.images.split("|").filter(Boolean);
    if (images.length < 2) { wrap.querySelector(".carousel_ctrl")?.remove(); return; }
    const img = $(".card_img", wrap);
    const dots = $$(".cdot", wrap);
    let cur = 0, timer = null;
    const show = i => {
      img.style.opacity = "0";
      setTimeout(() => { img.src = images[i]; img.style.opacity = "1"; }, 180);
      dots.forEach((d, j) => d.classList.toggle("active", j === i));
      cur = i;
    };
    const adv = () => show((cur + 1) % images.length);
    $(".c_prev", wrap)?.addEventListener("click", e => { e.stopPropagation(); show((cur - 1 + images.length) % images.length); });
    $(".c_next", wrap)?.addEventListener("click", e => { e.stopPropagation(); adv(); });
    dots.forEach((d, i) => d.addEventListener("click", e => { e.stopPropagation(); show(i); }));
    const card = wrap.closest(".project_card");
    card?.addEventListener("mouseenter", () => { timer = setInterval(adv, 2200); });
    card?.addEventListener("mouseleave", () => clearInterval(timer));
  });

  /* ─── 8. Skill bars (scroll-triggered) ─── */
  const skill_bars = $$(".skill_bar");
  if (skill_bars.length) {
    let done = false;
    new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !done) { done = true; skill_bars.forEach(b => requestAnimationFrame(() => { b.style.width = (b.dataset.width || 0) + "%"; })); } },
      { threshold: 0.3 }
    ).observe($("#skills") || skill_bars[0]);
  }

  /* ─── 9. Staggered fade-in reveal ─── */
  const stagger_groups = {
    ".project_card:not(.hidden)": 80,
    ".about_chip": 60,
    ".sticky_note": 100,
    ".tool_tag": 30,
    ".strip_item": 90,
    ".contact_row": 70,
    ".social_icon": 50,
  };
  const generic_reveals = $$(".about_grid, .fun_facts, .skills_dark_grid, .coding_split, .contact_layout, .hero_strip");

  const reveal_obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is_visible");

      /* stagger children if this element is a container */
      Object.entries(stagger_groups).forEach(([sel, delay]) => {
        const children = $$(sel, e.target);
        if (!children.length) return;
        children.forEach((el, i) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(24px)";
          el.style.transition = "opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, i * delay);
        });
      });
      reveal_obs.unobserve(e.target);
    }),
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
  );
  generic_reveals.forEach(el => { el.classList.add("fade_in"); reveal_obs.observe(el); });

  /* ─── 10. Counter animation (strip stats) ─── */
  const count_up = (el, target, suffix = "", duration = 900) => {
    if (reduce_motion()) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const strip = $(".hero_strip");
  if (strip) {
    let counted = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted) {
        counted = true;
        const items = $$(".strip_item strong", strip);
        // [3 Projects, 4+ Languages, 2+ Years, ∞ Curiosity]
        const targets = [3, 4, 2];
        const suffixes = ["", "+", "+"];
        items.forEach((el, i) => {
          if (i < targets.length) {
            const icon = el.querySelector("i");
            const icon_html = icon ? icon.outerHTML + " " : "";
            const num_span = document.createElement("span");
            el.innerHTML = icon_html;
            el.appendChild(num_span);
            count_up(num_span, targets[i], suffixes[i]);
          }
        });
      }
    }, { threshold: 0.5 }).observe(strip);
  }

  /* ─── 11. 3D card tilt on hover (desktop) ─── */
  if (!is_touch()) {
    $$(".project_card, .profile_card").forEach(card => {
      card.addEventListener("mousemove", e => {
        if (reduce_motion()) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translate(-3px,-3px) rotateY(${clamp(x * 8, -6, 6)}deg) rotateX(${clamp(-y * 6, -5, 5)}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.4s ease, box-shadow 0.18s ease";
        setTimeout(() => { card.style.transition = ""; }, 400);
      });
    });
  }

  /* ─── 12. Magnetic buttons (hero CTA) ─── */
  if (!is_touch()) {
    $$(".hero_cta .btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        if (reduce_motion()) return;
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
        btn.style.transform = `translate(${clamp(dx, -8, 8)}px, ${clamp(dy, -6, 6)}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ─── 13. Ripple on btn/filter click ─── */
  const add_ripple = (el) => {
    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.addEventListener("click", e => {
      if (reduce_motion()) return;
      const r = el.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const dot = document.createElement("span");
      dot.className = "ripple_dot";
      Object.assign(dot.style, {
        width: size + "px", height: size + "px",
        left: (e.clientX - r.left - size / 2) + "px",
        top: (e.clientY - r.top - size / 2) + "px",
      });
      el.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    });
  };
  $$(".btn, .filter_btn, .social_icon, .nav_link").forEach(add_ripple);

  /* ─── 14. Sticky notes: click to wobble, drag on desktop ─── */
  $$(".sticky_note").forEach(note => {
    let base_rot = parseFloat(note.style.getPropertyValue("--rot")) || 0;

    /* click wobble */
    note.addEventListener("click", () => {
      if (reduce_motion()) return;
      note.classList.add("note_wobble");
      note.addEventListener("animationend", () => note.classList.remove("note_wobble"), { once: true });
    });

    /* drag */
    if (!is_touch()) {
      let dragging = false, ox = 0, oy = 0, sx = 0, sy = 0;
      note.style.cursor = "grab";
      note.addEventListener("mousedown", e => {
        dragging = true;
        note.style.cursor = "grabbing";
        note.style.zIndex = "50";
        note.style.transition = "box-shadow 0.1s";
        note.style.boxShadow = "10px 10px 0 var(--black)";
        sx = e.clientX; sy = e.clientY;
        ox = note.offsetLeft; oy = note.offsetTop;
        note.style.position = "relative";
        e.preventDefault();
      });
      window.addEventListener("mousemove", e => {
        if (!dragging) return;
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        note.style.left = ox + dx + "px";
        note.style.top = oy + dy + "px";
      });
      window.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        note.style.cursor = "grab";
        note.style.zIndex = "";
        note.style.boxShadow = "";
        note.style.transition = "";
      });
    }
  });

  /* ─── 15. Cursor trail (desktop, no reduced motion) ─── */
  if (!is_touch() && !reduce_motion()) {
    const trail = document.createElement("div");
    trail.id = "cursor_trail";
    document.body.appendChild(trail);

    let tx = -100, ty = -100, cx = -100, cy = -100;
    window.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; }, { passive: true });

    (function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      trail.style.transform = `translate(${cx - 6}px, ${cy - 6}px)`;
      requestAnimationFrame(loop);
    })();

    /* hide/show on interactive elements */
    $$("a, button, .sticky_note, .project_card, .filter_btn").forEach(el => {
      el.addEventListener("mouseenter", () => trail.classList.add("trail_large"));
      el.addEventListener("mouseleave", () => trail.classList.remove("trail_large"));
    });
  }

  /* ─── 16. Smooth anchor scroll ─── */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ─── 17. LeetCode stats ─── */
  (async () => {
    try {
      const res = await fetch("https://leetcode-api-faisalshohag.vercel.app/its_nishant_10");
      if (!res.ok) throw new Error();
      const { totalSolved, easySolved, mediumSolved, hardSolved,
        totalQuestions, totalEasy, totalMedium, totalHard } = await res.json();

      const lc = $("#lc_total");
      if (lc) lc.innerHTML = `${totalSolved}<span style="font-size:0.5em;opacity:0.6;font-weight:500;"> / ${totalQuestions}</span>`;

      const set = (count_id, bar_id, solved, total) => {
        const c = $("#" + count_id); if (c) c.textContent = `${solved} / ${total}`;
        const b = $("#" + bar_id); if (b) b.style.width = (total > 0 ? (solved / total) * 100 : 0) + "%";
      };
      set("lc_easy_count", "lc_easy_bar", easySolved, totalEasy);
      set("lc_medium_count", "lc_medium_bar", mediumSolved, totalMedium);
      set("lc_hard_count", "lc_hard_bar", hardSolved, totalHard);
    } catch { /* silent — fallback values in HTML */ }
  })();

  /* ─── 18. Contact form ─── */
  const form = $("#contact_form");
  const toast = $("#toast");
  const sub_btn = $("#submit_btn");

  const show_toast = (msg, duration = 4000) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), duration);
  };

  if (form) {
    const validate_field = (inp, err_el) => {
      const v = inp.value.trim();
      let msg = v ? "" : "This field is required.";
      if (!msg && inp.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        msg = "Enter a valid email address.";
      inp.classList.toggle("error", !!msg);
      err_el.textContent = msg;
      return !msg;
    };

    $$("input, textarea", form).forEach(inp => {
      inp.addEventListener("input", () => {
        inp.classList.remove("error");
        const err = $("#" + inp.id + "_error");
        if (err) err.textContent = "";
      });
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const fields = [
        ["#name", "#name_error"], ["#email", "#email_error"],
        ["#subject", "#subject_error"], ["#message", "#message_error"],
      ].map(([i, e]) => ({ inp: $(i, form), err: $(e, form) }));

      let ok = true;
      fields.forEach(f => { if (f.inp && f.err && !validate_field(f.inp, f.err)) ok = false; });
      if (!ok) { show_toast("⚠ Please fill in all fields correctly."); return; }

      sub_btn.disabled = true;
      sub_btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      try {
        const r = await fetch(formspree_url, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        show_toast(r.ok ? "✓ Sent! I'll be in touch soon." : "✕ Failed to send. Try again?");
        if (r.ok) form.reset();
      } catch {
        show_toast("✕ Network error — email me directly.");
      } finally {
        sub_btn.disabled = false;
        sub_btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message →';
      }
    });
  }

  /* ─── 19. Easter Eggs ─── */
  const show_easter = msg => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show", "toast_egg");
    setTimeout(() => toast.classList.remove("show", "toast_egg"), 4500);
  };

  /* Konami Code */
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let ki = 0;
  document.addEventListener("keydown", e => {
    ki = (e.key === KONAMI[ki]) ? ki + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (ki === KONAMI.length) { ki = 0; show_easter("🎉 Achievement Unlocked: Konami Code!\nYou clearly have good taste."); }
  });

  /* Type 'sudo' anywhere */
  let sudo_buf = "";
  document.addEventListener("keypress", e => {
    sudo_buf = (sudo_buf + e.key).slice(-4);
    if (sudo_buf === "sudo") { sudo_buf = ""; show_easter("🚧 sudo: command not found.\nThis site doesn't run on root."); }
  });

  /* Triple-click logo */
  $(".nav_logo")?.addEventListener("click", e => {
    if (e.detail === 3) show_easter("☕ coffee_count++\n\ncurrentFuel: Nishant.coffee || Error");
  });

});
