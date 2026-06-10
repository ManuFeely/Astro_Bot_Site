// ===== ASTRO BOT SITE — INTERACTIVE SCRIPTS =====
 
// ===== STARS CANVAS =====
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
 
  let stars = [];
  let shootingStars = [];
  let W, H;
 
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
 
  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }
 
  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      len: Math.random() * 150 + 80,
      speed: Math.random() * 8 + 6,
      alpha: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
    });
  }
 
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
 
    // Draw stars
    stars.forEach(s => {
      s.twinkle += 0.02;
      const alpha = s.alpha * (0.7 + 0.3 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
 
    // Draw shooting stars
    shootingStars.forEach((ss, i) => {
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len);
      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len
      );
      grad.addColorStop(0, `rgba(56,189,248,${ss.alpha})`);
      grad.addColorStop(1, 'rgba(56,189,248,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
 
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= 0.012;
    });
 
    shootingStars = shootingStars.filter(ss => ss.alpha > 0);
 
    // Randomly spawn shooting stars
    if (Math.random() < 0.003) spawnShootingStar();
 
    requestAnimationFrame(draw);
  }
 
  window.addEventListener('resize', () => { resize(); createStars(200); });
  resize();
  createStars(200);
  requestAnimationFrame(draw);
})();
 
 
// ===== NAVIGATION SCROLL EFFECT =====
(function initNav() {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
})();
 
 
// ===== SCROLL REVEAL =====
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });
 
  els.forEach(el => io.observe(el));
})();
 
 
// ===== WORLD TABS =====
(function initWorldTabs() {
  const tabs = document.querySelectorAll('.world-tab');
  const panels = document.querySelectorAll('.world-panel');
 
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.world;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('world-' + target).classList.add('active');
    });
  });
})();
 
 
// ===== ANIMATED COUNTERS =====
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        const isDecimal = String(target).includes('.');
 
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
 
  counters.forEach(el => io.observe(el));
})();
 
 
// ===== CURSOR GLOW EFFECT =====
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(glow);
 
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();
 
 
// ===== PRODUCT CARD 3D TILT =====
(function initTilt() {
  const cards = document.querySelectorAll('.product-card, .mechanic-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
 
 
// ===== SMOOTH NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
 
 
// ===== NEWSLETTER FORM =====
(function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
 
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const btn = form.querySelector('.btn-primary');
    const val = input.value.trim();
    if (!val || !val.includes('@')) {
      input.style.borderColor = '#ef4444';
      input.style.boxShadow = '0 0 10px rgba(239,68,68,0.3)';
      setTimeout(() => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
      }, 2000);
      return;
    }
    btn.textContent = '✓ Подписано!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Подписаться';
      btn.style.background = '';
    }, 3000);
  });
})();
 
 
// ===== BUY BUTTON ANIMATION =====
document.querySelectorAll('.btn-buy').forEach(btn => {
  btn.addEventListener('click', function() {
    const orig = this.innerHTML;
    this.innerHTML = '🚀 Добавлено в корзину!';
    this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    this.disabled = true;
    setTimeout(() => {
      this.innerHTML = orig;
      this.style.background = '';
      this.disabled = false;
    }, 2500);
  });
});
 
 
// ===== PARALLAX HERO =====
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
    }
  });
})();