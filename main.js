// main.js
// Sélecteurs principaux
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isScrolling = false;

// Fonction de déplacement entre les slides
function scrollToSlide(idx) {
  currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
  slidesContainer.style.transform = `translateY(-${currentIndex * 100}vh)`;
}

// Navigation via les liens du menu et le bouton "Voir nos services"
document.querySelectorAll('nav a, .slide-hero button').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const idx = parseInt(el.dataset.index, 10);
    scrollToSlide(idx);
    // Ferme le menu mobile si besoin
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Navigation à la molette (desktop)
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

// Burger menu toggle
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
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

// Navigation tactile (swipe) - compatible iOS/Android/Tablette
let touchStartY = 0;
let touchEndY = 0;
let touchMoved = false;

slidesContainer.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) return; // Ignore multitouch
  touchStartY = e.touches[0].clientY;
  touchMoved = false;
}, { passive: true });

slidesContainer.addEventListener('touchmove', (e) => {
  touchMoved = true;
}, { passive: true });

slidesContainer.addEventListener('touchend', (e) => {
  if (!touchMoved) return;
  touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchEndY - touchStartY;
  const threshold = 50; // Pixels pour valider un slide

  if (Math.abs(deltaY) > threshold && !isScrolling) {
    if (deltaY < 0 && currentIndex < slides.length - 1) {
      // Swipe up = slide suivante
      isScrolling = true;
      scrollToSlide(currentIndex + 1);
    } else if (deltaY > 0 && currentIndex > 0) {
      // Swipe down = slide précédente
      isScrolling = true;
      scrollToSlide(currentIndex - 1);
    }
    setTimeout(() => { isScrolling = false; }, 800);
  }
});

// (Optionnel) Bloquer le scroll natif vertical quand on swipe les slides
// Décommente cette partie si la page scroll verticalement sur mobile
/*
document.body.addEventListener('touchmove', (e) => {
  // Permet le scroll natif si le menu burger est ouvert
  if (!navMenu.classList.contains('active')) {
    e.preventDefault();
  }
}, { passive: false });
*/
//Ancienne version sans touchend
