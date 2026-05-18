import React, { useEffect, useRef, useState } from 'react';

import styles from './SideNav.module.css';

export type SideNavSection = {
  id: string;
  label: string;
};

type SideNavProps = {
  sections: SideNavSection[];
};

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const smoothScrollTo = (targetY: number, duration = 600) => {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let start: number | null = null;

  const step = (timestamp: number) => {
    start ??= timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * easeInOutQuad(progress));
    if (elapsed < duration) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

export function SideNav({ sections }: SideNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const isScrollingRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) setActiveId(id);
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    setActiveId(id);
    isScrollingRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.scrollIntoView();
      isScrollingRef.current = false;
      return;
    }

    const top = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(top);
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  return (
    <nav className={styles['side-nav']} aria-label="Page sections">
      {sections.map(({ id, label }) => (
        <div
          key={id}
          className={`${styles['side-nav-item']}${activeId === id ? ` ${styles['side-nav-item--active']}` : ''}`}
        >
          <span className={styles['side-nav-label']}>{label}</span>
          <button
            className={`${styles['side-nav-dot']}${activeId === id ? ` ${styles['side-nav-dot--active']}` : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
          />
        </div>
      ))}
    </nav>
  );
}
