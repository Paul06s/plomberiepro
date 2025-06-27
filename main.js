// main.js
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isScrolling = false;

// Fonction de déplacement
function scrollToSlide(idx) {
  currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
  slidesContainer.style.transform = `translateY(-${currentIndex * 100}vh)`;
}

// Navigation via liens/menu
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

document.querySelectorAll('nav a, .slide-hero button').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const idx = parseInt(el.dataset.index, 10);
    scrollToSlide(idx);
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Burger menu mobile
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Wheel navigation (desktop)
window.addEventListener('wheel', e => {
  if (isScrolling) return;
  if (e.deltaY > 0 && currentIndex < slides.length - 1) {
    isScrolling = true;
    scrollToSlide(currentIndex + 1);
  } else if (e.deltaY < 0 && currentIndex > 0) {
    isScrolling = true;
    scrollToSlide(currentIndex - 1);
  }
  setTimeout(() => { isScrolling = false; }, 800);
});

// Navigation tactile verticale (swipe mobile/tablette)
let startY = null;

slidesContainer.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) return;
  startY = e.touches[0].clientY;
}, { passive: true });

slidesContainer.addEventListener('touchend', (e) => {
  if (startY === null) return;
  const endY = e.changedTouches[0].clientY;
  const deltaY = endY - startY;
  const threshold = 50;

  if (deltaY < -threshold && currentIndex < slides.length - 1 && !isScrolling) {
    isScrolling = true;
    scrollToSlide(currentIndex + 1);
    setTimeout(() => { isScrolling = false; }, 800);
  } else if (deltaY > threshold && currentIndex > 0 && !isScrolling) {
    isScrolling = true;
    scrollToSlide(currentIndex - 1);
    setTimeout(() => { isScrolling = false; }, 800);
  }
  startY = null;
});

// (Optionnel) Bloquer le scroll natif pour forcer la gestion JS du swipe
// Décommente si la page défile quand tu swipes les slides
/*
document.body.addEventListener('touchmove', function(e) {
  if (!navMenu.classList.contains('active')) {
    e.preventDefault();
  }
}, { passive: false });
*/
