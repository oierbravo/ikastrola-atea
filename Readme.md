#RFID Atea

(Deprecated,XD)##Arduino
- Arduino UNO + Ethernet + XBee RFID
- El xbee tiene que tener los jumpers en Xbee pero para poder programarlo tiene que estar en USB.
- Recomendable meterle el codigo al arduino antes de montar los shields.


##RPi - Atea - Cmd Utils
Hay un par de utils a compilar e instalar
		'make;
		make install'
		
##RPi - Atea - Node
Necesita las utils
- Lee la salida (stdOut) del comando 'ikastrola-wiegand' y hace un httprequest al atezaina.
- Abre la puerta con el comando 'ireki-atea'
- http://localhost/ireki abre la puerta.

##Atezaina - Node
- Lo basico basico.
- He utilizado NeDB  https://github.com/louischatriot/nedb

