class Carousel {
  constructor(element, options = {}) {
    this.container = element;
    this.options = {
      autoplayInterval: options.autoplayInterval || 5000,
      ...options
    };

    this.track = this.container.querySelector('[data-carousel-track]');
    this.prevBtn = this.container.querySelector('[data-carousel-prev]');
    this.nextBtn = this.container.querySelector('[data-carousel-next]');
    this.dots = Array.from(this.container.querySelectorAll('[data-carousel-dot]'));
    this.descriptions = Array.from(
      this.container.querySelectorAll('[data-carousel-descriptions] .carousel__description')
    );

    if (!this.track) return;

    this.originalSlides = Array.from(this.track.children);
    this.totalSlides = this.originalSlides.length;
    this.currentIndex = 0;
    this.autoplayTimer = null;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    this.setupClones();
    this.bindEvents();
    this.goTo(0, false);
    this.startAutoplay();
  }

  setupClones() {
    const firstClone = this.originalSlides[0].cloneNode(true);
    const lastClone = this.originalSlides[this.totalSlides - 1].cloneNode(true);

    firstClone.setAttribute('data-clone', 'true');
    lastClone.setAttribute('data-clone', 'true');

    this.track.appendChild(firstClone);
    this.track.insertBefore(lastClone, this.track.firstChild);

    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${1 * 100}%)`;
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoplay();
      });
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goTo(index);
        this.resetAutoplay();
      });
    });

    this.track.addEventListener('transitionend', () => {
      this.onTransitionEnd();
    });

    this.container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.container.addEventListener('touchend', (e) => this.onTouchEnd(e));
  }

  onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.hasSwiped = false;
  }

  onTouchMove(e) {
    if (!e.touches || e.touches.length !== 1 || this.hasSwiped) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    const SWIPE_THRESHOLD = 40;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    e.preventDefault();

    if (deltaX < 0) {
      this.next();
    } else {
      this.prev();
    }
    this.resetAutoplay();
    this.hasSwiped = true;
  }

  onTouchEnd() {
    this.hasSwiped = false;
  }

  goTo(index, animate = true) {
    if (this.isTransitioning) return;

    this.currentIndex = index;
    const trackIndex = index + 1;

    if (animate) {
      this.isTransitioning = true;
      this.track.style.transition = 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      this.track.style.transition = 'none';
    }

    this.track.style.transform = `translateX(-${trackIndex * 100}%)`;
    this.updateIndicators();
  }

  next() {
    if (this.isTransitioning) return;
    this.currentIndex++;
    const trackIndex = this.currentIndex + 1;

    this.isTransitioning = true;
    this.track.style.transition = 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
    this.track.style.transform = `translateX(-${trackIndex * 100}%)`;
    this.updateIndicators();
  }

  prev() {
    if (this.isTransitioning) return;
    this.currentIndex--;
    const trackIndex = this.currentIndex + 1;

    this.isTransitioning = true;
    this.track.style.transition = 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
    this.track.style.transform = `translateX(-${trackIndex * 100}%)`;
    this.updateIndicators();
  }

  onTransitionEnd() {
    this.isTransitioning = false;

    if (this.currentIndex >= this.totalSlides) {
      this.currentIndex = 0;
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(-${1 * 100}%)`;
    }

    if (this.currentIndex < 0) {
      this.currentIndex = this.totalSlides - 1;
      const trackIndex = this.currentIndex + 1;
      this.track.style.transition = 'none';
      this.track.style.transform = `translateX(-${trackIndex * 100}%)`;
    }

    this.updateIndicators();
  }

  updateIndicators() {
    const realIndex = ((this.currentIndex % this.totalSlides) + this.totalSlides) % this.totalSlides;

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === realIndex);
    });

    if (this.descriptions.length > 0) {
      this.descriptions.forEach((desc, i) => {
        desc.classList.toggle('active', i === realIndex);
      });
    }
  }

  startAutoplay() {
    if (this.options.autoplayInterval > 0) {
      this.autoplayTimer = setInterval(() => this.next(), this.options.autoplayInterval);
    }
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

/** Set your Steam App ID when the store page is live (digits only). */
const STEAM_APP_ID = '4450390';
const DEFAULT_STEAM_UTM = {
  utm_source: 'seo_main',
  utm_medium: 'lr',
  utm_content: 'ws',
};

const STEAM_LANG = {
  en: 'english',
  de: 'german',
  fr: 'french',
  es: 'spanish',
  jp: 'japanese',
  ko: 'koreana',
  ru: 'russian',
};

function getUtmParamsFromLocationSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const utm = {};
  urlParams.forEach((value, key) => {
    if (key.toLowerCase().startsWith('utm_')) {
      utm[key] = value;
    }
  });
  return utm;
}

function buildSteamHref(params, langCode) {
  const base = STEAM_APP_ID
    ? `https://store.steampowered.com/app/${STEAM_APP_ID}/`
    : 'https://store.steampowered.com/';
  const url = new URL(base);
  const steamLang = STEAM_LANG[langCode];
  if (steamLang) {
    url.searchParams.set('l', steamLang);
  }
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

const LANG_BY_FILE = {
  '': 'en',
  'index.html': 'en',
  'index-de.html': 'de',
  'index-fr.html': 'fr',
  'index-es.html': 'es',
  'index-jp.html': 'jp',
  'index-ko.html': 'ko',
  'index-ru.html': 'ru',
};

const LANG_LABELS = {
  en: { flagImg: 'assets/common/f-en.png', code: 'EN' },
  de: { flagImg: 'assets/common/f-de.png', code: 'DE' },
  fr: { flagImg: 'assets/common/f-fr.png', code: 'FR' },
  es: { flagImg: 'assets/common/f-es.png', code: 'ES' },
  jp: { flagImg: 'assets/common/f-jp.png', code: 'JP' },
  ko: { flagImg: 'assets/common/f-kr.png', code: 'KR' },
  ru: { flagImg: 'assets/common/f-ru.png', code: 'RU' },
};

function renderFlagHtml(langCode) {
  const label = LANG_LABELS[langCode];
  if (!label?.flagImg) return '';
  return `<img src="${label.flagImg}" alt="" width="24" height="24">`;
}

function renderLangLabel(container, langCode) {
  const label = LANG_LABELS[langCode];
  if (!label || !container) return;
  container.innerHTML =
    `<span class="lang-switcher__flag" aria-hidden="true">${renderFlagHtml(langCode)}</span>` +
    `<span class="lang-switcher__code">${label.code}</span>`;
}

function getCurrentLangCode() {
  let file = window.location.pathname.split('/').pop() || 'index.html';
  if (!file) file = 'index.html';
  return LANG_BY_FILE[file] || 'en';
}

function initLangSwitcher() {
  const switcher = document.querySelector('[data-lang-switcher]');
  if (!switcher) return;

  const toggle = switcher.querySelector('.lang-switcher__toggle');
  const currentLabel = switcher.querySelector('.lang-switcher__current');
  const currentCode = getCurrentLangCode();

  renderLangLabel(currentLabel, currentCode);

  switcher.querySelectorAll('.lang-switcher__link').forEach((link) => {
    if (link.dataset.lang === currentCode) {
      link.remove();
    }
  });

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = switcher.classList.toggle('lang-switcher--open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', () => {
    switcher.classList.remove('lang-switcher--open');
    toggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      switcher.classList.remove('lang-switcher--open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initSteamLinksAndUtm() {
  const fromPage = getUtmParamsFromLocationSearch();
  let stored = {};
  try {
    const s = sessionStorage.getItem('utm_params');
    if (s) stored = JSON.parse(s);
  } catch (e) {}

  let paramsForLinks;
  if (Object.keys(fromPage).length > 0) {
    paramsForLinks = { ...stored, ...fromPage };
    try {
      sessionStorage.setItem('utm_params', JSON.stringify(paramsForLinks));
    } catch (e) {}
  } else {
    try {
      sessionStorage.removeItem('utm_params');
    } catch (e) {}
    paramsForLinks = { ...DEFAULT_STEAM_UTM };
  }

  const langCode = getCurrentLangCode();
  const steamHref = buildSteamHref(paramsForLinks, langCode);
  document.querySelectorAll('[data-steam-link]').forEach((link) => {
    link.setAttribute('href', steamHref);
  });

  const utmQuery = '?' + new URLSearchParams(paramsForLinks).toString();
  document.querySelectorAll('.lang-switcher__link[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.includes('?')) {
      link.href = href + utmQuery;
    }
  });
}

function initYoutubeEmbeds() {
  document.querySelectorAll('.trailer-frame__inner iframe[src*="youtube.com/embed/"]').forEach((iframe) => {
    const src = iframe.getAttribute('src') || '';
    const match = src.match(/embed\/([^?&/]+)/);
    if (!match) return;

    const videoId = match[1];
    const container = iframe.closest('.trailer-frame__inner');
    if (!container) return;

    if (window.location.protocol === 'file:') {
      container.innerHTML =
        `<a class="trailer-frame__fallback" href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer">` +
        `<img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="">` +
        `<span class="trailer-frame__play" aria-hidden="true">&#9654;</span></a>`;
      return;
    }

    const url = new URL(`https://www.youtube.com/embed/${videoId}`);
    url.searchParams.set('rel', '0');
    url.searchParams.set('modestbranding', '1');
    if (window.location.origin && window.location.origin !== 'null') {
      url.searchParams.set('origin', window.location.origin);
    }

    iframe.setAttribute('src', url.toString());
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('loading', 'lazy');
  });
}

function initFaq() {
  document.querySelectorAll('.faq').forEach((faq) => {
    faq.classList.add('faq--accordion');

    faq.querySelectorAll('.faq__item').forEach((item) => {
      const question = item.querySelector('.faq__question');
      if (!question) return;

      question.setAttribute('tabindex', '0');
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        const isOpen = item.classList.toggle('faq__item--open');
        question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      };

      question.addEventListener('click', toggle);
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  });
}

function initSectionNav() {
  const nav = document.getElementById('section-nav');
  if (!nav) return;

  const navItems = Array.from(nav.querySelectorAll('.section-nav__item'));
  const sectionIds = navItems.map(item => item.getAttribute('href').slice(1));
  const sections = sectionIds.map(id => document.getElementById(id));

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      const navHeight = nav.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  function updateActiveNav() {
    const navHeight = nav.offsetHeight;
    const scrollY = window.scrollY + navHeight + 50;

    let activeIndex = -1;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i] && sections[i].getBoundingClientRect().top + window.scrollY <= scrollY) {
        activeIndex = i;
        break;
      }
    }

    navItems.forEach((item, i) => {
      item.classList.toggle('active', i === activeIndex);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
}

document.addEventListener('DOMContentLoaded', function() {
  initLangSwitcher();
  initSteamLinksAndUtm();

  const carousels = document.querySelectorAll('[data-carousel]');
  carousels.forEach(carousel => {
    const interval = parseInt(carousel.dataset.carouselInterval) || 5000;
    new Carousel(carousel, { autoplayInterval: interval });
  });

  initSectionNav();
  initFaq();
  initYoutubeEmbeds();
});
