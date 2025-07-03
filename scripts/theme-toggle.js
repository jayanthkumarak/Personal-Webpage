(function() {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;

  function setTheme(mode) {
    if (mode === 'light') {
      html.setAttribute('data-theme', 'light');
    } else if (mode === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
  }

  // Apply stored preference or do nothing to let OS preference win
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    setTheme(stored);
  }

  // Toggle handler
  const button = document.getElementById('theme-toggle');
  if (button) {
    button.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }
})();