/**
 * Animation utilities for scroll-triggered animations
 */

// Intersection Observer for scroll animations
export const initScrollAnimations = () => {
  if (typeof window === 'undefined') return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Observe all elements with scroll-animate class
  const elements = document.querySelectorAll('.scroll-animate');
  elements.forEach((el) => observer.observe(el));

  return observer;
};

// Stagger animation delay helper
export const getStaggerDelay = (index) => {
  return Math.min(index * 0.1, 0.6); // Max 600ms delay
};
