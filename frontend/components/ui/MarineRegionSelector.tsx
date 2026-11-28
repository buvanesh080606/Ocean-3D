'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOcean } from '../../context/OceanContext';
import { MARINE_REGIONS, MarineRegion } from '../../mocks/marineRegions';
import { Anchor, ChevronDown, Compass } from 'lucide-react';

export default function MarineRegionSelector() {
  const { flyToLocation, setSelectedLocation } = useOcean();
  const [selectedRegion, setSelectedRegion] = useState<MarineRegion>(MARINE_REGIONS[0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (region: MarineRegion) => {
    setSelectedRegion(region);
    setIsOpen(false);
    
    // Fly camera with dynamic 3D perspective angle
    flyToLocation(region.lat, region.lon, region.height, region.pitch, region.heading);
    
    setSelectedLocation({
      lat: region.lat,
      lon: region.lon,
      regionName: region.name.replace(/^[^\w]+/, '').trim(),
      seaDepthM: 3500
    });
  };

  return (
    <div ref={dropdownRef} className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-navy-ocean border-2 border-navy-sky hover:bg-navy-sky hover:text-navy-deep text-[11px] sm:text-xs font-semibold text-navy-ice transition"
        title="Select Marine Sea / Ocean Region"
      >
        <Anchor className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate max-w-[92px] sm:max-w-[180px] font-sans">{selectedRegion.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 sm:left-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-16px)] max-h-80 sm:max-h-96 overflow-y-auto bg-navy-deep border-2 border-navy-sky rounded-xl shadow-panel p-1.5 flex flex-col gap-1 text-xs">
          <div className="px-2.5 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-navy-sky border-b border-navy-sky flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-navy-sky" />
            <span>Select Marine Domain / Ocean Surface</span>
          </div>

          {MARINE_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => handleSelect(region)}
              className={`flex flex-col items-start px-2.5 py-2 rounded-lg transition text-left border ${
                selectedRegion.id === region.id
                  ? 'bg-navy-sky text-navy-deep border-navy-ice font-bold'
                  : 'bg-navy-ocean border-navy-sky/60 text-navy-ice hover:bg-navy-sky hover:text-navy-deep'
              }`}
            >
              <div className="font-semibold text-xs flex items-center justify-between w-full">
                <span>{region.name}</span>
                <span className="text-[9px] font-mono">{region.category}</span>
              </div>
              <span className="text-[10px] opacity-90 mt-0.5 font-sans leading-tight">
                {region.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
