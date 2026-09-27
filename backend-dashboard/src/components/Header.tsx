import React from 'react';
import { 
  Zap, 
  Wifi, 
  Clock, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

interface HeaderProps {
  onOpenHardwareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenHardwareModal }) => {
  const {
    selectedRoom,
    setSelectedRoom,
    roomOptions,
    soundEnabled,
    toggleSound,
    simSpeed,
    setSimSpeed,
    energySavingMode
  } = useSmartSpace();

  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
              <Zap className="w-6 h-6 text-white animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  SmartSpace
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    v2.4 IoT Pro
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Intelligent Classroom & Laboratory Energy Management
              </p>
            </div>
          </div>

          {/* Mobile status indicator */}
          <div className="md:hidden flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>

        {/* Center: Current Room Selector & System Status Badge */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
          
          {/* Room Selector Dropdown */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-inner">
            <Layers className="w-4 h-4 text-brand-400 mr-2" />
            <span className="text-xs text-slate-400 mr-2 font-medium">Room:</span>
            <select
              value={selectedRoom.id}
              onChange={(e) => {
                const room = roomOptions.find((r) => r.id === e.target.value);
                if (room) setSelectedRoom(room);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer hover:text-brand-300 transition-colors"
            >
              {roomOptions.map((room) => (
                <option key={room.id} value={room.id} className="bg-slate-900 text-white py-1">
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Online Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
            <Wifi className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>SYSTEM: ONLINE</span>
          </div>

          {/* Energy Saving Mode Indicator */}
          {energySavingMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>ECO MODE ACTIVE</span>
            </div>
          )}
        </div>

        {/* Right: Date/Time, Sim Speed, Sound & ESP32 Modal launcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Clock & Date */}
          <div className="hidden lg:flex flex-col items-end text-right">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formattedTime}</span>
            </div>
            <span className="text-[11px] text-slate-400">{formattedDate}</span>
          </div>

          {/* Simulation Speed Selector */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 px-1.5 hidden sm:inline">SPEED:</span>
            {[1, 5, 20, 60].map((speed) => (
              <button
                key={speed}
                onClick={() => setSimSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                  simSpeed === speed
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
                title={`${speed}x Simulation Clock Speed`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled
                ? 'bg-slate-800 text-brand-400 border-slate-700 hover:border-brand-500/50'
                : 'bg-slate-800/50 text-slate-500 border-slate-700 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Sound Effects Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* ESP32 / Wokwi Hardware Bridge Launcher */}
          <button
            onClick={onOpenHardwareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 border border-blue-400/30 transition-all transform hover:scale-105"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ESP32 / Wokwi</span>
            <span className="sm:hidden">IoT</span>
          </button>
        </div>

      </div>
    </header>
  );
};
