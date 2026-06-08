const GITHUB_USERNAME = "adibmz";
const GITHUB_API = "https://api.github.com";

// Language colors (subset of GitHub linguist colors)
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  EJS: "#a91e50",
  PHP: "#4F5D95",
  Python: "#3572A5",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Blade: "#f7523f",
  Vue: "#41b883",
  SCSS: "#c6538c",
};

// ===== Cursor glow (ambient light follows mouse) =====
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow || window.matchMedia("(max-width: 768px)").matches) return;

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow with lerp for that premium feel
  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== Scroll reveal animation =====
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ===== Header scroll effect =====
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle("scrolled", window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== Smooth number counter animation =====
function animateCounter(el, target) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(from + (target - from) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ===== Fetch GitHub profile =====
async function fetchProfile() {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
    if (!res.ok) return;
    const user = await res.json();

    const nameEl = document.getElementById("name");
    const bioEl = document.getElementById("bio");
    const avatarEl = document.getElementById("avatar");
    const reposEl = document.getElementById("repos-count");
    const followersEl = document.getElementById("followers-count");
    const followingEl = document.getElementById("following-count");

    if (user.name && nameEl) {
      // Preserve the accent span on last name
      const parts = user.name.split(" ");
      if (parts.length >= 2) {
        nameEl.innerHTML = `${parts[0]} <span class="accent">${parts.slice(1).join(" ")}</span>`;
      } else {
        nameEl.textContent = user.name;
      }
    }
    if (user.bio && bioEl) bioEl.textContent = user.bio;
    if (user.avatar_url && avatarEl) avatarEl.src = user.avatar_url;

    // Animate counters
    if (reposEl) animateCounter(reposEl, user.public_repos ?? 0);
    if (followersEl) animateCounter(followersEl, user.followers ?? 0);
    if (followingEl) animateCounter(followingEl, user.following ?? 0);
  } catch (err) {
    console.warn("Could not fetch GitHub profile:", err);
  }
}

// ===== Fetch GitHub repos =====
async function fetchRepos() {
  const grid = document.getElementById("projects-grid");
  const loading = document.getElementById("projects-loading");

  try {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`
    );
    if (!res.ok) throw new Error("Failed to fetch repos");
    const repos = await res.json();

    // Filter out profile repo and forks, sort by stars then updated
    const filtered = repos
      .filter((r) => !r.fork && r.name !== GITHUB_USERNAME && r.name !== `${GITHUB_USERNAME}.github.io`)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));

    if (loading) loading.remove();

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="loading">No public projects found.</p>';
      return;
    }

    filtered.forEach((repo, index) => {
      const card = document.createElement("div");
      card.className = "project-card reveal";
      card.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;

      const langDot = repo.language
        ? `<span><span class="lang-dot" style="background:${LANG_COLORS[repo.language] || "#71717a"}"></span> ${repo.language}</span>`
        : "";

      const topics = (repo.topics || [])
        .slice(0, 5)
        .map((t) => `<span class="topic-tag">${t}</span>`)
        .join("");

      card.innerHTML = `
        <div class="project-card-header">
          <h3 class="project-card-title">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
          </h3>
          <svg class="project-card-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
        ${repo.description ? `<p class="project-card-desc">${repo.description}</p>` : ""}
        ${topics ? `<div class="project-card-topics">${topics}</div>` : ""}
        <div class="project-card-meta">
          ${langDot}
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      `;

      grid.appendChild(card);
    });

    // Re-observe new project cards
    initScrollReveal();
  } catch (err) {
    console.warn("Could not fetch GitHub repos:", err);
    if (loading) loading.textContent = "Unable to load projects. Please visit my GitHub profile directly.";
  }
}

// ===== Mobile nav toggle =====
function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("active");
    });

    // Close menu when a link is clicked
    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("active");
      });
    });
  }
}

// ===== Active nav link tracking =====
function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute("href") === `#${id}`
              ? "var(--color-text)"
              : "";
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((section) => observer.observe(section));
}

// ===== Set year =====
function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initNav();
  initHeaderScroll();
  initCursorGlow();
  initScrollReveal();
  initActiveNav();
  fetchProfile();
  fetchRepos();
});
