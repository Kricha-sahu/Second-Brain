import React from 'react';
import CanopyGroveBackdrop from '../cottage/CanopyGroveBackdrop';
import StatRelicCard from '../cottage/StatRelicCard';
import PresenceLantern from '../cottage/PresenceLantern';
import SylvesterGlade from '../cottage/SylvesterGlade';
import AmbientBeetle from './AmbientBeetle';
import '../cottage/canopy.css';

export default function CanopyPage({
  thisMonthSpend,
  waterToday,
  todayExerciseDur,
  dailyScore,
  awareness,
  today,
  onPresenceChange,
  primaryInsight,
  streamList,
}) {
  const presence = awareness[today] || 5;
  const waterFill = Math.min(1, (waterToday || 0) / 8);

  return (
    <div className="view-section canopy-cottage">
      <header className="canopy-hero">
        <CanopyGroveBackdrop />
        <div className="canopy-hero-copy">
          <p className="canopy-eyebrow">Cottage clearing · morning mist</p>
          <h2>Welcome to the Canopy</h2>
          <p>
            Your grove keeps score in mossy relics and dew-lit lanterns. Hover a relic to wake it —
            nothing blocks you, the forest simply glows back.
          </p>
        </div>
      </header>

      <div className="grove-relic-grid" style={{ position: 'relative' }}>
        <StatRelicCard
          title="Acorn Vault"
          value={`₹${thisMonthSpend.toFixed(2)}`}
          footer="Logged this month"
          relicType="acorn"
          variant="primary"
        />
        <StatRelicCard
          title="Dewdrop Trail"
          value={`${waterToday || 0} / 8`}
          footer="Water cups today"
          relicType="dew"
          variant="secondary"
          progress={waterFill}
        />
        <StatRelicCard
          title="Movement"
          value={`${todayExerciseDur}m`}
          footer="Active minutes today"
          relicType="fern"
          variant="success"
        />
        <StatRelicCard
          title="Awareness Index"
          value={dailyScore.toFixed(1)}
          footer="Overall index today"
          relicType="crystal"
          variant="warning"
          progress={dailyScore / 10}
        />
        <AmbientBeetle type="ladybug" style={{ position: 'absolute', left: '-15px', bottom: '-15px', width: '38px', height: '38px' }} />
        <AmbientBeetle type="hercules" style={{ position: 'absolute', right: '-15px', top: '-15px', width: '42px', height: '42px' }} />
      </div>

      <div className="grid-dashboard-main canopy-dashboard-main">
        <div className="canopy-left-grove">
          <div className="glass awareness-slider-card cottage-presence-card">
            <div className="cottage-presence-layout">
              <PresenceLantern value={presence} />
              <div className="cottage-presence-controls">
                <h3 className="panel-title">Mind Presence Calibration</h3>
                <p className="cottage-card-sub">
                  Tune your lantern flame. Stop, breathe, register clarity (1–10).
                </p>
                <div className="range-container">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={presence}
                    onChange={(e) => onPresenceChange(parseInt(e.target.value, 10))}
                  />
                  <span className="awareness-rating cottage-lantern-rating">{presence} / 10</span>
                </div>
                <div className="slider-labels">
                  <span>Foggy Canopy</span>
                  <span>Balanced Dew</span>
                  <span>Crystal Focus</span>
                </div>
              </div>
            </div>
          </div>

          <div className="awareness-hero cottage-insight-hero">
            <div className="awareness-avatar-area">
              <div className="brain-glow firefly-glow cottage-insight-glow">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18h6M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                </svg>
              </div>
            </div>
            <div className="awareness-content">
              <p className="awareness-quote">
                "Quiet minds notice structural cycles. Be aware, observe the patterns, grow the tree."
              </p>
              <div className="awareness-analysis">
                <strong>Insight: {primaryInsight.title}</strong>
                <br />
                {primaryInsight.text}
              </div>
            </div>
          </div>

          <SylvesterGlade />
        </div>

        <div className="glass panel cottage-stream-panel">
          <h3 className="panel-title">
            <span>Canopy Stream</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--text-dim)" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </h3>
          <p className="cottage-card-sub stream-sub">Today&apos;s trail through the undergrowth</p>
          <div className="todo-list cottage-stream-list">
            {streamList.length === 0 ? (
              <div className="todo-item cottage-stream-empty">
                <span>The forest floor has no logs yet. Record data to wake it up.</span>
              </div>
            ) : (
              streamList.map((item, idx) => (
                <div key={idx} className="todo-item cottage-stream-row">
                  <div className="todo-left">
                    <span className="stream-leaf-icon">{item.icon}</span>
                    <div>
                      <div className="todo-label">{item.title}</div>
                      <div className="stream-meta">{item.meta}</div>
                    </div>
                  </div>
                  <span className={`tag ${item.tagClass}`}>{item.tag}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
