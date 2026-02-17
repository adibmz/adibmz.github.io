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
};

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

    if (user.name) nameEl.textContent = user.name;
    if (user.bio) bioEl.textContent = user.bio;
    if (user.avatar_url) avatarEl.src = user.avatar_url;
    reposEl.textContent = user.public_repos ?? 0;
    followersEl.textContent = user.followers ?? 0;
    followingEl.textContent = user.following ?? 0;
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

    filtered.forEach((repo) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const langDot = repo.language
        ? `<span><span class="lang-dot" style="background:${LANG_COLORS[repo.language] || "#8b949e"}"></span> ${repo.language}</span>`
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
  } catch (err) {
    console.warn("Could not fetch GitHub repos:", err);
    if (loading) loading.textContent = "Unable to load projects. Please visit my GitHub profile directly.";
  }
}

// ===== Mobile nav toggle =====
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

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

// ===== Set year =====
function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initNav();
  fetchProfile();
  fetchRepos();
});
