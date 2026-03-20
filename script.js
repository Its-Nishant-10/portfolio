"use strict";

const formspree_url = "https://formspree.io/f/xdalqqgo";
const typewriter_phrases = [
  "I Love Building Things for Fun !!",
  "I Enjoy Taking Things Apart — not to Destroy, but to understand.",
  "Creating Something out of Mess is my Thing 🤓.",
];

document.addEventListener("DOMContentLoaded", () => {
  const footer_year_el = document.getElementById("footer_year");
  if (footer_year_el) {
    footer_year_el.textContent = new Date().getFullYear();
  }

  const progress_bar = document.getElementById("scroll_progress");
  const back_to_top_btn = document.getElementById("back_to_top");

  const on_scroll = () => {
    const scroll_top = window.scrollY;
    const doc_height =
      document.documentElement.scrollHeight - window.innerHeight;

    if (progress_bar) {
      const pct = doc_height > 0 ? (scroll_top / doc_height) * 100 : 0;
      progress_bar.style.width = pct + "%";
    }

    if (back_to_top_btn) {
      if (scroll_top > 320) {
        back_to_top_btn.classList.add("visible");
      } else {
        back_to_top_btn.classList.remove("visible");
      }
    }
  };

  window.addEventListener("scroll", on_scroll, { passive: true });
  on_scroll();

  if (back_to_top_btn) {
    back_to_top_btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const typewriter_text = document.getElementById("typewriter_text");
  if (typewriter_text) {
    let phrase_index = 0;
    let char_index = 0;
    let is_deleting = false;

    const type_speed = 70;
    const delete_speed = 50;
    const pause_end = 180;
    const pause_start = 300;

    const tick_typewriter = () => {
      const current_phrase = typewriter_phrases[phrase_index];

      if (is_deleting) {
        char_index--;
      } else {
        char_index++;
      }

      typewriter_text.textContent = current_phrase.slice(0, char_index);

      let current_delay = is_deleting ? delete_speed : type_speed;

      if (!is_deleting && char_index === current_phrase.length) {
        current_delay = pause_end;
        is_deleting = true;
      } else if (is_deleting && char_index === 0) {
        is_deleting = false;

        phrase_index = (phrase_index + 1) % typewriter_phrases.length;
        current_delay = pause_start;
      }

      setTimeout(tick_typewriter, current_delay);
    };

    setTimeout(tick_typewriter, pause_start);
  }

  const page_sections = document.querySelectorAll("main section[id]");
  const navigation_links = document.querySelectorAll(".nav_link");

  const scroll_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigation_links.forEach((link) => {
            const target_id = "#" + entry.target.id;
            if (link.getAttribute("href") === target_id) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );

  page_sections.forEach((section) => scroll_observer.observe(section));

  const hamburger_btn = document.getElementById("hamburger");
  const nav_links_container = document.getElementById("nav_links");

  if (hamburger_btn && nav_links_container) {
    hamburger_btn.addEventListener("click", () => {
      const is_open = nav_links_container.classList.toggle("open");
      hamburger_btn.classList.toggle("open", is_open);
      hamburger_btn.setAttribute("aria-expanded", String(is_open));
    });

    const all_nav_links = nav_links_container.querySelectorAll(".nav_link");
    all_nav_links.forEach((link) => {
      link.addEventListener("click", () => {
        nav_links_container.classList.remove("open");
        hamburger_btn.classList.remove("open");
        hamburger_btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  const filter_buttons = document.querySelectorAll(".filter_btn");
  const project_cards = document.querySelectorAll(".project_card");

  const visible_project_limit = 4;

  if (filter_buttons.length > 0 && project_cards.length > 0) {
    const apply_project_filter = (selected_filter) => {
      let visible_count = 0;

      project_cards.forEach((card) => {
        const matches_filter =
          selected_filter === "all" ||
          card.dataset.category === selected_filter;
        const should_show =
          matches_filter && visible_count < visible_project_limit;

        if (should_show) {
          visible_count++;
          card.classList.remove("hidden");
          card.style.animation = "none";
          void card.offsetHeight;
          card.style.animation = "";
        } else {
          card.classList.add("hidden");
        }
      });
    };

    filter_buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filter_buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const selected_filter = btn.dataset.filter;
        apply_project_filter(selected_filter);
      });
    });

    const initial_active_filter =
      document.querySelector(".filter_btn.active")?.dataset.filter || "all";
    apply_project_filter(initial_active_filter);
  }

  document.querySelectorAll(".card_image[data-images]").forEach((wrap) => {
    const images = wrap.dataset.images.split("|").filter(Boolean);
    if (images.length < 2) {
      const ctrl = wrap.querySelector(".carousel_ctrl");
      if (ctrl) ctrl.remove();
      return;
    }

    const img = wrap.querySelector(".card_img");
    const dots = Array.from(wrap.querySelectorAll(".cdot"));
    const prev_btn = wrap.querySelector(".c_prev");
    const next_btn = wrap.querySelector(".c_next");
    let current = 0;
    let auto_timer = null;

    const show = (index) => {
      img.style.opacity = "0";
      setTimeout(() => {
        img.src = images[index];
        img.style.opacity = "1";
      }, 180);
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
      current = index;
    };

    const advance = () => show((current + 1) % images.length);

    prev_btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      show((current - 1 + images.length) % images.length);
    });

    next_btn?.addEventListener("click", (e) => {
      e.stopPropagation();
      advance();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        show(i);
      });
    });

    const card = wrap.closest(".project_card");
    card?.addEventListener("mouseenter", () => {
      auto_timer = setInterval(advance, 2200);
    });
    card?.addEventListener("mouseleave", () => {
      clearInterval(auto_timer);
    });
  });

  const skill_bars = document.querySelectorAll(".skill_bar");
  if (skill_bars.length > 0) {
    let has_animated = false;

    const skills_observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !has_animated) {
            has_animated = true;
            skill_bars.forEach((bar) => {
              requestAnimationFrame(() => {
                const target_width = bar.dataset.width || "0";
                bar.style.width = target_width + "%";
              });
            });
          }
        });
      },
      { threshold: 0.3 },
    );

    const skills_section = document.getElementById("skills");
    if (skills_section) {
      skills_observer.observe(skills_section);
    }
  }

  const fade_in_targets = document.querySelectorAll(
    ".about_grid, .skills_grid, .contact_grid, " +
      ".section_title, .section_eyebrow, .quicklinks_label, .quicklinks_bar, " +
      ".section_header_row",
  );

  fade_in_targets.forEach((el) => el.classList.add("fade_in"));

  const fade_in_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is_visible");
          fade_in_observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  fade_in_targets.forEach((el) => fade_in_observer.observe(el));

  const contact_form = document.getElementById("contact_form");
  const toast_element = document.getElementById("toast");
  const submit_button = document.getElementById("submit_btn");

  if (contact_form) {
    const show_toast = (message, duration_ms = 4000) => {
      if (!toast_element) return;
      toast_element.textContent = message;
      toast_element.classList.add("show");
      setTimeout(() => toast_element.classList.remove("show"), duration_ms);
    };

    const validate_input_field = (input_el, error_el) => {
      const current_val = input_el.value.trim();
      let error_message = "";

      if (!current_val) {
        error_message = "This field is required.";
      } else if (
        input_el.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(current_val)
      ) {
        error_message = "Please enter a valid email address.";
      }

      if (error_message) {
        input_el.classList.add("error");
      } else {
        input_el.classList.remove("error");
      }

      error_el.textContent = error_message;
      return !error_message;
    };

    const clear_error_on_input = (input_el) => {
      input_el.addEventListener("input", () => {
        input_el.classList.remove("error");

        const error_el = document.getElementById(input_el.id + "_error");
        if (error_el) error_el.textContent = "";
      });
    };

    const form_inputs = contact_form.querySelectorAll("input, textarea");
    form_inputs.forEach(clear_error_on_input);

    contact_form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const form_fields = [
        {
          input: contact_form.querySelector("#name"),
          error: contact_form.querySelector("#name_error"),
        },
        {
          input: contact_form.querySelector("#email"),
          error: contact_form.querySelector("#email_error"),
        },
        {
          input: contact_form.querySelector("#subject"),
          error: contact_form.querySelector("#subject_error"),
        },
        {
          input: contact_form.querySelector("#message"),
          error: contact_form.querySelector("#message_error"),
        },
      ];

      let is_form_valid = true;
      form_fields.forEach((field) => {
        if (field.input && field.error) {
          const is_valid = validate_input_field(field.input, field.error);
          if (!is_valid) is_form_valid = false;
        }
      });

      if (!is_form_valid) {
        show_toast("⚠ Please fill in all fields correctly.");
        return;
      }

      if (formspree_url.includes("YOUR_FORM_ID")) {
        show_toast("✓ Message sent! (Demo mode)");
        contact_form.reset();
        return;
      }

      submit_button.disabled = true;
      submit_button.textContent = "Sending…";

      try {
        const fetch_response = await fetch(formspree_url, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(contact_form),
        });

        if (fetch_response.ok) {
          show_toast("✓ Message sent successfully! I'll be in touch soon.");
          contact_form.reset();
        } else {
          show_toast("✕ Failed to send. Please check your details.");
        }
      } catch (err) {
        show_toast("✕ Network error — please try again or email me directly.");
      } finally {
        submit_button.disabled = false;
        submit_button.textContent = "Send Message →";
      }
    });
  }

  const all_anchor_links = document.querySelectorAll('a[href^="#"]');

  all_anchor_links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target_id = link.getAttribute("href");

      if (target_id === "#" || !target_id) return;

      const target_element = document.querySelector(target_id);
      if (target_element) {
        event.preventDefault();

        const nav_offset = 70;
        const element_top = target_element.getBoundingClientRect().top;
        const start_position = window.scrollY;
        const target_position = element_top + start_position - nav_offset;
        const distance = target_position - start_position;
        const duration = 800;
        let start_time = null;

        const ease = (t, b, c, d) => {
          t /= d / 2;
          if (t < 1) return (c / 2) * t * t * t + b;
          t -= 2;
          return (c / 2) * (t * t * t + 2) + b;
        };

        const animation_step = (current_time) => {
          if (!start_time) start_time = current_time;
          const time_elapsed = current_time - start_time;
          const run_time = Math.min(time_elapsed, duration);

          const next_y = ease(run_time, start_position, distance, duration);
          window.scrollTo(0, next_y);

          if (time_elapsed < duration) {
            requestAnimationFrame(animation_step);
          }
        };

        requestAnimationFrame(animation_step);
      }
    });
  });
  // --- LeetCode Auto-Updater ---
  const fetchLeetCodeStats = async () => {
    try {
      const response = await fetch("https://leetcode-api-faisalshohag.vercel.app/its_nishant_10");
      if (!response.ok) throw new Error("API not ok");
      const data = await response.json();

      const totalSolved = data.totalSolved;
      const easySolved = data.easySolved;
      const mediumSolved = data.mediumSolved;
      const hardSolved = data.hardSolved;

      const easyPct = totalSolved > 0 ? (easySolved / totalSolved) * 100 : 0;
      const mediumPct = totalSolved > 0 ? (mediumSolved / totalSolved) * 100 : 0;
      const hardPct = totalSolved > 0 ? (hardSolved / totalSolved) * 100 : 0;

      const lcTotal = document.getElementById("lc_total");
      if (lcTotal) lcTotal.innerHTML = `${totalSolved}<span style="font-size: 0.5em; opacity: 0.7; font-weight: 500;"> / ${data.totalQuestions}</span>`;

      const lcEasyCount = document.getElementById("lc_easy_count");
      if (lcEasyCount) lcEasyCount.textContent = `${easySolved} / ${data.totalEasy}`;
      const lcEasyBar = document.getElementById("lc_easy_bar");
      if (lcEasyBar) lcEasyBar.style.width = `${easyPct}%`;

      const lcMediumCount = document.getElementById("lc_medium_count");
      if (lcMediumCount) lcMediumCount.textContent = `${mediumSolved} / ${data.totalMedium}`;
      const lcMediumBar = document.getElementById("lc_medium_bar");
      if (lcMediumBar) lcMediumBar.style.width = `${mediumPct}%`;

      const lcHardCount = document.getElementById("lc_hard_count");
      if (lcHardCount) lcHardCount.textContent = `${hardSolved} / ${data.totalHard}`;
      const lcHardBar = document.getElementById("lc_hard_bar");
      if (lcHardBar) lcHardBar.style.width = `${hardPct}%`;

    } catch (err) {
      console.error("Failed to fetch LeetCode stats:", err);
    }
  };

  fetchLeetCodeStats();
});
