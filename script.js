// ===== Mobile Nav =====
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

const iconMenu = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
const iconClose = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function updateMenuIcon() {
  menuBtn.innerHTML = mobileMenu.classList.contains('open') ? iconClose : iconMenu;
}

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  updateMenuIcon();
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    updateMenuIcon();
  });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ===== Active Nav Highlight =====
const sections = document.querySelectorAll('section[id]');
const desktopNavLinks = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      desktopNavLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, {
  rootMargin: '-20% 0px -75% 0px',
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

// ===== Intersection Observer for Fade-in =====
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.12
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== Card Radial Glow (Mouse Tracking) =====
function addRadialGlow(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

addRadialGlow('.glass-card');
addRadialGlow('.project-card');

// ===== Toast Notification =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  toastIcon.textContent = type === 'success' ? '✓' : '✗';
  toastText.textContent = message;
  toast.className = 'toast show ' + type;

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ===== Copy Email to Clipboard =====
const copyBtn = document.getElementById('copy-email-btn');
const copyTooltip = document.getElementById('copy-tooltip');

if (copyBtn) {
  copyBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const email = copyBtn.dataset.email;

    try {
      await navigator.clipboard.writeText(email);
      copyTooltip.classList.add('show');
      setTimeout(() => copyTooltip.classList.remove('show'), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyTooltip.classList.add('show');
      setTimeout(() => copyTooltip.classList.remove('show'), 2000);
    }
  });
}

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

      // Observe for reveal animation
      revealObserver.observe(card);

      // Add radial glow mouse tracking
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });

  } catch (err) {
    console.error('Error loading projects:', err);
    grid.innerHTML = '<p style="color: var(--text-secondary);">Unable to load projects at this time.</p>';
  }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();

  // Set current year dynamically in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Contact Form: Sanitization & Validation =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Sanitize: strip HTML tags and trim
    function sanitize(str) {
      return str
        .replace(/<[^>]*>/g, '')    // strip HTML tags
        .replace(/&/g, '&amp;')     // escape ampersands
        .replace(/</g, '&lt;')      // escape <
        .replace(/>/g, '&gt;')      // escape >
        .replace(/"/g, '&quot;')    // escape quotes
        .trim();
    }

    // Show error on a field
    function showError(fieldId, message) {
      const group = document.getElementById(fieldId).closest('.form-group');
      const errorEl = document.getElementById('error-' + fieldId.replace('contact-', ''));
      group.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
    }

    // Clear error on a field
    function clearError(fieldId) {
      const group = document.getElementById(fieldId).closest('.form-group');
      const errorEl = document.getElementById('error-' + fieldId.replace('contact-', ''));
      group.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    }

    // Sanitize phone: strip everything except digits, +, spaces, dashes, parens
    function sanitizePhone(str) {
      return str.replace(/[^\d+\-() ]/g, '').trim();
    }

    // Clear errors on input
    ['contact-name', 'contact-email', 'contact-phone', 'contact-subject', 'contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => clearError(id));
      }
    });

    // Validate all fields, returns true if valid
    function validateForm() {
      let isValid = true;
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      // Name: required, min 2 characters
      if (!name) {
        showError('contact-name', 'Name is required.');
        isValid = false;
      } else if (name.length < 2) {
        showError('contact-name', 'Name must be at least 2 characters.');
        isValid = false;
      } else {
        clearError('contact-name');
      }

      // Email: required, valid format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        showError('contact-email', 'Email is required.');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showError('contact-email', 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError('contact-email');
      }

      // Phone: optional, but if provided must be valid (7-15 digits)
      if (phone) {
        const digitsOnly = phone.replace(/\D/g, '');
        if (digitsOnly.length < 7 || digitsOnly.length > 15) {
          showError('contact-phone', 'Please enter a valid phone number (7-15 digits).');
          isValid = false;
        } else {
          clearError('contact-phone');
        }
      } else {
        clearError('contact-phone');
      }

      // Subject: required
      if (!subject) {
        showError('contact-subject', 'Subject is required.');
        isValid = false;
      } else {
        clearError('contact-subject');
      }

      // Message: required, min 10 characters
      if (!message) {
        showError('contact-message', 'Message is required.');
        isValid = false;
      } else if (message.length < 10) {
        showError('contact-message', 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        clearError('contact-message');
      }

      return isValid;
    }

    // Handle submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const submitBtn = document.getElementById('contact-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      const statusEl = document.getElementById('form-status');

      // Sanitize field values
      const nameField = document.getElementById('contact-name');
      const emailField = document.getElementById('contact-email');
      const phoneField = document.getElementById('contact-phone');
      const subjectField = document.getElementById('contact-subject');
      const messageField = document.getElementById('contact-message');

      nameField.value = sanitize(nameField.value);
      emailField.value = sanitize(emailField.value);
      phoneField.value = sanitizePhone(phoneField.value);
      subjectField.value = sanitize(subjectField.value);
      messageField.value = sanitize(messageField.value);

      // Loading state
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';
      statusEl.textContent = '';
      statusEl.className = 'form-status';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
          contactForm.reset();
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        showToast('Something went wrong. Please try emailing me directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
    });
  }
});
