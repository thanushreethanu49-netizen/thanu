/* Main site interactions and accessibility helpers */
document.addEventListener('DOMContentLoaded', () => {
  // Set copyright year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme toggle (light / dark)
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    showToast(`Theme: ${next}`);
  });

  // Initialize Lottie hero animation (if lottie is available)
  (function initLottie() {
    try {
      const lottieEl = document.getElementById('lottie-hero');
      if (!lottieEl || !window.lottie) return;
      const path = lottieEl.dataset.lottie;
      // Respect reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      window.lottie.loadAnimation({
        container: lottieEl, renderer: 'svg', loop: true, autoplay: true, path
      });
    } catch (e) {
      // silently fail — animation not critical
      console.warn('Lottie init failed', e);
    }
  })();

  // Initialize particles background (using tsParticles) — disabled on small screens
  (function initParticles() {
    try {
      if (!window.tsParticles) return;
      if (window.innerWidth < 700) return; // skip on small devices
      window.tsParticles.load('tsparticles', {
        fpsLimit: 60,
        background: { color: 'transparent' },
        particles: {
          number: { value: 40, density: { enable: true, area: 800 } },
          color: { value: '#0b76ef' },
          shape: { type: 'circle' },
          opacity: { value: 0.7 },
          size: { value: { min: 2, max: 6 } },
          links: { enable: true, distance: 140, color: '#a9d1ff', opacity: 0.15, width: 1 }
        },
        interactivity: {
          detectsOn: 'canvas', events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: false } }
        },
        detectRetina: true
      });
    } catch (e) {
      console.warn('Particles init failed', e);
    }
  })();

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    })
  });

  // Fade-in on scroll for sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('fade-in');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section, .card, .hero').forEach(el => observer.observe(el));

  // Toast helper
  function showToast(message, ms = 3500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.style.opacity = '1';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.hidden = true, 300);
    }, ms);
  }

  // Contact form submit with Node.js backend and Formspree fallback
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    // Basic client validation UI
    if (!payload.name || payload.name.length < 2) return showToast('Please enter a valid name');
    if (!payload.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.email)) return showToast('Please enter a valid email');
    if (!payload.message || payload.message.length < 10) return showToast('Message should be at least 10 characters');

    showToast('Sending...');

    // Try backend /api/contact first
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Message sent — thank you!');
        form.reset();
        return;
      }
      const json = await res.json().catch(()=>({}));
      showToast(json.error || 'Server error, falling back');
      // If backend is not available or returns error, fallback to Formspree
    } catch (err) {
      // continue to Formspree fallback
    }

    // Formspree fallback if configured via data-formspree attribute on the form
    const formspree = form.dataset.formspree;
    if (formspree && formspree.includes('formspree.io')) {
      try {
        const res2 = await fetch(formspree, { method: 'POST', body: formData });
        if (res2.ok) {
          showToast('Message sent via Formspree — thank you!');
          form.reset();
          return;
        }
        const text = await res2.text();
        throw new Error('Formspree error: ' + text);
      } catch (err2) {
        showToast('Error sending message: ' + (err2.message || err2));
        return;
      }
    }

    showToast('Unable to send message. Please email me directly.');
  });

  // Project preview modal removed to prevent empty overlay. Project cards open GitHub links directly now.
  document.querySelectorAll('.project-card').forEach(card => {
    const link = card.dataset.github || null;
    card.style.cursor = link ? 'pointer' : 'default';
    if (link) card.addEventListener('click', () => { window.open(link, '_blank', 'noopener'); });
  });

}); // DOMContentLoaded