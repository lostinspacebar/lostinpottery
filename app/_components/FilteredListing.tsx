"use client";

import { Pot } from "@/lib/pot";
import { Children, useEffect, useState } from "react";

export default function FilteredListing({
  pots,
  children: fullListing,
}: {
  pots: Pot[]
  children: React.ReactNode;
}) {
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showMugs, setShowMugs] = useState(true);
  const [showPitchers, setShowPitchers] = useState(true);
  const [showBowls, setShowBowls] = useState(true);
  const [showVases, setShowVases] = useState(true);
  const [showOther, setShowOther] = useState(true);
  const [filteredListing, setFilteredListing] = useState(fullListing);

  useEffect(() => {
    const children = Children.toArray(fullListing);
    const filtered = children.filter((child, index) => {
      const pot = pots[index];
      if (showOnlyAvailable && pot.status !== 'available') {
        return false;
      }
      if (pot.type === 'mug' && !showMugs) {
        return false;
      }
      if (pot.type === 'pitcher' && !showPitchers) {
        return false;
      }
      if (pot.type === 'bowl' && !showBowls) {
        return false;
      }
      if (pot.type === 'vase' && !showVases) {
        return false;
      }
      if (pot.type === 'other' && !showOther) {
        return false;
      }
      return true;
    });
    setFilteredListing(filtered)
  }, [showOnlyAvailable, showMugs, showPitchers, showBowls, showVases, showOther]);

  return (
    <>
      <details className="filter-card collapse bg-base-200 break-before-avoid">
        <summary className="collapse-title text-xl font-medium">
          Filters
        </summary>
        <div className="collapse-content">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Only Show Available</span>
              <input type="checkbox" className="filter-toggle" checked={showOnlyAvailable} onChange={() => setShowOnlyAvailable(!showOnlyAvailable)} />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Mugs</span>
              <input type="checkbox" className="filter-toggle" checked={showMugs} onChange={() => setShowMugs(!showMugs)} />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Pitchers</span>
              <input type="checkbox" className="filter-toggle" checked={showPitchers} onChange={() => setShowPitchers(!showPitchers)} />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Bowls</span>
              <input type="checkbox" className="filter-toggle" checked={showBowls} onChange={() => setShowBowls(!showBowls)} />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Vases</span>
              <input type="checkbox" className="filter-toggle" checked={showVases} onChange={() => setShowVases(!showVases)} />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Other</span>
              <input type="checkbox" className="filter-toggle" checked={showOther} onChange={() => setShowOther(!showOther)} />
            </label>
          </div>
        </div>
      </details>
      {filteredListing}
    </>
  );
}
