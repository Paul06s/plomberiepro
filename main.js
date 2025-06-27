// main.js
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isScrolling = false;

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

// Wheel scroll
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
// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});
let startY = null;
let diffY = 0;
const swipeThreshold = 60; // px (ajuste la sensibilité ici)

slidesContainer.addEventListener('touchstart', e => {
  if (e.touches.length !== 1) return; // ignore multitouch
  startY = e.touches[0].clientY;
  diffY = 0;
}, { passive: true });

slidesContainer.addEventListener('touchmove', e => {
  if (startY === null) return;
  diffY = e.touches[0].clientY - startY;
}, { passive: true });

slidesContainer.addEventListener('touchend', e => {
  if (startY === null) return;
  // Swipe vers le haut => prochaine slide
  if (diffY < -swipeThreshold && currentIndex < slides.length - 1) {
    scrollToSlide(currentIndex + 1);
  }
  // Swipe vers le bas => slide précédente
  else if (diffY > swipeThreshold && currentIndex > 0) {
    scrollToSlide(currentIndex - 1);
  }
  // reset
  startY = null;
  diffY = 0;
});

document.body.addEventListener('touchmove', function(e){
  e.preventDefault();
}, { passive: false });
