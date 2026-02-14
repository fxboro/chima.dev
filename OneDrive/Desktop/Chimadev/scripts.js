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
});
