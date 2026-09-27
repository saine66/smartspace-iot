import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Flame, 
  Snowflake, 
  AlertTriangle,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const AutomaticRuleMonitor: React.FC = () => {
  const { activeRules } = useSmartSpace();

  const getRuleIcon = (ruleId: string, isTriggered: boolean) => {
    switch (ruleId) {
      case 'RULE_1':
        return <Zap className={`w-4 h-4 ${isTriggered ? 'text-emerald-400' : 'text-slate-500'}`} />;
      case 'RULE_2':
        return <Clock className={`w-4 h-4 ${isTriggered ? 'text-amber-400' : 'text-slate-500'}`} />;
      case 'RULE_3':
        return <Flame className={`w-4 h-4 ${isTriggered ? 'text-rose-400' : 'text-slate-500'}`} />;
      case 'RULE_4':
        return <Snowflake className={`w-4 h-4 ${isTriggered ? 'text-sky-400' : 'text-slate-500'}`} />;
      case 'RULE_5':
        return <AlertTriangle className={`w-4 h-4 ${isTriggered ? 'text-purple-400' : 'text-slate-500'}`} />;
      default:
        return <ShieldCheck className="w-4 h-4 text-brand-400" />;
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900/80">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Autonomous Rule Engine
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE LOGIC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time evaluation of energy conservation, thermal comfort & anomaly policies
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Zero-Touch IoT Governance</span>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {activeRules.map((rule, idx) => {
          const isTriggered = rule.isTriggered;

          return (
            <div
              key={rule.ruleId}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isTriggered
                  ? 'bg-slate-900/90 border-brand-500/40 shadow-md shadow-brand-500/5 ring-1 ring-brand-500/20'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Rule title & description */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                  isTriggered ? 'bg-brand-500/15 text-brand-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {getRuleIcon(rule.ruleId, isTriggered)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-brand-400">
                      RULE {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {rule.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {rule.description}
                  </p>
                </div>
              </div>

              {/* Condition -> Action */}
              <div className="flex items-center gap-3 self-end md:self-center">
                <div className="flex flex-col md:items-end text-left md:text-right">
                  <span className="text-[10px] font-mono text-slate-400">
                    Condition: <span className="text-slate-200 font-bold">{rule.condition}</span>
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <ArrowRight className="w-3 h-3 text-brand-400" />
                    <span className={`text-[11px] font-mono font-bold ${
                      isTriggered ? 'text-brand-300' : 'text-slate-500'
                    }`}>
                      {rule.actionTaken}
                    </span>
                  </div>
                </div>

                {/* Trigger pill */}
                <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-lg shrink-0 border ${
                  isTriggered
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {isTriggered ? 'TRIGGERED' : 'STANDBY'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
