#include <Servo.h>
#include <SoftwareSerial.h>

// Definición de pines
const int trigPin1 = 10;
const int echoPin1 = 11;
const int ledAzul = 12;
const int servoPin = 13;  // Pin de señal del servomotor

const int ledVerde = 5;
const int ledAmarillo = 6;
const int ledRojo = 7;
const int trigPin2 = 8;
const int echoPin2 = 9;

// Pines para SoftwareSerial
const int rxPin = 2;
const int txPin = 3;
SoftwareSerial espSerial(rxPin, txPin); // RX, TX

// Variables para los sensores ultrasonicos
long duration1, duration2;
int distance1, distance2;

// Variables para control de tiempo
unsigned long tiempoUltimaDeteccion = 0;
const unsigned long tiempoEspera = 1000;  // Tiempo de espera en milisegundos

// Crear un objeto servo
Servo servoMotor;

void setup() {
  // Configuración de pines de los sensores ultrasonicos
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  // Configuración de pines de los LEDs
  pinMode(ledAzul, OUTPUT);
  pinMode(ledVerde, OUTPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledRojo, OUTPUT);

  // Inicializar el servo
  servoMotor.attach(servoPin);
  servoMotor.write(0);  // Inicialmente cerrado

  // Inicializar la comunicación serie
  Serial.begin(9600);    // Para monitor serial
  espSerial.begin(115200); // Para comunicación con ESP8266

  Serial.println("ATmega328p is ready.");
}

void loop() {
  // Sensor 1: detectar personas
  distance1 = medirDistancia(trigPin1, echoPin1);

  // Sensor 2: medir la cantidad de basura
  distance2 = medirDistancia(trigPin2, echoPin2);

  // Control del servomotor basado en la detección de personas
  if (distance1 < 40) {  // Si una persona está cerca
    servoMotor.write(105);  // Abrir el tacho
    digitalWrite(ledAzul, HIGH);
    tiempoUltimaDeteccion = millis();  // Actualizar el tiempo de la última detección
  } else {
    if (millis() - tiempoUltimaDeteccion > tiempoEspera) {  // Si ha pasado más de 1 segundo desde la última detección
      servoMotor.write(0);  // Cerrar el tacho
      digitalWrite(ledAzul, LOW);
    }
  }

  // Control de los LEDs basado en la cantidad de basura
  if (distance2 > 25) {
    digitalWrite(ledVerde, HIGH);
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledRojo, LOW);
  } else if (distance2 <= 25 && distance2 > 10) {
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledAmarillo, HIGH);
    digitalWrite(ledRojo, LOW);
  } else {
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledRojo, HIGH);
  }

  // Enviar las distancias medidas al ESP8266 a través del puerto serial
  espSerial.print(distance1);
  espSerial.print(",");
  espSerial.println(distance2);

  // Imprimir las distancias medidas en el monitor serie
  Serial.print("Distance to person: ");
  Serial.print(distance1);
  Serial.println(" cm");

  Serial.print("Distance to trash: ");
  Serial.print(distance2);
  Serial.println(" cm");

  delay(300);  // Esperar 300 ms antes de la próxima lectura
}

int medirDistancia(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

