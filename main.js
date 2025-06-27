// main.js
/* const slidesContainer = document.querySelector('.slides');
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
}); */
Ancienne version sans touchend

// main.js
// Animation de bulles en fond (canvas)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let bubbles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Bubble {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * width;
    this.y = height + Math.random() * 100;
    this.radius = 2 + Math.random() * 4;
    this.speed = 1 + Math.random() * 2;
    this.alpha = 0.2 + Math.random() * 0.3;
  }
  update() {
    this.y -= this.speed;
    if (this.y < -this.radius) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

function initBubbles(count = 120) {
  bubbles = Array.from({ length: count }, () => new Bubble());
}

function animateBubbles() {
  ctx.clearRect(0, 0, width, height);
  bubbles.forEach(b => { b.update(); b.draw(); });
  requestAnimationFrame(animateBubbles);
}

initBubbles();
animateBubbles();

// Navigation one-page sans scroll
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;
let isScrolling = false;

function scrollToSlide(idx) {
  currentIndex = Math.max(0, Math.min(idx, slides.length - 1));
  slidesContainer.style.transform = `translateY(-${currentIndex * 100}vh)`;
}

const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');

// Liens de nav & bouton hero
document.querySelectorAll('nav a, .slide-hero button').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    scrollToSlide(parseInt(el.dataset.index, 10));
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Défilement molette
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

// Menu burger toggle
burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Fermer menu au clic sur un lien
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// GESTION DU SWIPE MOBILE
let touchStartY = 0;
let touchEndY = 0;
const swipeThreshold = 50;

slidesContainer.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

slidesContainer.addEventListener("touchend", (e) => {
  touchEndY = e.changedTouches[0].clientY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  if (isScrolling) return;
  const deltaY = touchStartY - touchEndY;
  if (Math.abs(deltaY) > swipeThreshold) {
    isScrolling = true;
    if (deltaY > 0 && currentIndex < slides.length - 1) {
      scrollToSlide(currentIndex + 1);
    } else if (deltaY < 0 && currentIndex > 0) {
      scrollToSlide(currentIndex - 1);
    }
    setTimeout(() => { isScrolling = false; }, 800);
  }
}
