export const easeInOutQuad = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const smoothScrollTo = (targetY, duration = 800) => {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;

  // Stop previous scrolling logic if needed
  window.isScrolling = true;

  const animation = (currentTime) => {
    if (!window.isScrolling) return;

    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = easeInOutQuad(progress);
    
    window.scrollTo(0, startY + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.isScrolling = false;
    }
  };

  const cancelScroll = () => {
    window.isScrolling = false;
    window.removeEventListener('wheel', cancelScroll);
    window.removeEventListener('touchstart', cancelScroll);
  };

  window.addEventListener('wheel', cancelScroll, { passive: true });
  window.addEventListener('touchstart', cancelScroll, { passive: true });

  requestAnimationFrame(animation);
};

export const smoothScrollToId = (id, offset = 90, duration = 1000) => {
  const element = document.getElementById(id);
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top;
  const currentScrollY = window.scrollY || window.pageYOffset;
  const targetY = elementPosition + currentScrollY - offset;
  
  smoothScrollTo(targetY, duration);
};
