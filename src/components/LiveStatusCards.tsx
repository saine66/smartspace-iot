import React from 'react';
import { 
  Users, 
  Thermometer, 
  Sun, 
  Zap, 
  Activity, 
  Leaf, 
  Info,
  TrendingDown,
  Clock
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const LiveStatusCards: React.FC = () => {
  const { 
    sensorData, 
    roomStatus, 
    energySavingMode, 
    selectedRoom,
    lastActionReason,
    isCountdownRunning,
    emptyCountdown
  } = useSmartSpace();

  // Determine temperature status label & color
  const temp = sensorData.temperature;
  let tempColor = 'text-emerald-400';
  let tempBg = 'bg-emerald-500/10 border-emerald-500/20';
  let tempLabel = 'Optimal Comfort';

  if (temp > 30) {
    tempColor = 'text-rose-400';
    tempBg = 'bg-rose-500/10 border-rose-500/20';
    tempLabel = 'High Heat (>28°C)';
  } else if (temp > 27) {
    tempColor = 'text-amber-400';
    tempBg = 'bg-amber-500/10 border-amber-500/20';
    tempLabel = 'Warm Ambient';
  } else if (temp < 22) {
    tempColor = 'text-sky-400';
    tempBg = 'bg-sky-500/10 border-sky-500/20';
    tempLabel = 'Cool Ambient (<24°C)';
  }

  // Determine power level label & color
  const power = sensorData.powerConsumption;
  let powerColor = 'text-emerald-400';
  let powerBg = 'bg-emerald-500/10 border-emerald-500/20';
  let powerLabel = 'Efficient Load';

  if (power >= 3.8) {
    powerColor = 'text-red-400';
    powerBg = 'bg-red-500/20 border-red-500/40 glow-rose animate-pulse';
    powerLabel = 'CRITICAL OVERLOAD';
  } else if (power >= 3.2) {
    powerColor = 'text-amber-400';
    powerBg = 'bg-amber-500/15 border-amber-500/30';
    powerLabel = 'High Consumption';
  } else if (power < 0.6) {
    powerColor = 'text-teal-400';
    powerBg = 'bg-teal-500/10 border-teal-500/20';
    powerLabel = 'Eco Standby';
  }

  // Room status badge
  const isOccupied = sensorData.occupancy > 0;
  const occupancyPercentage = Math.min(100, Math.round((sensorData.occupancy / selectedRoom.capacity) * 100));

  return (
    <div className="space-y-4">
      
      {/* Real-time Automation Reason Banner */}
      {lastActionReason && (
        <div className="flex items-start sm:items-center gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg text-xs backdrop-blur-md">
          <div className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block sm:inline mr-2">
              Autonomous Logic Engine:
            </span>
            <span className="font-semibold text-slate-200">
              {lastActionReason}
            </span>
          </div>
        </div>
      )}

      {/* 6 Key Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* 1. Occupancy Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-brand-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-400" />
              Occupancy
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isOccupied 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : isCountdownRunning
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {isOccupied ? 'ACTIVE' : isCountdownRunning ? 'VACANT (TIMING)' : 'EMPTY'}
            </span>
          </div>
          
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {sensorData.occupancy}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ {selectedRoom.capacity} students</span>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{occupancyPercentage}% Capacity</span>
              <span>Optical PIR Active</span>
            </div>
          </div>
        </div>

        {/* 2. Temperature Card */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all ${tempBg} group`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Thermometer className={`w-3.5 h-3.5 ${tempColor}`} />
              Temperature
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tempColor} bg-slate-900/60`}>
              {tempLabel}
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {sensorData.temperature.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">°C</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>DHT22 Precision: ±0.2°</span>
            <span className="font-semibold text-slate-300">Target: 24.0°C</span>
          </div>
        </div>

        {/* 3. Light Intensity Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              Light Intensity
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {sensorData.lightIntensity > 700 ? 'Daylight Boost' : sensorData.lightIntensity > 300 ? 'Moderate' : 'Low Lux'}
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {sensorData.lightIntensity}
              </span>
              <span className="text-xs text-slate-400 font-medium">lux (LDR)</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Harvesting: {sensorData.lightIntensity > 600 ? 'Active' : 'Off'}</span>
            <span className="font-semibold text-slate-300">Auto Dimming</span>
          </div>
        </div>

        {/* 4. Current Power Consumption Card */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all ${powerBg} group`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${powerColor}`} />
              Power Load
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${powerColor} bg-slate-900/60`}>
              {powerLabel}
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {power.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-400">kW</span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Threshold: 3.5 kW</span>
            <span className="font-semibold text-slate-300">ACS712 Live</span>
          </div>
        </div>

        {/* 5. Room Status Card */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-brand-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-400" />
              Room Status
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              Zone 1
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${
                roomStatus === 'OCCUPIED' 
                  ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse' 
                  : isCountdownRunning
                  ? 'bg-amber-500 shadow-lg shadow-amber-500/50 animate-ping'
                  : 'bg-teal-400'
              }`}></span>
              <span className="text-lg font-bold font-mono tracking-wide text-white uppercase">
                {isCountdownRunning ? 'EMPTY (TIMING)' : roomStatus}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
            {isCountdownRunning ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.floor(emptyCountdown / 60)}m {emptyCountdown % 60}s left
              </span>
            ) : (
              <span>{isOccupied ? 'Lectures in Progress' : 'No Presence'}</span>
            )}
            <span className="font-semibold text-slate-300">{selectedRoom.building}</span>
          </div>
        </div>

        {/* 6. Energy-Saving Mode Card */}
        <div className={`glass-panel p-4 rounded-2xl border transition-all ${
          energySavingMode 
            ? 'bg-teal-500/15 border-teal-500/40 glow-emerald' 
            : 'border-slate-800'
        } group`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Leaf className={`w-3.5 h-3.5 ${energySavingMode ? 'text-teal-300 animate-bounce-subtle' : 'text-slate-500'}`} />
              Eco Mode
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              energySavingMode 
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {energySavingMode ? 'ACTIVE' : 'OFF'}
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-extrabold font-mono tracking-tight ${
                energySavingMode ? 'text-teal-300' : 'text-slate-300'
              }`}>
                {energySavingMode ? 'ENABLED' : 'STANDBY'}
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>{energySavingMode ? 'Zero Load Idle' : 'Dynamic Auto'}</span>
            <span className="text-teal-400 font-semibold flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" />
              -35% Wastage
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
