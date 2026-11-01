document.addEventListener('DOMContentLoaded', () => {

  /* ---- Footer year ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  /* ---- Scroll reveal (fade up, with optional stagger via data-delay) ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay || 0, 10);
        setTimeout(() => e.target.classList.add('visible'), d);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- Scrollspy: highlight active nav link ---- */
  const sections = ['home', 'features', 'about', 'testimonials', 'blog', 'contact']
    .map(id => document.getElementById(id));
  const navAnchors = document.querySelectorAll('.nav-links > a, .dropdown-toggle');
  function spy() {
    const y = window.scrollY + 120;
    let current = 'home';
    sections.forEach(s => { if (s && s.offsetTop <= y) current = s.id; });
    // "Our Team" belongs to the About Us menu item
    const team = document.getElementById('team');
    if (team && team.offsetTop <= y && current === 'about') current = 'about';
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---- Testimonials slider ---- */
  const slides = document.querySelectorAll('.slide');
  const dotsWrap = document.getElementById('dots');
  const slider = document.getElementById('slider');
  let index = 0, timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('active', n === index));
    dots.forEach((d, n) => d.classList.toggle('active', n === index));
  }
  function restart() { clearInterval(timer); timer = setInterval(() => go(index + 1), 5000); }

  slider.querySelector('.prev').addEventListener('click', () => { go(index - 1); restart(); });
  slider.querySelector('.next').addEventListener('click', () => { go(index + 1); restart(); });
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  go(0); restart();

  /* ---- Contact form (front-end validation only) ---- */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('input, textarea').forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('error', bad);
      if (bad) ok = false;
    });
    if (ok) { alert('Thank you! Your message has been sent.'); form.reset(); }
  });
  form.addEventListener('input', e => e.target.classList.remove('error'));
});