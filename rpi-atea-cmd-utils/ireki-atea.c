#include <wiringPi.h>
//#define RELAY_PIN 4 //wiringPi pin
#define RELAY_PIN 23 //bcm pin
void setup(void){
  //Setting Sys mode. No root need. BCM pin schema
  system ("gpio export 23 OUT") ;
  wiringPiSetupSys () ;

}

main (){
  setup();
  //We put the relay up.
  digitalWrite (RELAY_PIN, HIGH) ;
  //5 second delay  
  delay (5000) ;
  //putting down the relay.
  digitalWrite (RELAY_PIN, LOW) ;
}
