import React from 'react';
import { SmartSpaceProvider, useSmartSpace } from './context/SmartSpaceContext';
import { Navigation } from './components/Navigation';
import { DashboardPage } from './components/pages/DashboardPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { RoomsDevicesPage } from './components/pages/RoomsDevicesPage';
import { AlertsInsightsPage } from './components/pages/AlertsInsightsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Esp32WokwiModal } from './components/Esp32WokwiModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';
import { RoomDetailModal } from './components/RoomDetailModal';
import { Zap, ShieldCheck, Award, Network, Cpu } from 'lucide-react';

const MainApplicationContent: React.FC = () => {
  const { 
    currentPage, 
    isHardwareModalOpen, 
    setIsHardwareModalOpen,
    setIsArchitectureModalOpen
  } = useSmartSpace();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* 1. Global Navigation Bar */}
      <Navigation />

      {/* Main Multi-Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'rooms' && <RoomsDevicesPage />}
        {currentPage === 'alerts' && <AlertsInsightsPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </main>

      {/* Institutional Application Footer */}
      <footer className="w-full bg-slate-900/90 border-t border-slate-800/80 py-6 px-4 lg:px-8 text-xs text-slate-400 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-slate-200">SmartSpace System</span>
            <span className="text-slate-600">|</span>
            <span>Intelligent Institutional Energy Management & Multi-Zone IoT Gateway</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              <Network className="w-3.5 h-3.5" />
              <span>IoT Architecture Flow</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setIsHardwareModalOpen(true)}
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>ESP32 Firmware</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Autonomous Rules Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="inline-flex items-center gap-1 text-amber-300">
              <Award className="w-3.5 h-3.5" />
              Competition Ready
            </span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <Esp32WokwiModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />

      <SystemArchitectureModal />

      <RoomDetailModal />

    </div>
  );
};

export default function App() {
  return (
    <SmartSpaceProvider>
      <MainApplicationContent />
    </SmartSpaceProvider>
  );
}
