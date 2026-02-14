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
});
