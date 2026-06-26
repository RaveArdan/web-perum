import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Reset scroll position to top instantly on pathname change
    // We temporarily override CSS smooth scroll to ensure this jump happens immediately (0ms)
    // and doesn't conflict with any subsequent smooth scroll to hash.
    try {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      // Restore smooth scroll in the next frame so subsequent user or hash scrolls remain smooth
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = "";
      });
    } catch (err) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    // 2. If there is a hash, scroll smoothly to the target element after a short layout-settle delay
    if (hash) {
      const timer = setTimeout(() => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            const headerOffset = 90; // height of the sticky navbar
            const elementPosition = element.getBoundingClientRect().top;
            const currentScrollY = window.pageYOffset || window.scrollY;
            const offsetPosition = elementPosition + currentScrollY - headerOffset;

            // Only trigger scroll if we are not already close to the target position
            // This prevents duplicate scroll triggers from restarting the smooth animation and causing micro-vibrations
            if (Math.abs(currentScrollY - offsetPosition) > 10) {
              window.scrollTo({
                top: offsetPosition,
                behavior: "auto" // Use the CSS 'scroll-behavior: smooth' for the animation
              });
            }
          }
        } catch (err) {
          console.error("Gagal melakukan hash scroll:", err);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
