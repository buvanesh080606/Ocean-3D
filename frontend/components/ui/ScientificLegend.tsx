'use client';

import React, { useState } from 'react';
import { useOcean } from '../../context/OceanContext';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ColorBand {
  color: string;
  range: string;
  meaning: string;
}

export default function ScientificLegend() {
  const { selectedVariable, selectedDepth, layers, heatmapMode, heatmapVariable } = useOcean();
  const [expanded, setExpanded] = useState(true);

  const getLegendDetails = (): {
    title: string;
    subtitle: string;
    unit: string;
    gradientStyle: string;
    bands: ColorBand[];
  } => {
    if (layers.errorHeatmap) {
      const varName = (heatmapVariable || selectedVariable || 'temperature').toUpperCase();
      const isSal = (heatmapVariable || selectedVariable) === 'salinity';
      const modeName = (heatmapMode || 'raw').toUpperCase();

      return {
        title: `ERROR HEATMAP (${modeName})`,
        subtitle: `${varName} = Observation minus Model`,
        unit: isSal ? 'PSU' : '°C',
        gradientStyle: 'linear-gradient(to right, #3b82f6, #06b6d4, #22c55e, #f59e0b, #ef4444)',
        bands: isSal
          ? [
              { color: '#ef4444', range: '> +0.25 PSU', meaning: 'Model under-predicts salinity' },
              { color: '#f59e0b', range: '+0.03 to +0.25', meaning: 'Slight positive bias' },
              { color: '#22c55e', range: '±0.03 PSU', meaning: 'Accurate (Model ≈ Obs)' },
              { color: '#06b6d4', range: '-0.25 to -0.03', meaning: 'Slight negative bias' },
              { color: '#3b82f6', range: '< -0.25 PSU', meaning: 'Model over-predicts salinity' },
            ]
          : [
              { color: '#ef4444', range: '> +1.0 °C', meaning: 'Model too cold (high error)' },
              { color: '#f59e0b', range: '+0.1 to +1.0 °C', meaning: 'Moderate warm obs bias' },
              { color: '#22c55e', range: '±0.1 °C', meaning: 'Accurate (Model ≈ Argo)' },
              { color: '#06b6d4', range: '-1.0 to -0.1 °C', meaning: 'Moderate cold obs bias' },
              { color: '#3b82f6', range: '< -1.0 °C', meaning: 'Model too warm (high error)' },
            ],
      };
    }

    switch (selectedVariable) {
      case 'temp':
        return {
          title: 'SEA TEMPERATURE (SST)',
          subtitle: `Thermal layer at ${selectedDepth === 0 ? 'Surface (0m)' : `${selectedDepth}m depth`}`,
          unit: '°C',
          gradientStyle: 'linear-gradient(to right, #0284c7, #38bdf8, #f59e0b, #f43f5e)',
          bands: [
            { color: '#f43f5e', range: '> 29.2 °C', meaning: 'Warm Pool / Heatwave Zone' },
            { color: '#f59e0b', range: '28.0 – 29.2 °C', meaning: 'Warm Tropical Water' },
            { color: '#38bdf8', range: '26.5 – 28.0 °C', meaning: 'Moderate Ocean Surface' },
            { color: '#0284c7', range: '< 26.5 °C', meaning: 'Cooler / Deeper Water' },
          ],
        };
      case 'salinity':
        return {
          title: 'SEA SALINITY (SSS)',
          subtitle: 'Arabian Sea (salty) vs Bay of Bengal (fresh)',
          unit: 'PSU',
          gradientStyle: 'linear-gradient(to right, #00f2fe, #06b6d4, #0284c7, #3b82f6, #4338ca)',
          bands: [
            { color: '#4338ca', range: '> 36.5 PSU', meaning: 'High Salinity (Arabian Sea)' },
            { color: '#3b82f6', range: '35.6 – 36.5', meaning: 'Elevated Salinity' },
            { color: '#0284c7', range: '34.5 – 35.6', meaning: 'Average Open Ocean' },
            { color: '#06b6d4', range: '33.2 – 34.5', meaning: 'Lower Salinity' },
            { color: '#00f2fe', range: '< 33.2 PSU', meaning: 'River-Fed Fresh Plume (BoB)' },
          ],
        };
      case 'currents':
        return {
          title: 'OCEAN CURRENT SPEED',
          subtitle: 'Animated streamlines show flow direction & speed',
          unit: 'm/s',
          gradientStyle: 'linear-gradient(to right, #00f2fe, #38bdf8, #f59e0b, #f43f5e)',
          bands: [
            { color: '#f43f5e', range: '> 0.70 m/s', meaning: 'Strong Jet / Monsoon Current' },
            { color: '#f59e0b', range: '0.45 – 0.70 m/s', meaning: 'Fast Regional Flow' },
            { color: '#38bdf8', range: '0.25 – 0.45 m/s', meaning: 'Moderate Circulation' },
            { color: '#00f2fe', range: '< 0.25 m/s', meaning: 'Slow Drift / Calm Gyre' },
          ],
        };
      case 'waves':
        return {
          title: 'WAVE SWELL HEIGHT',
          subtitle: 'Concentric rings mark major swell centers',
          unit: 'm',
          gradientStyle: 'linear-gradient(to right, #38bdf8, #f59e0b, #e11d48)',
          bands: [
            { color: '#e11d48', range: '> 3.2 m', meaning: 'High / Rough Swell Alert' },
            { color: '#f59e0b', range: '2.0 – 3.2 m', meaning: 'Moderate Ocean Swell' },
            { color: '#38bdf8', range: '< 2.0 m', meaning: 'Calm / Low Wave State' },
          ],
        };
      default:
        return {
          title: 'SEA TEMPERATURE',
          subtitle: 'Ocean thermal state',
          unit: '°C',
          gradientStyle: 'linear-gradient(to right, #0284c7, #38bdf8, #f59e0b, #f43f5e)',
          bands: [
            { color: '#f43f5e', range: '> 29.2 °C', meaning: 'Warm Pool / Heatwave' },
            { color: '#f59e0b', range: '28.0 – 29.2 °C', meaning: 'Warm Tropical' },
            { color: '#38bdf8', range: '26.5 – 28.0 °C', meaning: 'Moderate' },
            { color: '#0284c7', range: '< 26.5 °C', meaning: 'Cooler Water' },
          ],
        };
    }
  };

  const legend = getLegendDetails();

  return (
    <div className="absolute bottom-16 sm:bottom-3 right-3 z-30 w-64 sm:w-72 bg-navy-deep/95 backdrop-blur-md border-2 border-navy-sky rounded-xl p-2.5 sm:p-3 shadow-panel text-navy-ice select-none">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-heading font-bold text-navy-ice uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-navy-sky flex-shrink-0" />
            <span className="truncate">{legend.title}</span>
          </div>
          <div className="text-[10px] text-navy-muted truncate">{legend.subtitle}</div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded bg-navy-ocean border border-navy-sky/50 text-navy-ice hover:bg-navy-sky hover:text-navy-deep transition flex-shrink-0"
          title={expanded ? 'Collapse Legend' : 'Expand Legend'}
        >
          {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Exact-match gradient bar */}
      <div
        className="w-full h-2.5 rounded-md shadow-inner my-1.5 border border-white/15"
        style={{ background: legend.gradientStyle }}
      />

      {expanded && (
        <div className="space-y-2 mt-2">
          {/* Exact Color Meaning Rows */}
          <div className="space-y-1">
            {legend.bands.map((b) => (
              <div key={b.range} className="flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0 border border-white/40"
                    style={{ backgroundColor: b.color }}
                  />
                  <span className="text-navy-ice/90 truncate">{b.meaning}</span>
                </div>
                <span className="font-mono font-bold text-navy-sky whitespace-nowrap">{b.range}</span>
              </div>
            ))}
          </div>

          {/* 3D Globe Symbols Key */}
          <div className="pt-2 border-t border-navy-sky/30 space-y-1">
            <div className="text-[9px] font-mono uppercase tracking-wider text-navy-sky font-semibold">
              3D Globe Symbols
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-navy-ice/90">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] border border-white flex-shrink-0" />
                <span className="truncate">Argo Float</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] border border-amber-300 flex-shrink-0" />
                <span className="truncate">Anomaly Alert</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#00f2fe] flex-shrink-0" />
                <span className="truncate">Current Flow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-white flex-shrink-0" />
                <span className="truncate">Drift Start→End</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
