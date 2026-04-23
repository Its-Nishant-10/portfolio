'use strict';

/* ══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
function updateScrollBar() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = `${(scrolled / total) * 100}%`;
}
window.addEventListener('scroll', updateScrollBar, { passive: true });

/* ══════════════════════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════════════════════ */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  backTop?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Close on link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  }
});

/* ══════════════════════════════════════════════════════════
   ACTIVE NAV HIGHLIGHT (Intersection Observer)
══════════════════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-50% 0px -45% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ══════════════════════════════════════════════════════════
   FOOTER YEAR
══════════════════════════════════════════════════════════ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════════════════════
   LEETCODE LIVE STATS
   Tries two public APIs in order; falls back to a static
   display if both are unavailable.
══════════════════════════════════════════════════════════ */
(async function loadLeetCode() {
  const USERNAME = 'its_nishant';

  const loadingEl  = document.getElementById('lc-loading');
  const statsEl    = document.getElementById('lc-stats');
  const errorEl    = document.getElementById('lc-error');

  const totalEl    = document.getElementById('lc-total-num');
  const easyEl     = document.getElementById('lc-easy');
  const mediumEl   = document.getElementById('lc-medium');
  const hardEl     = document.getElementById('lc-hard');
  const easyBar    = document.getElementById('lc-easy-bar');
  const mediumBar  = document.getElementById('lc-medium-bar');
  const hardBar    = document.getElementById('lc-hard-bar');
  const rankEl     = document.getElementById('lc-rank');

  // ── attempt fetch from multiple endpoints ──────────────
  const ENDPOINTS = [
    {
      url  : `https://leetcode-stats-api.herokuapp.com/${USERNAME}`,
      parse: (j) => ({
        total : j.totalSolved,
        easy  : j.easySolved,
        medium: j.mediumSolved,
        hard  : j.hardSolved,
        rank  : j.ranking ?? null,
      }),
      check: (j) => typeof j.totalSolved === 'number',
    },
    {
      url  : `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`,
      parse: (j) => ({
        total : j.solvedProblem ?? j.totalSolved,
        easy  : j.easySolved   ?? 0,
        medium: j.mediumSolved ?? 0,
        hard  : j.hardSolved   ?? 0,
        rank  : j.ranking      ?? null,
      }),
      check: (j) => typeof (j.solvedProblem ?? j.totalSolved) === 'number',
    },
  ];

  let stats = null;

  for (const ep of ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res   = await fetch(ep.url, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const json = await res.json();
      if (ep.check(json)) { stats = ep.parse(json); break; }
    } catch (_) { /* try next */ }
  }

  // ── render ─────────────────────────────────────────────
  if (!stats) {
    loadingEl.style.display = 'none';
    errorEl.style.display   = 'block';
    return;
  }

  const { total, easy, medium, hard, rank } = stats;

  totalEl.textContent  = total;
  easyEl.textContent   = easy;
  mediumEl.textContent = medium;
  hardEl.textContent   = hard;

  if (rank) {
    rankEl.innerHTML = `Ranking: <strong>#${Number(rank).toLocaleString()}</strong>`;
  } else {
    rankEl.innerHTML = `Profile: <strong><a href="https://leetcode.com/u/${USERNAME}/" target="_blank"
      rel="noopener" style="color:#000;text-decoration:underline;">@${USERNAME} ↗</a></strong>`;
  }

  // ── animate bars after a short delay ──────────────────
  //   % fill = solved / approximate total per difficulty
  const CAPS = { easy: 820, medium: 1720, hard: 750 };
  setTimeout(() => {
    easyBar.style.width   = `${Math.min(100, (easy   / CAPS.easy)   * 100).toFixed(1)}%`;
    mediumBar.style.width = `${Math.min(100, (medium / CAPS.medium) * 100).toFixed(1)}%`;
    hardBar.style.width   = `${Math.min(100, (hard   / CAPS.hard)   * 100).toFixed(1)}%`;
  }, 300);

  loadingEl.style.display = 'none';
  statsEl.style.display   = 'flex';
})();

/* ══════════════════════════════════════════════════════════
   PROJECT FILTERING
══════════════════════════════════════════════════════════ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.proj-card');

// Set initial state based on default active button
const initialActiveFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'top';
projectCards.forEach(card => {
  if (card.dataset.category.includes(initialActiveFilter)) {
    card.style.display = 'flex';
  } else {
    card.style.display = 'none';
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filterBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked button
    btn.classList.add('active');

    const filterValue = btn.dataset.filter;

    // Filter projects
    projectCards.forEach(card => {
      if (filterValue === 'all' || card.dataset.category.includes(filterValue)) {
        card.style.display = 'flex';
        // Add a small animation effect
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease';
          card.style.opacity = '1';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});
