// ========================================
// CLEM&NATHA — Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // Navigation au scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Toggle menu mobile
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      nav.classList.toggle('menu-open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
        nav.classList.remove('menu-open');
      });
    });
  }

  // Reveal au scroll
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  // Filtres galerie
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const tags = item.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });

  // Sélection style devis
  const stylePicks = document.querySelectorAll('.style-pick');
  stylePicks.forEach(pick => {
    pick.addEventListener('click', () => {
      const isActive = pick.classList.contains('active');
      pick.classList.toggle('active');
      pick.setAttribute('aria-checked', (!isActive).toString());
    });
    pick.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pick.click(); }
    });
  });

  // Radio pills (type projet)
  const radioGroups = document.querySelectorAll('.radio-group');
  radioGroups.forEach(group => {
    const pills = group.querySelectorAll('.radio-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-checked', 'false'); });
        pill.classList.add('active');
        pill.setAttribute('aria-checked', 'true');
      });
      pill.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); pill.click(); }
      });
    });
  });

  // Upload zone (visuel)
  const uploadZones = document.querySelectorAll('.upload-zone');
  uploadZones.forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    zone.addEventListener('click', () => {
      if (input) input.click();
    });
    if (input) {
      input.addEventListener('change', () => {
        if (input.files.length > 0) {
          const p = zone.querySelector('p');
          if (p) p.textContent = `${input.files.length} fichier(s) sélectionné(s)`;
        }
      });
      ['dragover','dragleave','drop'].forEach(ev => {
        zone.addEventListener(ev, e => {
          e.preventDefault();
          if (ev === 'dragover') zone.style.borderColor = 'var(--vermillon)';
          if (ev === 'dragleave') zone.style.borderColor = '';
          if (ev === 'drop') {
            zone.style.borderColor = '';
            input.files = e.dataTransfer.files;
            input.dispatchEvent(new Event('change'));
          }
        });
      });
    }
  });

  // Formulaire devis — Web3Forms
  const devisForm = document.querySelector('form.form-card');
  if (devisForm) {
    // Sync radio pills → champ caché type_projet
    const radioGroup = devisForm.querySelector('.radio-group');
    if (radioGroup) {
      radioGroup.querySelectorAll('.radio-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          const hidden = devisForm.querySelector('input[name="type_projet"]');
          if (hidden) hidden.value = pill.textContent.trim();
        });
      });
    }

    // Sync style-picks → champ caché styles_souhaites
    const stylePickEls = devisForm.querySelectorAll('.style-pick');
    const updateStyles = () => {
      const hidden = devisForm.querySelector('input[name="styles_souhaites"]');
      if (!hidden) return;
      const sel = [...stylePickEls]
        .filter(p => p.classList.contains('active'))
        .map(p => p.querySelector('span').textContent.trim());
      hidden.value = sel.length ? sel.join(', ') : 'Non précisé';
    };
    stylePickEls.forEach(p => p.addEventListener('click', updateStyles));

    // Synchro champs cachés avant soumission native Netlify
    devisForm.addEventListener('submit', () => {
      updateStyles();
    });
  }
});
