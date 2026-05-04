"use strict";

const scrollBar = document.getElementById("scroll-bar");
function updateScrollBar() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) scrollBar.style.width = `${(scrolled / total) * 100}%`;
}
window.addEventListener("scroll", updateScrollBar, { passive: true });

const backTop = document.getElementById("back-top");
window.addEventListener(
  "scroll",
  () => {
    backTop?.classList.toggle("show", window.scrollY > 500);
  },
  { passive: true },
);

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", navLinks.classList.contains("open"));
});

navLinks?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (e) => {
  if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
    hamburger?.classList.remove("open");
    navLinks?.classList.remove("open");
  }
});

const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.remove("active"));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`,
        );
        active?.classList.add("active");
      }
    });
  },
  { rootMargin: "-50% 0px -45% 0px" },
);

sections.forEach((s) => navObserver.observe(s));

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

(async function loadLeetCode() {
  const USERNAME = "its_nishant";

  const loadingEl = document.getElementById("lc-loading");
  const statsEl = document.getElementById("lc-stats");
  const errorEl = document.getElementById("lc-error");
  const totalEl = document.getElementById("lc-total-num");
  const easyEl = document.getElementById("lc-easy");
  const mediumEl = document.getElementById("lc-medium");
  const hardEl = document.getElementById("lc-hard");

  const ENDPOINTS = [
    {
      url: `https://leetcode-stats-api.herokuapp.com/${USERNAME}`,
      parse: (j) => ({
        total: j.totalSolved,
        easy: j.easySolved,
        medium: j.mediumSolved,
        hard: j.hardSolved,
        rank: j.ranking ?? null,
      }),
      check: (j) => typeof j.totalSolved === "number",
    },
    {
      url: `https://alfa-leetcode-api.onrender.com/userProfile/${USERNAME}`,
      parse: (j) => ({
        total: j.solvedProblem ?? j.totalSolved,
        easy: j.easySolved ?? 0,
        medium: j.mediumSolved ?? 0,
        hard: j.hardSolved ?? 0,
        rank: j.ranking ?? null,
      }),
      check: (j) => typeof (j.solvedProblem ?? j.totalSolved) === "number",
    },
  ];

  let stats = null;

  for (const ep of ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(ep.url, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const json = await res.json();
      if (ep.check(json)) {
        stats = ep.parse(json);
        break;
      }
    } catch (_) { }
  }

  if (!stats) {
    loadingEl.style.display = "none";
    errorEl.style.display = "block";
    return;
  }

  const { total, easy, medium, hard, rank } = stats;

  if (totalEl) totalEl.textContent = total;
  if (easyEl) easyEl.textContent = easy;
  if (mediumEl) mediumEl.textContent = medium;
  if (hardEl) hardEl.textContent = hard;

  const rankBadgeEl = document.getElementById("lc-rank-badge");
  if (rankBadgeEl) {
    rankBadgeEl.textContent = rank ? `#${Number(rank).toLocaleString()}` : "—";
  }

  const heroLcEl = document.getElementById("hero-lc-num");
  if (heroLcEl) heroLcEl.textContent = total + "+";

  const rankEl = document.getElementById("lc-rank");
  if (rankEl) {
    rankEl.textContent = rank ? `#${Number(rank).toLocaleString()}` : "";
    if (rank) rankEl.classList.add("visible");
  }

  loadingEl.style.display = "none";
  statsEl.style.display = "flex";
})();

(async function loadCodeforces() {
  const CF_HANDLE = "yours_nishant";

  const cfLoading = document.getElementById("cf-loading");
  const cfStats = document.getElementById("cf-stats");
  const cfError = document.getElementById("cf-error");
  const cfTotalEl = document.getElementById("cf-total-num");
  const cfEasyEl = document.getElementById("cf-easy");
  const cfMedEl = document.getElementById("cf-medium");
  const cfHardEl = document.getElementById("cf-hard");
  const cfRatingEl = document.getElementById("cf-rating");
  const cfMaxRatingEl = document.getElementById("cf-max-rating");
  const cfRankTextEl = document.getElementById("cf-rank-text");
  const cfRankBadgeEl = document.getElementById("cf-rank-badge");
  const cfContestsEl = document.getElementById("cf-contests");
  const cfContribEl = document.getElementById("cf-contribution");

  const hide = (el) => el && (el.style.display = "none");
  const show = (el) => el && (el.style.display = "");

  async function cfFetch(url) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (!r.ok) return null;
      return await r.json();
    } catch (_) {
      clearTimeout(t);
      return null;
    }
  }

  const [infoData, ratingData, statusData] = await Promise.all([
    cfFetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`),
    cfFetch(`https://codeforces.com/api/user.rating?handle=${CF_HANDLE}`),
    cfFetch(
      `https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`,
    ),
  ]);

  if (!infoData || infoData.status !== "OK" || !infoData.result?.[0]) {
    hide(cfLoading);
    show(cfError);
    return;
  }

  const u = infoData.result[0];

  let easy = 0,
    medium = 0,
    hard = 0;
  if (statusData?.status === "OK") {
    const seen = new Set();
    for (const s of statusData.result) {
      if (s.verdict !== "OK") continue;
      const key = `${s.problem.contestId ?? ""}:${s.problem.index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = s.problem.rating ?? 0;
      if (r === 0 || r <= 1199) easy++;
      else if (r <= 1899) medium++;
      else hard++;
    }
  }
  const total = easy + medium + hard;

  if (cfTotalEl) cfTotalEl.textContent = total || "—";
  if (cfEasyEl) cfEasyEl.textContent = easy;
  if (cfMedEl) cfMedEl.textContent = medium;
  if (cfHardEl) cfHardEl.textContent = hard;

  const currentRating = u.rating;
  const maxRating = u.maxRating;
  const rank = (u.rank ?? "unrated").toLowerCase();

  if (cfRatingEl) {
    cfRatingEl.textContent = currentRating ?? "N/A";
    if (!currentRating) cfRatingEl.classList.add("unrated");
  }
  if (cfMaxRatingEl) cfMaxRatingEl.textContent = maxRating ?? "N/A";

  const displayRank = currentRating ? rank : "unrated";
  if (cfRankBadgeEl) cfRankBadgeEl.setAttribute("data-rank", displayRank);
  if (cfRankTextEl) {
    cfRankTextEl.textContent =
      displayRank === "unrated"
        ? "Unrated"
        : displayRank.charAt(0).toUpperCase() + displayRank.slice(1);
  }

  const contestCount =
    ratingData?.status === "OK" ? ratingData.result.length : "—";
  if (cfContestsEl) cfContestsEl.textContent = contestCount;
  if (cfContribEl) cfContribEl.textContent = u.contribution ?? 0;

  hide(cfLoading);
  show(cfStats);
})();

const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".proj-card");

const initialActiveFilter =
  document.querySelector(".filter-btn.active")?.dataset.filter || "all";
projectCards.forEach((card) => {
  if (card.dataset.category.includes(initialActiveFilter)) {
    card.style.display = "flex";
  } else {
    card.style.display = "none";
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    const filterValue = btn.dataset.filter;

    projectCards.forEach((card) => {
      if (
        filterValue === "all" ||
        card.dataset.category.includes(filterValue)
      ) {
        card.style.display = "flex";

        card.style.opacity = "0";
        setTimeout(() => {
          card.style.transition = "opacity 0.3s ease";
          card.style.opacity = "1";
        }, 50);
      } else {
        card.style.display = "none";
      }
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".section").forEach((section) => {
  revealObserver.observe(section);
});

(async function loadGitHubStats() {
  const USERNAME = "Its-Nishant-10";
  const reposEl = document.getElementById("gh-repos");
  const starsEl = document.getElementById("gh-stars");

  try {
    const res = await fetch(`https://api.github.com/users/${USERNAME}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (reposEl) reposEl.textContent = data.public_repos || 0;

    const reposRes = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
    );
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      const totalStars = reposData.reduce(
        (acc, repo) => acc + repo.stargazers_count,
        0,
      );
      if (starsEl) starsEl.textContent = totalStars;
    }
  } catch (e) {
    if (reposEl) reposEl.textContent = "—";
    if (starsEl) starsEl.textContent = "—";
  }
})();
