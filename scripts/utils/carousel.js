/**
 * Image Carousel Component
 * Provides interactive carousel functionality with keyboard and touch support
 */

class ImageCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = element.querySelector('.carousel-track');
    this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
    this.prevButton = element.querySelector('.carousel-button--prev');
    this.nextButton = element.querySelector('.carousel-button--next');
    this.indicatorContainer = element.querySelector('.carousel-indicators');
    
    this.currentIndex = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    // Only initialize if we have slides and it's not a grid gallery
    if (this.slides.length > 0 && this.carousel.dataset.galleryType !== 'grid') {
      this.init();
    }
  }
  
  init() {
    // Create indicators
    this.createIndicators();
    
    // Add event listeners
    this.prevButton?.addEventListener('click', () => this.goToPrevious());
    this.nextButton?.addEventListener('click', () => this.goToNext());
    
    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Touch support
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    
    // Update initial state
    this.updateCarousel();
  }
  
  createIndicators() {
    if (!this.indicatorContainer) return;
    
    this.slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.classList.add('carousel-indicator');
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.addEventListener('click', () => this.goToSlide(index));
      this.indicatorContainer.appendChild(indicator);
    });
    
    this.indicators = Array.from(this.indicatorContainer.querySelectorAll('.carousel-indicator'));
  }
  
  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.slides.length - 1));
    this.updateCarousel();
  }
  
  goToPrevious() {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.slides.length - 1;
    this.updateCarousel();
  }
  
  goToNext() {
    this.currentIndex = this.currentIndex < this.slides.length - 1 ? this.currentIndex + 1 : 0;
    this.updateCarousel();
  }
  
  updateCarousel() {
    // Update track position
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    
    // Update button states
    if (this.prevButton && this.nextButton) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.nextButton.disabled = this.currentIndex === this.slides.length - 1;
    }
    
    // Update indicators
    this.indicators?.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
      indicator.setAttribute('aria-pressed', index === this.currentIndex);
    });
    
    // Update ARIA attributes
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentIndex);
    });
  }
  
  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.goToNext();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
    }
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }
  
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.goToNext();
      } else {
        this.goToPrevious();
      }
    }
  }
}

// Initialize carousels when DOM is ready
if (typeof document !== 'undefined') {
  // For static site generation, we'll inline this in the template
  const initScript = `
    document.addEventListener('DOMContentLoaded', function() {
      const carousels = document.querySelectorAll('.image-carousel');
      carousels.forEach(carousel => new ImageCarousel(carousel));
    });
  `;
  
  // Export for build process
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageCarousel, initScript };
  }
}