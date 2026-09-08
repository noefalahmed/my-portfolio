import React, { useState } from 'react'
import styles from './GridOverlay.module.css'

const GridOverlay: React.FC = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      {visible && (
        <div className={styles.overlay} aria-hidden="true">
          {/* 8px spatial grid */}
          <div className={styles.spatialGrid} />
          {/* 8-column column grid */}
          <div className={styles.columnGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.column} />
            ))}
          </div>
        </div>
      )}
      <button
        className={styles.toggle}
        onClick={() => setVisible(v => !v)}
        aria-label="Toggle grid overlay"
      >
        {visible ? 'GRID ON' : 'GRID OFF'}
      </button>
    </>
  )
}

export default GridOverlay
