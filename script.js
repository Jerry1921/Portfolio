/* =====================
   THEME TOGGLE
   ===================== */
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;

// Persist preference
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);

themeBtn?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'forest' ? '' : 'forest';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeBtn.setAttribute('title', next === 'forest' ? 'Switch to dark' : 'Switch to forest');
});


/* =====================
   NAV TOGGLE (mobile)
   ===================== */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle?.addEventListener('click', () => navLinks.classList.toggle('open'));

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});


/* =====================
   ACTIVE NAV LINK
   ===================== */
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');

const activateLink = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 80) current = section.id;
  });
  links.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) link.style.color = 'var(--text)';
  });
};

window.addEventListener('scroll', activateLink, { passive: true });
activateLink();


/* =====================
   SCROLL FADE-IN
   ===================== */
const fadeTargets = document.querySelectorAll(
  '.timeline-item, .project-card, .skill-group, .cert-list li, .about-grid, .contact-item'
);

fadeTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeTargets.forEach(el => observer.observe(el));


/* =====================
   IMAGE FALLBACKS
   ===================== */
document.querySelectorAll('.project-img').forEach(img => {
  img.addEventListener('error', () => img.closest('.project-image-wrap')?.classList.add('no-img'));
});
