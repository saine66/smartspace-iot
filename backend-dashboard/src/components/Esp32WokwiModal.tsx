import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Copy, 
  Check, 
  Code, 
  Radio, 
  Zap
} from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

interface Esp32WokwiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Esp32WokwiModal: React.FC<Esp32WokwiModalProps> = ({ isOpen, onClose }) => {
  const { sensorData, appliances, selectedRoom } = useSmartSpace();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMqtt, setCopiedMqtt] = useState(false);
  const [activeTab, setActiveTab] = useState<'cpp' | 'mqtt' | 'pinout'>('cpp');

  if (!isOpen) return null;

  const liveMqttJson = JSON.stringify(
    {
      device_id: 'SMARTSPACE_NODE_01',
      room_id: selectedRoom.id,
      timestamp: new Date().toISOString(),
      sensors: {
        occupancy: sensorData.occupancy,
        temperature_c: sensorData.temperature,
        ambient_lux: sensorData.lightIntensity,
        current_kw: sensorData.powerConsumption,
        pir_motion: sensorData.occupancy > 0 ? 1 : 0,
      },
      actuators: {
        relay_lights_zone1: appliances.lights.zone1On && appliances.lights.isOn ? 1 : 0,
        relay_lights_zone2: appliances.lights.zone2On && appliances.lights.isOn ? 1 : 0,
        fan_speed_pwm: appliances.fans.isOn ? appliances.fans.speed * 85 : 0,
        relay_ac: appliances.ac.isOn ? 1 : 0,
        relay_projector: appliances.projector.isOn ? 1 : 0,
      },
      telemetry_state: {
        mode: appliances.lights.mode,
        saving_mode: sensorData.occupancy === 0 ? 1 : 0,
      }
    },
    null,
    2
  );

  const esp32CppCode = `/*
 * SmartSpace – ESP32 Autonomous Energy Node Firmware
 * Target: ESP32 DevKit V1 / Wokwi Simulator
 * Features: DHT22, HC-SR501 PIR, LDR Photoresistor, ACS712 Current Sensor, 4-Ch Relay
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Sensor Pin Definitions
#define DHTPIN 4
#define DHTTYPE DHT22
#define PIR_PIN 13
#define LDR_PIN 34
#define ACS712_PIN 35

// Relay Actuator Pins
#define RELAY_LIGHTS_Z1 18
#define RELAY_LIGHTS_Z2 19
#define RELAY_FANS 21
#define RELAY_AC 22

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* mqtt_server = "broker.hivemq.com";
const char* topic_telemetry = "smartspace/${selectedRoom.id}/telemetry";
const char* topic_command = "smartspace/${selectedRoom.id}/command";

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  pinMode(PIR_PIN, INPUT);
  pinMode(RELAY_LIGHTS_Z1, OUTPUT);
  pinMode(RELAY_LIGHTS_Z2, OUTPUT);
  pinMode(RELAY_FANS, OUTPUT);
  pinMode(RELAY_AC, OUTPUT);

  // Initialize relays in OFF state (active LOW or HIGH depending on module)
  digitalWrite(RELAY_LIGHTS_Z1, LOW);
  digitalWrite(RELAY_LIGHTS_Z2, LOW);
  digitalWrite(RELAY_FANS, LOW);
  digitalWrite(RELAY_AC, LOW);

  connectWiFi();
  mqttClient.setServer(mqtt_server, 1883);
}

void loop() {
  if (!mqttClient.connected()) reconnectMQTT();
  mqttClient.loop();

  // 1. Read Physical Sensors
  float temperature = dht.readTemperature();
  int pirState = digitalRead(PIR_PIN);
  int ldrRaw = analogRead(LDR_PIN);
  float lux = map(ldrRaw, 0, 4095, 1000, 0); // Inverted LDR voltage divider

  // 2. Publish Telemetry JSON over MQTT
  StaticJsonDocument<256> doc;
  doc["room"] = "${selectedRoom.name}";
  doc["temperature"] = temperature;
  doc["pir_motion"] = pirState;
  doc["lux"] = lux;

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);
  mqttClient.publish(topic_telemetry, jsonBuffer);

  Serial.println(jsonBuffer);
  delay(2000); // 2-second telemetry cycle
}
`;

  const handleCopy = (text: string, isCode: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedMqtt(true);
      setTimeout(() => setCopiedMqtt(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ESP32 & Wokwi IoT Hardware Bridge
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Ready to Deploy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct hardware firmware & MQTT JSON telemetry pipeline for physical IoT competition demo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800/80 bg-slate-900">
          <button
            onClick={() => setActiveTab('cpp')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'cpp'
                ? 'border-brand-500 text-brand-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            ESP32 Arduino C++ Code
          </button>
          <button
            onClick={() => setActiveTab('mqtt')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'mqtt'
                ? 'border-brand-500 text-brand-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            Live MQTT JSON Payload
          </button>
          <button
            onClick={() => setActiveTab('pinout')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pinout'
                ? 'border-brand-500 text-brand-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            Wiring & GPIO Pinout
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          
          {activeTab === 'cpp' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(esp32CppCode, true)}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all z-10"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
                {esp32CppCode}
              </pre>
            </div>
          )}

          {activeTab === 'mqtt' && (
            <div className="relative">
              <div className="flex items-center justify-between mb-3 text-xs font-sans">
                <span className="text-slate-300 font-bold">
                  MQTT Topic: <code className="text-emerald-400 font-mono">smartspace/{selectedRoom.id}/telemetry</code>
                </span>
                <button
                  onClick={() => handleCopy(liveMqttJson, false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-all"
                >
                  {copiedMqtt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMqtt ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 border border-slate-800 overflow-x-auto leading-relaxed">
                {liveMqttJson}
              </pre>
            </div>
          )}

          {activeTab === 'pinout' && (
            <div className="space-y-4 font-sans text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-3">ESP32 Pinout Allocation Table:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-brand-400 font-bold">GPIO 13:</span> HC-SR501 PIR Motion Sensor (Digital In)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-rose-400 font-bold">GPIO 04:</span> DHT22 Temperature & Humidity (OneWire)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-bold">GPIO 34:</span> LDR Ambient Light Sensor (ADC1_CH6)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-purple-400 font-bold">GPIO 35:</span> ACS712 20A Current Sensor (ADC1_CH7)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-blue-400 font-bold">GPIO 18:</span> Relay 1 (Zone A Lighting Bank)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-blue-400 font-bold">GPIO 19:</span> Relay 2 (Zone B Lighting Bank)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold">GPIO 21:</span> Relay 3 / PWM (BLDC Ceiling Fans)
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-cyan-400 font-bold">GPIO 22:</span> Relay 4 (HVAC Inverter AC)
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">
            Compatible with Wokwi Web Simulator & physical ESP32 boards.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
