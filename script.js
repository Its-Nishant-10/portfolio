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

  const back_to_top_btn = $("#back_to_top");

  const on_scroll = () => {
    const st = window.scrollY;
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
    ".gh_repo_row": 50,
    ".lc_diff_btn": 80,
    ".currently_card": 60,
  };
  const generic_reveals = $$(
    ".about_grid, .skills_dark_grid, .coding_block_full, .contact_layout, .hero_strip",
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

  /* ── GitHub Repos ── */
  const lang_colors = {
    JavaScript: "#f1e05a",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Java: "#b07219",
    Python: "#3572A5",
    "C++": "#f34b7d",
    C: "#555555",
    TypeScript: "#2b7489",
    Shell: "#89e051",
  };

  (async () => {
    const list = $("#gh_repos_list");
    if (!list) return;
    try {
      const res = await fetch(
        "https://api.github.com/users/Its-Nishant-10/repos?sort=updated&per_page=20",
      );
      if (!res.ok) throw new Error("GitHub API error");
      const repos = await res.json();
      const filtered = repos
        .filter((r) => !r.fork && r.name !== "Its-Nishant-10")
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);
      if (!filtered.length) {
        list.innerHTML =
          '<div class="gh_repos_loading">No public repos found.</div>';
        return;
      }
      list.innerHTML = filtered
        .map((r) => {
          const lang = r.language || "";
          const color = lang_colors[lang] || "#666";
          const stars = r.stargazers_count || 0;
          return `<a href="${r.html_url}" class="gh_repo_row" target="_blank" rel="noopener" aria-label="View ${r.name} on GitHub">
            <div class="gh_repo_row_top">
              <span class="gh_repo_row_name">${r.name}</span>
              <span class="gh_repo_row_arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></span>
            </div>
            <div class="gh_repo_row_tags">
              ${lang ? `<span class="gh_repo_tag"><span class="gh_tag_dot" style="background:${color}"></span>${lang}</span>` : ""}
              ${stars > 0 ? `<span class="gh_repo_tag"><i class="fa-solid fa-star" style="color:var(--yellow)"></i> ${stars}</span>` : ""}
            </div>
          </a>`;
        })
        .join("");
    } catch {
      list.innerHTML =
        '<div class="gh_repos_loading">Could not load repos — <a href="https://github.com/Its-Nishant-10" target="_blank" rel="noopener" style="color:#39d353">view on GitHub</a></div>';
    }
  })();

  /* ── LeetCode Stats + Recent Submissions ── */
  (async () => {
    const set_btn = (id, val) => {
      const el = $("#" + id);
      if (el) el.textContent = val;
    };
    try {
      const res = await fetch(
        "https://leetcode-api-faisalshohag.vercel.app/its_nishant",
      );
      if (!res.ok) throw new Error();
      const {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        totalQuestions,
      } = await res.json();

      const lc = $("#lc_total");
      if (lc)
        lc.innerHTML = `${totalSolved}<span class="lc_total_sub"> / ${totalQuestions}</span>`;

      set_btn("lc_easy_btn_count", easySolved);
      set_btn("lc_medium_btn_count", mediumSolved);
      set_btn("lc_hard_btn_count", hardSolved);
    } catch {
      const lc = $("#lc_total");
      if (lc)
        lc.innerHTML = `0<span class="lc_total_sub"> / 0</span>`;
      set_btn("lc_easy_btn_count", 0);
      set_btn("lc_medium_btn_count", 0);
      set_btn("lc_hard_btn_count", 0);
    }
  })();

  (async () => {
    const list_el = $("#lc_recent_list");
    if (!list_el) return;
    try {
      const res = await fetch(
        "https://alfa-leetcode-api.onrender.com/its_nishant/submission?limit=5",
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      const subs = data.submission || [];
      if (!subs.length) {
        list_el.innerHTML =
          '<div class="lc_recent_empty"><i class="fa-solid fa-inbox"></i> No recent submissions yet. Start solving!</div>';
        return;
      }
      const recent = subs.slice(0, 3);
      list_el.innerHTML = recent
        .map((s) => {
          const diff = (s.difficulty || "").toLowerCase();
          const badge_cls =
            diff === "easy"
              ? "lc_recent_badge_easy"
              : diff === "medium"
                ? "lc_recent_badge_medium"
                : "lc_recent_badge_hard";
          const label = s.difficulty || "—";
          const title = s.title || s.titleSlug || "Problem";
          const time_ago = s.timestamp
            ? time_since(Number(s.timestamp) * 1000)
            : "";
          const url = s.titleSlug
            ? `https://leetcode.com/problems/${s.titleSlug}/`
            : "#";
          return `<a href="${url}" class="lc_recent_item" target="_blank" rel="noopener">
            <span class="lc_recent_badge ${badge_cls}">${label}</span>
            <span class="lc_recent_title">${title}</span>
            ${time_ago ? `<span class="lc_recent_time">${time_ago}</span>` : ""}
          </a>`;
        })
        .join("");
    } catch {
      list_el.innerHTML =
        '<div class="lc_recent_empty"><i class="fa-solid fa-inbox"></i> No recent submissions yet. Start solving!</div>';
    }
  })();

  function time_since(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    const d = Math.floor(h / 24);
    if (d < 30) return d + "d ago";
    const mo = Math.floor(d / 30);
    return mo + "mo ago";
  }

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
