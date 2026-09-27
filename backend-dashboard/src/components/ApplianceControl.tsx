import React from 'react';
import { 
  Lightbulb, 
  Fan, 
  Wind, 
  Tv, 
  Power, 
  Sliders, 
  Cpu, 
  ShieldAlert
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const ApplianceControl: React.FC = () => {
  const { 
    appliances, 
    toggleAppliancePower, 
    setApplianceMode, 
    setMasterMode,
    setLightBrightness,
    toggleLightZone,
    setFanSpeed,
    setAcTargetTemp,
  } = useSmartSpace();

  // Check if any appliance is in manual override mode
  const hasManualOverride = Object.values(appliances).some((a) => a.mode === 'MANUAL');

  return (
    <div className="space-y-4">
      
      {/* Section Header & Master Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Appliance Actuation & Controls
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                4 Channels
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Autonomous energy management with faculty manual override capability
            </p>
          </div>
        </div>

        {/* Master Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMasterMode('AUTO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !hasManualOverride
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 ring-1 ring-white/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Master AUTO</span>
          </button>

          <button
            onClick={() => setMasterMode('MANUAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              hasManualOverride
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 ring-1 ring-white/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>Master MANUAL</span>
          </button>
        </div>
      </div>

      {/* Manual Override Active Notice Banner */}
      {hasManualOverride && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-bold shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>⚠️ Manual Override Active – Certain appliances are currently locked by manual faculty settings.</span>
          </div>
          <button
            onClick={() => setMasterMode('AUTO')}
            className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-extrabold hover:bg-amber-400 transition-all shrink-0 ml-2"
          >
            Resume Auto Rules
          </button>
        </div>
      )}

      {/* 4 Appliance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* CARD 1: LIGHTS */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
          appliances.lights.isOn 
            ? 'border-amber-500/40 bg-amber-500/5 shadow-lg shadow-amber-500/5' 
            : 'border-slate-800 opacity-80'
        }`}>
          <div>
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl transition-all ${
                  appliances.lights.isOn ? 'bg-amber-500/20 text-amber-400 glow-amber' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Lighting Bank</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Zones A & B (LED)</span>
                </div>
              </div>

              {/* Mode Toggle */}
              <button
                onClick={() => setApplianceMode('lights', appliances.lights.mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all ${
                  appliances.lights.mode === 'AUTO'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                }`}
                title="Click to toggle AUTO / MANUAL mode"
              >
                {appliances.lights.mode === 'AUTO' ? 'AUTO' : 'MANUAL OVERRIDE'}
              </button>
            </div>

            {/* Power Meter & ON/OFF switch */}
            <div className="flex items-center justify-between my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Load</span>
                <div className="text-base font-extrabold font-mono text-white flex items-baseline gap-1">
                  {appliances.lights.isOn ? appliances.lights.powerWatts : 0}
                  <span className="text-[10px] font-normal text-slate-400">Watts</span>
                </div>
              </div>

              <button
                onClick={() => toggleAppliancePower('lights')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                  appliances.lights.isOn
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{appliances.lights.isOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Sub-controls: Brightness & Zone Toggles */}
            <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Dimming:</span>
                <span className="text-amber-400 font-mono font-bold">{appliances.lights.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={appliances.lights.brightness}
                onChange={(e) => setLightBrightness(Number(e.target.value))}
                className="w-full accent-amber-500"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => toggleLightZone(1)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                    appliances.lights.zone1On
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700'
                  }`}
                >
                  Zone A: {appliances.lights.zone1On ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => toggleLightZone(2)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                    appliances.lights.zone2On
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800/60 text-slate-500 border-slate-700'
                  }`}
                >
                  Zone B: {appliances.lights.zone2On ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Reason footer */}
          <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
            <span className="font-semibold text-slate-300">Logic: </span>
            {appliances.lights.autoReason}
          </div>
        </div>

        {/* CARD 2: FANS */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
          appliances.fans.isOn 
            ? 'border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' 
            : 'border-slate-800 opacity-80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl transition-all ${
                  appliances.fans.isOn ? 'bg-emerald-500/20 text-emerald-400 glow-emerald' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Fan className={`w-5 h-5 ${appliances.fans.isOn ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Ceiling Fans</h3>
                  <span className="text-[10px] text-slate-400 font-mono">BLDC Motor Dual Bank</span>
                </div>
              </div>

              <button
                onClick={() => setApplianceMode('fans', appliances.fans.mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all ${
                  appliances.fans.mode === 'AUTO'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                }`}
                title="Click to toggle AUTO / MANUAL mode"
              >
                {appliances.fans.mode === 'AUTO' ? 'AUTO' : 'MANUAL OVERRIDE'}
              </button>
            </div>

            <div className="flex items-center justify-between my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Load</span>
                <div className="text-base font-extrabold font-mono text-white flex items-baseline gap-1">
                  {appliances.fans.isOn ? appliances.fans.powerWatts : 0}
                  <span className="text-[10px] font-normal text-slate-400">Watts</span>
                </div>
              </div>

              <button
                onClick={() => toggleAppliancePower('fans')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                  appliances.fans.isOn
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{appliances.fans.isOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Sub-controls: 3-Speed Selector */}
            <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Speed Control:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {appliances.fans.speed === 0 ? 'OFF' : `Speed ${appliances.fans.speed}`}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setFanSpeed(spd)}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      appliances.fans.speed === spd
                        ? 'bg-emerald-500 text-slate-950 font-extrabold border-emerald-400 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {spd === 0 ? 'OFF' : `L${spd}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
            <span className="font-semibold text-slate-300">Logic: </span>
            {appliances.fans.autoReason}
          </div>
        </div>

        {/* CARD 3: AC UNIT */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
          appliances.ac.isOn 
            ? 'border-cyan-500/40 bg-cyan-500/5 shadow-lg shadow-cyan-500/5' 
            : 'border-slate-800 opacity-80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl transition-all ${
                  appliances.ac.isOn ? 'bg-cyan-500/20 text-cyan-400 glow-cyan' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Climate AC</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Inverter 2.0 Ton</span>
                </div>
              </div>

              <button
                onClick={() => setApplianceMode('ac', appliances.ac.mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all ${
                  appliances.ac.mode === 'AUTO'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                }`}
                title="Click to toggle AUTO / MANUAL mode"
              >
                {appliances.ac.mode === 'AUTO' ? 'AUTO' : 'MANUAL OVERRIDE'}
              </button>
            </div>

            <div className="flex items-center justify-between my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Load</span>
                <div className="text-base font-extrabold font-mono text-white flex items-baseline gap-1">
                  {appliances.ac.isOn ? appliances.ac.powerWatts : 0}
                  <span className="text-[10px] font-normal text-slate-400">Watts</span>
                </div>
              </div>

              <button
                onClick={() => toggleAppliancePower('ac')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                  appliances.ac.isOn
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{appliances.ac.isOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Sub-controls: Target Temp Stepper */}
            <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Thermostat Target:</span>
                <span className="text-cyan-400 font-mono font-bold">{appliances.ac.targetTemp}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAcTargetTemp(Math.max(18, appliances.ac.targetTemp - 1))}
                  className="flex-1 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
                >
                  - 1°C
                </button>
                <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-white text-center">
                  {appliances.ac.targetTemp}°C
                </div>
                <button
                  onClick={() => setAcTargetTemp(Math.min(30, appliances.ac.targetTemp + 1))}
                  className="flex-1 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-xs"
                >
                  + 1°C
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
            <span className="font-semibold text-slate-300">Logic: </span>
            {appliances.ac.autoReason}
          </div>
        </div>

        {/* CARD 4: SMART BOARD & PROJECTOR */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
          appliances.projector.isOn 
            ? 'border-blue-500/40 bg-blue-500/5 shadow-lg shadow-blue-500/5' 
            : 'border-slate-800 opacity-80'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl transition-all ${
                  appliances.projector.isOn ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  <Tv className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Smart Board</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Laser Projector 4K</span>
                </div>
              </div>

              <button
                onClick={() => setApplianceMode('projector', appliances.projector.mode === 'AUTO' ? 'MANUAL' : 'AUTO')}
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all ${
                  appliances.projector.mode === 'AUTO'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                }`}
                title="Click to toggle AUTO / MANUAL mode"
              >
                {appliances.projector.mode === 'AUTO' ? 'AUTO' : 'MANUAL OVERRIDE'}
              </button>
            </div>

            <div className="flex items-center justify-between my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Load</span>
                <div className="text-base font-extrabold font-mono text-white flex items-baseline gap-1">
                  {appliances.projector.isOn ? appliances.projector.powerWatts : 0}
                  <span className="text-[10px] font-normal text-slate-400">Watts</span>
                </div>
              </div>

              <button
                onClick={() => toggleAppliancePower('projector')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
                  appliances.projector.isOn
                    ? 'bg-blue-500 text-slate-950 font-extrabold shadow-md shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{appliances.projector.isOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Signal Input:</span>
                <span className="text-blue-400 font-mono font-bold">HDMI-1 Lab</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 text-center">
                {appliances.projector.isOn ? '● Mirroring Presentation' : '○ Standby Eco Sleep'}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-800/60">
            <span className="font-semibold text-slate-300">Logic: </span>
            {appliances.projector.autoReason}
          </div>
        </div>

      </div>

    </div>
  );
};
