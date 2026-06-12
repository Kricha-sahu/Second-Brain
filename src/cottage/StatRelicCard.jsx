import React, { useState } from 'react';
import CottageCanvas from './CottageCanvas';
import RelicScene from './RelicScene';

export default function StatRelicCard({
  title,
  value,
  footer,
  relicType,
  variant = 'primary',
  progress = 0.5,
}) {
  const [active, setActive] = useState(false);

  return (
    <article
      className={`grove-relic-card grove-relic-${variant} ${active ? 'is-active' : ''}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
    >
      <div className="grove-relic-scene" aria-hidden="true">
        <CottageCanvas camera={{ position: [0, 0.45, 2.35], fov: 36 }}>
          <RelicScene type={relicType} active={active} progress={progress} />
        </CottageCanvas>
      </div>
      <div className="grove-relic-body">
        <header className="grove-relic-header">
          <span className="grove-relic-title">{title}</span>
          <span className="grove-relic-spark" aria-hidden="true">✦</span>
        </header>
        <p className="grove-relic-value">{value}</p>
        <p className="grove-relic-footer">{footer}</p>
      </div>
      <div className="grove-moss-rim" aria-hidden="true" />
    </article>
  );
}
