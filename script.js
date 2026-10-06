(() => {
  // Mobile Menu Toggle
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.nav-inner');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      const isEnglish = document.documentElement.lang === 'en';
      menuButton.textContent = isOpen ? (isEnglish ? 'Close' : 'Cerrar') : (isEnglish ? 'Menu' : 'Menú');
    });
  }

  // Language switch preference handler (Default: EN)
  try {
    if (!localStorage.getItem('preferred_lang')) {
      localStorage.setItem('preferred_lang', 'en');
    }
  } catch (e) {}

  const langLinks = document.querySelectorAll('.lang-switch a[data-lang]');
  langLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const selectedLang = link.getAttribute('data-lang');
      try {
        localStorage.setItem('preferred_lang', selectedLang);
      } catch (e) {
        // LocalStorage not available or restricted
      }
    });
  });

  // Universal Lightbox
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    const isEnglish = document.documentElement.lang === 'en';
    const closeText = isEnglish ? 'Close' : 'Cerrar';
    const ariaLabel = isEnglish ? 'Enlarged photograph' : 'Fotografía ampliada';
    const wrapper = document.createElement('div');
    wrapper.className = 'lightbox';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');
    wrapper.setAttribute('aria-label', ariaLabel);
    wrapper.innerHTML = `
      <button class="lightbox-close" type="button">${closeText}</button>
      <div class="lightbox-inner">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(wrapper);
    lightbox = wrapper;
  }

  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let lastTrigger = null;

  const openLightbox = (src, alt, caption, triggerEl) => {
    if (!src) return;
    lastTrigger = triggerEl || null;
    lightboxImage.src = src;
    lightboxImage.alt = alt || '';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeButton) closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxCaption.textContent = '';
    document.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  };

  // 1. Photo gallery buttons
  const photoButtons = document.querySelectorAll('[data-lightbox-src]');
  photoButtons.forEach((button) => {
    button.addEventListener('click', () => {
      openLightbox(
        button.dataset.lightboxSrc,
        button.dataset.lightboxAlt || '',
        button.dataset.lightboxCaption || '',
        button
      );
    });
  });

  // 2. Article Hero & Body Figures
  const articleImages = document.querySelectorAll('.article-hero img, .article-body figure img, .article-body > img');
  articleImages.forEach((img) => {
    // Ignore images inside link wrappers (cards/related)
    if (img.closest('a')) return;

    img.addEventListener('click', () => {
      let caption = '';
      const figure = img.closest('figure');
      if (figure) {
        const figcap = figure.querySelector('figcaption');
        if (figcap) caption = figcap.textContent.trim();
      }
      if (!caption && img.alt) {
        caption = img.alt.trim();
      }
      openLightbox(img.currentSrc || img.src, img.alt || '', caption, img);
    });
  });

  // Lightbox interactions
  if (closeButton) {
    closeButton.addEventListener('click', closeLightbox);
  }
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.classList.contains('lightbox-inner')) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
})();
