import React, { useState } from 'react';
import { 
  Lightbulb, 
  Fan, 
  Wind, 
  Monitor, 
  Users, 
  Radio, 
  Eye, 
  Layers, 
  Thermometer, 
  Sun
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const ClassroomVisualizer: React.FC = () => {
  const { 
    sensorData, 
    appliances, 
    selectedRoom,
    isCountdownRunning,
    emptyCountdown
  } = useSmartSpace();

  const [viewMode, setViewMode] = useState<'floorplan' | 'schematic'>('floorplan');
  const [hoveredDesk, setHoveredDesk] = useState<number | null>(null);

  // Total desk stations in this visual layout: 32 workstations (4 rows of 8)
  const totalDesks = 32;
  const occupiedCount = Math.min(sensorData.occupancy, totalDesks);

  // Generate desk layout
  const desks = Array.from({ length: totalDesks }, (_, index) => {
    const isDeskOccupied = index < occupiedCount;
    const row = Math.floor(index / 8);
    const col = index % 8;
    return { id: index + 1, row, col, isDeskOccupied };
  });

  // Fan rotation class based on state
  const fanSpinClass = appliances.fans.isOn
    ? appliances.fans.speed === 3
      ? 'animate-spin-fast'
      : appliances.fans.speed === 2
      ? 'animate-spin'
      : 'animate-spin-slow'
    : '';

  // Lighting overlay ambiance
  const lightsOn = appliances.lights.isOn;
  const brightness = appliances.lights.brightness;
  const ambientLux = sensorData.lightIntensity;

  // Background tint calculation
  const roomLightingStyle = lightsOn
    ? {
        backgroundColor: `rgba(15, 23, 42, ${Math.max(0.4, 0.95 - (brightness / 100) * 0.35)})`,
        boxShadow: `inset 0 0 100px rgba(251, 191, 36, ${0.05 + (brightness / 100) * 0.12})`,
      }
    : {
        backgroundColor: 'rgba(5, 8, 15, 0.95)',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8)',
      };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Live Laboratory Digital Twin
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {selectedRoom.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time physical spatial simulation & automated appliance actuation
            </p>
          </div>
        </div>

        {/* View toggles & Environmental Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
            <span className="flex items-center gap-1 text-amber-300">
              <Sun className="w-3 h-3" />
              {ambientLux} lx
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <Thermometer className="w-3 h-3" />
              {sensorData.temperature.toFixed(1)}°C
            </span>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'floorplan' ? 'schematic' : 'floorplan')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-brand-400" />
            <span className="capitalize">{viewMode} View</span>
          </button>
        </div>
      </div>

      {/* Interactive Digital Twin Laboratory Room Stage */}
      <div 
        className="relative rounded-2xl border border-slate-800 p-6 transition-all duration-700 min-h-[360px] flex flex-col justify-between overflow-hidden"
        style={roomLightingStyle}
      >
        
        {/* Ceiling Lights Layer (Zone 1 & Zone 2) */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((lightIdx) => {
            const isZone1 = lightIdx <= 2;
            const isZoneActive = isZone1 ? appliances.lights.zone1On : appliances.lights.zone2On;
            const isBulbLit = lightsOn && isZoneActive;

            return (
              <div 
                key={lightIdx} 
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 border ${
                  isBulbLit 
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_35px_rgba(251,191,36,0.35)]' 
                    : 'bg-slate-900/60 border-slate-800 opacity-40'
                }`}
              >
                <div className="relative">
                  <Lightbulb className={`w-6 h-6 transition-all duration-300 ${
                    isBulbLit ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]' : 'text-slate-600'
                  }`} />
                  {isBulbLit && (
                    <span className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm animate-pulse"></span>
                  )}
                </div>
                <span className="text-[10px] font-mono font-bold mt-1 text-slate-300">
                  LED #{lightIdx} {isBulbLit ? `(${brightness}%)` : '(OFF)'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Middle Level: Ceiling Fans & HVAC Split Unit */}
        <div className="flex items-center justify-between px-4 py-2 my-2 relative">
          
          {/* Ceiling Fan 1 */}
          <div className="flex flex-col items-center">
            <div className={`p-3 rounded-full border transition-all duration-300 ${
              appliances.fans.isOn 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-slate-900/60 border-slate-800 text-slate-600'
            }`}>
              <Fan className={`w-8 h-8 ${fanSpinClass}`} />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold">
              Fan A {appliances.fans.isOn ? `(Spd ${appliances.fans.speed})` : '(IDLE)'}
            </span>
          </div>

          {/* Teacher Stage / Interactive Whiteboard in Center */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-xl max-w-xs w-full text-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-1">
              <Monitor className={`w-4 h-4 ${appliances.projector.isOn ? 'text-blue-400' : 'text-slate-600'}`} />
              <span>Smart Teaching Podium</span>
            </div>
            <div className={`w-full py-1.5 px-3 rounded text-[11px] font-mono transition-all ${
              appliances.projector.isOn 
                ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              {appliances.projector.isOn ? '● ACTIVE: IoT Lab Slide 4/12' : '○ STANDBY'}
            </div>
          </div>

          {/* Ceiling Fan 2 */}
          <div className="flex flex-col items-center">
            <div className={`p-3 rounded-full border transition-all duration-300 ${
              appliances.fans.isOn 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-slate-900/60 border-slate-800 text-slate-600'
            }`}>
              <Fan className={`w-8 h-8 ${fanSpinClass}`} />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 font-semibold">
              Fan B {appliances.fans.isOn ? `(Spd ${appliances.fans.speed})` : '(IDLE)'}
            </span>
          </div>

          {/* Climate AC Airflow Unit (Top Right) */}
          <div className="absolute right-4 -top-3 flex items-center gap-2 p-2 bg-slate-900/90 border border-cyan-500/30 rounded-xl shadow-lg">
            <Wind className={`w-5 h-5 ${appliances.ac.isOn ? 'text-cyan-400 animate-pulse' : 'text-slate-600'}`} />
            <div className="text-[10px] font-mono">
              <div className="font-bold text-cyan-300">HVAC Split AC</div>
              <div className="text-slate-400">{appliances.ac.isOn ? `${appliances.ac.targetTemp}°C Cooling` : 'OFF'}</div>
            </div>
          </div>

        </div>

        {/* Desks Grid with Dynamic Animated Student Avatars */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-brand-400" />
              Student Laboratory Workstations ({sensorData.occupancy} Active)
            </span>
            <span>Capacity: {selectedRoom.capacity} Seats</span>
          </div>

          <div className="grid grid-cols-8 gap-2">
            {desks.map((desk) => (
              <div
                key={desk.id}
                onMouseEnter={() => setHoveredDesk(desk.id)}
                onMouseLeave={() => setHoveredDesk(null)}
                className={`group relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer border ${
                  desk.isDeskOccupied
                    ? 'bg-brand-500/15 border-brand-500/40 text-brand-300 shadow-sm shadow-brand-500/20 hover:scale-105 hover:bg-brand-500/25'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-600 hover:border-slate-700'
                }`}
              >
                {/* Desk PC / Avatar Icon */}
                <div className="relative">
                  {desk.isDeskOccupied ? (
                    <div className="relative flex items-center justify-center">
                      {/* Animated Student Avatar */}
                      <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/30">
                        {desk.id}
                      </span>
                      <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse"></span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] text-slate-500 font-mono">
                      {desk.id}
                    </div>
                  )}
                </div>

                <span className="text-[9px] font-mono mt-1 text-slate-400 group-hover:text-white transition-colors">
                  PC-{String(desk.id).padStart(2, '0')}
                </span>

                {/* Hover Tooltip */}
                {hoveredDesk === desk.id && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950 border border-brand-500/40 text-white rounded-lg shadow-2xl text-[10px] whitespace-nowrap z-30 pointer-events-none">
                    <p className="font-bold text-brand-400">Station #{desk.id}</p>
                    <p className="text-slate-300">Status: {desk.isDeskOccupied ? 'Occupied (Laptop Active)' : 'Vacant'}</p>
                    <p className="text-slate-400">Power: {desk.isDeskOccupied ? '32W Active' : '0W Idle'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Entrance / Exit Door with PIR Sensor */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
              <Radio className={`w-3.5 h-3.5 ${sensorData.occupancy > 0 ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-[11px] font-mono font-bold text-slate-300">
                PIR Motion Sensor: {sensorData.occupancy > 0 ? 'PRESENCE DETECTED' : 'NO MOTION'}
              </span>
            </div>

            {isCountdownRunning && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                <span>Auto-Off Timer: {Math.floor(emptyCountdown / 60)}m {emptyCountdown % 60}s</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Room Door: Unlocked</span>
          </div>
        </div>

      </div>

    </div>
  );
};
