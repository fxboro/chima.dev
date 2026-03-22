document.addEventListener('DOMContentLoaded', () => {
  const dashTime = document.getElementById('dash-time');
  const dashTasks = document.getElementById('dash-tasks');
  const dashBookings = document.getElementById('dash-bookings');
  const dashStress = document.getElementById('dash-stress');
  const dashProgress = document.getElementById('dash-progress');
  const dashLoad = document.getElementById('dash-load');
  const themeToggle = document.getElementById('theme-toggle');

  // Populate demo dashboard values (safe, no network calls)
  try {
    if (dashTime) dashTime.textContent = '12';
    if (dashTasks) dashTasks.textContent = '35';
    if (dashBookings) dashBookings.textContent = '18';
    if (dashStress) dashStress.textContent = '↓';
    if (dashProgress) dashProgress.style.width = '66%';
    if (dashLoad) dashLoad.textContent = 'CPU: 12%';
  } catch (e) {
    // fail silently — UI is primarily static
    console.warn('dashboard init error', e);
  }

  // Theme toggle: toggles `dark` class on <html> and persists to localStorage
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      if (themeToggle) themeToggle.textContent = '☀️ Light';
    } else {
      document.documentElement.classList.add('dark');
      if (themeToggle) themeToggle.textContent = '🌙 Dark';
    }
  }

  const saved = localStorage.getItem('chima:theme') || 'dark';
  applyTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('chima:theme', next); } catch (e) {}
    });
  }

  // Mobile nav: accessible open/close + focus trap
  const mobileOpen = document.getElementById('mobile-nav-open');
  const mobileClose = document.getElementById('mobile-nav-close');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
  let _lastFocus = null;

  function trapKey(e) {
    if (!mobileNav || mobileNav.classList.contains('hidden')) return;
    if (e.key === 'Escape') {
      closeMobileNav();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(mobileNav.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function openMobileNav() {
    if (!mobileNav) return;
    _lastFocus = document.activeElement;
    mobileNav.classList.remove('hidden');
    mobileNav.setAttribute('aria-hidden', 'false');
    if (mobileOpen) mobileOpen.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const focusable = mobileNav.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    document.addEventListener('keydown', trapKey);
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('hidden');
    mobileNav.setAttribute('aria-hidden', 'true');
    if (mobileOpen) mobileOpen.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (_lastFocus && _lastFocus.focus) _lastFocus.focus();
    document.removeEventListener('keydown', trapKey);
  }

  if (mobileOpen) mobileOpen.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  // wire mobile theme toggle to reuse applyTheme and persist
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', () => {
      const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('chima:theme', next); } catch (e) {}
    });
  }

  // ── Scroll-based Navigation ──
  // Toggle .nav-scrolled on header when user scrolls past hero section
  const stickyHeader = document.querySelector('header.sticky');
  const heroSection = document.getElementById('hero');

  if (stickyHeader && heroSection) {
    const handleScroll = () => {
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      if (window.scrollY > heroBottom * 0.3) {
        stickyHeader.classList.add('nav-scrolled');
      } else {
        stickyHeader.classList.remove('nav-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load
  }

  // ── Section Reveal Animations ──
  // Use IntersectionObserver to trigger .revealed class on .reveal sections
  const revealSections = document.querySelectorAll('.reveal');

  if (revealSections.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealSections.forEach(section => revealObserver.observe(section));
  } else {
    // Fallback: show everything if no IntersectionObserver
    revealSections.forEach(section => section.classList.add('revealed'));
  }

  // ── Tech Stack Card Shuffle ──
  // Every 20 s the tool cards in #tech-stack-grid swap positions randomly.
  // Phase 1: fade-out + scale-down (250 ms)
  // Phase 2: re-order DOM, then fade each card back in with a stagger
  (function initTechStackShuffle() {
    const grid = document.getElementById('tech-stack-grid');
    if (!grid) return; // guard: element must exist

    // Detect user's motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fisher-Yates shuffle — returns a NEW shuffled array, original untouched
    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function runShuffle() {
      const cards = Array.from(grid.children);
      if (cards.length < 2) return; // nothing to shuffle

      if (reducedMotion) {
        // No animation — just silently reorder
        const shuffled = shuffleArray(cards);
        shuffled.forEach(card => grid.appendChild(card));
        return;
      }

      // Phase 1 — fade all cards out simultaneously
      cards.forEach(card => {
        card.classList.remove('tech-card-shuffle-in');
        card.style.animationDelay = '';
        card.classList.add('tech-card-shuffling');
      });

      // After the fade-out transition completes (280 ms > 250 ms transition)
      setTimeout(() => {
        // Re-order the DOM
        const shuffled = shuffleArray(cards);
        shuffled.forEach(card => grid.appendChild(card));

        // Phase 2 — fade each card back in with a small stagger
        shuffled.forEach((card, index) => {
          card.classList.remove('tech-card-shuffling');
          card.style.animationDelay = `${index * 40}ms`; // 40 ms stagger per card
          card.classList.add('tech-card-shuffle-in');
        });

        // Clean up animation class once all cards are done
        const totalDuration = 350 + shuffled.length * 40 + 50; // animation + stagger + buffer
        setTimeout(() => {
          shuffled.forEach(card => {
            card.classList.remove('tech-card-shuffle-in');
            card.style.animationDelay = '';
          });
        }, totalDuration);

      }, 280);
    }

    // Kick off the 20-second interval
    setInterval(runShuffle, 20000);
  })();
});
