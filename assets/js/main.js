/* ===========================
   MAIN SCRIPTS
   Portfolio — Harsh Pandey
=========================== */

// ── AOS Init ──
AOS.init({
  duration: 700,
  once: true,
  easing: 'ease-out-cubic',
  offset: 60
});

// ── Mobile Navigation ──
(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
})();

// ── Back to Top ──
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Active Nav Link Highlighting ──
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── Animated Stat Counters ──
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ── Skill Bar Animation ──
(function () {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();

// ── Project Filter ──
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.5s ease-out forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ── Project Modal ──
(function () {
  const overlay = document.getElementById('projectModal');
  if (!overlay) return;

  const modalBody = overlay.querySelector('.modal-body');
  const modalTitle = overlay.querySelector('.modal-title');

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.project-card-title')?.textContent || '';
      const desc = card.querySelector('.project-card-desc')?.textContent || '';
      const tags = card.querySelector('.project-card-tags')?.innerHTML || '';
      const category = card.getAttribute('data-category') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalBody) {
        modalBody.innerHTML = `
          <div style="margin-bottom:16px">
            <span class="project-tag" style="background:rgba(129,140,248,0.15);color:#818cf8;padding:5px 14px;border-radius:20px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px">${category}</span>
          </div>
          <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.8;margin-bottom:20px">${desc}</p>
          <h6 style="font-weight:700;font-size:0.88rem;margin-bottom:12px;color:var(--text-main)">Technologies Used</h6>
          <div style="display:flex;flex-wrap:wrap;gap:8px">${tags}</div>
          <div class="callout callout-blue" style="margin-top:24px">
            <i class="fas fa-info-circle callout-icon" style="color:#38bdf8"></i>
            <div>
              <div class="callout-title" style="color:#38bdf8">Live Production Project</div>
              <div class="callout-body">This project was built and deployed for a real client, handling live production traffic.</div>
            </div>
          </div>
        `;
      }
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  overlay.querySelector('.modal-close')?.addEventListener('click', () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

// ── Particles Effect (Hero) ──
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(50, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    });

    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
})();

// ── Typed Effect for Hero Subtitle ──
(function () {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const texts = [
    'Full Stack Developer',
    'SaaS Builder',
    'Business Solution Architect',
    'Deployment Specialist',
    'Technical Consultant',
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const current = texts[textIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      delay = 50;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      delay = 100;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 400; // pause before next word
    }

    setTimeout(type, delay);
  }

  type();
})();

// ── Contact Form (Visual Only) ──
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #38bdf8)';
    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
})();

// ── Theme Toggle (Light / Dark Mode) ──
(function () {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const getTheme = () => localStorage.getItem('theme') || 'dark';
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fas fa-moon';
      } else {
        icon.className = 'fas fa-sun';
      }
    }
  };

  // Initialize
  setTheme(getTheme());

  toggleBtn.addEventListener('click', () => {
    const currentTheme = getTheme();
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });
})();

// ── Preloader Safeguard ──
// The preloader is handled inline in each HTML file for instant execution.
// This safeguard ensures that if the load event has fired, the preloader is removed.
(function () {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 500);
      }
    }, 1200); // safety fallback delay
  });
})();

