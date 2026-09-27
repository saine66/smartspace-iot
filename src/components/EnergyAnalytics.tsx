import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Zap, 
  Leaf, 
  IndianRupee, 
  BarChart3, 
  Sparkles
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const EnergyAnalytics: React.FC = () => {
  const {
    todayConsumptionKwh,
    todaySavedKwh,
    avoidedWastageKwh,
    savingPercentage,
    costSavedRupees,
    co2SavedKg,
    hourlyHistory,
    appliances,
    sensorData
  } = useSmartSpace();

  const [activeTab, setActiveTab] = useState<'timeline' | 'breakdown' | 'occupancy'>('timeline');

  // Breakdown by appliance type
  const applianceData = [
    { 
      name: 'HVAC / AC Unit', 
      value: appliances.ac.isOn ? appliances.ac.powerWatts : 120, 
      color: '#06b6d4', 
      percentage: '52%' 
    },
    { 
      name: 'Smart Lighting (LED)', 
      value: appliances.lights.isOn ? appliances.lights.powerWatts : 40, 
      color: '#f59e0b', 
      percentage: '18%' 
    },
    { 
      name: 'Ceiling Fans (BLDC)', 
      value: appliances.fans.isOn ? appliances.fans.powerWatts : 30, 
      color: '#10b981', 
      percentage: '12%' 
    },
    { 
      name: 'Lab PCs & Podiums', 
      value: Math.max(150, sensorData.occupancy * 32), 
      color: '#6366f1', 
      percentage: '18%' 
    },
  ];

  return (
    <div className="space-y-4">
      
      {/* 4 Summary KPI Metric Cards (Section 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Energy Consumed Today */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              Today's Energy Used
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Metered
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {todayConsumptionKwh.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span>Grid Baseline: ~11.0 kWh</span>
            <span className="text-brand-400 font-bold">Optimized</span>
          </div>
        </div>

        {/* Metric 2: Estimated Energy Saved */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between hover:border-emerald-500/50 transition-all glow-emerald">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Estimated Saved
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              +{savingPercentage}% Eff
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-emerald-300 tracking-tight">
                {todaySavedKwh.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
            <span>Wastage Prevented:</span>
            <span className="text-emerald-400 font-bold">{avoidedWastageKwh.toFixed(1)} kWh</span>
          </div>
        </div>

        {/* Metric 3: Cost Saved */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              Institutional Savings
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              ₹8.5/kWh
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-amber-300 tracking-tight">
                ₹{costSavedRupees}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ room / day</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-amber-500/20 flex items-center justify-between">
            <span>Monthly Est:</span>
            <span className="text-amber-400 font-bold">~₹{(costSavedRupees * 26).toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 4: Carbon Footprint Offset */}
        <div className="glass-panel p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 flex flex-col justify-between hover:border-teal-500/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              CO₂ Carbon Offset
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
              Clean Campus
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-teal-300 tracking-tight">
                {co2SavedKg.toFixed(1)}
              </span>
              <span className="text-xs font-semibold text-slate-400">kg CO₂</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-teal-500/20 flex items-center justify-between">
            <span>Reduction:</span>
            <span className="text-teal-400 font-bold">Equivalent to 4 trees</span>
          </div>
        </div>

      </div>

      {/* Main Interactive Chart Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90">
        
        {/* Chart Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Energy Analytics & Telemetry Curve
              </h3>
              <p className="text-xs text-slate-400">
                Comparative load analysis: Traditional Unmanaged Baseline vs Autonomous SmartSpace
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24h Load Curve
            </button>
            <button
              onClick={() => setActiveTab('occupancy')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'occupancy'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Occupancy vs Power
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'breakdown'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Appliance Shares
            </button>
          </div>
        </div>

        {/* Chart Display Area */}
        <div className="h-[280px] w-full">
          {activeTab === 'timeline' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorSmart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  dataKey="withoutSmartSpace" 
                  name="Baseline (Without SmartSpace)" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1} 
                  fill="url(#colorBaseline)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="withSmartSpace" 
                  name="SmartSpace (Autonomous IoT)" 
                  stroke="#10b981" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorSmart)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'occupancy' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" st" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="withSmartSpace" name="Power Consumption (kW)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="occupancy" name="Classroom Occupancy" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'breakdown' && (
            <div className="flex flex-col md:flex-row items-center justify-around h-full gap-4">
              <div className="w-full md:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applianceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {applianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(value) => [`${value} W`, 'Current Load']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Breakdown Legend List */}
              <div className="w-full md:w-1/2 space-y-2 text-xs">
                {applianceData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <div className="font-mono text-right">
                      <span className="font-bold text-white mr-2">{item.value} W</span>
                      <span className="text-slate-400 text-[10px]">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
