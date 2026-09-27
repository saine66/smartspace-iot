import React from 'react';
import { JudgeDemoBar } from '../JudgeDemoBar';
import { LiveStatusCards } from '../LiveStatusCards';
import { SensorSimulationPanel } from '../SensorSimulationPanel';
import { BuildingOverview } from '../BuildingOverview';
import { ClassroomVisualizer } from '../ClassroomVisualizer';
import { ApplianceControl } from '../ApplianceControl';
import { AutomaticRuleMonitor } from '../AutomaticRuleMonitor';
import { AlertPanel } from '../AlertPanel';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Competition Judge Demo Scenario Bar */}
      <section aria-label="Demo Scenarios">
        <JudgeDemoBar />
      </section>

      {/* 2. Live Room Status KPI Cards */}
      <section aria-label="Live Room Status">
        <LiveStatusCards />
      </section>

      {/* 3. Live Sensor Simulation Controls Panel */}
      <section aria-label="Sensor Simulation">
        <SensorSimulationPanel />
      </section>

      {/* 4. Campus Building Multi-Room Overview */}
      <section aria-label="Building Overview">
        <BuildingOverview />
      </section>

      {/* 5. 2-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Span 7): Digital Twin Visualizer + Appliance Controls */}
        <div className="lg:col-span-7 space-y-6">
          <section aria-label="Classroom Visualizer">
            <ClassroomVisualizer />
          </section>

          <section aria-label="Appliance Controls">
            <ApplianceControl />
          </section>
        </div>

        {/* Right Column (Span 5): Live Rule Engine Monitor + Real-time Alert Timeline */}
        <div className="lg:col-span-5 space-y-6">
          <section aria-label="Automatic Rule Engine">
            <AutomaticRuleMonitor />
          </section>

          <section aria-label="Live Alerts and Events">
            <AlertPanel />
          </section>
        </div>

      </div>
    </div>
  );
};
