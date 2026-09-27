import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type {
  SensorData,
  Appliances,
  RoomStatus,
  AlertEvent,
  HourlyData,
  RoomOption,
  RuleStatus,
  NavigationPage,
  CollegeRoom,
  SystemSettings,
  IntelligentInsight
} from '../types';
import { soundManager } from '../utils/audio';

export interface SmartSpaceContextType {
  // Navigation
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;

  // Sensors
  sensorData: SensorData;
  setSensorData: React.Dispatch<React.SetStateAction<SensorData>>;
  updateSensor: (key: keyof SensorData, value: number) => void;
  driftEnabled: boolean;
  setDriftEnabled: (val: boolean) => void;

  // Appliances
  appliances: Appliances;
  toggleAppliancePower: (applianceKey: keyof Appliances) => void;
  setApplianceMode: (applianceKey: keyof Appliances, mode: 'AUTO' | 'MANUAL') => void;
  setMasterMode: (mode: 'AUTO' | 'MANUAL') => void;
  setLightBrightness: (val: number) => void;
  toggleLightZone: (zone: 1 | 2) => void;
  setFanSpeed: (speed: number) => void;
  setAcTargetTemp: (temp: number) => void;

  // Room Status & Campus Rooms
  roomStatus: RoomStatus;
  energySavingMode: boolean;
  selectedRoom: RoomOption;
  setSelectedRoom: (room: RoomOption) => void;
  roomOptions: RoomOption[];
  collegeRooms: CollegeRoom[];
  selectedModalRoom: CollegeRoom | null;
  setSelectedModalRoom: (room: CollegeRoom | null) => void;

  // System Settings
  systemSettings: SystemSettings;
  updateSetting: <K extends keyof SystemSettings>(key: K, val: SystemSettings[K]) => void;
  resetSettingsToDefault: () => void;

  // Empty room countdown
  emptyCountdown: number;
  emptyCountdownDuration: number;
  setEmptyCountdownDuration: (seconds: number) => void;
  isCountdownRunning: boolean;
  fastForwardCountdown: () => void;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;

  // Alerts
  alerts: AlertEvent[];
  addAlert: (alert: Omit<AlertEvent, 'id' | 'timestamp'>) => void;
  clearAlerts: () => void;

  // Energy Analytics & Insights
  analyticsTimeframe: 'today' | 'week' | 'month';
  setAnalyticsTimeframe: (tf: 'today' | 'week' | 'month') => void;
  todayConsumptionKwh: number;
  todaySavedKwh: number;
  avoidedWastageKwh: number;
  savingPercentage: number;
  averagePowerKw: number;
  peakPowerKw: number;
  costSavedRupees: number;
  co2SavedKg: number;
  hourlyHistory: HourlyData[];
  weeklyHistory: { day: string; withSmartSpace: number; withoutSmartSpace: number; savedKwh: number }[];
  monthlyHistory: { week: string; withSmartSpace: number; withoutSmartSpace: number; savedKwh: number }[];
  intelligentInsights: IntelligentInsight[];

  // Rules Live Engine
  activeRules: RuleStatus[];
  lastActionReason: string;

  // Demo Scenarios & Reset
  runScenario: (scenarioId: string) => void;
  activeScenario: string | null;
  resetSimulation: () => void;

  // Modals
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;
  isHardwareModalOpen: boolean;
  setIsHardwareModalOpen: (open: boolean) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
}

const AVAILABLE_ROOMS: RoomOption[] = [
  { id: 'cse-lab-302', name: 'CSE Laboratory (Room 302)', building: 'Turing Block', capacity: 40, type: 'Computer Lab' },
  { id: 'classroom-101', name: 'Classroom 101', building: 'Turing Block', capacity: 60, type: 'Lecture Hall' },
  { id: 'classroom-102', name: 'Classroom 102', building: 'Turing Block', capacity: 55, type: 'Smart Classroom' },
  { id: 'electronics-lab', name: 'Electronics Laboratory', building: 'Faraday Wing', capacity: 35, type: 'Hardware Lab' },
  { id: 'seminar-hall', name: 'Main Seminar Hall', building: 'Innovation Hub', capacity: 120, type: 'Auditorium' },
];

const INITIAL_HOURLY_DATA: HourlyData[] = [
  { time: '08:00', withoutSmartSpace: 1.8, withSmartSpace: 0.4, occupancy: 0, savedKwh: 1.4 },
  { time: '09:00', withoutSmartSpace: 2.9, withSmartSpace: 2.1, occupancy: 18, savedKwh: 0.8 },
  { time: '10:00', withoutSmartSpace: 3.5, withSmartSpace: 2.4, occupancy: 24, savedKwh: 1.1 },
  { time: '11:00', withoutSmartSpace: 3.8, withSmartSpace: 2.6, occupancy: 28, savedKwh: 1.2 },
  { time: '12:00', withoutSmartSpace: 2.4, withSmartSpace: 0.5, occupancy: 0, savedKwh: 1.9 },
  { time: '13:00', withoutSmartSpace: 3.6, withSmartSpace: 2.5, occupancy: 22, savedKwh: 1.1 },
  { time: '14:00', withoutSmartSpace: 3.9, withSmartSpace: 2.7, occupancy: 26, savedKwh: 1.2 },
  { time: '15:00', withoutSmartSpace: 2.8, withSmartSpace: 1.8, occupancy: 14, savedKwh: 1.0 },
  { time: '16:00', withoutSmartSpace: 1.9, withSmartSpace: 0.3, occupancy: 0, savedKwh: 1.6 },
];

const INITIAL_WEEKLY_DATA = [
  { day: 'Mon', withoutSmartSpace: 24.5, withSmartSpace: 16.8, savedKwh: 7.7 },
  { day: 'Tue', withoutSmartSpace: 26.1, withSmartSpace: 17.4, savedKwh: 8.7 },
  { day: 'Wed', withoutSmartSpace: 25.8, withSmartSpace: 16.9, savedKwh: 8.9 },
  { day: 'Thu', withoutSmartSpace: 27.2, withSmartSpace: 18.1, savedKwh: 9.1 },
  { day: 'Fri', withoutSmartSpace: 24.0, withSmartSpace: 15.6, savedKwh: 8.4 },
  { day: 'Sat', withoutSmartSpace: 12.5, withSmartSpace: 4.2, savedKwh: 8.3 },
  { day: 'Sun', withoutSmartSpace: 8.0, withSmartSpace: 1.5, savedKwh: 6.5 },
];

const INITIAL_MONTHLY_DATA = [
  { week: 'Week 1', withoutSmartSpace: 165, withSmartSpace: 112, savedKwh: 53 },
  { week: 'Week 2', withoutSmartSpace: 172, withSmartSpace: 118, savedKwh: 54 },
  { week: 'Week 3', withoutSmartSpace: 168, withSmartSpace: 114, savedKwh: 54 },
  { week: 'Week 4', withoutSmartSpace: 160, withSmartSpace: 108, savedKwh: 52 },
];

const DEFAULT_SETTINGS: SystemSettings = {
  emptyTimeoutSeconds: 10,
  tempComfortThreshold: 28.0,
  coolRoomThreshold: 24.0,
  highPowerThresholdKw: 3.0,
  criticalPowerThresholdKw: 4.0,
  defaultOperatingMode: 'AUTO',
  demoModeEnabled: true,
  soundEnabled: true,
};

const SmartSpaceContext = createContext<SmartSpaceContextType | undefined>(undefined);

export const SmartSpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');

  // Selected Room
  const [selectedRoom, setSelectedRoom] = useState<RoomOption>(AVAILABLE_ROOMS[0]);
  const [selectedModalRoom, setSelectedModalRoom] = useState<CollegeRoom | null>(null);

  // Modals
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);

  // Sound
  const [soundEnabled, setSoundEnabled] = useState<boolean>(DEFAULT_SETTINGS.soundEnabled);
  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    setSystemSettings((prev) => ({ ...prev, soundEnabled: !soundEnabled }));
  };

  const updateSetting = <K extends keyof SystemSettings>(key: K, val: SystemSettings[K]) => {
    soundManager.playClick();
    setSystemSettings((prev) => ({ ...prev, [key]: val }));
    if (key === 'soundEnabled') {
      soundManager.enabled = Boolean(val);
      setSoundEnabled(Boolean(val));
    }
  };

  const resetSettingsToDefault = () => {
    soundManager.playSuccess();
    setSystemSettings(DEFAULT_SETTINGS);
  };

  // Sensor State
  const [sensorData, setSensorData] = useState<SensorData>({
    occupancy: 24,
    temperature: 27.5,
    lightIntensity: 420,
    powerConsumption: 1.24,
    manualPowerOffset: 0,
    humidity: 55,
  });

  const isDirectPowerModeRef = useRef<boolean>(false);
  const [driftEnabled, setDriftEnabled] = useState<boolean>(false);

  // Appliances State
  const [appliances, setAppliances] = useState<Appliances>({
    lights: {
      id: 'lights',
      name: 'Smart LED Lighting',
      isOn: true,
      powerWatts: 240,
      mode: 'AUTO',
      brightness: 85,
      zone1On: true,
      zone2On: true,
      autoReason: 'Lights turned ON automatically — room occupied (24 students).',
    },
    fans: {
      id: 'fans',
      name: 'BLDC Ceiling Fans',
      isOn: true,
      powerWatts: 130,
      mode: 'AUTO',
      speed: 2,
      autoReason: 'Fans active for room ventilation.',
    },
    ac: {
      id: 'ac',
      name: 'Inverter Climate AC',
      isOn: true,
      powerWatts: 850,
      mode: 'AUTO',
      targetTemp: 24,
      ecoMode: false,
      autoReason: 'Maintaining target 24.0°C laboratory temperature.',
    },
    projector: {
      id: 'projector',
      name: 'Interactive Smart Display',
      isOn: true,
      powerWatts: 180,
      mode: 'AUTO',
      source: 'HDMI-1',
      autoReason: 'Lab lecture active.',
    }
  });

  // Room Status & Energy Saving
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('OCCUPIED');
  const [energySavingMode, setEnergySavingMode] = useState<boolean>(false);

  // Empty room countdown
  const [emptyCountdownDuration, setEmptyCountdownDuration] = useState<number>(10);
  const [emptyCountdown, setEmptyCountdown] = useState<number>(10);
  const [isCountdownRunning, setIsCountdownRunning] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Active Scenario tracking
  const [activeScenario, setActiveScenario] = useState<string | null>('demo-1');

  // Reason banner
  const [lastActionReason, setLastActionReason] = useState<string>(
    'System operating in Autonomous Intelligent Mode. Occupancy: 24 students detected.'
  );

  // Dynamic Saved Energy Tracker
  const [accumulatedSavingsKwh, setAccumulatedSavingsKwh] = useState<number>(2.3);

  // Analytics Timeframe
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Alerts List
  const [alerts, setAlerts] = useState<AlertEvent[]>([
    {
      id: 'init-1',
      room: 'CSE Laboratory',
      type: 'info',
      title: 'SmartSpace System Online',
      message: 'Autonomous energy controller connected to CSE Lab IoT gateway.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'RULE_ENGINE',
      status: 'ACTIVE',
    },
    {
      id: 'init-2',
      room: 'CSE Laboratory',
      type: 'success',
      title: 'Room became occupied.',
      message: '24 students detected. Dual PIR motion sensors active.',
      timestamp: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'SENSOR_TRIGGER',
      status: 'ACTIVE',
    },
    {
      id: 'init-3',
      room: 'Classroom 102',
      type: 'info',
      title: 'Energy-saving mode activated.',
      message: 'Classroom 102 empty for >10 mins. Standby power reduced to 45W.',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'ENERGY_SAVER',
      status: 'RESOLVED',
    }
  ]);

  const addAlert = useCallback((newAlert: Omit<AlertEvent, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setAlerts((prev) => {
      if (prev[0] && prev[0].title === newAlert.title && prev[0].message === newAlert.message) {
        return prev;
      }
      return [{ ...newAlert, room: newAlert.room || selectedRoom.name, id, timestamp, status: 'ACTIVE' }, ...prev.slice(0, 49)];
    });

    if (newAlert.type === 'critical' || newAlert.type === 'error') {
      soundManager.playCritical();
    } else if (newAlert.type === 'warning') {
      soundManager.playWarning();
    } else if (newAlert.type === 'success') {
      soundManager.playSuccess();
    }
  }, [selectedRoom.name]);

  const clearAlerts = () => {
    setAlerts([]);
    soundManager.playClick();
  };

  const updateSensor = (key: keyof SensorData, value: number) => {
    if (key === 'powerConsumption') {
      isDirectPowerModeRef.current = true;
    }
    setSensorData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fastForwardCountdown = () => {
    soundManager.playClick();
    setEmptyCountdown(0);
  };

  // Rule status evaluation list
  const [activeRules, setActiveRules] = useState<RuleStatus[]>([
    {
      ruleId: 'RULE_1',
      name: 'Occupancy Based Lighting & Fans',
      description: 'Auto-turn ON lights when occupancy > 0.',
      condition: 'Occupancy > 0',
      isTriggered: true,
      actionTaken: 'Lights & Fans ACTIVE',
    },
    {
      ruleId: 'RULE_2',
      name: 'Empty Room Auto-Shutdown',
      description: 'When occupancy = 0, start countdown then power OFF all appliances & enable Eco Mode.',
      condition: 'Occupancy == 0 (Timer Finished)',
      isTriggered: false,
      actionTaken: 'Standby - Room Occupied',
    },
    {
      ruleId: 'RULE_3',
      name: 'Thermal Comfort Trigger',
      description: `Automatically turn Fans ON when temperature exceeds ${systemSettings.tempComfortThreshold}°C.`,
      condition: `Temperature > ${systemSettings.tempComfortThreshold}°C`,
      isTriggered: false,
      actionTaken: 'Inactive (Temp = 27.5°C)',
    },
    {
      ruleId: 'RULE_4',
      name: 'Cool Room Energy Conservation',
      description: `Automatically turn Fans OFF if room drops to ${systemSettings.coolRoomThreshold}°C or below.`,
      condition: `Temperature <= ${systemSettings.coolRoomThreshold}°C`,
      isTriggered: false,
      actionTaken: 'Inactive (Temp = 27.5°C)',
    },
    {
      ruleId: 'RULE_5',
      name: 'Abnormal Power Consumption Monitor',
      description: `Show warning when power > ${systemSettings.highPowerThresholdKw} kW and critical when > ${systemSettings.criticalPowerThresholdKw} kW.`,
      condition: `Power > ${systemSettings.highPowerThresholdKw} kW`,
      isTriggered: false,
      actionTaken: 'Normal Grid Load',
    },
  ]);

  const prevOccupancyRef = useRef(sensorData.occupancy);
  const prevTempRef = useRef(sensorData.temperature);
  const prevPowerRef = useRef(sensorData.powerConsumption);

  // AUTOMATIC CONTROL LOGIC ENGINE
  useEffect(() => {
    const isOccupied = sensorData.occupancy > 0;
    const temp = sensorData.temperature;
    const lux = sensorData.lightIntensity;
    const tempThreshold = systemSettings.tempComfortThreshold;
    const coolThreshold = systemSettings.coolRoomThreshold;

    if (isOccupied) {
      setRoomStatus('OCCUPIED');
      setIsCountdownRunning(false);
      setEmptyCountdown(emptyCountdownDuration);

      if (energySavingMode) {
        setEnergySavingMode(false);
        addAlert({
          type: 'info',
          title: 'Room became occupied.',
          message: `Classroom re-occupied by ${sensorData.occupancy} students. Restoring nominal power.`,
          source: 'RULE_ENGINE',
        });
      }

      if (prevOccupancyRef.current === 0) {
        setLastActionReason(`🟢 Room became occupied (${sensorData.occupancy} students). Lights and fans turned ON automatically.`);
        addAlert({
          type: 'success',
          title: 'Room became occupied.',
          message: `${sensorData.occupancy} students entered ${selectedRoom.name}.`,
          source: 'SENSOR_TRIGGER',
        });
        addAlert({
          type: 'info',
          title: 'Lights turned ON automatically.',
          message: 'Automated occupancy rule activated ceiling LED banks.',
          source: 'RULE_ENGINE',
        });
      }

      setAppliances((prev) => {
        const next = { ...prev };

        if (next.lights.mode === 'AUTO') {
          const targetBrightness = lux > 750 ? 40 : lux > 500 ? 70 : 100;
          const power = Math.round(240 * (targetBrightness / 100));
          next.lights = {
            ...next.lights,
            isOn: true,
            brightness: targetBrightness,
            powerWatts: power,
            autoReason: `Lights turned ON automatically — room occupied (${sensorData.occupancy} students).`,
          };
        }

        if (next.fans.mode === 'AUTO') {
          if (temp > tempThreshold) {
            const speed = temp >= 33 ? 3 : 2;
            const power = speed === 3 ? 180 : 130;
            next.fans = {
              ...next.fans,
              isOn: true,
              speed,
              powerWatts: power,
              autoReason: `Fans turned ON automatically — temperature reached ${temp.toFixed(1)}°C (> ${tempThreshold}°C).`,
            };
          } else if (temp <= coolThreshold) {
            next.fans = {
              ...next.fans,
              isOn: false,
              speed: 0,
              powerWatts: 0,
              autoReason: `Fans turned OFF automatically — cool temperature detected (${temp.toFixed(1)}°C ≤ ${coolThreshold}°C).`,
            };
          } else {
            next.fans = {
              ...next.fans,
              isOn: true,
              speed: 1,
              powerWatts: 75,
              autoReason: `Eco ventilation active for comfortable ambient (${temp.toFixed(1)}°C).`,
            };
          }
        }

        if (next.ac.mode === 'AUTO') {
          if (temp > 26.0) {
            next.ac = {
              ...next.ac,
              isOn: true,
              powerWatts: temp > 30 ? 1500 : 950,
              autoReason: `AC compressor active: ambient ${temp.toFixed(1)}°C > 26.0°C target.`,
            };
          } else if (temp <= 22.0) {
            next.ac = {
              ...next.ac,
              isOn: false,
              powerWatts: 0,
              autoReason: `Ambient temp ${temp.toFixed(1)}°C is cool. Compressor resting.`,
            };
          } else {
            next.ac = {
              ...next.ac,
              isOn: true,
              powerWatts: 600,
              autoReason: `Eco thermal modulation active at ${temp.toFixed(1)}°C.`,
            };
          }
        }

        return next;
      });
    } else {
      setRoomStatus('EMPTY');

      if (prevOccupancyRef.current > 0) {
        setIsCountdownRunning(true);
        setEmptyCountdown(emptyCountdownDuration);
        setLastActionReason('🟡 Room became empty. Empty-room timer started before auto-shutdown.');
        addAlert({
          type: 'warning',
          title: 'Room became empty.',
          message: `Zero occupancy detected. Starting ${emptyCountdownDuration}s vacancy timer before auto-shutdown.`,
          source: 'RULE_ENGINE',
        });
      }
    }

    if (temp > tempThreshold && prevTempRef.current <= tempThreshold) {
      addAlert({
        type: 'warning',
        title: `Temperature exceeded ${tempThreshold}°C.`,
        message: `Ambient temperature reached ${temp.toFixed(1)}°C (> ${tempThreshold}°C).`,
        source: 'RULE_ENGINE',
      });
      addAlert({
        type: 'info',
        title: 'Fans turned ON automatically.',
        message: `High temperature (${temp.toFixed(1)}°C) triggered automatic cooling.`,
        source: 'RULE_ENGINE',
      });
      setLastActionReason(`Fans turned ON automatically — temperature reached ${temp.toFixed(1)}°C.`);
    } else if (temp <= coolThreshold && prevTempRef.current > coolThreshold && isOccupied) {
      addAlert({
        type: 'info',
        title: `Cool temperature detected (≤${coolThreshold}°C).`,
        message: `Temperature cooled to ${temp.toFixed(1)}°C. Fans powered OFF automatically.`,
        source: 'RULE_ENGINE',
      });
      setLastActionReason(`❄️ Fans turned OFF automatically — cool temperature detected (${temp.toFixed(1)}°C ≤ ${coolThreshold}°C).`);
    }

    prevOccupancyRef.current = sensorData.occupancy;
    prevTempRef.current = temp;
  }, [
    sensorData.occupancy, 
    sensorData.temperature, 
    sensorData.lightIntensity, 
    emptyCountdownDuration, 
    selectedRoom.name, 
    systemSettings.tempComfortThreshold, 
    systemSettings.coolRoomThreshold,
    addAlert
  ]);

  // COUNTDOWN TICKER EFFECT FOR EMPTY ROOM TIMEOUT
  useEffect(() => {
    if (!isCountdownRunning || sensorData.occupancy > 0) return;

    const interval = setInterval(() => {
      setEmptyCountdown((prev) => {
        if (prev <= 1) {
          setIsCountdownRunning(false);
          setEnergySavingMode(true);
          setAccumulatedSavingsKwh((kwh) => Math.round((kwh + 1.2) * 10) / 10);

          setAppliances((curr) => {
            const next = { ...curr };
            if (next.lights.mode === 'AUTO') {
              next.lights = {
                ...next.lights,
                isOn: false,
                powerWatts: 0,
                autoReason: 'Lights turned OFF automatically because the room has been empty.',
              };
            }
            if (next.fans.mode === 'AUTO') {
              next.fans = {
                ...next.fans,
                isOn: false,
                speed: 0,
                powerWatts: 0,
                autoReason: 'Fans turned OFF automatically because the room has been empty.',
              };
            }
            if (next.ac.mode === 'AUTO') {
              next.ac = {
                ...next.ac,
                isOn: false,
                powerWatts: 0,
                autoReason: 'AC shut down due to empty room timeout.',
              };
            }
            if (next.projector.mode === 'AUTO') {
              next.projector = {
                ...next.projector,
                isOn: false,
                powerWatts: 0,
                autoReason: 'Display entered standby eco mode.',
              };
            }
            return next;
          });

          setLastActionReason('🟢 Energy-saving mode activated because the room has been empty. Lights and fans turned OFF.');
          addAlert({
            type: 'success',
            title: 'Energy-saving mode activated.',
            message: 'Energy-saving mode activated because the room has been empty.',
            source: 'ENERGY_SAVER',
          });

          return 0;
        }
        return prev - 1;
      });
    }, 1000 / simSpeed);

    return () => clearInterval(interval);
  }, [isCountdownRunning, sensorData.occupancy, simSpeed, addAlert]);

  // POWER MONITORING & DYNAMIC POWER RECOMPUTATION
  useEffect(() => {
    let powerToEvaluate = sensorData.powerConsumption;
    const highThreshold = systemSettings.highPowerThresholdKw;
    const critThreshold = systemSettings.criticalPowerThresholdKw;

    if (!isDirectPowerModeRef.current) {
      const lightsWatts = appliances.lights.isOn ? appliances.lights.powerWatts : 0;
      const fansWatts = appliances.fans.isOn ? appliances.fans.powerWatts : 0;
      const acWatts = appliances.ac.isOn ? appliances.ac.powerWatts : 0;
      const projWatts = appliances.projector.isOn ? appliances.projector.powerWatts : 0;
      const studentLoadWatts = sensorData.occupancy * 32;
      const baselineIdleWatts = energySavingMode ? 60 : 220;

      const calculatedKw = (lightsWatts + fansWatts + acWatts + projWatts + studentLoadWatts + baselineIdleWatts) / 1000;
      powerToEvaluate = Math.round(calculatedKw * 100) / 100;

      setSensorData((prev) => {
        if (Math.abs(prev.powerConsumption - powerToEvaluate) > 0.02) {
          return { ...prev, powerConsumption: powerToEvaluate };
        }
        return prev;
      });
    }

    if (powerToEvaluate > critThreshold && prevPowerRef.current <= critThreshold) {
      addAlert({
        type: 'critical',
        title: `Critical power surge detected (>${critThreshold.toFixed(1)} kW).`,
        message: `Abnormally high critical load of ${powerToEvaluate.toFixed(2)} kW detected. High electrical surge hazard!`,
        source: 'ANOMALY_DETECTOR',
      });
      setLastActionReason(`🔴 Critical abnormal power surge: ${powerToEvaluate.toFixed(2)} kW (> ${critThreshold.toFixed(1)} kW threshold)!`);
    } else if (powerToEvaluate > highThreshold && powerToEvaluate <= critThreshold && prevPowerRef.current <= highThreshold) {
      addAlert({
        type: 'warning',
        title: 'Abnormally high power consumption detected.',
        message: `Current load ${powerToEvaluate.toFixed(2)} kW exceeds ${highThreshold.toFixed(1)} kW threshold.`,
        source: 'ANOMALY_DETECTOR',
      });
      setLastActionReason(`🟠 Abnormally high power consumption detected (${powerToEvaluate.toFixed(2)} kW > ${highThreshold.toFixed(1)} kW).`);
    }

    prevPowerRef.current = powerToEvaluate;
  }, [
    appliances.lights.isOn,
    appliances.lights.powerWatts,
    appliances.fans.isOn,
    appliances.fans.powerWatts,
    appliances.ac.isOn,
    appliances.ac.powerWatts,
    appliances.projector.isOn,
    appliances.projector.powerWatts,
    sensorData.occupancy,
    sensorData.powerConsumption,
    energySavingMode,
    systemSettings.highPowerThresholdKw,
    systemSettings.criticalPowerThresholdKw,
    addAlert
  ]);

  // SENSOR DRIFT SIMULATION
  useEffect(() => {
    if (!driftEnabled) return;
    const interval = setInterval(() => {
      setSensorData((prev) => {
        const tempDrift = (Math.random() - 0.5) * 0.1;
        const luxDrift = (Math.random() - 0.5) * 4;
        return {
          ...prev,
          temperature: Math.round((prev.temperature + tempDrift) * 10) / 10,
          lightIntensity: Math.max(0, Math.min(1000, Math.round(prev.lightIntensity + luxDrift))),
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [driftEnabled]);

  // LIVE RULES STATUS SYNC
  useEffect(() => {
    const isOccupied = sensorData.occupancy > 0;
    const temp = sensorData.temperature;
    const power = sensorData.powerConsumption;
    const tempThresh = systemSettings.tempComfortThreshold;
    const coolThresh = systemSettings.coolRoomThreshold;
    const highPowerThresh = systemSettings.highPowerThresholdKw;
    const critPowerThresh = systemSettings.criticalPowerThresholdKw;

    setActiveRules([
      {
        ruleId: 'RULE_1',
        name: 'Occupancy Based Lighting & Fans',
        description: 'Auto-turn ON lights when occupancy > 0.',
        condition: 'Occupancy > 0',
        isTriggered: isOccupied,
        actionTaken: isOccupied ? `Active (${sensorData.occupancy} students) → Lights & Ventilation ON` : 'Standby (0 Occupancy)',
      },
      {
        ruleId: 'RULE_2',
        name: 'Empty Room Auto-Shutdown',
        description: 'When occupancy = 0, start countdown then power OFF all appliances & enable Eco Mode.',
        condition: 'Occupancy == 0',
        isTriggered: !isOccupied,
        actionTaken: energySavingMode
          ? 'Completed → Energy Saving Mode ON (Appliances Powered Down)'
          : isCountdownRunning
          ? `Timer running: ${emptyCountdown}s remaining`
          : 'Standby - Room Occupied',
      },
      {
        ruleId: 'RULE_3',
        name: 'Thermal Comfort Trigger',
        description: `Automatically turn Fans ON when temperature exceeds ${tempThresh}°C.`,
        condition: `Temperature > ${tempThresh.toFixed(1)}°C`,
        isTriggered: temp > tempThresh,
        actionTaken: temp > tempThresh ? `Triggered (${temp.toFixed(1)}°C > ${tempThresh}°C) → Fans ON (Boosted)` : `Inactive (${temp.toFixed(1)}°C ≤ ${tempThresh}°C)`,
      },
      {
        ruleId: 'RULE_4',
        name: 'Cool Room Energy Conservation',
        description: `Automatically turn Fans OFF if room drops to ${coolThresh}°C or below.`,
        condition: `Temperature <= ${coolThresh.toFixed(1)}°C`,
        isTriggered: temp <= coolThresh && isOccupied,
        actionTaken: temp <= coolThresh ? `Triggered (${temp.toFixed(1)}°C ≤ ${coolThresh}°C) → Fans Switched OFF` : `Inactive (${temp.toFixed(1)}°C > ${coolThresh}°C)`,
      },
      {
        ruleId: 'RULE_5',
        name: 'Abnormal Power Consumption Monitor',
        description: `Show warning when power > ${highPowerThresh} kW and critical when > ${critPowerThresh} kW.`,
        condition: `Power > ${highPowerThresh.toFixed(2)} kW`,
        isTriggered: power > highPowerThresh,
        actionTaken: power > critPowerThresh ? `CRITICAL SURGE (${power.toFixed(2)} kW > ${critPowerThresh} kW)` : power > highPowerThresh ? `High Load Warning (${power.toFixed(2)} kW > ${highPowerThresh} kW)` : 'Normal (Nominal Load)',
      },
    ]);
  }, [
    sensorData.occupancy, 
    sensorData.temperature, 
    sensorData.powerConsumption, 
    isCountdownRunning, 
    emptyCountdown, 
    energySavingMode,
    systemSettings.tempComfortThreshold,
    systemSettings.coolRoomThreshold,
    systemSettings.highPowerThresholdKw,
    systemSettings.criticalPowerThresholdKw
  ]);

  // COLLEGE CAMPUS ROOMS LIST (Dynamic sync with live simulator for CSE Lab)
  const collegeRooms: CollegeRoom[] = [
    {
      id: 'cse-lab-302',
      name: 'CSE Laboratory (Room 302)',
      building: 'Turing Block',
      floor: '3rd Floor',
      capacity: 40,
      occupancy: sensorData.occupancy,
      temperature: sensorData.temperature,
      powerKw: sensorData.powerConsumption,
      status: roomStatus,
      healthStatus: sensorData.powerConsumption > 4.0 ? 'CRITICAL' : sensorData.powerConsumption > 3.0 ? 'ATTENTION' : 'NORMAL',
      lightsOn: appliances.lights.isOn,
      fansOn: appliances.fans.isOn,
      acOn: appliances.ac.isOn,
      isSimulatedLiveRoom: true,
    },
    {
      id: 'classroom-101',
      name: 'Classroom 101',
      building: 'Turing Block',
      floor: '1st Floor',
      capacity: 60,
      occupancy: 42,
      temperature: 26.2,
      powerKw: 1.45,
      status: 'OCCUPIED',
      healthStatus: 'NORMAL',
      lightsOn: true,
      fansOn: true,
      acOn: false,
    },
    {
      id: 'classroom-102',
      name: 'Classroom 102',
      building: 'Turing Block',
      floor: '1st Floor',
      capacity: 55,
      occupancy: 0,
      temperature: 24.8,
      powerKw: 0.12,
      status: 'STANDBY',
      healthStatus: 'NORMAL',
      lightsOn: false,
      fansOn: false,
      acOn: false,
    },
    {
      id: 'electronics-lab',
      name: 'Electronics Laboratory',
      building: 'Faraday Wing',
      floor: '2nd Floor',
      capacity: 35,
      occupancy: 28,
      temperature: 29.5,
      powerKw: 3.42,
      status: 'OCCUPIED',
      healthStatus: 'ATTENTION', // High power attention
      lightsOn: true,
      fansOn: true,
      acOn: true,
    },
    {
      id: 'seminar-hall',
      name: 'Main Seminar Hall',
      building: 'Innovation Hub',
      floor: 'Ground Floor',
      capacity: 120,
      occupancy: 85,
      temperature: 25.0,
      powerKw: 2.85,
      status: 'OCCUPIED',
      healthStatus: 'NORMAL',
      lightsOn: true,
      fansOn: true,
      acOn: true,
    },
  ];

  // DYNAMIC INTELLIGENT INSIGHTS GENERATION
  const intelligentInsights: IntelligentInsight[] = [
    {
      id: 'ins-1',
      type: 'SAVINGS',
      title: 'Vacancy Energy Conservation Impact',
      description: energySavingMode 
        ? 'Energy-saving mode prevented unnecessary appliance usage while the room remained empty.'
        : 'SmartSpace has achieved 18% lower energy consumption during simulated unoccupied periods.',
      impact: energySavingMode ? '-94% Idle Wastage Eliminated' : '~2.3 kWh Saved Daily',
      timestamp: 'Live Computation',
      actionRecommendation: 'Maintain automatic 10-second empty room shutdown rule across Turing Block.',
    },
    {
      id: 'ins-2',
      type: 'EFFICIENCY',
      title: 'Lighting Load Contribution',
      description: `Lighting currently contributes approximately ${Math.round((appliances.lights.powerWatts / Math.max(1, sensorData.powerConsumption * 1000)) * 100)}% of laboratory consumption.`,
      impact: `${sensorData.lightIntensity > 600 ? 'Daylight Harvesting Active (-45% dimming)' : 'Optimal Lux Level'}`,
      timestamp: 'Live Sensor Telemetry',
      actionRecommendation: 'LDR daylight harvesting is automatically trimming LED output.',
    },
    {
      id: 'ins-3',
      type: 'ANOMALY',
      title: sensorData.powerConsumption > 3.0 ? 'Elevated Power Anomaly' : 'Thermal & Electrical Grid Health',
      description: sensorData.powerConsumption > 3.0
        ? `Power consumption (${sensorData.powerConsumption.toFixed(2)} kW) is unusually high compared with normal baseline usage.`
        : 'All electrical branch circuits and thermal comfort parameters are operating within nominal green thresholds.',
      impact: sensorData.powerConsumption > 3.0 ? 'High Tariff Hazard' : 'Grid In Spec',
      timestamp: 'ACS712 Current Telemetry',
      actionRecommendation: sensorData.powerConsumption > 3.0 ? 'Inspect workstation power strips or throttle AC target.' : 'No manual intervention required.',
    },
    {
      id: 'ins-4',
      type: 'BEHAVIOR',
      title: 'Room Occupancy vs HVAC Optimization',
      description: `With ${sensorData.occupancy} students present, dynamic compressor modulation maintains 24.0°C comfort setpoint.`,
      impact: '0.82 kg CO₂ Saved / Hour',
      timestamp: 'Continuous Rule Evaluation',
      actionRecommendation: 'Autonomous rules are active.',
    },
  ];

  // APPLIANCE CONTROL HANDLERS
  const toggleAppliancePower = (applianceKey: keyof Appliances) => {
    soundManager.playClick();
    setAppliances((prev) => {
      const app = prev[applianceKey];
      const nextState = !app.isOn;
      const powerMap: Record<string, number> = {
        lights: 240,
        fans: 120,
        ac: 900,
        projector: 180,
      };

      const updated = {
        ...app,
        isOn: nextState,
        mode: 'MANUAL' as const,
        manualOverrideActive: true,
        powerWatts: nextState ? (powerMap[applianceKey] || 100) : 0,
        autoReason: `MANUAL OVERRIDE: Switched ${nextState ? 'ON' : 'OFF'} by faculty.`,
      };

      addAlert({
        type: 'info',
        title: `${app.name} Manual Override`,
        message: `${app.name} turned ${nextState ? 'ON' : 'OFF'} manually. Auto-rules disabled for this device.`,
        source: 'MANUAL_OVERRIDE',
      });

      return {
        ...prev,
        [applianceKey]: updated,
      };
    });
  };

  const setApplianceMode = (applianceKey: keyof Appliances, mode: 'AUTO' | 'MANUAL') => {
    soundManager.playClick();
    setAppliances((prev) => {
      const app = prev[applianceKey];
      const updated = {
        ...app,
        mode,
        manualOverrideActive: mode === 'MANUAL',
        autoReason: mode === 'AUTO' ? 'Returned to autonomous energy rule control.' : 'MANUAL OVERRIDE ACTIVE',
      };

      addAlert({
        type: mode === 'AUTO' ? 'success' : 'warning',
        title: `${app.name} Mode: ${mode}`,
        message: mode === 'AUTO' ? 'Automatic IoT rules resumed.' : 'Manual override active. Automatic rules will not override.',
        source: 'MANUAL_OVERRIDE',
      });

      return {
        ...prev,
        [applianceKey]: updated,
      };
    });
  };

  const setMasterMode = (mode: 'AUTO' | 'MANUAL') => {
    soundManager.playClick();
    setAppliances((prev) => ({
      lights: {
        ...prev.lights,
        mode,
        manualOverrideActive: mode === 'MANUAL',
        autoReason: mode === 'AUTO' ? 'Autonomous IoT rule engine active' : 'MANUAL OVERRIDE ACTIVE',
      },
      fans: {
        ...prev.fans,
        mode,
        manualOverrideActive: mode === 'MANUAL',
        autoReason: mode === 'AUTO' ? 'Autonomous IoT rule engine active' : 'MANUAL OVERRIDE ACTIVE',
      },
      ac: {
        ...prev.ac,
        mode,
        manualOverrideActive: mode === 'MANUAL',
        autoReason: mode === 'AUTO' ? 'Autonomous IoT rule engine active' : 'MANUAL OVERRIDE ACTIVE',
      },
      projector: {
        ...prev.projector,
        mode,
        manualOverrideActive: mode === 'MANUAL',
        autoReason: mode === 'AUTO' ? 'Autonomous IoT rule engine active' : 'MANUAL OVERRIDE ACTIVE',
      },
    }));

    addAlert({
      type: mode === 'AUTO' ? 'success' : 'warning',
      title: `Master Control: ${mode}`,
      message: mode === 'AUTO' ? 'All appliances synchronized with autonomous IoT rules.' : 'Manual Override Active across all lab appliances.',
      source: 'MANUAL_OVERRIDE',
    });
  };

  const setLightBrightness = (val: number) => {
    setAppliances((prev) => ({
      ...prev,
      lights: {
        ...prev.lights,
        brightness: val,
        powerWatts: Math.round(240 * (val / 100)),
        isOn: val > 0,
      }
    }));
  };

  const toggleLightZone = (zone: 1 | 2) => {
    soundManager.playClick();
    setAppliances((prev) => {
      const z1 = zone === 1 ? !prev.lights.zone1On : prev.lights.zone1On;
      const z2 = zone === 2 ? !prev.lights.zone2On : prev.lights.zone2On;
      const isOn = z1 || z2;
      const watts = (z1 ? 120 : 0) + (z2 ? 120 : 0);

      return {
        ...prev,
        lights: {
          ...prev.lights,
          zone1On: z1,
          zone2On: z2,
          isOn,
          powerWatts: Math.round(watts * (prev.lights.brightness / 100)),
        }
      };
    });
  };

  const setFanSpeed = (speed: number) => {
    soundManager.playClick();
    setAppliances((prev) => ({
      ...prev,
      fans: {
        ...prev.fans,
        speed,
        isOn: speed > 0,
        mode: 'MANUAL',
        manualOverrideActive: true,
        powerWatts: speed === 0 ? 0 : speed === 1 ? 55 : speed === 2 ? 110 : 170,
        autoReason: `MANUAL OVERRIDE: Fan set to speed ${speed}.`,
      }
    }));
  };

  const setAcTargetTemp = (targetTemp: number) => {
    soundManager.playClick();
    setAppliances((prev) => ({
      ...prev,
      ac: {
        ...prev.ac,
        targetTemp,
        powerWatts: targetTemp < 22 ? 1400 : targetTemp < 25 ? 900 : 650,
      }
    }));
  };

  // RESET SIMULATION FUNCTION
  const resetSimulation = () => {
    soundManager.playSuccess();
    isDirectPowerModeRef.current = false;
    setSensorData({
      occupancy: 24,
      temperature: 27.5,
      lightIntensity: 420,
      powerConsumption: 1.24,
      manualPowerOffset: 0,
      humidity: 55,
    });
    setAppliances({
      lights: {
        id: 'lights',
        name: 'Smart LED Lighting',
        isOn: true,
        powerWatts: 240,
        mode: 'AUTO',
        brightness: 85,
        zone1On: true,
        zone2On: true,
        autoReason: 'Lights turned ON automatically — room occupied (24 students).',
      },
      fans: {
        id: 'fans',
        name: 'BLDC Ceiling Fans',
        isOn: true,
        powerWatts: 130,
        mode: 'AUTO',
        speed: 2,
        autoReason: 'Fans active for room comfort at 27.5°C.',
      },
      ac: {
        id: 'ac',
        name: 'Inverter Climate AC',
        isOn: true,
        powerWatts: 850,
        mode: 'AUTO',
        targetTemp: 24,
        ecoMode: false,
        autoReason: 'Maintaining optimal 24.0°C laboratory temperature.',
      },
      projector: {
        id: 'projector',
        name: 'Interactive Smart Display',
        isOn: true,
        powerWatts: 180,
        mode: 'AUTO',
        source: 'HDMI-1',
        autoReason: 'Lab lecture active.',
      }
    });
    setRoomStatus('OCCUPIED');
    setEnergySavingMode(false);
    setIsCountdownRunning(false);
    setEmptyCountdown(emptyCountdownDuration);
    setActiveScenario('demo-1');
    setLastActionReason('Simulation Reset: Baseline values restored. Occupancy = 24, Temp = 27.5°C, Power = 1.24 kW.');

    addAlert({
      type: 'info',
      title: 'Simulation Reset',
      message: 'All sensor values and appliances reset to default baseline state.',
      source: 'RULE_ENGINE',
    });
  };

  // DEMO SCENARIOS
  const runScenario = (scenarioId: string) => {
    soundManager.playClick();
    setActiveScenario(scenarioId);

    switch (scenarioId) {
      case 'demo-1':
        resetSimulation();
        break;

      case 'demo-2':
        isDirectPowerModeRef.current = false;
        setSensorData((prev) => ({
          ...prev,
          occupancy: 0,
        }));
        setRoomStatus('EMPTY');
        setIsCountdownRunning(true);
        setEmptyCountdown(emptyCountdownDuration);
        break;

      case 'demo-3':
        isDirectPowerModeRef.current = false;
        setSensorData((prev) => ({
          ...prev,
          occupancy: 26,
          temperature: 31.0,
        }));
        break;

      case 'demo-4':
        isDirectPowerModeRef.current = true;
        setSensorData((prev) => ({
          ...prev,
          powerConsumption: 4.25,
        }));
        break;

      case 'demo-5':
        isDirectPowerModeRef.current = false;
        setSensorData((prev) => ({
          ...prev,
          occupancy: 20,
          lightIntensity: 880,
          temperature: 25.0,
        }));
        break;

      default:
        break;
    }
  };

  // DYNAMIC ENERGY CALCULATIONS
  const todayConsumptionKwh = 8.7 + (sensorData.powerConsumption > 1.5 ? 0.4 : 0.0);
  const todaySavedKwh = energySavingMode ? accumulatedSavingsKwh + 1.2 : accumulatedSavingsKwh;
  const avoidedWastageKwh = energySavingMode ? 2.8 : 1.8;
  const savingPercentage = Math.round((todaySavedKwh / (todayConsumptionKwh + todaySavedKwh)) * 100);
  const averagePowerKw = Math.round((1.18 + (sensorData.powerConsumption - 1.24) * 0.3) * 100) / 100;
  const peakPowerKw = Math.max(3.15, sensorData.powerConsumption);
  const costSavedRupees = Math.round(todaySavedKwh * 8.5);
  const co2SavedKg = Math.round(todaySavedKwh * 0.82 * 10) / 10;

  return (
    <SmartSpaceContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        sensorData,
        setSensorData,
        updateSensor,
        driftEnabled,
        setDriftEnabled,
        appliances,
        toggleAppliancePower,
        setApplianceMode,
        setMasterMode,
        setLightBrightness,
        toggleLightZone,
        setFanSpeed,
        setAcTargetTemp,
        roomStatus,
        energySavingMode,
        selectedRoom,
        setSelectedRoom,
        roomOptions: AVAILABLE_ROOMS,
        collegeRooms,
        selectedModalRoom,
        setSelectedModalRoom,
        systemSettings,
        updateSetting,
        resetSettingsToDefault,
        emptyCountdown,
        emptyCountdownDuration,
        setEmptyCountdownDuration,
        isCountdownRunning,
        fastForwardCountdown,
        simSpeed,
        setSimSpeed,
        alerts,
        addAlert,
        clearAlerts,
        analyticsTimeframe,
        setAnalyticsTimeframe,
        todayConsumptionKwh,
        todaySavedKwh,
        avoidedWastageKwh,
        savingPercentage,
        averagePowerKw,
        peakPowerKw,
        costSavedRupees,
        co2SavedKg,
        hourlyHistory: INITIAL_HOURLY_DATA,
        weeklyHistory: INITIAL_WEEKLY_DATA,
        monthlyHistory: INITIAL_MONTHLY_DATA,
        intelligentInsights,
        activeRules,
        lastActionReason,
        runScenario,
        activeScenario,
        resetSimulation,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        isHardwareModalOpen,
        setIsHardwareModalOpen,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </SmartSpaceContext.Provider>
  );
};

export const useSmartSpace = () => {
  const context = useContext(SmartSpaceContext);
  if (!context) {
    throw new Error('useSmartSpace must be used within a SmartSpaceProvider');
  }
  return context;
};
