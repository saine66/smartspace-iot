import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Trash2, 
  Download
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import type { AlertEvent } from '../types';

export const AlertPanel: React.FC = () => {
  const { alerts, clearAlerts } = useSmartSpace();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType === 'all') return true;
    if (filterType === 'critical') return alert.type === 'critical' || alert.type === 'error';
    if (filterType === 'warning') return alert.type === 'warning';
    if (filterType === 'success') return alert.type === 'success';
    if (filterType === 'info') return alert.type === 'info';
    return true;
  });

  const getAlertIcon = (type: AlertEvent['type']) => {
    switch (type) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getAlertBadgeClass = (type: AlertEvent['type']) => {
    switch (type) {
      case 'critical':
      case 'error':
        return 'bg-red-500/15 border-red-500/40 text-red-300 ring-1 ring-red-500/20';
      case 'warning':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'success':
        return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
      case 'info':
      default:
        return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
    }
  };

  // Export event audit log to CSV
  const handleExportCSV = () => {
    const header = 'Timestamp,Type,Source,Title,Message\n';
    const rows = alerts.map((a) => `"${a.timestamp}","${a.type}","${a.source}","${a.title}","${a.message.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smartspace-audit-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900/90 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Live Audit & Telemetry Alerts
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {alerts.length} Events
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time chronological timeline of autonomous IoT actuations & alerts
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition-all"
            title="Download CSV Audit Log"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={clearAlerts}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 border border-slate-700 text-xs font-bold text-slate-400 transition-all"
            title="Clear all alerts"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
        {['all', 'critical', 'warning', 'success', 'info'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-2.5 py-1 rounded-lg font-mono font-bold uppercase text-[10px] transition-all whitespace-nowrap border ${
              filterType === type
                ? 'bg-brand-500 text-white border-brand-400 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Chronological Event Stream (Newest First) */}
      <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">
            No events logged in this filter category.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-2xl border transition-all duration-300 flex items-start gap-3 ${getAlertBadgeClass(
                alert.type
              )}`}
            >
              <div className="p-1.5 rounded-xl bg-slate-900/80 shrink-0 mt-0.5 shadow-sm">
                {getAlertIcon(alert.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white truncate">
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-400 border border-slate-800">
                    SRC: {alert.source}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
