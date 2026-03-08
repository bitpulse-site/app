import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' ensures there is no unprofessional sliding animation
    // It just snaps immediately to the top before the next frame renders.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' 
    });
  }, [pathname]);

  return null; // This component renders nothing to the screen
}