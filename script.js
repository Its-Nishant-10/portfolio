"use strict";

const formspree_url = "https://formspree.io/f/xdalqqgo";
const typewriter_phrases = [
  "I build reliable web interfaces and automation workflows.",
  "I like systems that are clear under the hood — and calm on the surface.",
  "Focused on shipping small, solid iterations.",
];

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const is_touch = () => window.matchMedia("(hover: none)").matches;
const reduce_motion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  const yr = $("#footer_year");
  if (yr) yr.textContent = new Date().getFullYear();

  const progress_bar = $("#scroll_progress");
  const back_to_top_btn = $("#back_to_top");

  const on_scroll = () => {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (progress_bar)
      progress_bar.style.width = (dh > 0 ? (st / dh) * 100 : 0) + "%";
    if (back_to_top_btn) back_to_top_btn.classList.toggle("visible", st > 320);
  };
  window.addEventListener("scroll", on_scroll, { passive: true });
  on_scroll();
  back_to_top_btn?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  const tw_el = $("#typewriter_text");
  if (tw_el) {
    let pi = 0,
      ci = 0,
      del = false;
    const TYPE = 68,
      DEL = 42,
      PAUSE_END = 1800,
      PAUSE_START = 300;
    const tick = () => {
      const phrase = typewriter_phrases[pi];
      if (del) ci--;
      else ci++;
      tw_el.textContent = phrase.slice(0, ci);
      let d = del ? DEL : TYPE;
      if (!del && ci === phrase.length) {
        d = PAUSE_END;
        del = true;
      } else if (del && ci === 0) {
        del = false;
        pi = (pi + 1) % typewriter_phrases.length;
        d = PAUSE_START;
      }
      setTimeout(tick, d);
    };
    setTimeout(tick, PAUSE_START);
  }

  const sections = $$("main section[id]");
  const nav_links = $$(".nav_link");
  const sect_obs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        nav_links.forEach((l) => {
          const active = l.getAttribute("href") === "#" + id;
          l.classList.toggle("active", active);
          if (active) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      }),
    { rootMargin: "-40% 0px -55% 0px" },
  );
  sections.forEach((s) => sect_obs.observe(s));

  const ham = $("#hamburger");
  const nav_ul = $("#nav_links");
  if (ham && nav_ul) {
    ham.addEventListener("click", () => {
      const open = nav_ul.classList.toggle("open");
      ham.classList.toggle("open", open);
      ham.setAttribute("aria-expanded", String(open));
    });
    $$(".nav_link", nav_ul).forEach((l) =>
      l.addEventListener("click", () => {
        nav_ul.classList.remove("open");
        ham.classList.remove("open");
        ham.setAttribute("aria-expanded", "false");
      }),
    );
  }

  const filter_btns = $$(".filter_btn");
  const cards = $$(".project_card");
  if (filter_btns.length && cards.length) {
    const apply = (sel) => {
      let n = 0;
      cards.forEach((c) => {
        const show = (sel === "all" || c.dataset.category === sel) && n < 99;
        if (show) {
          n++;
          c.classList.remove("hidden");
          c.style.animation = "none";
          void c.offsetHeight;
          c.style.animation = "";
        } else c.classList.add("hidden");
      });
    };
    filter_btns.forEach((b) =>
      b.addEventListener("click", () => {
        filter_btns.forEach((x) => {
          x.classList.remove("active");
          x.setAttribute("aria-pressed", "false");
        });
        b.classList.add("active");
        b.setAttribute("aria-pressed", "true");
        apply(b.dataset.filter);
      }),
    );
    filter_btns.forEach((x) =>
      x.setAttribute(
        "aria-pressed",
        x.classList.contains("active") ? "true" : "false",
      ),
    );
    apply($(".filter_btn.active")?.dataset.filter || "all");
  }

  $$(".card_image[data-images]").forEach((wrap) => {
    const images = wrap.dataset.images.split("|").filter(Boolean);
    if (images.length < 2) {
      wrap.querySelector(".carousel_ctrl")?.remove();
      return;
    }
    const img = $(".card_img", wrap);
    const dots = $$(".cdot", wrap);
    let cur = 0,
      timer = null;
    const show = (i) => {
      img.style.opacity = "0";
      setTimeout(() => {
        img.src = images[i];
        img.style.opacity = "1";
      }, 180);
      dots.forEach((d, j) => d.classList.toggle("active", j === i));
      cur = i;
    };
    const adv = () => show((cur + 1) % images.length);
    $(".c_prev", wrap)?.addEventListener("click", (e) => {
      e.stopPropagation();
      show((cur - 1 + images.length) % images.length);
    });
    $(".c_next", wrap)?.addEventListener("click", (e) => {
      e.stopPropagation();
      adv();
    });
    dots.forEach((d, i) =>
      d.addEventListener("click", (e) => {
        e.stopPropagation();
        show(i);
      }),
    );
    const card = wrap.closest(".project_card");
    card?.addEventListener("mouseenter", () => {
      clearInterval(timer);
      timer = setInterval(adv, 2200);
    });
    card?.addEventListener("mouseleave", () => {
      clearInterval(timer);
      timer = null;
    });
  });

  const skill_bars = $$(".skill_bar");
  if (skill_bars.length) {
    let done = false;
    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done) {
          done = true;
          skill_bars.forEach((b) =>
            requestAnimationFrame(() => {
              b.style.width = (b.dataset.width || 0) + "%";
            }),
          );
        }
      },
      { threshold: 0.3 },
    ).observe($("#skills") || skill_bars[0]);
  }

  const stagger_groups = {
    ".project_card:not(.hidden)": 70,
    ".about_chip": 55,
    ".tool_tag": 28,
    ".strip_item": 75,
    ".contact_row": 60,
    ".social_icon": 45,
  };
  const generic_reveals = $$(
    ".about_grid, .skills_dark_grid, .coding_split, .contact_layout, .hero_strip",
  );

  const reveal_ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const reveal_obs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is_visible");
        if (reduce_motion()) {
          reveal_obs.unobserve(e.target);
          return;
        }

        Object.entries(stagger_groups).forEach(([sel, delay]) => {
          const children = $$(sel, e.target);
          if (!children.length) return;
          const pinClearMs = 560;
          children.forEach((el, i) => {
            const rot =
              getComputedStyle(el).getPropertyValue("--pin-rot").trim() ||
              "0deg";
            el.style.opacity = "0";
            el.style.transform = `translateY(18px) rotate(${rot})`;
            el.style.transition = `opacity 0.55s ${reveal_ease}, transform 0.55s ${reveal_ease}`;
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = `translateY(0) rotate(${rot})`;
            }, i * delay);
          });
        });
        reveal_obs.unobserve(e.target);
      }),
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );
  generic_reveals.forEach((el) => {
    el.classList.add("fade_in");
    reveal_obs.observe(el);
  });

  const count_up = (el, target, suffix = "", duration = 900) => {
    if (reduce_motion()) {
      el.textContent = target + suffix;
      return;
    }
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
    new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !counted) {
          counted = true;
          const items = $$(".strip_item strong", strip);
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
      },
      { threshold: 0.5 },
    ).observe(strip);
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  (async () => {
    try {
      const res = await fetch(
        "https://leetcode-api-faisalshohag.vercel.app/its_nishant_10",
      );
      if (!res.ok) throw new Error();
      const {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        totalQuestions,
        totalEasy,
        totalMedium,
        totalHard,
      } = await res.json();

      const lc = $("#lc_total");
      if (lc)
        lc.innerHTML = `${totalSolved}<span style="font-size:0.5em;opacity:0.6;font-weight:500;"> / ${totalQuestions}</span>`;

      const set = (count_id, bar_id, solved, total) => {
        const c = $("#" + count_id);
        if (c) c.textContent = `${solved} / ${total}`;
        const b = $("#" + bar_id);
        if (b) b.style.width = (total > 0 ? (solved / total) * 100 : 0) + "%";
      };
      set("lc_easy_count", "lc_easy_bar", easySolved, totalEasy);
      set("lc_medium_count", "lc_medium_bar", mediumSolved, totalMedium);
      set("lc_hard_count", "lc_hard_bar", hardSolved, totalHard);
    } catch {}
  })();

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

    $$("input, textarea", form).forEach((inp) => {
      inp.addEventListener("input", () => {
        inp.classList.remove("error");
        const err = $("#" + inp.id + "_error");
        if (err) err.textContent = "";
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = [
        ["#name", "#name_error"],
        ["#email", "#email_error"],
        ["#subject", "#subject_error"],
        ["#message", "#message_error"],
      ].map(([i, er]) => ({ inp: $(i, form), err: $(er, form) }));

      let ok = true;
      fields.forEach((f) => {
        if (f.inp && f.err && !validate_field(f.inp, f.err)) ok = false;
      });
      if (!ok) {
        show_toast("Please fill in all fields correctly.");
        return;
      }

      sub_btn.disabled = true;
      sub_btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
      try {
        const r = await fetch(formspree_url, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        show_toast(
          r.ok
            ? "Sent. I will get back to you soon."
            : "Could not send. Try again or email directly.",
        );
        if (r.ok) form.reset();
      } catch {
        show_toast("Network error — email me directly.");
      } finally {
        sub_btn.disabled = false;
        sub_btn.innerHTML =
          '<i class="fa-solid fa-paper-plane"></i> Send Message →';
      }
    });
  }
});
