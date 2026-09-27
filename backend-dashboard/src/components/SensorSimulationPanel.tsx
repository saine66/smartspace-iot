import React from 'react';
import { 
  Sliders, 
  Users, 
  Thermometer, 
  Sun, 
  Zap, 
  RotateCcw, 
  AlertTriangle,
  FastForward,
  Waves,
  Sparkles,
  Clock
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const SensorSimulationPanel: React.FC = () => {
  const {
    sensorData,
    updateSensor,
    driftEnabled,
    setDriftEnabled,
    resetSimulation,
    isCountdownRunning,
    emptyCountdown,
    emptyCountdownDuration,
    setEmptyCountdownDuration,
    fastForwardCountdown,
  } = useSmartSpace();

  return (
    <div className="glass-panel p-5 rounded-3xl border border-brand-500/30 shadow-2xl relative overflow-hidden bg-slate-900/90">
      
      {/* Decorative Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-500 via-emerald-400 to-cyan-500"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-300 shadow-md shadow-brand-500/10">
            <Sliders className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                Live Sensor Simulation
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-400" />
                ESP32 Hardware Sim
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Simulate real-time sensor inputs (Occupancy, Temperature, Lux, Power). Adjusting sliders instantly triggers dashboard rules.
            </p>
          </div>
        </div>

        {/* Right Action Tools: Timer mode, ADC Noise & Reset */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          
          {/* Vacancy Timer Duration Selector */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-1 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <span className="text-[10px] font-bold text-slate-400 mr-1.5">Timer:</span>
            <select
              value={emptyCountdownDuration}
              onChange={(e) => setEmptyCountdownDuration(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer hover:text-brand-300"
            >
              <option value={10} className="bg-slate-900 text-white">10s (Fast Demo)</option>
              <option value={30} className="bg-slate-900 text-white">30s (Mid Demo)</option>
              <option value={600} className="bg-slate-900 text-white">10m (Standard)</option>
            </select>
          </div>

          {/* ADC Sensor Noise Toggle */}
          <button
            onClick={() => setDriftEnabled(!driftEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              driftEnabled
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-md ring-1 ring-brand-500/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle realistic micro-jitter from physical sensor ADCs"
          >
            <Waves className={`w-3.5 h-3.5 ${driftEnabled ? 'animate-pulse text-brand-400' : ''}`} />
            <span>ADC Noise {driftEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset Simulation Button */}
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border border-slate-600 text-xs font-bold shadow-md transition-all transform hover:scale-105"
            title="Reset telemetry and appliances to baseline defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Simulation</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Simulated Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        
        {/* SENSOR A: OCCUPANCY (0 - 60) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-400" />
                A. Occupancy
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-base font-extrabold text-brand-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {sensorData.occupancy}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">students</span>
              </div>
            </div>

            <div className="my-3">
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={sensorData.occupancy}
                onChange={(e) => updateSensor('occupancy', Number(e.target.value))}
                className="w-full accent-brand-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span className="text-amber-400 font-bold">0 (Empty)</span>
                <span>24 (Default)</span>
                <span>60 (Max)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Occupancy Presets:
            </span>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono font-bold">
              {[
                { label: '0 (Empty)', val: 0 },
                { label: '12 (Few)', val: 12 },
                { label: '24 (Def)', val: 24 },
                { label: '45 (Full)', val: 45 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => updateSensor('occupancy', preset.val)}
                  className={`py-1 rounded-lg border transition-all ${
                    sensorData.occupancy === preset.val
                      ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm font-extrabold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SENSOR B: TEMPERATURE (15 - 45 °C) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-rose-400" />
                B. Temperature
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-base font-extrabold text-rose-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {sensorData.temperature.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">°C</span>
              </div>
            </div>

            <div className="my-3">
              <input
                type="range"
                min="15"
                max="45"
                step="0.5"
                value={sensorData.temperature}
                onChange={(e) => updateSensor('temperature', Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span className="text-sky-400">15°C</span>
                <span className="text-slate-400">24°C (Off)</span>
                <span className="text-amber-400 font-bold">&gt;28°C (Fan)</span>
                <span className="text-rose-400">45°C</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Temperature Presets:
            </span>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono font-bold">
              {[
                { label: '22°C (Cool)', val: 22 },
                { label: '27.5° (Def)', val: 27.5 },
                { label: '30.5° (Fan)', val: 30.5 },
                { label: '36°C (Hot)', val: 36 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => updateSensor('temperature', preset.val)}
                  className={`py-1 rounded-lg border transition-all ${
                    Math.abs(sensorData.temperature - preset.val) < 0.4
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm font-extrabold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SENSOR C: LIGHT INTENSITY (0 - 1000 LUX) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                C. Light Intensity
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-base font-extrabold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  {sensorData.lightIntensity}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">lux</span>
              </div>
            </div>

            <div className="my-3">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={sensorData.lightIntensity}
                onChange={(e) => updateSensor('lightIntensity', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0 lx (Dark)</span>
                <span>420 lx (Default)</span>
                <span className="text-amber-300">1000 lx (Sun)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Lighting Presets:
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold">
              {[
                { label: '50 lx (Dark)', val: 50 },
                { label: '420 lx (Default)', val: 420 },
                { label: '880 lx (Sun)', val: 880 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => updateSensor('lightIntensity', preset.val)}
                  className={`py-1 rounded-lg border transition-all ${
                    Math.abs(sensorData.lightIntensity - preset.val) < 20
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm font-extrabold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SENSOR D: POWER CONSUMPTION (0 - 5.0 kW) */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" />
                D. Power Consumption
              </span>
              <div className="flex items-center gap-1">
                <span className={`font-mono text-base font-extrabold px-2 py-0.5 rounded border ${
                  sensorData.powerConsumption > 4.0
                    ? 'text-red-400 bg-red-500/20 border-red-500/40 animate-pulse'
                    : sensorData.powerConsumption > 3.0
                    ? 'text-amber-400 bg-amber-500/20 border-amber-500/40'
                    : 'text-purple-300 bg-slate-900 border-slate-700'
                }`}>
                  {sensorData.powerConsumption.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">kW</span>
              </div>
            </div>

            <div className="my-3">
              <input
                type="range"
                min="0"
                max="5.0"
                step="0.05"
                value={sensorData.powerConsumption}
                onChange={(e) => updateSensor('powerConsumption', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>0.0 kW</span>
                <span>1.24 kW (Def)</span>
                <span className="text-amber-400">&gt;3 kW (Warn)</span>
                <span className="text-red-400">&gt;4 kW (Crit)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Power Presets:
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold">
              <button
                onClick={() => updateSensor('powerConsumption', 1.24)}
                className={`py-1 rounded-lg border transition-all ${
                  Math.abs(sensorData.powerConsumption - 1.24) < 0.1
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm font-extrabold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                1.24 kW (Norm)
              </button>
              <button
                onClick={() => updateSensor('powerConsumption', 3.45)}
                className={`py-1 rounded-lg border transition-all ${
                  sensorData.powerConsumption > 3.0 && sensorData.powerConsumption <= 4.0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm font-extrabold'
                    : 'bg-slate-900 text-amber-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                3.45 kW (Warn)
              </button>
              <button
                onClick={() => updateSensor('powerConsumption', 4.35)}
                className={`py-1 rounded-lg border transition-all ${
                  sensorData.powerConsumption > 4.0
                    ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-sm font-extrabold'
                    : 'bg-slate-900 text-red-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                4.35 kW (Crit)
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Empty Room Countdown Notification & Quick Fast-Forward Trigger */}
      {isCountdownRunning && (
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-pulse">
          <div className="flex items-center gap-2.5 text-xs text-amber-200 font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              Empty room detected (Occupancy = 0). Automatic shutdown timer: <span className="font-mono text-white text-sm bg-slate-900 px-2 py-0.5 rounded border border-amber-500/40">{emptyCountdown}s</span> remaining before appliances turn OFF and Energy Saving Mode activates.
            </span>
          </div>
          <button
            onClick={fastForwardCountdown}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all shrink-0"
            title="Fast-forward the countdown immediately"
          >
            <FastForward className="w-4 h-4" />
            <span>Finish Timer Now</span>
          </button>
        </div>
      )}

    </div>
  );
};
