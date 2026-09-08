import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

function hasLargeTextAncestor(el: Element | null): boolean {
  let node = el;
  while (node && node !== document.body) {
    if (Array.from(node.classList).some(c => c.includes('largetext'))) return true;
    node = node.parentElement;
  }
  return false;
}

function isOverText(el: Element | null): boolean {
  if (!el || el === document.body) return false;
  if (el.closest('a, button, input, textarea, select')) return false;
  return !!el.closest('p, h1, h2, h3, h4, h5, h6, li, blockquote') || hasLargeTextAncestor(el);
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let visible = false;
    cursor.style.opacity = '0';

    function isOverNoCursor(e: MouseEvent) {
      return !!(e.target as Element)?.closest('[data-nocursor]');
    }

    function onMouseMove(e: MouseEvent) {
      cursor!.style.left = `${e.clientX}px`;
      cursor!.style.top = `${e.clientY}px`;
      cursor!.style.opacity = isOverNoCursor(e) ? '0' : '1';
      if (!visible) { visible = true; }
    }

    function onTouchStart() {
      visible = false;
      cursor!.style.opacity = '0';
    }

    function onOver(e: MouseEvent) {
      if (!!(e.target as Element)?.closest('[data-nocursor]')) return;
      if (isOverText(e.target as Element)) {
        cursor!.classList.add(styles.text);
      } else {
        cursor!.classList.remove(styles.text);
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} />;
}
