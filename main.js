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
//Ancienne version sans touchend

