// ===== Mobile Nav =====
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== Intersection Observer for Fade-in =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// ===== Load Projects =====
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  
  try {
    const res = await fetch('repos.json');
    if (!res.ok) throw new Error('Failed to load projects');
    
    const repos = await res.json();
    
    if (repos.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-secondary);">No projects found.</p>';
      return;
    }
    
    repos.forEach((repo, index) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.style.transitionDelay = `${Math.min(index * 0.1, 0.4)}s`;
      
      const topics = (repo.topics || []).slice(0, 5).map(t => `<span>${t}</span>`).join('');
      
      const linkIcon = repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" title="Live Site">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>` : '';
      
      const githubIcon = repo.html_url ? `<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" title="GitHub">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      </a>` : '';

      const titleLink = repo.html_url 
        ? `<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>`
        : (repo.homepage 
           ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer">${repo.name}</a>` 
           : repo.name);

      card.innerHTML = `
        <div class="project-header">
          <h3 class="project-title">
            ${titleLink}
          </h3>
          <div class="project-links">
            ${linkIcon}
            ${githubIcon}
          </div>
        </div>
        <p class="project-desc">${repo.description || ''}</p>
        <div class="project-topics">
          ${topics}
        </div>
      `;
      
      grid.appendChild(card);
      observer.observe(card); // Observe new dynamic elements
    });
    
  } catch (err) {
    console.error('Error loading projects:', err);
    grid.innerHTML = '<p style="color: var(--text-secondary);">Unable to load projects at this time.</p>';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  
  // Set current year dynamically in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
