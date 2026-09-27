import React from 'react';
import { 
  Settings as SettingsIcon, 
  Clock, 
  Thermometer, 
  Zap, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Cpu
} from 'lucide-react';
import { useSmartSpace } from '../../context/SmartSpaceContext';

export const SettingsPage: React.FC = () => {
  const { 
    systemSettings, 
    updateSetting, 
    resetSettingsToDefault,
    emptyCountdownDuration,
    setEmptyCountdownDuration,
    simSpeed,
    setSimSpeed,
    soundEnabled,
    toggleSound
  } = useSmartSpace();

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                System & Policy Configuration
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">
                GLOBAL SETTINGS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Configure autonomous IoT rule thresholds, vacancy timeouts, operating modes & hardware bridge parameters
            </p>
          </div>
        </div>

        <button
          onClick={resetSettingsToDefault}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reset Factory Defaults</span>
        </button>
      </div>

      {/* Settings Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: VACANCY & TIMEOUT RULES */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Vacancy & Energy-Saving Timeout
              </h3>
              <p className="text-[11px] text-slate-400">
                Rule 2: Countdown before automatic appliance power-down
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Empty Room Timeout Duration:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
                {[
                  { label: '10s (Demo)', val: 10 },
                  { label: '30s', val: 30 },
                  { label: '60s', val: 60 },
                  { label: '10m (Std)', val: 600 },
                ].map((option) => (
                  <button
                    key={option.val}
                    onClick={() => {
                      updateSetting('emptyTimeoutSeconds', option.val);
                      setEmptyCountdownDuration(option.val);
                    }}
                    className={`py-2 rounded-xl border transition-all ${
                      emptyCountdownDuration === option.val
                        ? 'bg-amber-500 text-slate-950 font-extrabold border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                Select 10s for fast live presentation before competition judges.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Simulation Clock Speed:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
                {[1, 5, 20, 60].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`py-2 rounded-xl border transition-all ${
                      simSpeed === spd
                        ? 'bg-brand-500 text-white border-brand-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {spd}x Clock
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: THERMAL COMFORT THRESHOLDS */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Thermal Comfort & Fan Policies
              </h3>
              <p className="text-[11px] text-slate-400">
                Rules 3 & 4: Automatic cooling triggers
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">High Temp Fan Trigger (Rule 3):</span>
                <span className="font-mono font-bold text-rose-400">{systemSettings.tempComfortThreshold.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="26.0"
                max="34.0"
                step="0.5"
                value={systemSettings.tempComfortThreshold}
                onChange={(e) => updateSetting('tempComfortThreshold', Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                <span>26.0°C (Sensitive)</span>
                <span className="text-white font-bold">28.0°C (Default)</span>
                <span>34.0°C (Relaxed)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Cool Room Conservation (Rule 4):</span>
                <span className="font-mono font-bold text-sky-400">{systemSettings.coolRoomThreshold.toFixed(1)}°C</span>
              </div>
              <input
                type="range"
                min="20.0"
                max="26.0"
                step="0.5"
                value={systemSettings.coolRoomThreshold}
                onChange={(e) => updateSetting('coolRoomThreshold', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                <span>20.0°C</span>
                <span className="text-white font-bold">24.0°C (Default)</span>
                <span>26.0°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: POWER CONSUMPTION THRESHOLDS */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Power Surge & Anomaly Limits
              </h3>
              <p className="text-[11px] text-slate-400">
                Rule 5: Warning & critical overload thresholds
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">High Load Warning Threshold:</span>
                <span className="font-mono font-bold text-amber-400">{systemSettings.highPowerThresholdKw.toFixed(1)} kW</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="4.0"
                step="0.2"
                value={systemSettings.highPowerThresholdKw}
                onChange={(e) => updateSetting('highPowerThresholdKw', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                <span>2.0 kW</span>
                <span className="text-white font-bold">3.0 kW (Default)</span>
                <span>4.0 kW</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-300">Critical Power Spike Threshold:</span>
                <span className="font-mono font-bold text-red-400">{systemSettings.criticalPowerThresholdKw.toFixed(1)} kW</span>
              </div>
              <input
                type="range"
                min="3.5"
                max="5.0"
                step="0.2"
                value={systemSettings.criticalPowerThresholdKw}
                onChange={(e) => updateSetting('criticalPowerThresholdKw', Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
                <span>3.5 kW</span>
                <span className="text-white font-bold">4.0 kW (Default)</span>
                <span>5.0 kW</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: OPERATING MODE & DEMO BEHAVIOR */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Operating Mode & UI Feedback
              </h3>
              <p className="text-[11px] text-slate-400">
                Default startup state and judge demo controls
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Default Operating Mode:</span>
                <span className="text-slate-400 text-[11px]">Choose default control behavior on boot</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => updateSetting('defaultOperatingMode', 'AUTO')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    systemSettings.defaultOperatingMode === 'AUTO'
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  AUTO
                </button>
                <button
                  onClick={() => updateSetting('defaultOperatingMode', 'MANUAL')}
                  className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    systemSettings.defaultOperatingMode === 'MANUAL'
                      ? 'bg-amber-500 text-slate-950 font-extrabold'
                      : 'text-slate-400'
                  }`}
                >
                  MANUAL
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Demo Mode Banner:</span>
                <span className="text-slate-400 text-[11px]">Display active competition badge</span>
              </div>
              <button
                onClick={() => updateSetting('demoModeEnabled', !systemSettings.demoModeEnabled)}
                className={`px-3 py-1 rounded-xl font-bold text-xs border ${
                  systemSettings.demoModeEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {systemSettings.demoModeEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-white block">Audio Sound Effects:</span>
                <span className="text-slate-400 text-[11px]">Web Audio API tactile chimes & alerts</span>
              </div>
              <button
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-xs border ${
                  soundEnabled
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-brand-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                <span>{soundEnabled ? 'ACTIVE' : 'MUTED'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
