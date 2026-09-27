import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Zap, 
  Lightbulb, 
  Fan, 
  Wind, 
  Sliders, 
  Search, 
  ExternalLink,
  Radio,
  Cpu
} from 'lucide-react';
import { useSmartSpace } from '../../context/SmartSpaceContext';
import type { CollegeRoom } from '../../types';

export const RoomsDevicesPage: React.FC = () => {
  const { 
    collegeRooms, 
    setSelectedModalRoom, 
    setCurrentPage, 
    setSelectedRoom, 
    roomOptions,
    setIsHardwareModalOpen
  } = useSmartSpace();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterHealth, setFilterHealth] = useState<string>('all');

  const filteredRooms = collegeRooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          room.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = filterFloor === 'all' || room.floor.includes(filterFloor);
    const matchesHealth = filterHealth === 'all' || room.healthStatus === filterHealth;
    return matchesSearch && matchesFloor && matchesHealth;
  });

  const getStatusBadge = (health: CollegeRoom['healthStatus']) => {
    switch (health) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            RED: CRITICAL
          </span>
        );
      case 'ATTENTION':
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            YELLOW: ATTENTION
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GREEN: NORMAL
          </span>
        );
    }
  };

  const handleInspectRoom = (room: CollegeRoom) => {
    setSelectedModalRoom(room);
  };

  const handleLaunchSimulator = (room: CollegeRoom) => {
    const match = roomOptions.find(r => r.id === room.id);
    if (match) setSelectedRoom(match);
    setCurrentPage('dashboard');
  };

  // Building Aggregate KPIs
  const totalOccupancy = collegeRooms.reduce((acc, r) => acc + r.occupancy, 0);
  const totalPowerKw = collegeRooms.reduce((acc, r) => acc + r.powerKw, 0);
  const totalLightsOn = collegeRooms.filter((r) => r.lightsOn).length;
  const totalFansOn = collegeRooms.filter((r) => r.fansOn).length;
  const totalAcOn = collegeRooms.filter((r) => r.acOn).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Rooms & Connected Devices
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">
                TURING BLOCK SIMULATION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Campus multi-zone laboratory & classroom building monitoring with per-device telemetry
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsHardwareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all"
        >
          <Cpu className="w-4 h-4" />
          <span>Provision New ESP32 Node</span>
        </button>
      </div>

      {/* Building Summary Quick Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Active Rooms</span>
            <span className="text-xl font-extrabold font-mono text-white">{collegeRooms.length} Zones</span>
          </div>
          <Building2 className="w-5 h-5 text-brand-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Campus Occupancy</span>
            <span className="text-xl font-extrabold font-mono text-brand-300">{totalOccupancy} Students</span>
          </div>
          <Users className="w-5 h-5 text-brand-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Power</span>
            <span className="text-xl font-extrabold font-mono text-purple-300">{totalPowerKw.toFixed(2)} kW</span>
          </div>
          <Zap className="w-5 h-5 text-purple-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Active Lights</span>
            <span className="text-xl font-extrabold font-mono text-amber-300">{totalLightsOn} / {collegeRooms.length} Rooms</span>
          </div>
          <Lightbulb className="w-5 h-5 text-amber-400" />
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">HVAC & Fans</span>
            <span className="text-xl font-extrabold font-mono text-cyan-300">{totalAcOn + totalFansOn} Units</span>
          </div>
          <Wind className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rooms, laboratories, wings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Floor:</span>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Floors</option>
              <option value="Ground" className="bg-slate-900 text-white">Ground Floor</option>
              <option value="1st" className="bg-slate-900 text-white">1st Floor</option>
              <option value="2nd" className="bg-slate-900 text-white">2nd Floor</option>
              <option value="3rd" className="bg-slate-900 text-white">3rd Floor</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Health:</span>
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Statuses</option>
              <option value="NORMAL" className="bg-slate-900 text-emerald-400">Green: Normal</option>
              <option value="ATTENTION" className="bg-slate-900 text-amber-400">Yellow: Attention</option>
              <option value="CRITICAL" className="bg-slate-900 text-red-400">Red: Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campus Rooms Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const isLiveSimulatorRoom = room.isSimulatedLiveRoom;

          return (
            <div
              key={room.id}
              className={`glass-panel p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between hover:shadow-2xl ${
                isLiveSimulatorRoom
                  ? 'border-brand-500/50 bg-slate-900/95 ring-1 ring-brand-500/30'
                  : 'border-slate-800 bg-slate-900/90'
              }`}
            >
              <div>
                {/* Room Top Bar */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-white">
                        {room.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {room.building} • {room.floor}
                    </p>
                  </div>

                  {getStatusBadge(room.healthStatus)}
                </div>

                {isLiveSimulatorRoom && (
                  <div className="mb-3 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-between text-[11px] text-brand-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
                      Live Interactive Simulator Node
                    </span>
                    <span className="font-mono text-[10px] text-brand-400">GPIO ACTIVE</span>
                  </div>
                )}

                {/* 3 Core Sensor Readings Grid */}
                <div className="grid grid-cols-3 gap-2.5 my-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-semibold block">Occupancy</span>
                    <span className="text-sm font-extrabold font-mono text-white">
                      {room.occupancy} <span className="text-[10px] font-normal text-slate-400">/{room.capacity}</span>
                    </span>
                  </div>

                  <div className="text-center border-x border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block">Temp</span>
                    <span className="text-sm font-extrabold font-mono text-rose-400">
                      {room.temperature.toFixed(1)}°C
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-semibold block">Power</span>
                    <span className={`text-sm font-extrabold font-mono ${room.powerKw > 3.0 ? 'text-amber-400' : 'text-purple-300'}`}>
                      {room.powerKw.toFixed(2)} kW
                    </span>
                  </div>
                </div>

                {/* Actuator State Badges */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Appliance Actuators:
                  </span>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className={`p-2 rounded-xl border flex items-center justify-between ${
                      room.lightsOn 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Lights</span>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold">{room.lightsOn ? 'ON' : 'OFF'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center justify-between ${
                      room.fansOn 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Fan className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">Fans</span>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold">{room.fansOn ? 'ON' : 'OFF'}</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center justify-between ${
                      room.acOn 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">AC</span>
                      </div>
                      <span className="font-mono text-[10px] font-extrabold">{room.acOn ? 'ON' : 'OFF'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleInspectRoom(room)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Details</span>
                </button>

                {isLiveSimulatorRoom && (
                  <button
                    onClick={() => handleLaunchSimulator(room)}
                    className="flex-1 py-2 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Control Live</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
