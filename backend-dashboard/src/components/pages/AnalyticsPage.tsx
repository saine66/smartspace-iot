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
  BarChart3, 
  Zap, 
  Leaf, 
  IndianRupee, 
  Sparkles, 
  Gauge, 
  Activity, 
  Lightbulb, 
  Fan, 
  Wind, 
  Monitor, 
  BrainCircuit
} from 'lucide-react';
import { useSmartSpace } from '../../context/SmartSpaceContext';

export const AnalyticsPage: React.FC = () => {
  const {
    sensorData,
    appliances,
    todayConsumptionKwh,
    todaySavedKwh,
    avoidedWastageKwh,
    savingPercentage,
    averagePowerKw,
    peakPowerKw,
    costSavedRupees,
    co2SavedKg,
    hourlyHistory,
    weeklyHistory,
    monthlyHistory,
    intelligentInsights,
    analyticsTimeframe,
    setAnalyticsTimeframe
  } = useSmartSpace();

  const [chartView, setChartView] = useState<'load_curve' | 'occupancy_correlation' | 'appliance_pie'>('load_curve');

  // Multiplier for timeframe calculations
  const isWeek = analyticsTimeframe === 'week';
  const isMonth = analyticsTimeframe === 'month';

  const displayConsumed = isMonth 
    ? (452 + todayConsumptionKwh * 3.5).toFixed(1)
    : isWeek 
    ? (118.5 + todayConsumptionKwh * 1.2).toFixed(1)
    : todayConsumptionKwh.toFixed(1);

  const displaySaved = isMonth
    ? (165 + todaySavedKwh * 14).toFixed(1)
    : isWeek
    ? (57.6 + todaySavedKwh * 3.5).toFixed(1)
    : todaySavedKwh.toFixed(1);

  const displayAvoided = isMonth
    ? (128 + avoidedWastageKwh * 12).toFixed(1)
    : isWeek
    ? (44.2 + avoidedWastageKwh * 3).toFixed(1)
    : avoidedWastageKwh.toFixed(1);

  const displayCostSaved = isMonth
    ? Math.round(Number(displaySaved) * 8.5)
    : isWeek
    ? Math.round(Number(displaySaved) * 8.5)
    : costSavedRupees;

  const displayCo2 = isMonth
    ? (Number(displaySaved) * 0.82).toFixed(1)
    : isWeek
    ? (Number(displaySaved) * 0.82).toFixed(1)
    : co2SavedKg.toFixed(1);

  // Appliance load allocation
  const lightsLoad = appliances.lights.isOn ? appliances.lights.powerWatts : 40;
  const fansLoad = appliances.fans.isOn ? appliances.fans.powerWatts : 30;
  const acLoad = appliances.ac.isOn ? appliances.ac.powerWatts : 120;
  const pcsLoad = Math.max(150, sensorData.occupancy * 32);
  const totalLoadWatts = lightsLoad + fansLoad + acLoad + pcsLoad;

  const applianceData = [
    { 
      name: 'Climate AC (HVAC)', 
      value: acLoad, 
      color: '#06b6d4', 
      percent: Math.round((acLoad / totalLoadWatts) * 100),
      icon: <Wind className="w-4 h-4 text-cyan-400" />
    },
    { 
      name: 'Smart Lighting', 
      value: lightsLoad, 
      color: '#f59e0b', 
      percent: Math.round((lightsLoad / totalLoadWatts) * 100),
      icon: <Lightbulb className="w-4 h-4 text-amber-400" />
    },
    { 
      name: 'BLDC Ceiling Fans', 
      value: fansLoad, 
      color: '#10b981', 
      percent: Math.round((fansLoad / totalLoadWatts) * 100),
      icon: <Fan className="w-4 h-4 text-emerald-400" />
    },
    { 
      name: 'Lab PCs & Podiums', 
      value: pcsLoad, 
      color: '#6366f1', 
      percent: Math.round((pcsLoad / totalLoadWatts) * 100),
      icon: <Monitor className="w-4 h-4 text-indigo-400" />
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Institutional Energy Analytics
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 font-bold">
                TELEMETRY RECHARTS
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Comprehensive historical load profiling, appliance decomposition & carbon reduction analytics
            </p>
          </div>
        </div>

        {/* Timeframe Filter Tabs: Today / This Week / This Month */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setAnalyticsTimeframe('today')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              analyticsTimeframe === 'today'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setAnalyticsTimeframe('week')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              analyticsTimeframe === 'week'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setAnalyticsTimeframe('month')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              analyticsTimeframe === 'month'
                ? 'bg-brand-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Energy Consumed */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-400" />
              Energy Consumed
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {analyticsTimeframe.toUpperCase()}
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {displayConsumed}
              </span>
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span>Baseline: ~{(Number(displayConsumed) * 1.35).toFixed(1)} kWh</span>
            <span className="text-brand-400 font-bold">Optimized</span>
          </div>
        </div>

        {/* Metric 2: Estimated Energy Saved */}
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col justify-between glow-emerald">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              Energy Saved
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              +{savingPercentage}%
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-emerald-300 tracking-tight">
                {displaySaved}
              </span>
              <span className="text-xs font-semibold text-slate-400">kWh</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-emerald-500/20 flex items-center justify-between">
            <span>Avoided Wastage:</span>
            <span className="text-emerald-400 font-bold">{displayAvoided} kWh</span>
          </div>
        </div>

        {/* Metric 3: Average Power Load */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Average Power
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              KW LOAD
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-cyan-300 tracking-tight">
                {averagePowerKw.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">kW</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <span>Nominal Range:</span>
            <span className="text-cyan-400 font-bold">1.0 - 2.5 kW</span>
          </div>
        </div>

        {/* Metric 4: Peak Power Load */}
        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              Peak Power Surge
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
              ACS712
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-purple-300 tracking-tight">
                {peakPowerKw.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">kW</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-purple-500/20 flex items-center justify-between">
            <span>Threshold Safety:</span>
            <span className={`font-bold ${peakPowerKw > 3.5 ? 'text-rose-400' : 'text-purple-400'}`}>
              {peakPowerKw > 3.5 ? 'Attention' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Metric 5: Institutional Cost & CO2 */}
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
              Financial Savings
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
              ₹8.5/UNIT
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-amber-300 tracking-tight">
                ₹{displayCostSaved.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-amber-500/20 flex items-center justify-between">
            <span>CO₂ Offset:</span>
            <span className="text-amber-400 font-bold">{displayCo2} kg</span>
          </div>
        </div>

      </div>

      {/* Main Interactive Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (Span 8): Interactive Telemetry Chart */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {chartView === 'load_curve' 
                  ? 'Historical Load Curve & Autonomous Optimization' 
                  : chartView === 'occupancy_correlation'
                  ? 'Occupancy vs Power Consumption Correlation'
                  : 'Appliance Decomposition Distribution'}
              </h3>
              <p className="text-xs text-slate-400">
                Comparative telemetry data for {analyticsTimeframe === 'today' ? 'Today (Hourly)' : analyticsTimeframe === 'week' ? 'This Week (7 Days)' : 'This Month (4 Weeks)'}
              </p>
            </div>

            {/* Chart mode buttons */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setChartView('load_curve')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartView === 'load_curve'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Load Curve
              </button>
              <button
                onClick={() => setChartView('occupancy_correlation')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartView === 'occupancy_correlation'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Occupancy vs Power
              </button>
              <button
                onClick={() => setChartView('appliance_pie')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  chartView === 'appliance_pie'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Appliance Shares
              </button>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-[320px] w-full">
            {chartView === 'load_curve' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={
                    analyticsTimeframe === 'today'
                      ? hourlyHistory.map(h => ({ label: h.time, withoutSmartSpace: h.withoutSmartSpace, withSmartSpace: h.withSmartSpace }))
                      : analyticsTimeframe === 'week'
                      ? weeklyHistory.map(w => ({ label: w.day, withoutSmartSpace: w.withoutSmartSpace, withSmartSpace: w.withSmartSpace }))
                      : monthlyHistory.map(m => ({ label: m.week, withoutSmartSpace: m.withoutSmartSpace, withSmartSpace: m.withSmartSpace }))
                  } 
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="anBaseline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="anSmart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" kW" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="withoutSmartSpace" 
                    name="Unmanaged Grid Baseline (kW)" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#anBaseline)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="withSmartSpace" 
                    name="SmartSpace Autonomous (kW)" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#anSmart)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartView === 'occupancy_correlation' && (
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
                  <Bar yAxisId="right" dataKey="occupancy" name="Classroom Occupancy (Students)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartView === 'appliance_pie' && (
              <div className="flex flex-col sm:flex-row items-center justify-around h-full gap-4">
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={applianceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {applianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(value) => [`${value} W`, 'Load']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full sm:w-1/2 space-y-2 text-xs">
                  {applianceData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="font-semibold text-slate-200">{item.name}</span>
                      </div>
                      <div className="font-mono text-right">
                        <span className="font-bold text-white mr-2">{item.value} W</span>
                        <span className="text-slate-400 text-[10px]">({item.percent}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right (Span 4): Energy Decomposition Progress Meters */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white tracking-tight">
              Appliance Power Share
            </h3>
            <span className="text-[10px] font-mono text-brand-400 font-bold">
              {totalLoadWatts} W Total
            </span>
          </div>

          <div className="space-y-3.5">
            {applianceData.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-300">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{item.value}W ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-white">Autonomous Efficiency:</strong> SmartSpace dynamic dimming and thermostat setbacks reduce HVAC & Lighting consumption by <span className="text-emerald-400 font-bold">32%</span> during non-peak lecture hours.
          </div>
        </div>

      </div>

      {/* Section: "Energy Saving Insights" (Dynamic AI & Rule-based Insights) */}
      <div className="glass-panel p-6 rounded-3xl border border-brand-500/30 shadow-2xl bg-slate-900/90 relative overflow-hidden">
        
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-300">
            <BrainCircuit className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Energy Saving Insights
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                LIVE REASONING ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Autonomous observations generated from simulated physical telemetry and occupancy trends
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intelligentInsights.map((insight) => (
            <div 
              key={insight.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                    {insight.title}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-brand-300 border border-slate-800">
                    {insight.impact}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  "{insight.description}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{insight.actionRecommendation}</span>
                <span className="text-[10px] font-mono text-slate-500">{insight.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
