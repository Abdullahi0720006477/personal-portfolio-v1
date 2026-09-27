const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav-links');

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 16);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px' });

  revealItems.forEach((item) => observer.observe(item));
}

const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  themeColor.setAttribute('content', theme === 'dark' ? '#0d0e22' : '#ffffff');
};

applyTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (error) {}
});

if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.glow-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

const localTime = document.querySelector('[data-local-time]');

if (localTime) {
  const formatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
  const updateTime = () => { localTime.textContent = `${formatter.format(new Date())} local time (EAT)`; };
  updateTime();
  setInterval(updateTime, 30000);
}

const copyStatus = document.querySelector('.copy-status');

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = 'Copied';
      button.classList.add('copied');
      copyStatus.textContent = 'Email address copied to clipboard.';
    } catch (error) {
      copyStatus.textContent = `Copy failed. The address is ${button.dataset.copy}`;
    }
    setTimeout(() => {
      button.textContent = 'Copy';
      button.classList.remove('copied');
      copyStatus.textContent = '';
    }, 2200);
  });
});
