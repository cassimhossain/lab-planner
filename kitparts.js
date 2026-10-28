/* Generated from circuit/parts*.js: which Circuit Lab part draws each kit item. */
window.KITPARTS = {
 "10k resistor": {
  "attrs": {
   "color": "#3A3326",
   "label": "LTR-4206",
   "p1": "C",
   "p2": "E",
   "p3": "NC"
  },
  "label": "Phototransistor",
  "t": "phototrans",
  "tag": "cl-to92"
 },
 "10k resistor (pull-up)": {
  "attrs": {
   "label": "LM393",
   "names": "OUT1,IN1N,IN1P,GND,IN2P,IN2N,OUT2,VCC",
   "sub": "compare"
  },
  "label": "LM393 comparator",
  "t": "lm393",
  "tag": "cl-dip"
 },
 "18650 cell + holder": {
  "attrs": {
   "kind": "9V"
  },
  "label": "Battery",
  "t": "battery",
  "tag": "cl-battery"
 },
 "1k resistor (for RX)": {
  "attrs": {
   "color": "#1E3A5F",
   "label": "DFPlayer",
   "pins": "VCC,GND,RX,TX,SPK1,SPK2,BUSY",
   "shape": "chip",
   "sub": "idle"
  },
  "label": "MP3 player DFPlayer",
  "t": "dfplayer",
  "tag": "cl-i2c"
 },
 "220 ohm resistor": {
  "attrs": {
   "label": "4N35",
   "names": "A,K,NC1,E,C,B",
   "sub": "isolate"
  },
  "label": "Optocoupler 4N35",
  "t": "opto",
  "tag": "cl-dip"
 },
 "2WD robot chassis kit": {
  "attrs": {},
  "label": "L298N motor driver",
  "t": "l298n",
  "tag": "cl-l298n"
 },
 "2xAA battery holder + batteries": {
  "attrs": {
   "kind": "9V"
  },
  "label": "Battery",
  "t": "battery",
  "tag": "cl-battery"
 },
 "4WD robot car (assembled, L298N)": {
  "attrs": {},
  "label": "L298N motor driver",
  "t": "l298n",
  "tag": "cl-l298n"
 },
 "4x4 matrix keypad": {
  "attrs": {},
  "label": "Keypad 4\u00d74",
  "t": "keypad",
  "tag": "wokwi-membrane-keypad"
 },
 "4xAA battery pack": {
  "attrs": {
   "kind": "9V"
  },
  "label": "Battery",
  "t": "battery",
  "tag": "cl-battery"
 },
 "5 V DC fan": {
  "attrs": {},
  "label": "5V DC fan",
  "t": "fan",
  "tag": "cl-fan"
 },
 "7-segment display 4-digit": {
  "attrs": {
   "color": "red",
   "digits": "4"
  },
  "label": "7-segment display (4 digit)",
  "t": "seg4",
  "tag": "cl-seg4"
 },
 "74HC04 hex inverter": {
  "attrs": {
   "label": "74HC04",
   "names": "1A,1Y,2A,2Y,3A,3Y,GND,4Y,4A,5Y,5A,6Y,6A,VCC",
   "sub": "NOT"
  },
  "label": "74HC04 NOT gate",
  "t": "hc04",
  "tag": "cl-logic"
 },
 "74HC165 shift register": {
  "attrs": {
   "label": "74HC165",
   "names": "SHLD,CLK,D4,D5,D6,D7,Q7N,GND,Q7,SER,D0,D1,D2,D3,CE,VCC",
   "sub": "PISO"
  },
  "label": "74HC165 input expander",
  "t": "hc165",
  "tag": "cl-dip"
 },
 "74HC595 shift register": {
  "attrs": {
   "label": "74HC595",
   "names": "Q1,Q2,Q3,Q4,Q5,Q6,Q7,GND,Q7S,MR,SHCP,STCP,OE,DS,Q0,VCC"
  },
  "label": "Shift register 74HC595",
  "t": "sr595",
  "tag": "cl-dip"
 },
 "74HC74 dual D flip-flop": {
  "attrs": {
   "label": "74HC74",
   "names": "1CLR,1D,1CLK,1PRE,1Q,1QN,GND,2QN,2Q,2PRE,2CLK,2D,2CLR,VCC",
   "sub": "D-FF"
  },
  "label": "74HC74 D flip-flop",
  "t": "hc74",
  "tag": "cl-dip"
 },
 "9V battery + snap": {
  "attrs": {
   "kind": "9V"
  },
  "label": "Battery",
  "t": "battery",
  "tag": "cl-battery"
 },
 "A4988 stepper driver": {
  "attrs": {},
  "label": "A4988 stepper driver",
  "t": "a4988",
  "tag": "cl-a4988"
 },
 "ADS1115 16-bit ADC": {
  "attrs": {
   "color": "#4B3A82",
   "label": "ADS1115",
   "pins": "VCC,GND,SCL,SDA,A0,A1,A2,A3",
   "shape": "chip",
   "sub": "0x48"
  },
  "label": "Precise ADC ADS1115",
  "t": "ads1115",
  "tag": "cl-i2c"
 },
 "AHT20 temperature and humidity sensor": {
  "attrs": {
   "color": "#1F6F54",
   "label": "AHT20",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x38"
  },
  "label": "Temp & humidity AHT20",
  "t": "aht20",
  "tag": "cl-i2c"
 },
 "AMG8833 thermal camera": {
  "attrs": {
   "color": "#5C2E82",
   "label": "AMG8833",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x69"
  },
  "label": "Thermal camera AMG8833",
  "t": "amg8833",
  "tag": "cl-i2c"
 },
 "Accelerometer ADXL345": {
  "attrs": {
   "color": "#2A4A32",
   "label": "ADXL345",
   "pins": "VCC,GND,SCL,SDA,CS,INT",
   "shape": "chip",
   "sub": "0x53"
  },
  "label": "Accelerometer ADXL345",
  "t": "adxl345",
  "tag": "cl-i2c"
 },
 "Arduino Mega 2560 + USB cable": {
  "attrs": {},
  "label": "Arduino Mega 2560",
  "t": "mega",
  "tag": "wokwi-arduino-mega"
 },
 "Arduino Nano + USB cable": {
  "attrs": {},
  "label": "Arduino Nano",
  "t": "nano",
  "tag": "wokwi-arduino-nano"
 },
 "Arduino Uno + USB cable": {
  "attrs": {},
  "label": "Arduino Uno",
  "t": "uno",
  "tag": "wokwi-arduino-uno"
 },
 "BME280 weather sensor": {
  "attrs": {
   "color": "#2A4A82",
   "label": "BME280",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x76"
  },
  "label": "Weather sensor BME280",
  "t": "bme280",
  "tag": "cl-i2c"
 },
 "BMP280 pressure sensor": {
  "attrs": {
   "color": "#4A2A82",
   "label": "BMP280",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x76"
  },
  "label": "Pressure BMP280",
  "t": "bmp280",
  "tag": "cl-i2c"
 },
 "Bluetooth module HC-05": {
  "attrs": {},
  "label": "Bluetooth HC-05",
  "t": "hc05",
  "tag": "cl-hc05"
 },
 "Breadboard (half size)": {
  "attrs": {
   "cols": "30"
  },
  "label": "Breadboard",
  "t": "breadboard",
  "tag": "cl-breadboard"
 },
 "Breadboard power supply module": {
  "attrs": {},
  "label": "Breadboard power supply",
  "t": "psu",
  "tag": "cl-psu"
 },
 "Bridge rectifier KBP206": {
  "attrs": {
   "label": "KBP206"
  },
  "label": "Bridge rectifier",
  "t": "bridge",
  "tag": "cl-bridge"
 },
 "Buck converter LM2596": {
  "attrs": {},
  "label": "Buck converter LM2596",
  "t": "buck",
  "tag": "cl-buck"
 },
 "Buzzer": {
  "attrs": {},
  "label": "Buzzer",
  "t": "buzzer",
  "tag": "wokwi-buzzer"
 },
 "CCS811 air quality sensor": {
  "attrs": {
   "color": "#7A3A1E",
   "label": "CCS811",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x5A"
  },
  "label": "Air quality CCS811",
  "t": "ccs811",
  "tag": "cl-i2c"
 },
 "CD4017 decade counter": {
  "attrs": {
   "label": "CD4017",
   "names": "Q5,Q1,Q0,Q2,Q6,Q7,Q3,GND,Q8,Q4,Q9,CO,CE,CLK,MR,VCC",
   "sub": "1-of-10"
  },
  "label": "CD4017 decade counter",
  "t": "cd4017",
  "tag": "cl-dip"
 },
 "CD4051 multiplexer": {
  "attrs": {
   "label": "CD4051",
   "names": "Y4,Y6,Z,Y7,Y5,EN,VEE,GND,S2,S1,S0,Y3,Y0,Y1,Y2,VCC",
   "sub": "8-to-1"
  },
  "label": "CD4051 analog mux",
  "t": "cd4051",
  "tag": "cl-dip"
 },
 "CD4511 BCD decoder": {
  "attrs": {
   "label": "CD4511",
   "names": "B,C,LE,BL,LT,D,A,GND,SE,SD,SC,SB,SA,SG,SF,VCC",
   "sub": "decoder"
  },
  "label": "CD4511 BCD to 7-seg",
  "t": "cd4511",
  "tag": "cl-dip"
 },
 "Capacitor 0.1 uF": {
  "attrs": {
   "label": "LM7805",
   "p1": "IN",
   "p2": "GND",
   "p3": "OUT"
  },
  "label": "7805 regulator",
  "t": "lm7805",
  "tag": "cl-to220"
 },
 "Capacitor 10 nF": {
  "attrs": {
   "value": "100uF"
  },
  "label": "Capacitor",
  "t": "capacitor",
  "tag": "cl-capacitor"
 },
 "Capacitor 10 uF": {
  "attrs": {
   "value": "100uF"
  },
  "label": "Capacitor",
  "t": "capacitor",
  "tag": "cl-capacitor"
 },
 "Capacitor 100 uF": {
  "attrs": {
   "value": "100uF"
  },
  "label": "Capacitor",
  "t": "capacitor",
  "tag": "cl-capacitor"
 },
 "Coin cell CR2032": {
  "attrs": {
   "kind": "9V"
  },
  "label": "Battery",
  "t": "battery",
  "tag": "cl-battery"
 },
 "Colour sensor TCS34725": {
  "attrs": {},
  "label": "Colour sensor TCS34725",
  "t": "tcs34725",
  "tag": "cl-tcs"
 },
 "Compass HMC5883L": {
  "attrs": {
   "color": "#4A3A82",
   "label": "HMC5883L",
   "pins": "VCC,GND,SCL,SDA,DRDY",
   "shape": "chip",
   "sub": "0x1E"
  },
  "label": "Compass HMC5883L",
  "t": "compass",
  "tag": "cl-i2c"
 },
 "Continuous rotation servo FS90R": {
  "attrs": {},
  "label": "Servo (continuous 360\u00b0)",
  "t": "servo360",
  "tag": "wokwi-servo"
 },
 "Current sensor ACS712": {
  "attrs": {},
  "label": "Current sensor ACS712",
  "t": "acs712",
  "tag": "cl-acs712"
 },
 "Current sensor INA219": {
  "attrs": {
   "addr": "0x40"
  },
  "label": "Current sensor INA219",
  "t": "ina219",
  "tag": "cl-ina219"
 },
 "DC hobby motor": {
  "attrs": {},
  "label": "DC motor",
  "t": "dcmotor",
  "tag": "cl-dcmotor"
 },
 "DFPlayer Mini MP3 module": {
  "attrs": {
   "color": "#1E3A5F",
   "label": "DFPlayer",
   "pins": "VCC,GND,RX,TX,SPK1,SPK2,BUSY",
   "shape": "chip",
   "sub": "idle"
  },
  "label": "MP3 player DFPlayer",
  "t": "dfplayer",
  "tag": "cl-i2c"
 },
 "DHT11 sensor": {
  "attrs": {
   "temperature": "25"
  },
  "label": "DHT11 temp & humidity",
  "t": "dht11",
  "tag": "wokwi-dht22"
 },
 "DHT22 sensor": {
  "attrs": {},
  "label": "DHT22 temp & humidity",
  "t": "dht22",
  "tag": "wokwi-dht22"
 },
 "DIP switch 8-way": {
  "attrs": {},
  "label": "DIP switch (8)",
  "t": "dipswitch",
  "tag": "wokwi-dip-switch-8"
 },
 "DRV8825 stepper driver": {
  "attrs": {},
  "label": "DRV8825 stepper driver",
  "t": "drv8825",
  "tag": "cl-a4988"
 },
 "DRV8833 motor driver": {
  "attrs": {
   "color": "#3A2A52",
   "label": "DRV8833",
   "pins": "VM,GND,SLP,AIN1,AIN2,AOUT1,AOUT2,BIN1,BIN2,BOUT1,BOUT2",
   "shape": "chip",
   "sub": "dual H"
  },
  "label": "Motor driver DRV8833",
  "t": "drv8833",
  "tag": "cl-i2c"
 },
 "Diode 1N4007": {
  "attrs": {
   "label": "1N4007"
  },
  "label": "Diode",
  "t": "diode",
  "tag": "cl-diode"
 },
 "ESP32 Dev Board + USB cable": {
  "attrs": {},
  "label": "ESP32 DevKit",
  "t": "esp32",
  "tag": "wokwi-esp32-devkit-v1"
 },
 "External 5V supply for the servos": {
  "attrs": {
   "color": "#1E6B4F",
   "label": "PCA9685",
   "shape": "chip",
   "sub": "50 Hz"
  },
  "label": "Servo driver PCA9685",
  "t": "pca9685",
  "tag": "cl-i2c"
 },
 "Flame sensor": {
  "attrs": {},
  "label": "Flame sensor",
  "t": "flame",
  "tag": "cl-flame"
 },
 "Flex sensor": {
  "attrs": {},
  "label": "Flex sensor",
  "t": "flex",
  "tag": "cl-flex"
 },
 "Force sensitive resistor": {
  "attrs": {},
  "label": "Force sensor (FSR)",
  "t": "fsr",
  "tag": "cl-fsr"
 },
 "GPS module NEO-6M": {
  "attrs": {},
  "label": "GPS module NEO-6M",
  "t": "gps",
  "tag": "cl-gps"
 },
 "GSM module SIM800L": {
  "attrs": {},
  "label": "GSM module SIM800L",
  "t": "sim800l",
  "tag": "cl-sim800"
 },
 "Hall effect sensor A3144": {
  "attrs": {},
  "label": "Hall effect sensor",
  "t": "hall",
  "tag": "cl-hall"
 },
 "IR receiver TSOP1838": {
  "attrs": {},
  "label": "IR receiver",
  "t": "irrecv",
  "tag": "wokwi-ir-receiver"
 },
 "IR remote control": {
  "attrs": {},
  "label": "IR receiver",
  "t": "irrecv",
  "tag": "wokwi-ir-receiver"
 },
 "IR sensor module": {
  "attrs": {},
  "label": "IR obstacle sensor",
  "t": "ir",
  "tag": "cl-ir-obstacle"
 },
 "Inductor 100 uH": {
  "attrs": {
   "label": "100 uH"
  },
  "label": "Inductor",
  "t": "inductor",
  "tag": "cl-inductor"
 },
 "Joystick module": {
  "attrs": {},
  "label": "Joystick",
  "t": "joystick",
  "tag": "wokwi-analog-joystick"
 },
 "K-type thermocouple probe": {
  "attrs": {
   "color": "#7A6A1E",
   "label": "MAX6675",
   "pins": "VCC,GND,SCK,CS,SO",
   "shape": "chip",
   "sub": "SPI"
  },
  "label": "Thermocouple MAX6675",
  "t": "max6675",
  "tag": "cl-i2c"
 },
 "Knock sensor KY-031": {
  "attrs": {},
  "label": "Knock sensor",
  "t": "knock",
  "tag": "cl-knock"
 },
 "L293D motor driver": {
  "attrs": {
   "label": "L293D",
   "names": "EN1,IN1,OUT1,GND,GND.2,OUT2,IN2,VS,EN2,IN3,OUT3,GND.3,GND.4,OUT4,IN4,VCC"
  },
  "label": "L293D motor driver",
  "t": "l293d",
  "tag": "cl-dip"
 },
 "L298N motor driver": {
  "attrs": {},
  "label": "L298N motor driver",
  "t": "l298n",
  "tag": "cl-l298n"
 },
 "LCD 20x4 I2C": {
  "attrs": {
   "pins": "i2c"
  },
  "label": "LCD 20\u00d74 I2C",
  "t": "lcd2004",
  "tag": "wokwi-lcd2004"
 },
 "LDR module": {
  "attrs": {},
  "label": "Light sensor (LDR)",
  "t": "ldr",
  "tag": "cl-ldr"
 },
 "LED 5 mm (assorted)": {
  "attrs": {
   "color": "red"
  },
  "label": "LED",
  "t": "led",
  "tag": "wokwi-led"
 },
 "LED bar graph 10-segment": {
  "attrs": {
   "color": "red"
  },
  "label": "LED bar graph (10)",
  "t": "ledbar",
  "tag": "wokwi-led-bar-graph"
 },
 "LM35 temperature sensor": {
  "attrs": {
   "label": "LM35",
   "p1": "VCC",
   "p2": "OUT",
   "p3": "GND"
  },
  "label": "LM35 temperature",
  "t": "lm35",
  "tag": "cl-to92"
 },
 "LM358 op-amp": {
  "attrs": {
   "label": "LM358",
   "names": "OUT1,IN1N,IN1P,GND,IN2P,IN2N,OUT2,VCC",
   "sub": "op-amp"
  },
  "label": "LM358 op-amp",
  "t": "lm358",
  "tag": "cl-dip"
 },
 "LM393 comparator": {
  "attrs": {
   "label": "LM393",
   "names": "OUT1,IN1N,IN1P,GND,IN2P,IN2N,OUT2,VCC",
   "sub": "compare"
  },
  "label": "LM393 comparator",
  "t": "lm393",
  "tag": "cl-dip"
 },
 "LM7805 voltage regulator": {
  "attrs": {
   "label": "LM7805",
   "p1": "IN",
   "p2": "GND",
   "p3": "OUT"
  },
  "label": "7805 regulator",
  "t": "lm7805",
  "tag": "cl-to220"
 },
 "Laser distance sensor VL53L0X": {
  "attrs": {
   "color": "#2A2A32",
   "label": "VL53L0X",
   "pins": "VCC,GND,SCL,SDA,XSH",
   "shape": "lens",
   "sub": "0x29"
  },
  "label": "Laser distance VL53L0X",
  "t": "vl53l0x",
  "tag": "cl-i2c"
 },
 "Laser module KY-008": {
  "attrs": {},
  "label": "Laser module",
  "t": "laser",
  "tag": "cl-laser"
 },
 "Light sensor BH1750": {
  "attrs": {
   "color": "#1F6B57",
   "label": "BH1750",
   "pins": "VCC,GND,SCL,SDA,ADDR",
   "shape": "dome",
   "sub": "0x23"
  },
  "label": "Light meter BH1750",
  "t": "bh1750",
  "tag": "cl-i2c"
 },
 "Limit switch (lever microswitch)": {
  "attrs": {},
  "label": "Limit switch",
  "t": "limitsw",
  "tag": "cl-limitsw"
 },
 "Load cell 5 kg + HX711": {
  "attrs": {},
  "label": "Load cell + HX711",
  "t": "hx711",
  "tag": "cl-hx711"
 },
 "Low-voltage LED lamp (5 V)": {
  "attrs": {},
  "label": "5V lamp",
  "t": "lamp",
  "tag": "cl-lamp"
 },
 "MAX30102 pulse oximeter": {
  "attrs": {
   "color": "#8C1F3A",
   "label": "MAX30102",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x57"
  },
  "label": "Heart rate MAX30102",
  "t": "max30102",
  "tag": "cl-i2c"
 },
 "MAX6675 thermocouple amplifier": {
  "attrs": {
   "color": "#7A6A1E",
   "label": "MAX6675",
   "pins": "VCC,GND,SCK,CS,SO",
   "shape": "chip",
   "sub": "SPI"
  },
  "label": "Thermocouple MAX6675",
  "t": "max6675",
  "tag": "cl-i2c"
 },
 "MAX7219 4-in-1 LED matrix": {
  "attrs": {
   "blocks": "4"
  },
  "label": "LED matrix 4-in-1 (32\u00d78)",
  "t": "max7219x4",
  "tag": "cl-max7219x4"
 },
 "MAX7219 8x8 LED matrix": {
  "attrs": {},
  "label": "8\u00d78 LED matrix MAX7219",
  "t": "max7219",
  "tag": "cl-max7219"
 },
 "MCP23017 I2C pin expander": {
  "attrs": {
   "color": "#1F4F6B",
   "label": "MCP23017",
   "shape": "chip",
   "sub": "0x20"
  },
  "label": "Pin expander MCP23017",
  "t": "mcp23017",
  "tag": "cl-i2c"
 },
 "MCP4725 DAC": {
  "attrs": {
   "color": "#6B4F1E",
   "label": "MCP4725",
   "pins": "VCC,GND,SCL,SDA,OUT",
   "shape": "chip",
   "sub": "0x60"
  },
  "label": "Analog out MCP4725",
  "t": "mcp4725",
  "tag": "cl-i2c"
 },
 "MH-Z19B CO2 sensor": {
  "attrs": {
   "color": "#1C1C20",
   "label": "MH-Z19B",
   "pins": "VCC,GND,TX,RX",
   "shape": "chip",
   "sub": "UART"
  },
  "label": "CO2 sensor MH-Z19",
  "t": "mhz19",
  "tag": "cl-i2c"
 },
 "MLX90614 infrared thermometer": {
  "attrs": {
   "color": "#7A2A4A",
   "label": "MLX90614",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "dome",
   "sub": "0x5A"
  },
  "label": "Infrared thermometer MLX90614",
  "t": "mlx90614",
  "tag": "cl-i2c"
 },
 "MOSFET IRF520": {
  "attrs": {
   "label": "IRF520",
   "p1": "G",
   "p2": "D",
   "p3": "S"
  },
  "label": "MOSFET (IRF520)",
  "t": "mosfet",
  "tag": "cl-to220"
 },
 "MPU6050 IMU": {
  "attrs": {
   "ad0": "0"
  },
  "label": "MPU6050 motion",
  "t": "mpu6050",
  "tag": "cl-mpu"
 },
 "MQ-135 air quality sensor": {
  "attrs": {
   "kind": "MQ-135"
  },
  "label": "Air quality MQ-135",
  "t": "mq135",
  "tag": "cl-gas"
 },
 "MQ-2 gas sensor": {
  "attrs": {
   "kind": "MQ-2"
  },
  "label": "Gas / smoke MQ-2",
  "t": "mq2",
  "tag": "cl-gas"
 },
 "Micro SD card 8 GB": {
  "attrs": {},
  "label": "SD card module",
  "t": "sdcard",
  "tag": "wokwi-microsd-card"
 },
 "Micro SD card module": {
  "attrs": {},
  "label": "SD card module",
  "t": "sdcard",
  "tag": "wokwi-microsd-card"
 },
 "Microphone module MAX4466": {
  "attrs": {},
  "label": "Microphone MAX4466",
  "t": "mic",
  "tag": "cl-mic"
 },
 "Mini speaker 8 ohm": {
  "attrs": {},
  "label": "Speaker 8 \u03a9",
  "t": "speaker",
  "tag": "cl-speaker"
 },
 "Mini water pump + tube": {
  "attrs": {},
  "label": "Mini water pump",
  "t": "pump",
  "tag": "cl-pump"
 },
 "NE555 timer IC": {
  "attrs": {
   "label": "NE555",
   "names": "GND,TRIG,OUT,RESET,CTRL,THR,DIS,VCC"
  },
  "label": "555 timer",
  "t": "ne555",
  "tag": "cl-dip"
 },
 "NPN transistor 2N2222": {
  "attrs": {
   "color": "#1A1A1A",
   "label": "2N2222",
   "p1": "C",
   "p2": "B",
   "p3": "E"
  },
  "label": "NPN transistor",
  "t": "npn",
  "tag": "cl-to92"
 },
 "NPN transistor BC547": {
  "attrs": {
   "color": "#1A1A1A",
   "label": "2N2222",
   "p1": "C",
   "p2": "B",
   "p3": "E"
  },
  "label": "NPN transistor",
  "t": "npn",
  "tag": "cl-to92"
 },
 "OLED 0.96 in I2C": {
  "attrs": {
   "color": "white",
   "size": "128x64"
  },
  "label": "OLED 0.96\\",
  "t": "oled",
  "tag": "cl-oled"
 },
 "Optocoupler 4N35": {
  "attrs": {
   "label": "4N35",
   "names": "A,K,NC1,E,C,B",
   "sub": "isolate"
  },
  "label": "Optocoupler 4N35",
  "t": "opto",
  "tag": "cl-dip"
 },
 "PCA9685 16-channel servo driver": {
  "attrs": {
   "color": "#1E6B4F",
   "label": "PCA9685",
   "shape": "chip",
   "sub": "50 Hz"
  },
  "label": "Servo driver PCA9685",
  "t": "pca9685",
  "tag": "cl-i2c"
 },
 "PCF8574 I2C pin expander": {
  "attrs": {
   "color": "#2B4C7E",
   "label": "PCF8574",
   "shape": "chip",
   "sub": "0x20"
  },
  "label": "Pin expander PCF8574",
  "t": "pcf8574",
  "tag": "cl-i2c"
 },
 "PIR motion sensor": {
  "attrs": {},
  "label": "PIR motion sensor",
  "t": "pir",
  "tag": "wokwi-pir-motion-sensor"
 },
 "PNP transistor 2N3906": {
  "attrs": {
   "color": "#17171A",
   "label": "2N3906",
   "p1": "E",
   "p2": "B",
   "p3": "C"
  },
  "label": "PNP transistor",
  "t": "pnp",
  "tag": "cl-to92"
 },
 "PNP transistor BC557": {
  "attrs": {
   "color": "#17171A",
   "label": "2N3906",
   "p1": "E",
   "p2": "B",
   "p3": "C"
  },
  "label": "PNP transistor",
  "t": "pnp",
  "tag": "cl-to92"
 },
 "Passive buzzer": {
  "attrs": {},
  "label": "Buzzer",
  "t": "buzzer",
  "tag": "wokwi-buzzer"
 },
 "Phototransistor LTR-4206": {
  "attrs": {
   "color": "#3A3326",
   "label": "LTR-4206",
   "p1": "C",
   "p2": "E",
   "p3": "NC"
  },
  "label": "Phototransistor",
  "t": "phototrans",
  "tag": "cl-to92"
 },
 "Potentiometer 10k": {
  "attrs": {
   "value": "512"
  },
  "label": "Potentiometer",
  "t": "pot",
  "tag": "wokwi-potentiometer"
 },
 "Pulse sensor": {
  "attrs": {},
  "label": "Pulse sensor",
  "t": "pulse",
  "tag": "cl-pulse"
 },
 "Push button": {
  "attrs": {
   "color": "green"
  },
  "label": "Push button",
  "t": "button",
  "tag": "wokwi-pushbutton-6mm"
 },
 "RFID RC522 + cards": {
  "attrs": {},
  "label": "RFID reader RC522",
  "t": "rfid",
  "tag": "cl-rfid"
 },
 "RGB LED": {
  "attrs": {},
  "label": "RGB LED",
  "t": "rgbled",
  "tag": "wokwi-rgb-led"
 },
 "RTC module DS3231": {
  "attrs": {},
  "label": "Real-time clock DS3231",
  "t": "rtc",
  "tag": "wokwi-ds1307"
 },
 "Radio module nRF24L01": {
  "attrs": {},
  "label": "Radio nRF24L01",
  "t": "nrf24",
  "tag": "cl-nrf24"
 },
 "Rain sensor": {
  "attrs": {},
  "label": "Rain sensor",
  "t": "rain",
  "tag": "cl-rain"
 },
 "Reed switch module": {
  "attrs": {},
  "label": "Reed switch",
  "t": "reed",
  "tag": "cl-reed"
 },
 "Relay module (1-channel)": {
  "attrs": {
   "channels": "1"
  },
  "label": "Relay module",
  "t": "relay",
  "tag": "cl-relay"
 },
 "Relay module (4-channel)": {
  "attrs": {
   "channels": "1"
  },
  "label": "Relay module",
  "t": "relay",
  "tag": "cl-relay"
 },
 "Resistor 10k ohm": {
  "attrs": {
   "span": "4",
   "value": "220"
  },
  "label": "Resistor",
  "t": "resistor",
  "tag": "cl-resistor"
 },
 "Resistor 1k ohm": {
  "attrs": {
   "span": "4",
   "value": "220"
  },
  "label": "Resistor",
  "t": "resistor",
  "tag": "cl-resistor"
 },
 "Resistor 220 ohm": {
  "attrs": {
   "span": "4",
   "value": "220"
  },
  "label": "Resistor",
  "t": "resistor",
  "tag": "cl-resistor"
 },
 "Rotary encoder KY-040": {
  "attrs": {},
  "label": "Rotary encoder KY-040",
  "t": "encoder",
  "tag": "wokwi-ky-040"
 },
 "SCD40 CO2 sensor": {
  "attrs": {
   "color": "#1E5B4F",
   "label": "SCD40",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x62"
  },
  "label": "True CO2 SCD40",
  "t": "scd40",
  "tag": "cl-i2c"
 },
 "SGP30 air quality sensor": {
  "attrs": {
   "color": "#2F5E8C",
   "label": "SGP30",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x58"
  },
  "label": "Air quality SGP30",
  "t": "sgp30",
  "tag": "cl-i2c"
 },
 "SHT31 temperature and humidity sensor": {
  "attrs": {
   "color": "#1F57A8",
   "label": "SHT31",
   "pins": "VCC,GND,SCL,SDA",
   "shape": "chip",
   "sub": "0x44"
  },
  "label": "Temp & humidity SHT31",
  "t": "sht31",
  "tag": "cl-i2c"
 },
 "Servo MG995": {
  "attrs": {},
  "label": "Servo SG90",
  "t": "servo",
  "tag": "wokwi-servo"
 },
 "Servo SG90": {
  "attrs": {},
  "label": "Servo SG90",
  "t": "servo",
  "tag": "wokwi-servo"
 },
 "Sharp IR distance sensor GP2Y0A21": {
  "attrs": {},
  "label": "Sharp IR distance",
  "t": "sharpir",
  "tag": "cl-sharpir"
 },
 "Slide potentiometer": {
  "attrs": {},
  "label": "Slide potentiometer",
  "t": "slidepot",
  "tag": "wokwi-slide-potentiometer"
 },
 "Slide switch": {
  "attrs": {},
  "label": "Slide switch",
  "t": "slideswitch",
  "tag": "wokwi-slide-switch"
 },
 "Small solar panel": {
  "attrs": {},
  "label": "Solar panel 6V",
  "t": "solar",
  "tag": "cl-solar"
 },
 "Small speaker 8 ohm": {
  "attrs": {
   "color": "#1E3A5F",
   "label": "DFPlayer",
   "pins": "VCC,GND,RX,TX,SPK1,SPK2,BUSY",
   "shape": "chip",
   "sub": "idle"
  },
  "label": "MP3 player DFPlayer",
  "t": "dfplayer",
  "tag": "cl-i2c"
 },
 "Soil moisture sensor": {
  "attrs": {},
  "label": "Soil moisture sensor",
  "t": "soil",
  "tag": "cl-soil"
 },
 "Solenoid 12V": {
  "attrs": {},
  "label": "Solenoid",
  "t": "solenoid",
  "tag": "cl-solenoid"
 },
 "Sound sensor KY-037": {
  "attrs": {},
  "label": "Sound sensor KY-037",
  "t": "sound",
  "tag": "cl-sound"
 },
 "Stepper 28BYJ-48 + ULN2003": {
  "attrs": {},
  "label": "Stepper 28BYJ-48 + ULN2003",
  "t": "stepper28",
  "tag": "cl-stepper28"
 },
 "TB6612FNG motor driver": {
  "attrs": {
   "color": "#24405C",
   "label": "TB6612",
   "pins": "VM,VCC,GND,STBY,AIN1,AIN2,PWMA,AO1,AO2,BIN1,BIN2,PWMB,BO1,BO2",
   "shape": "chip",
   "sub": "dual H"
  },
  "label": "Motor driver TB6612",
  "t": "tb6612",
  "tag": "cl-i2c"
 },
 "TDS water quality sensor": {
  "attrs": {},
  "label": "Water quality (TDS)",
  "t": "tds",
  "tag": "cl-tds"
 },
 "TFT display 2.4 in ILI9341": {
  "attrs": {},
  "label": "TFT colour screen 2.4\\",
  "t": "tft",
  "tag": "wokwi-ili9341"
 },
 "TM1637 4-digit display": {
  "attrs": {},
  "label": "TM1637 4-digit display",
  "t": "tm1637",
  "tag": "cl-tm1637"
 },
 "TMP36 temperature sensor": {
  "attrs": {
   "label": "TMP36",
   "p1": "VCC",
   "p2": "OUT",
   "p3": "GND"
  },
  "label": "TMP36 temperature",
  "t": "tmp36",
  "tag": "cl-to92"
 },
 "Thermistor NTC 10k": {
  "attrs": {},
  "label": "Thermistor module (NTC)",
  "t": "thermistor",
  "tag": "wokwi-ntc-temperature-sensor"
 },
 "Thermistor module KY-013": {
  "attrs": {},
  "label": "Thermistor module (NTC)",
  "t": "thermistor",
  "tag": "wokwi-ntc-temperature-sensor"
 },
 "Touch sensor TTP223": {
  "attrs": {},
  "label": "Touch sensor TTP223",
  "t": "touch",
  "tag": "cl-touch"
 },
 "ULN2003 driver": {
  "attrs": {
   "label": "ULN2003",
   "names": "IN1,IN2,IN3,IN4,IN5,IN6,IN7,GND,COM,OUT7,OUT6,OUT5,OUT4,OUT3,OUT2,OUT1",
   "sub": "7 ch"
  },
  "label": "ULN2003 driver",
  "t": "uln2003",
  "tag": "cl-dip"
 },
 "UV sensor GUVA-S12SD": {
  "attrs": {},
  "label": "UV sensor",
  "t": "uv",
  "tag": "cl-uv"
 },
 "Ultrasonic sensor HC-SR04": {
  "attrs": {},
  "label": "Ultrasonic HC-SR04",
  "t": "hcsr04",
  "tag": "wokwi-hc-sr04"
 },
 "Vibration motor module": {
  "attrs": {},
  "label": "Vibration motor",
  "t": "vibe",
  "tag": "cl-vibe"
 },
 "Vibration sensor SW-420": {
  "attrs": {},
  "label": "Vibration switch SW-420",
  "t": "vibsw",
  "tag": "cl-vibsw"
 },
 "WS2812B LED ring (12 LEDs)": {
  "attrs": {
   "pixels": "12"
  },
  "label": "NeoPixel ring",
  "t": "ledring",
  "tag": "wokwi-led-ring"
 },
 "WS2812B LED strip (1 m, 30 LEDs)": {
  "attrs": {
   "pixels": "16"
  },
  "label": "NeoPixel LED strip",
  "t": "ledstrip",
  "tag": "cl-ledstrip"
 },
 "WS2812B matrix 8x8": {
  "attrs": {
   "cols": "8",
   "rows": "8"
  },
  "label": "NeoPixel matrix 8\u00d78",
  "t": "npmatrix",
  "tag": "wokwi-neopixel-matrix"
 },
 "Water flow sensor YF-S201": {
  "attrs": {},
  "label": "Water flow sensor",
  "t": "flow",
  "tag": "cl-flow"
 },
 "Water level sensor": {
  "attrs": {},
  "label": "Water level sensor",
  "t": "waterlevel",
  "tag": "cl-waterlevel"
 },
 "Waterproof temperature probe DS18B20": {
  "attrs": {},
  "label": "Temperature probe DS18B20",
  "t": "ds18b20",
  "tag": "cl-ds18b20"
 },
 "Zener diode 1N4733 5.1V": {
  "attrs": {
   "label": "1N4733"
  },
  "label": "Zener diode 5.1 V",
  "t": "zener",
  "tag": "cl-diode"
 },
 "microSD card": {
  "attrs": {
   "color": "#1E3A5F",
   "label": "DFPlayer",
   "pins": "VCC,GND,RX,TX,SPK1,SPK2,BUSY",
   "shape": "chip",
   "sub": "idle"
  },
  "label": "MP3 player DFPlayer",
  "t": "dfplayer",
  "tag": "cl-i2c"
 }
};
