'use client';

import React from 'react';
import { useOcean } from '../../context/OceanContext';
import { DepthLevel, LayerVisibilityState } from '../../types/ocean';
import {
  Thermometer,
  Droplets,
  Wind,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Navigation,
  Sparkles,
  Sliders,
  Radio
} from 'lucide-react';

const DEPTH_LEVELS: DepthLevel[] = [0, 10, 50, 100, 500, 1000, 2000];

export default function LeftControls() {
  const {
    selectedVariable,
    setSelectedVariable,
    selectedDepth,
    setSelectedDepth,
    layers,
    toggleLayer,
    leftControlsOpen,
    setLeftControlsOpen,
    trajectoryModeActive,
    setTrajectoryModeActive,
    setActiveDrawer,
    activeDrawer,
    heatmapMode,
    setHeatmapMode,
    flyToLocation
  } = useOcean();

  const handleLayerToggle = (key: keyof LayerVisibilityState) => {
    toggleLayer(key);
    if (key === 'errorHeatmap' && !layers.errorHeatmap) {
      flyToLocation(14.0, 70.0, 4500000, -60, 0);
    }
  };

  const handleVariableChange = (variable: typeof selectedVariable) => {
    setSelectedVariable(variable);
  };

  const openDrawerResponsive = (drawer: typeof activeDrawer) => {
    const next = activeDrawer === drawer ? 'none' : drawer;
    setActiveDrawer(next);
    if (next !== 'none' && typeof window !== 'undefined' && window.innerWidth < 768) {
      setLeftControlsOpen(false);
    }
  };

  return (
    <aside
      className={`absolute top-[60px] sm:top-[64px] left-2 z-40 transition-all duration-300 ${
        leftControlsOpen ? 'w-[calc(100vw-16px)] sm:w-80' : 'w-auto'
      }`}
    >
      <div className="bg-navy-deep/95 backdrop-blur-md border-2 border-navy-sky rounded-xl p-2 sm:p-3 shadow-panel text-navy-ice max-h-[calc(100dvh-165px)] sm:max-h-[calc(100vh-140px)] overflow-y-auto overscroll-contain custom-scrollbar">
        {/* Panel Header & Collapse Toggle */}
        <div className={`flex items-center justify-between gap-2 ${leftControlsOpen ? 'border-b-2 border-navy-sky pb-2 mb-3 sticky -top-2 sm:-top-3 bg-navy-deep/95 backdrop-blur-md pt-1 z-10' : ''}`}>
          {leftControlsOpen ? (
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-navy-sky" />
              <h2 className="text-xs font-heading font-bold tracking-wider text-navy-ice uppercase">Scientific Controls</h2>
            </div>
          ) : (
            <button
              onClick={() => setLeftControlsOpen(true)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-navy-ocean hover:bg-navy-sky hover:text-navy-deep text-navy-ice border border-navy-sky text-xs font-semibold transition"
              title="Expand Controls"
            >
              <Sliders className="w-3.5 h-3.5 text-navy-sky" />
              <span className="sm:hidden">Controls</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          {leftControlsOpen && (
            <button
              onClick={() => setLeftControlsOpen(false)}
              className="p-1 rounded bg-navy-ocean hover:bg-navy-sky hover:text-navy-deep text-navy-ice border border-navy-sky transition ml-auto"
              title="Collapse Controls"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {leftControlsOpen && (
          <div className="space-y-4 text-xs font-sans">
            {/* 1. VARIABLE SELECTOR */}
            <div>
              <label className="text-[11px] font-mono font-semibold text-navy-sky uppercase tracking-wider block mb-2">
                Ocean Variable
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleVariableChange('temp')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition ${
                    selectedVariable === 'temp'
                      ? 'bg-navy-sky text-navy-deep border-2 border-navy-ice font-bold shadow-md'
                      : 'bg-navy-ocean text-navy-ice border border-navy-sky hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                >
                  <Thermometer className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs truncate">Temperature</div>
                    <div className="text-[10px] font-mono opacity-90">°C</div>
                  </div>
                </button>

                <button
                  onClick={() => handleVariableChange('salinity')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition ${
                    selectedVariable === 'salinity'
                      ? 'bg-navy-sky text-navy-deep border-2 border-navy-ice font-bold shadow-md'
                      : 'bg-navy-ocean text-navy-ice border border-navy-sky hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                >
                  <Droplets className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs truncate">Salinity</div>
                    <div className="text-[10px] font-mono opacity-90">PSU</div>
                  </div>
                </button>

                <button
                  onClick={() => handleVariableChange('currents')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition ${
                    selectedVariable === 'currents'
                      ? 'bg-navy-sky text-navy-deep border-2 border-navy-ice font-bold shadow-md'
                      : 'bg-navy-ocean text-navy-ice border border-navy-sky hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                >
                  <Wind className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs truncate">Currents</div>
                    <div className="text-[10px] font-mono opacity-90">m/s</div>
                  </div>
                </button>

                <button
                  onClick={() => handleVariableChange('waves')}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition ${
                    selectedVariable === 'waves'
                      ? 'bg-navy-sky text-navy-deep border-2 border-navy-ice font-bold shadow-md'
                      : 'bg-navy-ocean text-navy-ice border border-navy-sky hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                >
                  <Radio className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-xs truncate">Waves</div>
                    <div className="text-[10px] font-mono opacity-90">Height (m)</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. DEPTH SLICING CONTROL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono font-semibold text-navy-sky uppercase tracking-wider">
                  Depth Level
                </label>
                <span className="font-mono font-bold text-navy-ice bg-navy-ocean px-2 py-0.5 rounded border border-navy-sky text-[11px]">
                  {selectedDepth === 0 ? 'Surface (0m)' : `${selectedDepth}m`}
                </span>
              </div>

              {/* Depth Selector Buttons — Structured 4-column layout to prevent clipping */}
              <div className="grid grid-cols-4 gap-1 mb-2">
                {DEPTH_LEVELS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDepth(d)}
                    className={`py-1.5 px-1 rounded text-[11px] font-mono transition text-center border ${
                      selectedDepth === d
                        ? 'bg-navy-sky text-navy-deep font-bold border-2 border-navy-ice shadow-md'
                        : 'bg-navy-ocean border border-navy-sky text-navy-ice hover:bg-navy-sky hover:text-navy-deep'
                    }`}
                  >
                    {d === 0 ? '0m' : `${d}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. SCIENTIFIC VISUAL LAYERS TOGGLES */}
            <div>
              <label className="text-[11px] font-mono font-semibold text-navy-sky uppercase tracking-wider block mb-2">
                Layers & Overlays
              </label>

              <div className="space-y-1.5">
                {[
                  { key: 'argoFloats', label: '📡 Argo Float Observations' },
                  { key: 'currentParticles', label: '🌊 Animated Current Field' },
                  { key: 'errorHeatmap', label: '🗺️ Model Error Heatmap' },
                  { key: 'anomalies', label: '⚠️ Ocean Anomaly Hotspots' },
                  { key: 'trajectoryPath', label: '📍 Trajectory Drift Paths' },
                ].map(({ key, label }) => {
                  const isActive = layers[key as keyof LayerVisibilityState];
                  return (
                    <div key={key} className="space-y-1">
                      <button
                        onClick={() => handleLayerToggle(key as keyof LayerVisibilityState)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-left transition text-[11px] ${
                          isActive
                            ? 'bg-navy-sky text-navy-deep font-bold border-2 border-navy-ice shadow-md'
                            : 'bg-navy-ocean text-navy-ice border border-navy-sky/60 hover:bg-navy-sky hover:text-navy-deep'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {isActive ? (
                          <Eye className="w-3.5 h-3.5 text-navy-deep flex-shrink-0 ml-1" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-navy-ice/50 flex-shrink-0 ml-1" />
                        )}
                      </button>

                      {key === 'errorHeatmap' && isActive && (
                        <div className="p-2 bg-navy-darker rounded-lg border border-navy-sky/80 space-y-1.5 text-[10px] my-1">
                          <div className="flex items-center justify-between text-navy-sky font-semibold uppercase tracking-wider">
                            <span>Error Calculation:</span>
                            <span className="font-mono text-navy-ice font-bold">{heatmapMode.toUpperCase()}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setHeatmapMode('raw'); }}
                              className={`py-1 px-1.5 rounded text-center transition font-semibold ${
                                heatmapMode === 'raw'
                                  ? 'bg-navy-sky text-navy-deep border border-navy-ice font-bold shadow'
                                  : 'bg-navy-ocean text-navy-ice hover:bg-navy-sky/40 border border-navy-sky/40'
                              }`}
                            >
                              Raw Error
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setHeatmapMode('corrected'); }}
                              className={`py-1 px-1.5 rounded text-center transition font-semibold ${
                                heatmapMode === 'corrected'
                                  ? 'bg-navy-sky text-navy-deep border border-navy-ice font-bold shadow'
                                  : 'bg-navy-ocean text-navy-ice hover:bg-navy-sky/40 border border-navy-sky/40'
                              }`}
                            >
                              XGBoost Corrected
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. TRAJECTORY & PROMINENT AI INSIGHT ACTIONS */}
            <div className="pt-2 border-t-2 border-navy-sky space-y-2">
              <button
                onClick={() => {
                  const next = !trajectoryModeActive;
                  setTrajectoryModeActive(next);
                  if (next) setActiveDrawer('trajectory');
                }}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-xs transition border-2 ${
                  trajectoryModeActive
                    ? 'bg-navy-sky text-navy-deep border-navy-ice shadow-md'
                    : 'bg-navy-ocean border border-navy-sky text-navy-ice hover:bg-navy-sky hover:text-navy-deep'
                }`}
              >
                <Navigation className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{trajectoryModeActive ? 'Selecting Drift Origin...' : 'Current Trajectory Mode'}</span>
              </button>

              {/* PROMINENT AI MODEL INSIGHTS BUTTON */}
              <button
                onClick={() => openDrawerResponsive('explain')}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition border-2 ${
                  activeDrawer === 'explain'
                    ? 'bg-navy-sky text-navy-deep border-navy-ice font-bold shadow-md'
                    : 'bg-navy-ocean hover:bg-navy-sky hover:text-navy-deep border-navy-sky text-navy-ice font-bold shadow-md'
                }`}
                title="Open AI Ocean Model Insights & Physics Explanation Drawer"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0 text-cyan-300" />
                <span className="tracking-wider text-xs uppercase font-bold truncate">AI MODEL INSIGHTS & PREDICTIONS</span>
              </button>

              {/* QUICK SCIENTIFIC ANALYTICS DRAWERS */}
              <div className="grid grid-cols-3 gap-1 pt-1">
                <button
                  onClick={() => openDrawerResponsive('reliability')}
                  className={`py-1 px-1.5 rounded text-[10px] font-mono text-center transition border truncate ${
                    activeDrawer === 'reliability'
                      ? 'bg-navy-sky text-navy-deep font-bold border-navy-ice'
                      : 'bg-navy-ocean text-navy-ice border-navy-sky/60 hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                  title="View Model Reliability Score"
                >
                  🛡️ Reliability
                </button>
                <button
                  onClick={() => openDrawerResponsive('argo')}
                  className={`py-1 px-1.5 rounded text-[10px] font-mono text-center transition border truncate ${
                    activeDrawer === 'argo'
                      ? 'bg-navy-sky text-navy-deep font-bold border-navy-ice'
                      : 'bg-navy-ocean text-navy-ice border-navy-sky/60 hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                  title="View Vertical CTD Depth Profile"
                >
                  📈 Profile
                </button>
                <button
                  onClick={() => openDrawerResponsive('bias')}
                  className={`py-1 px-1.5 rounded text-[10px] font-mono text-center transition border truncate ${
                    activeDrawer === 'bias'
                      ? 'bg-navy-sky text-navy-deep font-bold border-navy-ice'
                      : 'bg-navy-ocean text-navy-ice border-navy-sky/60 hover:bg-navy-sky hover:text-navy-deep'
                  }`}
                  title="View XGBoost Bias-Correction"
                >
                  ⚡ Bias Field
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

