#include "DHT.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

int lightPin = 2;
int fanPin = 17;
int pirPin = 16;
int dhtPin = 15;
int ldrPin = 34;

DHT dht(dhtPin, DHT22);

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* serverUrl = "https://smartspace-iot-live.loca.lt/api/telemetry";

void setup() {
  Serial.begin(115200);
  pinMode(lightPin, OUTPUT);
  pinMode(fanPin, OUTPUT);
  pinMode(pirPin, INPUT);
  dht.begin();

  Serial.println("SmartSpace ESP32 is alive!");
  Serial.print("Connecting to Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Wi-Fi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  int motionDetected = digitalRead(pirPin);
  float temperature = dht.readTemperature();
  int lightLevel = analogRead(ldrPin);

  bool occupied = (motionDetected == HIGH);
  bool lowLight = (lightLevel < 2000);
  bool lightOn = (occupied && lowLight);
  digitalWrite(lightPin, lightOn ? HIGH : LOW);

  static bool fanOn = false;
  if (temperature > 28.0) {
    fanOn = true;
  } else if (temperature < 24.0) {
    fanOn = false;
  }
  digitalWrite(fanPin, fanOn ? HIGH : LOW);

  float simulatedPower = 0;
  if (lightOn) simulatedPower += 10.0;
  if (fanOn) simulatedPower += 15.0;
  float powerInKw = simulatedPower / 1000.0;

  Serial.println(occupied ? "Room Status: OCCUPIED" : "Room Status: UNOCCUPIED");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" C");
  Serial.print("Light Level: "); Serial.println(lightLevel);
  Serial.println(lightOn ? "Light: ON" : "Light: OFF");
  Serial.println(fanOn ? "Fan: ON" : "Fan: OFF");
  Serial.print("Power Usage: "); Serial.print(simulatedPower); Serial.println(" W");

  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();   // skips certificate checking, simplifies HTTPS setup

    HTTPClient http;
    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{";
    jsonPayload += "\"room_id\":\"cse-lab-302\",";
    jsonPayload += "\"occupancy\":" + String(occupied ? 1 : 0) + ",";
    jsonPayload += "\"temperature\":" + String(temperature) + ",";
    jsonPayload += "\"light_intensity\":" + String(lightLevel) + ",";
    jsonPayload += "\"lights_on\":" + String(lightOn ? "true" : "false") + ",";
    jsonPayload += "\"fans_on\":" + String(fanOn ? "true" : "false") + ",";
    jsonPayload += "\"fan_speed\":" + String(fanOn ? 2 : 0) + ",";
    jsonPayload += "\"power_consumption\":" + String(powerInKw, 3);
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("Data sent! Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }

  Serial.println("-----------------------");
  delay(5000);
}
