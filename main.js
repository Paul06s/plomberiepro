// main.js
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isScrolling = false;

// Détection mobile
const isMobile = window.matchMedia('(max-width: 786px)').matches;

// Désactive le scroll JS et swipe sur mobile, active le scroll natif
if (!isMobile) {
  let touchStartY = 0;

  window.addEventListener('touchstart', e => {
    touchStartY = e.changedTouches[0].screenY;
  });

  window.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].screenY;
    // si on est déjà en train d’animer, on sort
    if (isScrolling) return;

    // swipe vers le haut (scroll down)
    if (touchStartY - touchEndY > 50 && currentIndex < slides.length - 1) {
      isScrolling = true;
      scrollToSlide(currentIndex + 1);
    }
    // swipe vers le bas (scroll up)
    else if (touchEndY - touchStartY > 50 && currentIndex > 0) {
      isScrolling = true;
      scrollToSlide(currentIndex - 1);
    }

    // on réactive le scroll après l’animation
    setTimeout(() => { isScrolling = false; }, 800);
  });

  // Wheel scroll
  window.addEventListener('wheel', e => {
    e.preventDefault();              // bloque le scroll natif
    if (isScrolling) return;

    if (e.deltaY > 0 && currentIndex < slides.length - 1) {
      isScrolling = true;
      scrollToSlide(currentIndex + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      isScrolling = true;
      scrollToSlide(currentIndex - 1);
    }

    setTimeout(() => { isScrolling = false; }, 800);
  }, { passive: false });
} else {
  // Sur mobile : scroll natif
  document.querySelector('.slides').style.transition = 'none';
  document.body.style.overflow = 'auto';
}

function scrollToSlide(idx) {
  currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
  slidesContainer.style.transform = `translateY(-${currentIndex * 100}vh)`;
}

// Navigation links & hero button
document.querySelectorAll('nav a, .slide-hero button').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const idx = parseInt(el.dataset.index, 10);
    scrollToSlide(idx);
    // close menu on mobile
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Burger menu toggle
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navMenu.classList.toggle('active');
});
// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});
