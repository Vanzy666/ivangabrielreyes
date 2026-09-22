// EDIT HERE: Directional portrait assets. Keep filenames in sync with images/.
const portraitImages = {
  up: 'images/up.png',
  'upper right': 'images/upper right.png',
  right: 'images/right.png',
  'lower right': 'images/lower right.png',
  down: 'images/down.png',
  'lower left': 'images/lower left.png',
  left: 'images/left.png',
  'upper left': 'images/upper left.png',
  middle: 'images/middle.png'
};

// EDIT HERE: Persist the visitor's preferred color theme.
const themeToggle = document.querySelector('#themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('portfolio-theme', theme);
}

setTheme(initialTheme);
themeToggle.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

// EDIT HERE: Profile image follows the cursor across the whole page in eight 45-degree directions.
const portraitWrap = document.querySelector('#portraitWrap');
const profileImage = document.querySelector('#profileImage');
const directionOrder = ['right', 'lower right', 'down', 'lower left', 'left', 'upper left', 'up', 'upper right'];
let lastDirection = 'middle';

function updatePortrait(event) {
  if (portraitWrap.contains(event.target)) {
    if (lastDirection !== 'middle') {
      profileImage.src = portraitImages.middle;
      lastDirection = 'middle';
    }
    return;
  }

  const bounds = portraitWrap.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
  const normalizedAngle = (angle + 360 + 22.5) % 360;
  const direction = directionOrder[Math.floor(normalizedAngle / 45)];

  if (direction !== lastDirection) {
    profileImage.src = portraitImages[direction];
    lastDirection = direction;
  }
}

document.addEventListener('mousemove', updatePortrait);

// EDIT HERE: Keep the sidebar shortcut highlight synced with clicks and manual scrolling.
const railLinks = [...document.querySelectorAll('.rail-link')];
const portfolioSections = railLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function setActiveSection(sectionId) {
  railLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${sectionId}`;
    link.classList.toggle('active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

railLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveSection(link.getAttribute('href').slice(1));
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  },
  { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
);

portfolioSections.forEach((section) => sectionObserver.observe(section));

// EDIT HERE: Personalized in-page introduction popup.
const greetingForm = document.querySelector('#greetingForm');
const visitorNameInput = document.querySelector('#visitorName');
const greetingResult = document.querySelector('#greetingResult');

greetingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!greetingForm.checkValidity()) {
    greetingForm.classList.add('was-validated');
    return;
  }

  greetingResult.textContent = `Hi ${visitorNameInput.value.trim()} — I’m Ivan. Thanks for stopping by.`;
  greetingResult.classList.add('is-visible');
});

// EDIT HERE: Front-end-only contact feedback. Connect this form to a backend later.
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.classList.add('was-validated');
    formStatus.textContent = 'Please complete all fields with valid details.';
    return;
  }

  formStatus.textContent = 'Thanks — your message is sent and will be reviewed. I will get back to you as soon as possible.';
  contactForm.reset();
});
