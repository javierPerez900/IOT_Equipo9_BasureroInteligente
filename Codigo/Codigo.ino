#include <Servo.h>

// Definición de pines
const int trigPin1 = 8;
const int echoPin1 = 9;
const int trigPin2 = 10;
const int echoPin2 = 11;

const int ledVerde = 2;
const int ledAmarillo = 3;
const int ledRojo = 4;

const int servoPin = 6;  // Pin de señal del servomotor

// Variables para los sensores ultrasonicos
long duration1, duration2;
int distance1, distance2;

// Crear un objeto servo
Servo servoMotor;

void setup() {
  // Configuración de pines de los sensores ultrasonicos
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);

  // Configuración de pines de los LEDs
  pinMode(ledVerde, OUTPUT);
  pinMode(ledAmarillo, OUTPUT);
  pinMode(ledRojo, OUTPUT);

  // Inicializar el servo
  servoMotor.attach(servoPin);
  servoMotor.write(0);  // Inicialmente cerrado

  // Inicializar la comunicación serie
  Serial.begin(9600);
}

void loop() {
  // Sensor 1: detectar personas
  digitalWrite(trigPin1, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin1, LOW);
  duration1 = pulseIn(echoPin1, HIGH);
  distance1 = duration1 * 0.034 / 2;

  // Sensor 2: medir la cantidad de basura
  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin2, LOW);
  duration2 = pulseIn(echoPin2, HIGH);
  distance2 = duration2 * 0.034 / 2;

  // Control del servomotor basado en la detección de personas
  if (distance1 < 20) {  // Si una persona está cerca
    servoMotor.write(90);  // Abrir el tacho
  } else {
    servoMotor.write(0);  // Cerrar el tacho
  }

  // Control de los LEDs basado en la cantidad de basura
  if (distance2 > 30) {
    digitalWrite(ledVerde, HIGH);
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledRojo, LOW);
  } else if (distance2 <= 30 && distance2 > 10) {
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledAmarillo, HIGH);
    digitalWrite(ledRojo, LOW);
  } else {
    digitalWrite(ledVerde, LOW);
    digitalWrite(ledAmarillo, LOW);
    digitalWrite(ledRojo, HIGH);
  }

  // Imprimir las distancias medidas en el monitor serie
  Serial.print("Distance to person: ");
  Serial.print(distance1);
  Serial.println(" cm");
  
  Serial.print("Distance to trash: ");
  Serial.print(distance2);
  Serial.println(" cm");

  delay(500);  // Esperar 500 ms antes de la próxima lectura
}
