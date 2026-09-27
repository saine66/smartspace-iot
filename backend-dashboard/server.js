import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// In-Memory Storage for Telemetry & Alerts
const latestRoomTelemetry = {
  'cse-lab-302': {
    room_id: 'cse-lab-302',
    name: 'CSE Laboratory',
    occupancy: 24,
    temperature: 27.5,
    light_intensity: 420,
    power_consumption: 1.24,
    lights_on: true,
    fans_on: true,
    ac_on: true,
    last_updated: new Date().toISOString()
  },
  'classroom-101': {
    room_id: 'classroom-101',
    name: 'Classroom 101',
    occupancy: 42,
    temperature: 26.2,
    light_intensity: 550,
    power_consumption: 1.45,
    lights_on: true,
    fans_on: true,
    ac_on: false,
    last_updated: new Date().toISOString()
  },
  'classroom-102': {
    room_id: 'classroom-102',
    name: 'Classroom 102',
    occupancy: 0,
    temperature: 24.8,
    light_intensity: 120,
    power_consumption: 0.12,
    lights_on: false,
    fans_on: false,
    ac_on: false,
    last_updated: new Date().toISOString()
  },
  'electronics-lab': {
    room_id: 'electronics-lab',
    name: 'Electronics Laboratory',
    occupancy: 28,
    temperature: 29.5,
    light_intensity: 600,
    power_consumption: 3.42,
    lights_on: true,
    fans_on: true,
    ac_on: true,
    last_updated: new Date().toISOString()
  },
  'seminar-hall': {
    room_id: 'seminar-hall',
    name: 'Main Seminar Hall',
    occupancy: 85,
    temperature: 25.0,
    light_intensity: 750,
    power_consumption: 2.85,
    lights_on: true,
    fans_on: true,
    ac_on: true,
    last_updated: new Date().toISOString()
  }
};

const telemetryHistory = [];
const alertsLog = [
  {
    id: 'srv-init-1',
    timestamp: new Date().toISOString(),
    room: 'System',
    type: 'info',
    title: 'SmartSpace Cloud Backend Online',
    message: 'Render.com IoT ingestion gateway initialized and listening for ESP32 telemetry.'
  }
];

// Middleware: Request Logger for Debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// 1. HEALTH CHECK ENDPOINTS
// ==========================================
app.get(['/', '/api', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    system: 'SmartSpace IoT Platform',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor(process.uptime()),
    active_rooms: Object.keys(latestRoomTelemetry).length,
    endpoints: {
      post_telemetry: 'POST /api/telemetry',
      get_telemetry: 'GET /api/telemetry',
      health: 'GET /api/health'
    }
  });
});

// ==========================================
// 2. ESP32 TELEMETRY INGESTION (HTTP POST)
// Supports: /api/telemetry, /api/telemetry/, /telemetry, /api/v1/telemetry
// ==========================================
const handleTelemetryIngest = (req, res) => {
  try {
    const data = req.body || {};

    // Extract fields (supports both structured and flat formats)
    const roomId = data.room_id || data.roomId || req.params.roomId || 'cse-lab-302';
    const occupancy = Number(data.occupancy ?? data.sensors?.occupancy ?? (data.pir_motion ? 24 : 0));
    const temperature = Number(data.temperature ?? data.temperature_c ?? data.sensors?.temperature_c ?? 25.0);
    const lightIntensity = Number(data.light_intensity ?? data.ambient_lux ?? data.lux ?? data.sensors?.ambient_lux ?? 400);
    const powerConsumption = Number(data.power_consumption ?? data.power_kw ?? data.sensors?.power_kw ?? 1.2);
    
    const lightsOn = data.lights_on ?? data.lights_status ?? (occupancy > 0);
    const fansOn = data.fans_on ?? data.fan_status ?? (temperature > 28.0);
    const acOn = data.ac_on ?? data.ac_status ?? (temperature > 26.0);

    const record = {
      room_id: roomId,
      occupancy,
      temperature,
      light_intensity: lightIntensity,
      power_consumption: powerConsumption,
      lights_on: Boolean(lightsOn),
      fans_on: Boolean(fansOn),
      ac_on: Boolean(acOn),
      received_at: new Date().toISOString()
    };

    // Update in-memory state
    latestRoomTelemetry[roomId] = {
      ...(latestRoomTelemetry[roomId] || {}),
      ...record
    };

    // Add to history (keep last 100)
    telemetryHistory.unshift(record);
    if (telemetryHistory.length > 100) telemetryHistory.pop();

    // Autonomous Rule Evaluation & Alert Logging
    if (powerConsumption > 4.0) {
      alertsLog.unshift({
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        room: roomId,
        type: 'critical',
        title: 'Critical Power Surge Detected',
        message: `High abnormal load of ${powerConsumption.toFixed(2)} kW detected from ESP32 node.`
      });
    } else if (temperature > 32.0) {
      alertsLog.unshift({
        id: `alert-${Date.now()}`,
        timestamp: new Date().toISOString(),
        room: roomId,
        type: 'warning',
        title: 'High Temperature Threshold Exceeded',
        message: `Temperature reached ${temperature.toFixed(1)}°C. Fans and cooling boosted.`
      });
    }

    if (alertsLog.length > 50) alertsLog.pop();

    console.log(`[ESP32 Telemetry Saved] Room: ${roomId} | Occ: ${occupancy} | Temp: ${temperature}°C | Power: ${powerConsumption}kW`);

    // Respond back to ESP32 with acknowledgment and actuator directives
    return res.status(200).json({
      success: true,
      message: 'Telemetry received and processed successfully',
      room_id: roomId,
      server_timestamp: record.received_at,
      desired_actuators: {
        lights_relay: record.lights_on ? 1 : 0,
        fans_relay: record.fans_on ? 1 : 0,
        ac_relay: record.ac_on ? 1 : 0
      }
    });
  } catch (err) {
    console.error('[Telemetry Ingest Error]:', err);
    return res.status(500).json({ error: 'Internal Server Error processing telemetry' });
  }
};

// Bind to multiple route aliases for maximum compatibility
app.post('/api/telemetry', handleTelemetryIngest);
app.post('/api/telemetry/', handleTelemetryIngest);
app.post('/telemetry', handleTelemetryIngest);
app.post('/telemetry/', handleTelemetryIngest);
app.post('/api/v1/telemetry', handleTelemetryIngest);
app.post('/api/rooms/:roomId/telemetry', handleTelemetryIngest);


// ==========================================
// 3. GET TELEMETRY & ALERTS ENDPOINTS
// ==========================================
app.get('/api/telemetry', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(latestRoomTelemetry).length,
    data: latestRoomTelemetry
  });
});

app.get('/api/telemetry/:roomId', (req, res) => {
  const room = latestRoomTelemetry[req.params.roomId];
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json({ success: true, data: room });
});

app.get('/api/alerts', (req, res) => {
  res.json({
    success: true,
    count: alertsLog.length,
    data: alertsLog
  });
});

// ==========================================
// 4. SERVE STATIC FRONTEND (SPA)
// ==========================================
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to React index.html for any unmatched client routes
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ==========================================
// 5. START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SmartSpace Cloud Backend Server Active!`);
  console.log(`📍 Listening on Port: ${PORT}`);
  console.log(`🌐 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`📡 Telemetry Ingest: POST http://localhost:${PORT}/api/telemetry`);
  console.log(`====================================================`);
});
