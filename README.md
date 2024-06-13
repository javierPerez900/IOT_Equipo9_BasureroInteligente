# IOT_Equipo9_BasureroInteligente
Descripción:
El proyecto del basurero inteligente basado en IoT tiene como objetivo principal automatizar la apertura y cierre de la tapa del basurero al detectar la proximidad de una persona, así como monitorear el nivel de llenado del basurero. Esta automatización mejora la higiene, reduce olores y facilita el uso del basurero sin necesidad de contacto manual.
Componentes Principales
Sensores Ultrasónicos: Detectan la proximidad de una persona al basurero y monitorean el nivel de llenado del basurero.
Servomotor: Controla la apertura y cierre automático de la tapa del basurero.
LEDs: Indican el estado del basurero (nivel de llenado).
Microcontrolador: Un microcontrolador (ESP8266) que procesa los datos del sensor ultrasónico y gestiona el servomotor y los LEDs.
Fuente de Energía: Alimentación a través de baterías recargables para asegurar la autonomía del sistema.
Funcionamiento
Monitoreo de Proximidad: El sensor ultrasónico monitorea continuamente la proximidad de objetos frente al basurero.
Detección de Presencia: Cuando una persona se acerca a una distancia predeterminada, el sensor ultrasónico envía una señal al microcontrolador.
Activación del Servomotor: El microcontrolador procesa la señal y activa el servomotor para abrir la tapa del basurero.
Monitoreo del Nivel de Llenado: Un sensor ultrasónico interior mide el nivel de llenado del basurero. Hay tres niveles predeterminados: bajo, medio y alto.
Indicadores LED: Los LEDs indican el nivel de llenado del basurero (por ejemplo, un LED rojo para nivel alto, amarillo para medio, y verde para bajo).
Cierre Automático: Después de un período de tiempo determinado, el microcontrolador desactiva el servomotor, cerrando la tapa del basurero.
Esta solución de basurero inteligente no solo mejora la experiencia del usuario al eliminar la necesidad de contacto manual, sino que también contribuye a un entorno más higiénico y agradable. Además, el monitoreo del nivel de llenado permite una gestión más eficiente del vaciado del basurero y la posibilidad de integración con una aplicación móvil para recibir notificaciones sobre el estado del basurero.

