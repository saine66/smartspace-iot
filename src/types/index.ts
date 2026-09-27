export type ControlMode = 'AUTO' | 'MANUAL';

export type RoomStatus = 'OCCUPIED' | 'EMPTY' | 'STANDBY';

export type NavigationPage = 'dashboard' | 'analytics' | 'rooms' | 'alerts' | 'settings';

export interface SensorData {
  occupancy: number;           // 0 - 60 students
  temperature: number;         // 15 - 45 °C
  lightIntensity: number;      // 0 - 1000 lux
  powerConsumption: number;    // 0 - 5.0 kW (combined live)
  manualPowerOffset: number;   // Extra simulated kW load
  humidity: number;            // 30 - 90 %
}

export interface Appliance {
  id: string;
  name: string;
  isOn: boolean;
  powerWatts: number;
  mode: ControlMode;
  autoReason?: string;
  manualOverrideActive?: boolean;
}

export interface LightsState extends Appliance {
  brightness: number;          // 0 - 100 %
  zone1On: boolean;
  zone2On: boolean;
}

export interface FansState extends Appliance {
  speed: number;               // 0 (off), 1 (low), 2 (med), 3 (high)
}

export interface AcState extends Appliance {
  targetTemp: number;          // 18 - 30 °C
  ecoMode: boolean;
}

export interface ProjectorState extends Appliance {
  source: string;
}

export interface Appliances {
  lights: LightsState;
  fans: FansState;
  ac: AcState;
  projector: ProjectorState;
}

export interface AlertEvent {
  id: string;
  room?: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  source: 'RULE_ENGINE' | 'SENSOR_TRIGGER' | 'MANUAL_OVERRIDE' | 'ANOMALY_DETECTOR' | 'ENERGY_SAVER';
  status?: 'ACTIVE' | 'RESOLVED' | 'ACKNOWLEDGED';
  icon?: string;
}

export interface HourlyData {
  time: string;
  withoutSmartSpace: number;   // Baseline power in kW
  withSmartSpace: number;      // Smart power in kW
  occupancy: number;
  savedKwh: number;
}

export interface RoomOption {
  id: string;
  name: string;
  building: string;
  capacity: number;
  type: string;
}

export interface CollegeRoom {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  occupancy: number;
  temperature: number;
  powerKw: number;
  status: RoomStatus;
  healthStatus: 'NORMAL' | 'ATTENTION' | 'CRITICAL'; // 🟢, 🟡, 🔴
  lightsOn: boolean;
  fansOn: boolean;
  acOn: boolean;
  isSimulatedLiveRoom?: boolean;
}

export interface SystemSettings {
  emptyTimeoutSeconds: number;
  tempComfortThreshold: number;
  coolRoomThreshold: number;
  highPowerThresholdKw: number;
  criticalPowerThresholdKw: number;
  defaultOperatingMode: ControlMode;
  demoModeEnabled: boolean;
  soundEnabled: boolean;
}

export interface IntelligentInsight {
  id: string;
  type: 'SAVINGS' | 'ANOMALY' | 'BEHAVIOR' | 'EFFICIENCY';
  title: string;
  description: string;
  impact: string;
  timestamp: string;
  actionRecommendation?: string;
}

export interface RuleStatus {
  ruleId: string;
  name: string;
  description: string;
  condition: string;
  isTriggered: boolean;
  actionTaken: string;
}
