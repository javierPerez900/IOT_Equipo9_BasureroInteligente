#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "SOCIPEP 2.4G";
const char* password = "RussoMeza";

ESP8266WebServer server(80);

// Variables para almacenar los datos de los sensores
String distance1 = "0";
String distance2 = "0";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");

  // Configurar el servidor web
  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
}

void loop() {
  // Escuchar por peticiones HTTP
  server.handleClient();

  // Leer datos del serial (del ATmega328p)
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    Serial.println("Data received: " + data); // Mensaje de depuración
    int separatorIndex = data.indexOf(',');
    if (separatorIndex != -1) {
      distance1 = data.substring(0, separatorIndex);
      distance2 = data.substring(separatorIndex + 1);
    }
  }
}

void handleRoot() {
  String html = "<html><head><title>Sensor Data</title></head><body>";
  html += "<h1>Sensor Data</h1>";
  html += "<p>Distance to person: " + distance1 + " cm</p>";
  html += "<p>Distance to trash: " + distance2 + " cm</p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleData() {
  String json = "{\"distance1\": \"" + distance1 + "\", \"distance2\": \"" + distance2 + "\"}";
  server.send(200, "application/json", json);
}
