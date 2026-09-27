# SmartSpace – Intelligent Classroom & Laboratory Energy Management System

A production-grade, interactive IoT Prototype and Autonomous Energy Management Dashboard designed for college innovation and IoT competitions.

---

## 🌟 Key Features

1. **Autonomous IoT Rule Engine**:
   - **Rule 1 (Occupancy-Driven)**: Turns ON lighting and climate systems when students enter.
   - **Rule 2 (10-Minute Vacancy Timeout)**: Automatically triggers an empty-room countdown when occupancy hits 0, turns OFF appliances, and enables **Energy-Saving Mode**.
   - **Rule 3 (Thermal Comfort > 28°C)**: Automatically turns ON and boosts BLDC fan speed during high temperatures.
   - **Rule 4 (Cool Room < 24°C)**: Powers down fans when the room is cool and occupied to eliminate wasted power.
   - **Rule 5 (Overload & Anomaly Detection)**: Flags abnormal electrical surges (> 3.5 kW) with visual and audio alerts.

2. **Simulated Sensor Controls Panel**:
   - **Occupancy Slider** (0–60 students) + Quick Presets (`Empty`, `12 Students`, `24 Full Class`, `45 Jammed`).
   - **Temperature Slider** (15°C–45°C) + Thermal Presets (`21°C AC`, `25°C Eco`, `29°C Fan Trigger`, `35°C Heatwave`).
   - **Ambient Light Intensity** (0–1000 lux) with daylight harvesting auto-dimming.
   - **Power Load & Surge Injector** (0–5.0 kW) with real-time anomaly simulation.
   - **ADC Micro-Noise Generator** to mimic live sensor fluctuations.

3. **Live Digital Twin Classroom Visualization**:
   - Dynamic 2D floorplan with 32 workstations populated by animated student avatars matching live occupancy.
   - Glowing dual-zone ceiling LED banks responding to lux and dimmer settings.
   - Spinning BLDC ceiling fans with CSS animations synchronized to active fan speeds.
   - Split AC unit with cool airflow particle indicators.
   - PIR motion sensor gateway at the classroom entrance.

4. **Appliance Actuation & Faculty Manual Override**:
   - Zone A & Zone B smart lighting with 0–100% dimming.
   - BLDC ceiling fans with 4-level speed controls.
   - Inverter AC unit with thermostat setpoint stepper.
   - Laser interactive whiteboard display.
   - Master AUTO / MANUAL switches with clear "Manual Override Active" alerts.

5. **Energy Analytics & Sustainability KPIs**:
   - 24-Hour Comparative Load Curve (Unmanaged Baseline vs SmartSpace Autonomous).
   - Occupancy vs Power consumption correlation bar charts.
   - Energy breakdown by appliance (HVAC, Lighting, Fans, PCs).
   - Dynamic calculations for kWh saved, ₹ institutional cost savings, and CO₂ offset.

6. **ESP32 & Wokwi IoT Hardware Bridge**:
   - Ready-to-flash Arduino/C++ firmware for ESP32.
   - Standard MQTT JSON telemetry pipeline (`smartspace/cse-lab-302/telemetry`).
   - Complete GPIO pinout table (PIR on GPIO 13, DHT22 on GPIO 4, LDR on GPIO 34, ACS712 on GPIO 35, Relays on GPIO 18, 19, 21, 22).

---

## 🚀 How to Run Locally

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) installed on your system.

### 2. Start the Development Server
Open your terminal in the project directory:
```bash
npm run dev
```

### 3. Open in Browser
Open your browser and navigate to:
```
http://localhost:5173/
```

### 4. Build for Production (Optional)
To verify or create a standalone distribution bundle:
```bash
npm run build
npm run preview
```

---

## 🎯 Quick Judge Demonstration Guide

| Scenario | Click This Button | Expected Dashboard Reaction |
| :--- | :--- | :--- |
| **Demo 1: Normal Lab Session** | `Demo 1: Class Active` | Occupancy = 24, Temp = 27.5°C, Room = OCCUPIED, Lights & Fans automatically ON. |
| **Demo 2: Class Leaves** | `Demo 2: Class Leaves` → `Jump 10m` | Occupancy = 0, Vacancy countdown starts. After 10m elapsed, all appliances power down & **Eco-Mode ON** activates. |
| **Demo 3: High Temperature** | `Demo 3: High Temp (32°C)` | Temperature surges to 32.5°C. Rule 3 triggers, fan speed boosts to high, and high-temp alert is logged. |
| **Demo 4: Power Surge Anomaly** | `Demo 4: Power Surge Anomaly` | Power load spikes above 3.8 kW. Critical anomaly warning badge and audible beep engage. |
| **Demo 5: Daylight Saver** | `Demo 5: Daylight Saver` | Light intensity reaches 880 lux. Artificial lighting automatically dims to 35% to save energy. |
| **Hardware Bridge** | `ESP32 / Wokwi` Button | Opens modal with ready-to-use C++ code, MQTT payload, and GPIO wiring schematic. |

---

## 📂 Project Architecture

```
smartspace/
├── index.html                  # HTML5 shell with Google Fonts & dark theme
├── package.json                # React 19, Vite 6, Tailwind CSS, Lucide, Recharts
├── tailwind.config.js          # Custom colors, glow effects & animations
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Main dashboard layout
│   ├── index.css               # Glassmorphism utilities & custom sliders
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   ├── utils/
│   │   └── audio.ts            # Web Audio sound generator for tactile feedback
│   ├── context/
│   │   └── SmartSpaceContext.tsx # Autonomous IoT rule engine & sensor state
│   └── components/
│       ├── Header.tsx              # Brand, system status, room selector, clock
│       ├── JudgeDemoBar.tsx        # 1-click competition demo scenario triggers
│       ├── LiveStatusCards.tsx     # 6 key KPI cards + logic explanation banner
│       ├── SensorSimulationPanel.tsx # Interactive sliders & presets
│       ├── ClassroomVisualizer.tsx # 2D digital twin with desks & avatars
│       ├── ApplianceControl.tsx    # Actuation cards & manual override
│       ├── AutomaticRuleMonitor.tsx# Live Rule 1–5 policy evaluator
│       ├── EnergyAnalytics.tsx     # Interactive Recharts & savings breakdown
│       ├── AlertPanel.tsx          # Real-time event feed & CSV exporter
│       └── Esp32WokwiModal.tsx     # ESP32 C++ firmware & MQTT bridge
```
