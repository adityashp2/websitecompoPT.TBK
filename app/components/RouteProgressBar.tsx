'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Complete progress on route change
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Trickle animation while navigating
  useEffect(() => {
    if (!isNavigating) return;

    setIsVisible(true);
    setProgress(15);

    const timer1 = setTimeout(() => {
      setProgress((prev) => (prev < 40 ? 40 : prev));
    }, 100);

    const timer2 = setTimeout(() => {
      setProgress((prev) => (prev < 70 ? 70 : prev));
    }, 300);

    const timer3 = setTimeout(() => {
      setProgress((prev) => (prev < 88 ? 88 : prev));
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isNavigating]);

  // Intercept click on internal links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Skip external links, downloads, hash links, or new tab links
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        targetAttr === '_blank' ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's the exact same pathname + hash
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return; // External origin

        // If same pathname and no query change, skip
        if (url.pathname === window.location.pathname && url.search === window.location.search) {
          return;
        }

        // Start progress bar
        setIsNavigating(true);
      } catch {
        // Ignore invalid URLs
      }
    };

    const handlePopState = () => {
      setIsNavigating(true);
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3.5px] bg-transparent"
    >
      {/* Progress track */}
      <div
        className="h-full bg-gradient-to-r from-[#073B78] via-[#FF9D2E] to-[#F28A17] transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transitionProperty: 'width, opacity',
        }}
      >
        {/* Glowing Head Particle */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-[4px] bg-[#FF9D2E] rounded-full blur-[1.5px] animate-progress-glow opacity-90" />
      </div>
    </div>
  );
}
