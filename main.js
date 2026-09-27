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

const progressBar = document.querySelector('.scroll-progress');

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
};

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

const counters = document.querySelectorAll('[data-count]');

const runCounter = (element) => {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => {
    counter.textContent = `0${counter.dataset.suffix || ''}`;
    counterObserver.observe(counter);
  });
}

const filterTabs = document.querySelectorAll('.filter-tab');
const filterItems = document.querySelectorAll('#work [data-category]');

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;
    filterTabs.forEach((other) => {
      const isActive = other === tab;
      other.classList.toggle('is-active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });
    filterItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !show);
      item.classList.remove('filter-in');
      if (show) {
        item.classList.add('visible');
        void item.offsetWidth;
        item.classList.add('filter-in');
      }
    });
  });
});

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const formError = contactForm.querySelector('.form-error');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.elements.name;
    const message = contactForm.elements.message;
    const missing = [name, message].filter((field) => !field.value.trim());

    [name, message].forEach((field) => field.setAttribute('aria-invalid', String(missing.includes(field))));

    if (missing.length) {
      formError.textContent = 'Please add your name and a short message.';
      missing[0].focus();
      return;
    }

    formError.textContent = '';
    const text = `Hi Abdullahi, I'm ${name.value.trim()}.\nTopic: ${contactForm.elements.topic.value}\n\n${message.value.trim()}`;
    window.open(`https://wa.me/${contactForm.dataset.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
}
