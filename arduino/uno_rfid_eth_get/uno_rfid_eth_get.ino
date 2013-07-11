//Based on Jeremy Blum's Arduino Tutorial Series - Episode 12 - RFID Cards
//http://www.jeremyblum.com
//Some Code Adapted from http://www.cooking-hacks.com
//Code Updated on 1/21/2012 to comply with Arduino 1.0 Changes

byte data[5];  //For holding the ID we receive
int val = 0;
 
#include <SPI.h>
#include <Ethernet.h>

#define DEBUG

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

IPAddress server(192,168,1,37); 
IPAddress ip(192,168,1,177);

EthernetClient client;
boolean lastConnected = false; 
String result;
boolean gotResponse;
int response;
boolean waitingResponse;

int yellowLedPin = 13;
int redLedPin = 8;
int greenLedPin = 9;

void setup(){

  pinMode(yellowLedPin,OUTPUT);
  pinMode(redLedPin,OUTPUT);
  pinMode(greenLedPin,OUTPUT);
  setupRFID();
  setupEthernet();
}
void setupRFID(){
   Serial.begin(19200);
  
   // Setting Auto Read Mode - EM4102 Decoded Mode - No password
   // command: FF 01 09 87 01 03 02 00 10 20 30 40 37
  Serial.write(0xFF);  //Header
  Serial.write(0x01);  //Reserved
  Serial.write(0x09);  //Length (Command + Data)
  Serial.write(0x87);  //Command (0x87 sets auto mode behavior
  Serial.write(0x01);  //Data 1: Enable Auto-Read
  Serial.write(0x03);  //Data 2: Mode – Parity decoded – Manchester RF/64
  Serial.write(0x02);  //Data 3: Total number of block to be read (2)
  Serial.write((byte)0x00);  //Data 4: No password expected
  Serial.write(0x10);  //Data 5: Password byte 1
  Serial.write(0x20);  //Data 6: Password byte 2
  Serial.write(0x30);  //Data 7: Password byte 3
  Serial.write(0x40);  //Data 8: Password byte 4
  Serial.write(0x37);  //Checksum
   
  delay(500);
  while(Serial.available()>0){
    Serial.read();
  }
  #ifdef DEBUG
  Serial.println();
    Serial.println("RFID module started in Auto Read Mode, Waiting for Card...");
  #endif
}
void setupEthernet(){
  if (Ethernet.begin(mac) == 0) {
   Serial.println("Failed to configure Ethernet using DHCP");

   Ethernet.begin(mac, ip);
  }
}
void loop(){
  readEthernet();
  if(!waitingResponse){
    readRFID();
  }
  lastConnected = client.connected();
}
 
void readEthernet(){
 while (client.available()) {
  char c = client.read();
     #ifdef DEBUG
    Serial.print(c);
       #endif
    result = result + c; 
   ///   HTTP/1.1 200 OK
    if(result.endsWith("HTTP/1.1 200 OK")){
      result="";
      gotResponse = true;
      response = 200;
      client.stop();
    } else if(result.endsWith("HTTP/1.1 404 Not Found")){
      result="";
      gotResponse = true;
      response = 404;
      client.stop();
    }     
  }
   if(gotResponse){
    waitingResponse = false;
    #ifdef DEBUG
      Serial.print("Got Response: ");
      Serial.println(response);
    #endif
    parseResponse(response);
    gotResponse = false;
  }
  if (!client.connected() && lastConnected) {
    waitingResponse = false;
    client.stop();
    #ifdef DEBUG
      Serial.flush();
      Serial.println("disconnecting.");
    #endif
  }
}

void parseResponse(int response){
  digitalWrite(yellowLedPin,LOW);
  if(response == 404){
    #ifdef DEBUG
     Serial.println("404");
   #endif
     digitalWrite(redLedPin,HIGH);
   delay(200);
   digitalWrite(redLedPin,LOW);
   delay(200);
  } else if(response == 200){
   #ifdef DEBUG
     Serial.println("200");
   #endif
    digitalWrite(greenLedPin,HIGH);
   delay(200);
   digitalWrite(greenLedPin,LOW);
   delay(200);
  }
}
void readRFID(){
  val = Serial.read();
   while (val != 0xff)
   {  //On Successful read, first byte will always be 0xFF
      val = Serial.read();
      digitalWrite(yellowLedPin,HIGH);
      delay(1000);
   
     }
   //we already read the header (0xff)
   Serial.read();              // reserved
   Serial.read();              // length
   Serial.read();              // command (indicates tag data)
   data[0] = Serial.read();    // we read data 1
   data[1] = Serial.read();    // we read data 2
   data[2] = Serial.read();    // we read data 3
   data[3] = Serial.read();    // we read data 4
   data[4] = Serial.read();    // we read data 5
   Serial.read();        // checksum
   #ifdef DEBUG
     Serial.print("Card found - Code: ");
   #endif
   
   String key = "";
   for (int i=0; i<5; i++)
   {
     if (data[i] < 16) {
        key += "0";
     }
     key += String(data[i],HEX);
   }
   #ifdef DEBUG
     Serial.println(key);
   #endif

   sendKey(key);

}
void sendKey(String key){
  #ifdef DEBUG
    Serial.println("connecting...");
  #endif
  
  
  if (client.connect(server, 9876)) {
    #ifdef DEBUG
      Serial.println("connected");
    #endif
    String head = "GET /arduino?key=";
    head += key;
    head += "  HTTP/1.0";
     client.println(head);
     client.println("Connection: close");
     client.println();

     gotResponse = false;
     waitingResponse = true;
  }  else {

    #ifdef DEBUG
      Serial.println("connection failed");
      Serial.println();
      Serial.println("disconnecting.");
    #endif
    client.stop();
  }

}
