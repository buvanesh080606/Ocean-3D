'use client';

import React from 'react';
import { useOcean } from '../../context/OceanContext';
import { Play, Pause, SkipBack, SkipForward, Clock } from 'lucide-react';

const TIME_STEPS = [
  "01 SEP 00:00 UTC",
  "01 SEP 06:00 UTC",
  "01 SEP 12:00 UTC",
  "01 SEP 18:00 UTC",
  "02 SEP 00:00 UTC",
  "02 SEP 06:00 UTC",
  "02 SEP 12:00 UTC",
  "02 SEP 18:00 UTC",
  "03 SEP 00:00 UTC",
];

export default function BottomTimeline() {
  const {
    timeIndex,
    setTimeIndex,
    availableTimeSteps,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed
  } = useOcean();

  const totalSteps = Math.max(1, availableTimeSteps.length);
  const safeIndex = Math.min(Math.max(0, timeIndex), totalSteps - 1);

  const formatStepLabel = (iso?: string, fallbackIdx: number = 0) => {
    if (!iso) return TIME_STEPS[fallbackIdx % TIME_STEPS.length];
    const d = new Date(iso);
    if (isNaN(d.getTime())) return TIME_STEPS[fallbackIdx % TIME_STEPS.length];
    const day = String(d.getUTCDate()).padStart(2, '0');
    const mon = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    const yr = d.getUTCFullYear();
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    return `${day} ${mon} ${yr} ${hh}:${mm} UTC`;
  };

  const formatShortTick = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const mon = d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' }).toUpperCase();
    return `${String(d.getUTCDate()).padStart(2, '0')} ${mon} ${String(d.getUTCFullYear()).slice(-2)}`;
  };

  const handlePrev = () => {
    setTimeIndex((safeIndex - 1 + totalSteps) % totalSteps);
  };

  const handleNext = () => {
    setTimeIndex((safeIndex + 1) % totalSteps);
  };

  return (
    <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-16px)] sm:w-[calc(100%-24px)] max-w-xl lg:max-w-2xl select-none pointer-events-none">
      <div className="bg-navy-deep/95 backdrop-blur-md border-2 border-navy-sky rounded-xl p-2 sm:p-3 shadow-panel text-navy-ice pointer-events-auto">
        <div className="flex flex-nowrap items-center justify-between gap-1.5 sm:gap-3 mb-1.5 sm:mb-2">
          {/* Playback Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handlePrev}
              className="p-1 sm:p-1.5 rounded-lg bg-navy-ocean hover:bg-navy-sky hover:text-navy-deep text-navy-ice border border-navy-sky transition"
              title="Previous Timestep"
            >
              <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-2 py-1 sm:p-2 rounded-lg bg-navy-ocean hover:bg-navy-sky hover:text-navy-deep text-navy-ice font-bold border-2 border-navy-sky transition shadow-md flex items-center gap-1"
              title={isPlaying ? 'Pause Animation' : 'Play Timeline'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-navy-ice" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-navy-ice fill-current" />}
              <span className="text-[10px] sm:text-xs font-mono">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={handleNext}
              className="p-1 sm:p-1.5 rounded-lg bg-navy-ocean hover:bg-navy-sky hover:text-navy-deep text-navy-ice border border-navy-sky transition"
              title="Next Timestep"
            >
              <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Current Date/Time Display */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-navy-ocean border border-navy-sky text-[10px] sm:text-xs font-mono min-w-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-navy-ice flex-shrink-0" />
            <span className="hidden sm:inline text-navy-ice font-sans">Timestep:</span>
            <span className="font-bold text-navy-ice truncate">
              <span className="sm:hidden">{formatShortTick(availableTimeSteps[safeIndex]) || 'STEP'}</span>
              <span className="hidden sm:inline">{formatStepLabel(availableTimeSteps[safeIndex], safeIndex)}</span>
            </span>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-navy-ocean p-0.5 sm:p-1 rounded-lg border border-navy-sky text-[10px] sm:text-[11px] font-mono flex-shrink-0">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-1.5 sm:px-2 py-0.5 rounded transition ${
                  playbackSpeed === spd
                    ? 'bg-navy-sky text-navy-deep font-bold border border-navy-ice'
                    : 'text-navy-ice hover:bg-navy-sky hover:text-navy-deep'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber Slider Bar */}
        <div className="relative flex items-center px-1">
          <input
            type="range"
            min="0"
            max={Math.max(0, totalSteps - 1)}
            value={safeIndex}
            onChange={(e) => setTimeIndex(Number(e.target.value))}
            className="w-full h-2 sm:h-2.5 bg-navy-ocean border border-navy-sky rounded-lg appearance-none cursor-pointer accent-[#4988C4]"
          />
        </div>

        {/* Step Tick Markers */}
        <div className="flex justify-between px-1 mt-1 text-[9px] font-mono text-navy-ice font-semibold">
          <span>{formatShortTick(availableTimeSteps[0]) || 'START'}</span>
          <span className="hidden sm:inline">{formatShortTick(availableTimeSteps[Math.floor((totalSteps - 1) * 0.25)])}</span>
          <span>{formatShortTick(availableTimeSteps[Math.floor((totalSteps - 1) * 0.5)])}</span>
          <span className="hidden sm:inline">{formatShortTick(availableTimeSteps[Math.floor((totalSteps - 1) * 0.75)])}</span>
          <span>{formatShortTick(availableTimeSteps[totalSteps - 1]) || 'END'}</span>
        </div>
      </div>
    </div>
  );
}
