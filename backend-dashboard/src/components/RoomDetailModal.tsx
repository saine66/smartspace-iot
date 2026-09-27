import React from 'react';
import { 
  X, 
  Layers, 
  Users, 
  Thermometer, 
  Zap, 
  Lightbulb, 
  Fan, 
  Wind, 
  Activity, 
  ShieldCheck, 
  Sliders
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const RoomDetailModal: React.FC = () => {
  const { selectedModalRoom, setSelectedModalRoom, setCurrentPage } = useSmartSpace();

  if (!selectedModalRoom) return null;

  const room = selectedModalRoom;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {room.name}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  room.healthStatus === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : room.healthStatus === 'ATTENTION'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {room.healthStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {room.building} • {room.floor} • Capacity: {room.capacity} seats
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedModalRoom(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* 4 Core Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-semibold">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                Occupancy
              </span>
              <div className="text-lg font-extrabold font-mono text-white">
                {room.occupancy} <span className="text-xs font-normal text-slate-400">/ {room.capacity}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-semibold">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Temperature
              </span>
              <div className="text-lg font-extrabold font-mono text-white">
                {room.temperature.toFixed(1)} <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-semibold">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Power Load
              </span>
              <div className="text-lg font-extrabold font-mono text-purple-300">
                {room.powerKw.toFixed(2)} <span className="text-xs font-normal text-slate-400">kW</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1 font-semibold">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Status
              </span>
              <div className="text-sm font-extrabold font-mono text-emerald-400 uppercase mt-0.5">
                {room.status}
              </div>
            </div>
          </div>

          {/* Connected Device Actuator States */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected IoT Appliance Channels:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Lightbulb className={`w-4 h-4 ${room.lightsOn ? 'text-amber-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-bold text-slate-200">Lighting</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  room.lightsOn ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {room.lightsOn ? 'ON' : 'OFF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Fan className={`w-4 h-4 ${room.fansOn ? 'text-emerald-400 animate-spin' : 'text-slate-600'}`} />
                  <span className="text-xs font-bold text-slate-200">BLDC Fans</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  room.fansOn ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {room.fansOn ? 'ACTIVE' : 'OFF'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <Wind className={`w-4 h-4 ${room.acOn ? 'text-cyan-400' : 'text-slate-600'}`} />
                  <span className="text-xs font-bold text-slate-200">Inverter AC</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  room.acOn ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {room.acOn ? 'COOLING' : 'OFF'}
                </span>
              </div>
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Automated Energy Rules Active:</span>
              <span>This room is synchronized with SmartSpace campus governance. Vacancy countdown and thermal threshold logic are active.</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          {room.isSimulatedLiveRoom ? (
            <button
              onClick={() => {
                setCurrentPage('dashboard');
                setSelectedModalRoom(null);
              }}
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Control in Live Simulator</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              Campus Telemetry Active
            </span>
          )}

          <button
            onClick={() => setSelectedModalRoom(null)}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
