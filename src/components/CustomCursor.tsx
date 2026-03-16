import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let visible = false;
    cursor.style.opacity = '0';

    function onMouseMove(e: MouseEvent) {
      cursor!.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%)) scale(0.8)`;
      if (!visible) {
        visible = true;
        cursor!.style.opacity = '1';
      }
    }

    function onTouchStart() {
      visible = false;
      cursor!.style.opacity = '0';
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
    };
  }, []);

  return <div ref={cursorRef} className={styles.cursor} />;
}
