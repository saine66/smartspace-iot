import React from 'react';
import { 
  X, 
  Cpu, 
  Wifi, 
  Server, 
  BrainCircuit, 
  LayoutDashboard, 
  Lightbulb, 
  ArrowDown, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

export const SystemArchitectureModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useSmartSpace();

  if (!isArchitectureModalOpen) return null;

  const architectureLayers = [
    {
      level: 1,
      title: '1. Physical Sensor Layer',
      subtitle: 'Classroom & Laboratory Environment Sensing',
      icon: <Radio className="w-5 h-5 text-emerald-400" />,
      badge: 'Hardware Sensor Bus',
      items: [
        'HC-SR501 PIR Optical Motion Sensor (Occupancy detection)',
        'DHT22 High-Precision Temperature & Humidity Sensor',
        'LDR Light-Dependent Resistor (0–1000 Lux ambient daylight)',
        'ACS712 20A Hall-Effect AC/DC Current & Power Sensor',
      ],
      color: 'border-emerald-500/40 bg-emerald-500/5',
    },
    {
      level: 2,
      title: '2. Edge Compute & Microcontroller Firmware',
      subtitle: 'Local Real-Time Sampling & ADC Signal Processing',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      badge: 'Edge Node (ESP32 DevKit)',
      items: [
        'ESP32 Dual-Core 240MHz Xtensa LX6 Microcontroller',
        '2-Second Periodic ADC Telemetry Sampling & Moving Average Filter',
        'Local Fail-Safe Relay Actuation & Watchdog Recovery Timer',
        'JSON Payload Serialization via ArduinoJson v6',
      ],
      color: 'border-blue-500/40 bg-blue-500/5',
    },
    {
      level: 3,
      title: '3. IoT Network & Transport Layer',
      subtitle: 'Lightweight Publish/Subscribe Wireless Protocol',
      icon: <Wifi className="w-5 h-5 text-purple-400" />,
      badge: 'MQTT Broker over WiFi / WebSocket',
      items: [
        '802.11 b/g/n 2.4GHz Wi-Fi Campus WLAN Gateway',
        'MQTT Topic: smartspace/{room_id}/telemetry (QoS 0/1)',
        'Bidirectional Control Topic: smartspace/{room_id}/command',
        'TLS/SSL Encrypted Payload Transmission & Keep-Alive Heartbeats',
      ],
      color: 'border-purple-500/40 bg-purple-500/5',
    },
    {
      level: 4,
      title: '4. SmartSpace Backend & IoT Gateway',
      subtitle: 'Multi-Tenant Institutional State Synchronization',
      icon: <Server className="w-5 h-5 text-cyan-400" />,
      badge: 'Cloud & Edge Server',
      items: [
        'Node.js / Express / Fastify MQTT Broker Bridge',
        'Time-Series Telemetry Ingestion Engine & Audit Logger',
        'Campus Multi-Room Database (PostgreSQL / InfluxDB / Supabase)',
        'RESTful API & WebSocket Push Notification Gateway',
      ],
      color: 'border-cyan-500/40 bg-cyan-500/5',
    },
    {
      level: 5,
      title: '5. Analytics & Autonomous Decision Engine',
      subtitle: 'Rule-Based Logic & Machine Learning Anomaly Detection',
      icon: <BrainCircuit className="w-5 h-5 text-amber-400" />,
      badge: 'Autonomous Energy AI',
      items: [
        'Rules 1–5 Real-Time Policy Evaluation (10-min vacancy timeout, thermal comfort)',
        'Dynamic Energy Savings & Wastage Avoidance Calculator',
        'ACS712 Current Anomaly & Surge Pattern Recognition',
        'Predictive HVAC Modulation based on Schedule & Ambient Solar Lux',
      ],
      color: 'border-amber-500/40 bg-amber-500/5',
    },
    {
      level: 6,
      title: '6. Web Application & Dashboard Interface',
      subtitle: 'Faculty Monitoring & Real-Time Digital Twin',
      icon: <LayoutDashboard className="w-5 h-5 text-brand-400" />,
      badge: 'React 19 / TypeScript / Tailwind',
      items: [
        'Live 2D Digital Twin Laboratory Floorplan & Workstation Avatars',
        'Simulated Sensor Controls & Competition Scenario Runner',
        'Interactive Recharts Power Load Curves & Appliance Breakdown',
        'Manual Override Switchboard & Instant Audit Trail Export',
      ],
      color: 'border-brand-500/40 bg-brand-500/5',
    },
    {
      level: 7,
      title: '7. Actuator & Appliance Execution Layer',
      subtitle: 'Direct Electrical Relay & PWM Inverter Switching',
      icon: <Lightbulb className="w-5 h-5 text-rose-400" />,
      badge: 'High-Power Relays (250V AC)',
      items: [
        'Optocoupler-Isolated 4-Channel 10A Relay Module',
        'Dual-Zone LED Ceiling Lighting Banks with TRIAC/PWM Dimming',
        'BLDC Ceiling Fan Speed Regulators (PWM 4-Step)',
        'HVAC Split AC Unit Thermostat Interlock & Smart Projector Relay',
      ],
      color: 'border-rose-500/40 bg-rose-500/5',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  SmartSpace Real-World IoT System Architecture
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Full Stack Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end hardware, transport protocol, decision engine and actuator actuation map
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype Transparency Notice */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              STATUS: <strong className="text-white">SIMULATED PROTOTYPE</strong> — Interactive in-browser telemetry active. ESP32 hardware firmware & Wokwi circuit ready for physical deployment.
            </span>
          </div>
        </div>

        {/* Flow Diagram Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3 font-sans text-xs">
          {architectureLayers.map((layer, index) => (
            <React.Fragment key={layer.level}>
              <div className={`p-4 rounded-2xl border ${layer.color} shadow-sm transition-all hover:scale-[1.01]`}>
                <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 shrink-0">
                      {layer.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {layer.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {layer.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 shrink-0">
                    {layer.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-slate-800/60 font-mono text-[11px] text-slate-300">
                  {layer.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {index < architectureLayers.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-500 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Compliant with MQTT 3.1.1 / IEEE 802.11 / W3C Web Standards
          </span>
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="px-5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-md"
          >
            Close Architecture
          </button>
        </div>

      </div>
    </div>
  );
};
