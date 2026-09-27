import React from 'react';
import { 
  Building2, 
  Users, 
  Thermometer, 
  Zap, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import type { CollegeRoom } from '../types';

export const BuildingOverview: React.FC = () => {
  const { 
    collegeRooms, 
    setSelectedModalRoom,
    setCurrentPage,
    setSelectedRoom,
    roomOptions
  } = useSmartSpace();

  const getHealthBadge = (health: CollegeRoom['healthStatus']) => {
    switch (health) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            CRITICAL
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            ATTENTION
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            NORMAL
          </span>
        );
    }
  };

  const handleRoomClick = (room: CollegeRoom) => {
    setSelectedModalRoom(room);
    if (room.isSimulatedLiveRoom) {
      const match = roomOptions.find(r => r.id === room.id);
      if (match) setSelectedRoom(match);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900/80">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Campus Building Overview
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                CSE & Science Block
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Multi-room institutional IoT telemetry and live zonal health indicators
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('rooms')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-400 text-xs font-bold transition-all border border-slate-700 hover:border-brand-500/40"
        >
          <span>All Rooms & Devices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Simulated Campus Rooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {collegeRooms.map((room) => {
          const isLiveSimulatorRoom = room.isSimulatedLiveRoom;

          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] ${
                isLiveSimulatorRoom
                  ? 'bg-slate-950/80 border-brand-500/40 ring-1 ring-brand-500/20 shadow-md shadow-brand-500/10'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Title & Health Status */}
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold">
                    {room.floor}
                  </span>
                  {getHealthBadge(room.healthStatus)}
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-300 transition-colors truncate">
                    {room.name}
                  </h4>
                </div>

                {isLiveSimulatorRoom && (
                  <span className="inline-block text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300 mb-2 border border-brand-500/30">
                    ● ACTIVE SIMULATOR
                  </span>
                )}
              </div>

              {/* Room Stats */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3 text-brand-400" />
                    Occupancy:
                  </span>
                  <span className="font-bold">{room.occupancy}/{room.capacity}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Thermometer className="w-3 h-3 text-rose-400" />
                    Temp:
                  </span>
                  <span className="font-bold">{room.temperature.toFixed(1)}°C</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Zap className="w-3 h-3 text-purple-400" />
                    Load:
                  </span>
                  <span className={`font-bold ${room.powerKw > 3.0 ? 'text-amber-400' : 'text-white'}`}>
                    {room.powerKw.toFixed(2)} kW
                  </span>
                </div>
              </div>

              {/* Action Hint */}
              <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-slate-300">
                <span>View Details</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
