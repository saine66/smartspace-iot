import React from 'react';
import { 
  Users, 
  UserMinus, 
  Flame, 
  AlertTriangle, 
  Sun, 
  FastForward,
  Clock,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const JudgeDemoBar: React.FC = () => {
  const { 
    runScenario, 
    activeScenario, 
    resetSimulation,
    isCountdownRunning, 
    emptyCountdown, 
    fastForwardCountdown,
    energySavingMode
  } = useSmartSpace();

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-y border-brand-500/20 px-4 lg:px-8 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-3">
        
        {/* Left: Prominent DEMO MODE Badge */}
        <div className="flex items-center gap-2.5 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-xs tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>DEMO MODE ACTIVE</span>
            </div>
          </div>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            title="Reset Simulation to initial baseline (24 students, 27.5°C, 1.24 kW)"
          >
            <RotateCcw className="w-3 h-3 text-emerald-400" />
            <span>Reset Simulation</span>
          </button>
        </div>

        {/* Center: Quick Scenario Launchers */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-start xl:justify-center">
          
          {/* Scenario 1: Normal Lab Session */}
          <button
            onClick={() => runScenario('demo-1')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'demo-1'
                ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-md shadow-brand-500/10 ring-1 ring-brand-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/60 hover:text-white'
            }`}
            title="Demo 1: Occupancy=24, Temp=27.5°C -> Room Occupied, Lights ON, Fans active"
          >
            <Users className="w-3.5 h-3.5 text-brand-400" />
            <span>1: Normal Lab (24 Students)</span>
          </button>

          {/* Scenario 2: Class Leaves (Occupancy = 0) */}
          <button
            onClick={() => runScenario('demo-2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'demo-2'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/60 hover:text-white'
            }`}
            title="Demo 2: Occupancy=0 -> Starts empty-room countdown -> Auto shutoff & Eco Mode"
          >
            <UserMinus className="w-3.5 h-3.5 text-amber-400" />
            <span>2: Class Leaves (0 Students)</span>
          </button>

          {/* Scenario 3: Temp > 28°C */}
          <button
            onClick={() => runScenario('demo-3')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'demo-3'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/60 hover:text-white'
            }`}
            title="Demo 3: Temp=31°C (>28°C) -> High Temp Alert & Fans Auto ON"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>3: High Temp (31°C)</span>
          </button>

          {/* Scenario 4: Power Surge > 4 kW */}
          <button
            onClick={() => runScenario('demo-4')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'demo-4'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/60 hover:text-white'
            }`}
            title="Demo 4: Power surge 4.25 kW -> Critical anomaly alert"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
            <span>4: Power Surge (&gt;4 kW)</span>
          </button>

          {/* Scenario 5: Daylight Saver (880 lux) */}
          <button
            onClick={() => runScenario('demo-5')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              activeScenario === 'demo-5'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700/60 hover:text-white'
            }`}
            title="Demo 5: Light 880 lux -> Auto Dimming"
          >
            <Sun className="w-3.5 h-3.5 text-sky-400" />
            <span>5: Daylight Saver</span>
          </button>
        </div>

        {/* Right: Real-Time Vacancy Countdown Timer Badge */}
        {(isCountdownRunning || energySavingMode) && (
          <div className="flex items-center gap-3 w-full xl:w-auto bg-slate-900/90 border border-amber-500/30 rounded-xl px-3 py-1.5 shadow-md">
            {isCountdownRunning ? (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase text-amber-400">Empty Timer:</span>
                    <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                      {emptyCountdown}s
                    </span>
                  </div>
                </div>

                <button
                  onClick={fastForwardCountdown}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all"
                  title="Finish empty room timer immediately"
                >
                  <FastForward className="w-3 h-3" />
                  <span>Jump</span>
                </button>
              </>
            ) : energySavingMode ? (
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Eco Mode: Zero Wastage</span>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
