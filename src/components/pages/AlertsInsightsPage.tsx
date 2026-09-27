import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info, 
  Search, 
  Download, 
  Trash2, 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  Building2
} from 'lucide-react';
import { useSmartSpace } from '../../context/SmartSpaceContext';
import type { AlertEvent } from '../../types';

export const AlertsInsightsPage: React.FC = () => {
  const { alerts, clearAlerts, intelligentInsights, collegeRooms } = useSmartSpace();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterRoom, setFilterRoom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = 
      filterSeverity === 'all' || 
      (filterSeverity === 'critical' && (alert.type === 'critical' || alert.type === 'error')) ||
      (filterSeverity === 'warning' && alert.type === 'warning') ||
      (filterSeverity === 'success' && alert.type === 'success') ||
      (filterSeverity === 'info' && alert.type === 'info');

    const matchesRoom = filterRoom === 'all' || alert.room === filterRoom;
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.room && alert.room.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSeverity && matchesRoom && matchesSearch;
  });

  const getAlertIcon = (type: AlertEvent['type']) => {
    switch (type) {
      case 'critical':
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getAlertCardStyle = (type: AlertEvent['type']) => {
    switch (type) {
      case 'critical':
      case 'error':
        return 'border-red-500/40 bg-red-500/10 ring-1 ring-red-500/30';
      case 'warning':
        return 'border-amber-500/40 bg-amber-500/10';
      case 'success':
        return 'border-emerald-500/40 bg-emerald-500/10';
      case 'info':
      default:
        return 'border-cyan-500/30 bg-cyan-500/5';
    }
  };

  const handleExportCSV = () => {
    const header = 'Timestamp,Room,Type,Source,Title,Message\n';
    const rows = alerts.map((a) => `"${a.timestamp}","${a.room || 'General'}","${a.type}","${a.source}","${a.title}","${a.message.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smartspace-alerts-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Counts
  const criticalCount = alerts.filter(a => a.type === 'critical' || a.type === 'error').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const successCount = alerts.filter(a => a.type === 'success').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Alerts & Intelligent Insights
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">
                AUDIT & REASONING
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time audit log of electrical surges, vacancy auto-actuations & AI rule-based optimization insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={clearAlerts}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-300 border border-slate-700 text-xs font-bold text-slate-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* Severity Counters Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilterSeverity('critical')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filterSeverity === 'critical' ? 'bg-red-500/20 border-red-500/60 ring-1 ring-red-500' : 'bg-slate-900/90 border-slate-800 hover:border-red-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-300 uppercase">Critical Surges</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {criticalCount}
          </div>
        </div>

        <div 
          onClick={() => setFilterSeverity('warning')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filterSeverity === 'warning' ? 'bg-amber-500/20 border-amber-500/60 ring-1 ring-amber-500' : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase">Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {warningCount}
          </div>
        </div>

        <div 
          onClick={() => setFilterSeverity('success')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filterSeverity === 'success' ? 'bg-emerald-500/20 border-emerald-500/60 ring-1 ring-emerald-500' : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase">Eco Actions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {successCount}
          </div>
        </div>

        <div 
          onClick={() => setFilterSeverity('info')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filterSeverity === 'info' ? 'bg-cyan-500/20 border-cyan-500/60 ring-1 ring-cyan-500' : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase">Info Events</span>
            <Info className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white mt-1">
            {infoCount}
          </div>
        </div>
      </div>

      {/* Main 2-Column: Event Feed (Left) & Intelligent Insights Engine (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (Span 7): Filterable Event Feed */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alerts, messages, reasons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px]">Room:</span>
                <select
                  value={filterRoom}
                  onChange={(e) => setFilterRoom(e.target.value)}
                  className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-900 text-white">All Rooms</option>
                  {collegeRooms.map((r) => (
                    <option key={r.id} value={r.name} className="bg-slate-900 text-white">
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {filterSeverity !== 'all' && (
                <button
                  onClick={() => setFilterSeverity('all')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Events Stream */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 font-mono text-xs">
                No telemetry alerts match your current search and filter settings.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-3xl border transition-all flex items-start gap-3.5 shadow-md ${getAlertCardStyle(
                    alert.type
                  )}`}
                >
                  <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5 shadow-sm">
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white truncate">
                          {alert.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950/80 text-slate-300 border border-slate-800 uppercase">
                          {alert.type}
                        </span>
                      </div>
                      
                      <span className="text-[11px] font-mono text-slate-400 font-semibold shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-bold">
                        <Building2 className="w-3 h-3 text-brand-400" />
                        {alert.room || 'CSE Laboratory'}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span>SRC: {alert.source}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400 font-bold">● {alert.status || 'ACTIVE'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right (Span 5): Intelligent Insights AI Reasoning Section */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="glass-panel p-5 rounded-3xl border border-brand-500/30 shadow-2xl bg-slate-900/95 space-y-4">
            
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-300">
                <BrainCircuit className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Intelligent Energy Insights
                </h3>
                <p className="text-xs text-slate-400">
                  Automated reasoning & anomaly detection engine
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {intelligentInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      {insight.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {insight.impact}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    "{insight.description}"
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Recommendation: </strong>
                    {insight.actionRecommendation}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
              <span className="font-bold text-white block mb-0.5">Machine Learning Ready:</span>
              <span>This modular insight engine is structured to accept real-time anomaly scores from TensorFlow Lite or server-side scikit-learn models once physical hardware is linked.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
