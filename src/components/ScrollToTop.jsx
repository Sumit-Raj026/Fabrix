import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that specific element
    if (hash) {
      // Use setTimeout to ensure the element is in the DOM after any potential route transitions
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If no hash, scroll to top of the page on every route change
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
