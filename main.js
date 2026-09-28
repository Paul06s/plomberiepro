// Le navigateur gère les ancres, l'historique et le défilement.
// JavaScript ne gère que le menu et la place occupée par l'en-tête.
const header = document.querySelector('header');
const navContainer = document.querySelector('.nav-container');
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const mobileQuery = window.matchMedia('(max-width: 786px)');

if (header && navContainer && burger && navMenu) {
  function setMenuOpen(open, restoreFocus = false) {
    const expanded = open && mobileQuery.matches;
    burger.setAttribute('aria-expanded', String(expanded));
    burger.setAttribute('aria-label', expanded ? 'Fermer le menu' : 'Ouvrir le menu');
    burger.classList.toggle('active', expanded);
    navMenu.classList.toggle('active', expanded);
    if (restoreFocus) burger.focus();
  }

  // Avec JS, le menu mobile peut être replié. Sans JS, ses liens restent visibles.
  header.classList.add('nav-enhanced');
  setMenuOpen(false);

  burger.addEventListener('click', () => {
    setMenuOpen(burger.getAttribute('aria-expanded') !== 'true');
  });

  header.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileQuery.matches && burger.getAttribute('aria-expanded') === 'true') {
        const section = document.querySelector(link.getAttribute('href'));
        // Le lien va disparaître : placer le focus dans la section de destination.
        section?.focus({ preventScroll: true });
      }
      setMenuOpen(false);
      // Aucun preventDefault : l'ancre HTML fait le déplacement.
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!navContainer.contains(event.target)) {
      setMenuOpen(false, mobileQuery.matches && navMenu.contains(document.activeElement));
    }
  });

  // Tab peut sortir du menu sans rester dans une liste ouverte au-dessus du contenu.
  navContainer.addEventListener('focusout', (event) => {
    if (!navContainer.contains(event.relatedTarget)) setMenuOpen(false);
  });

  // Le mode mobile est recalculé après redimensionnement, pas seulement au chargement.
  mobileQuery.addEventListener('change', () => {
    const focusedElement = document.activeElement;
    setMenuOpen(false);
    if (mobileQuery.matches && navMenu.contains(focusedElement)) burger.focus();
    if (!mobileQuery.matches && focusedElement === burger) {
      navMenu.querySelector('a')?.focus();
    }
  });

  // Le décalage des ancres suit la vraie hauteur de l'en-tête, même avec du zoom.
  function updateHeaderHeight() {
    document.documentElement.style.setProperty(
      '--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`
    );
  }
  updateHeaderHeight();
  if ('ResizeObserver' in window) {
    const headerObserver = new ResizeObserver(updateHeaderHeight);
    headerObserver.observe(header);
  } else {
    window.addEventListener('resize', updateHeaderHeight);
  }
}
