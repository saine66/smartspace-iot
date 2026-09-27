import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Layers, 
  Bell, 
  Settings, 
  Zap, 
  Volume2, 
  VolumeX, 
  Cpu, 
  Network, 
  Menu, 
  X
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import type { NavigationPage } from '../types';

export const Navigation: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    soundEnabled, 
    toggleSound, 
    alerts,
    setIsArchitectureModalOpen,
    setIsHardwareModalOpen
  } = useSmartSpace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Energy Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'rooms', label: 'Rooms & Devices', icon: <Layers className="w-4 h-4" /> },
    { 
      id: 'alerts', 
      label: 'Alerts & Insights', 
      icon: <Bell className="w-4 h-4" />,
      badge: alerts.filter(a => a.type === 'critical' || a.type === 'warning').length 
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <nav className="w-full bg-slate-900/95 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between py-3 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 shadow-lg shadow-brand-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                    SmartSpace
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    IoT Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Intelligent Institutional Energy Management
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 ring-1 ring-white/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-slate-950 text-amber-300' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Architecture, ESP32, Sound, Time) */}
          <div className="flex items-center gap-2">
            
            {/* System Architecture Flow Modal Trigger */}
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all"
              title="View Real-World IoT System Architecture Diagram"
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span>IoT Flow</span>
            </button>

            {/* ESP32 Firmware / Wokwi Modal */}
            <button
              onClick={() => setIsHardwareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 border border-blue-400/30 transition-all transform hover:scale-105"
              title="Open ESP32 Firmware & Wokwi Circuit Bridge"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ESP32 Bridge</span>
              <span className="sm:hidden">ESP32</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-slate-800 text-brand-400 border-slate-700 hover:border-brand-500/50'
                  : 'bg-slate-800/50 text-slate-500 border-slate-700'
              }`}
              title={soundEnabled ? 'Audio Feedback Active' : 'Sound Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1.5 animate-fadeIn">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  currentPage === item.id
                    ? 'bg-brand-500 text-white font-extrabold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs px-2 text-slate-400">
              <button
                onClick={() => {
                  setIsArchitectureModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-cyan-400 font-bold"
              >
                <Network className="w-3.5 h-3.5" />
                <span>IoT System Architecture</span>
              </button>
              <span>{formattedTime}</span>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};
