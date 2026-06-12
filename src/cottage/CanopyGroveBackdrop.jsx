import React from 'react';
import ForestHeroArt from './ForestHeroArt';

export default function CanopyGroveBackdrop() {
  return (
    <div className="canopy-grove-backdrop" aria-hidden="true">
      <ForestHeroArt />
      <div className="canopy-grove-vignette" />
      <div className="canopy-grove-mist" />
    </div>
  );
}
