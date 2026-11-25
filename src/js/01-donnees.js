
"use strict";
/* ───────── data: boards, modules, missions, lesson, quiz ───────── */
const seq=(p,a,b)=>{const o=[];for(let i=a;a<=b?i<=b:i>=b;i+=a<=b?1:-1)o.push(p+i);return o};
const BOARDS=[
{id:'uno',name:'Arduino Uno R3',maker:'Arduino',year:2010,tag:'Where almost everyone starts',level:'Beginner',accent:'#12838a',volt:5,w:68.6,d:53.4,color:'#0f7d82',pwm:[3,5,6,9,10,11],
 silk:[['ARDUINO',46,21,2.6],['UNO',47,28.5,6.5]],holes:[[14,2.5],[15.3,50.7],[66,7.6],[66,35.5]],
 spec:['ATmega328P · 8-bit AVR','16 MHz','32 KB','2 KB','5 V','14 digital (6 PWM)','6','—','≈ $27','First circuits, shields, classrooms'],
 pinx:{D13:'digital I/O · SPI SCK · built-in LED "L"',D12:'digital I/O · SPI MISO',D11:'digital I/O · PWM · SPI MOSI',D10:'digital I/O · PWM · SPI SS',D0:'digital I/O · serial RX (receive)',D1:'digital I/O · serial TX (transmit)',D2:'digital I/O · external interrupt 0',A4:'analog input · I²C SDA',A5:'analog input · I²C SCL',SDA:'I²C data line',SCL:'I²C clock line'},
 parts:[['usbchip','ATmega16U2 USB bridge','A second, smaller microcontroller whose only job is translating USB from your computer into the serial signals the main chip understands.'],
  ['xtal','16 MHz crystal','The metronome of the board. It ticks sixteen million times a second, so delay(1000) really lasts one second.'],
  ['reg','5 V regulator','Turns the 7–12 V from the barrel jack into a steady 5 V. It gets warm when it works hard.'],
  ['ledon','ON LED (green)','Lights whenever the board has power — the first thing to check when nothing works.'],
  ['ledl','Built-in LED "L"','Wired to pin D13, so you can blink something before connecting a single part.'],
  ['ledtx','TX / RX LEDs','Flicker while the board talks to your computer — during uploads and Serial.print().'],
  ['reset','Reset button','Restarts your sketch from its first line, without erasing it.'],
  ['mcu','ATmega328P microcontroller','The brain: an 8-bit chip with 32 KB for your program and 2 KB of working memory. It sits in a socket, so a fried one can be swapped.'],
  ['caps','Filter capacitors','Small reservoirs that smooth the supply so the chip never sees a dip when a motor or LED switches.'],
  ['icsp','ICSP headers','Six pins for programming a chip directly, and the SPI bus many shields use.'],
  ['phdr','Power and analog headers','5 V, 3.3 V and GND to feed your parts, plus A0–A5 which measure a voltage instead of just HIGH or LOW.'],
  ['dhdr','Digital pin headers','D0–D13: pins your sketch switches on and off, or reads. Six of them can also fade with PWM.'],
  ['barrel','Barrel jack','Takes 7–12 V from a wall adapter or battery pack when the board is not on USB.'],
  ['usb','USB-B port','Power and programming over one cable — the chunky plug printers use.']],
 comps:[['usbB',5,13,{p:'usb'}],['barrel',5.5,44.5,{p:'barrel'}],
  ['fh',31.2,2.5,{n:10,p:'dhdr',pins:['SCL','SDA','AREF','GND','D13','D12','D11','D10','D9','D8']}],['fh',55.7,2.5,{n:8,p:'dhdr',pins:seq('D',7,0)}],
  ['fh',37.1,50.9,{n:8,p:'phdr',pins:['NC','IOREF','RESET','3V3','5V','GND','GND','VIN']}],['fh',57.4,50.9,{n:6,p:'phdr',pins:seq('A',0,5)}],
  ['dip',47,40.5,{w:35,d:7.6,p:'mcu',t:'ATMEGA328P-PU'}],['chip',22.5,18,{w:5.2,d:5.2,p:'usbchip'}],['xtal',16,27,{p:'xtal',r:90}],
  ['ecap',15,38.5,{p:'caps'}],['ecap',22.5,38.5,{p:'caps'}],['reg',27,31,{p:'reg'}],['btn',5.5,3.6,{c:'#b53a2a',p:'reset'}],
  ['mh',64.6,27.5,{n:3,rows:2,r:90,p:'icsp'}],['mh',19,8,{n:3,rows:2,p:'icsp'}],
  ['led',28,12.5,{c:'#ffa520',p:'ledl',k:'L'}],['led',28,17,{c:'#ffd040',p:'ledtx'}],['led',28,19.6,{c:'#ffd040',p:'ledtx'}],['led',58.5,17,{c:'#35e36a',p:'ledon',on:1,k:'ON'}]]},
{id:'nano',name:'Arduino Nano',maker:'Arduino',year:2008,tag:'The Uno, shrunk to breadboard size',level:'Beginner',accent:'#2d59a8',volt:5,w:45,d:18,color:'#24509c',down:1,pwm:[3,5,6,9,10,11],
 silk:[['NANO',26.5,14.2,1.6]],holes:[[1.6,1.6],[43.4,1.6],[1.6,16.4],[43.4,16.4]],
 spec:['ATmega328P · 8-bit AVR','16 MHz','32 KB','2 KB','5 V','14 digital (6 PWM)','8','—','≈ $25','Small builds that live on a breadboard'],
 pinx:{D13:'digital I/O · SPI SCK · built-in LED',RX0:'serial RX — receives data',TX1:'serial TX — sends data',D2:'digital I/O · external interrupt 0',A4:'analog input · I²C SDA',A5:'analog input · I²C SCL','5V':'5 V power output (or regulated 5 V input)'},
 parts:[['mcu','ATmega328 microcontroller','The same brain as the Uno in a flat surface-mount package — which is why your Uno sketches run here unchanged.'],
  ['reg','5 V regulator','Drops the voltage on VIN to a clean 5 V for the chip and your modules.'],
  ['ledon','Power LED','On whenever the board is powered.'],['ledl','Built-in LED "L"','Connected to D13 — handy for a first blink.'],['ledtx','TX / RX LEDs','Blink while data moves over USB.'],
  ['reset','Reset button','Restarts the sketch.'],['usb','Mini-USB port','Power and programming. Behind it, a USB-to-serial chip sits on the underside.'],
  ['icsp','ICSP header','Direct programming access and the SPI bus.'],['pins','Pin headers','Two rows of 15 pins on a 0.1-inch grid: the Nano drops straight into a breadboard.']],
 comps:[['musb',2.4,9,{p:'usb',big:1}],['chip',21,9,{w:7,d:7,r:45,p:'mcu'}],['chip',11.5,9,{w:3.2,d:5,p:'reg',quad:0}],['btn',31,9,{s:.6,c:'#e8e8e8',p:'reset'}],
  ['mh',41,9,{n:3,rows:2,r:90,p:'icsp'}],['led',36.2,4.6,{c:'#35e36a',on:1,p:'ledon'}],['led',36.2,7.5,{c:'#ffa520',p:'ledl',k:'L'}],['led',36.2,10.4,{c:'#ffd040',p:'ledtx'}],['led',36.2,13.3,{c:'#ffd040',p:'ledtx'}],
  ['mh',22.5,1.3,{n:15,down:1,p:'pins',pins:[...seq('D',12,2),'GND','RST','RX0','TX1']}],['mh',22.5,16.7,{n:15,down:1,p:'pins',pins:['D13','3V3','AREF',...seq('A',0,7),'5V','RST','GND','VIN']}]]},
{id:'mega',name:'Arduino Mega 2560 R3',maker:'Arduino',year:2010,tag:'When the Uno runs out of pins',level:'Intermediate',accent:'#12838a',volt:5,w:101.5,d:53.3,color:'#15858a',pwm:[2,3,4,5,6,7,8,9,10,11,12,13],
 silk:[['ARDUINO',42,21,2.4],['MEGA 2560',42,26,3.4]],holes:[[14,2.5],[15.3,50.7],[66,7.6],[66,35.5],[90,50.7],[96.5,2.5]],
 spec:['ATmega2560 · 8-bit AVR','16 MHz','256 KB','8 KB','5 V','54 digital (15 PWM)','16','—','≈ $48','Robots and printers with many motors and sensors'],
 pinx:{D13:'digital I/O · PWM · built-in LED "L"',D0:'serial 0 RX',D1:'serial 0 TX',D14:'serial 3 TX',D15:'serial 3 RX',D16:'serial 2 TX',D17:'serial 2 RX',D18:'serial 1 TX — sends data',D19:'serial 1 RX — receives data',D20:'I²C SDA',D21:'I²C SCL'},
 parts:[['usbchip','ATmega16U2 USB bridge','Translates USB into serial for the main chip.'],['mcu','ATmega2560 microcontroller','A 100-pin chip with eight times the Uno\'s program space and four hardware serial ports.'],
  ['xtal','16 MHz crystal','Keeps time for the processor.'],['reg','5 V regulator','Makes 5 V from the barrel-jack supply.'],['ledon','ON LED','Power indicator.'],['ledl','Built-in LED "L"','Wired to D13.'],
  ['reset','Reset button','Restarts the sketch.'],['caps','Filter capacitors','Smooth the supply rails.'],['icsp','ICSP header','Direct programming and SPI.'],
  ['phdr','Power and analog headers','Supply pins plus sixteen analog inputs, A0–A15.'],['dhdr','Digital and communication headers','D0–D21, including PWM pins and three extra serial ports.'],
  ['xhdr','Double-row digital header','D22–D53: thirty-two more pins for everything the Uno could not fit.'],['barrel','Barrel jack','7–12 V supply input.'],['usb','USB-B port','Power and programming.']],
 comps:[['usbB',5,13,{p:'usb'}],['barrel',5.5,44.5,{p:'barrel'}],
  ['fh',31.2,2.5,{n:10,p:'dhdr',pins:['SCL','SDA','AREF','GND','D13','D12','D11','D10','D9','D8']}],['fh',55.7,2.5,{n:8,p:'dhdr',pins:seq('D',7,0)}],['fh',78.5,2.5,{n:8,p:'dhdr',pins:seq('D',14,21)}],
  ['fh',37.1,50.8,{n:8,p:'phdr',pins:['NC','IOREF','RESET','3V3','5V','GND','GND','VIN']}],['fh',60,50.8,{n:8,p:'phdr',pins:seq('A',0,7)}],['fh',82.9,50.8,{n:8,p:'phdr',pins:seq('A',8,15)}],
  ['fh',95.5,26.7,{n:18,rows:2,r:90,p:'xhdr',pins:['5V','5V',...seq('D',22,53),'GND','GND']}],
  ['chip',56,28,{w:14,d:14,p:'mcu',t:'ATMEGA\n2560'}],['chip',22.5,18,{w:5.2,d:5.2,p:'usbchip'}],['xtal',38,34,{p:'xtal'}],['ecap',15,38.5,{p:'caps'}],['ecap',22.5,38.5,{p:'caps'}],['reg',27,31,{p:'reg'}],
  ['btn',50,9.5,{c:'#b53a2a',p:'reset'}],['mh',74,29,{n:3,rows:2,r:90,p:'icsp'}],['led',28,12.5,{c:'#ffa520',p:'ledl',k:'L'}],['led',38,12.5,{c:'#35e36a',p:'ledon',on:1}]]},
{id:'esp32',name:'ESP32 DevKit V1',maker:'Espressif (DOIT)',year:2016,tag:'Wi-Fi and Bluetooth for pocket money',level:'Intermediate',accent:'#26282b',volt:3.3,w:51.5,d:28,color:'#1b1c1e',down:1,
 silk:[['ESP32 DEVKIT V1',34,12.5,1.3]],holes:[[2,2],[49.5,2],[2,26],[49.5,26]],
 spec:['ESP32 · dual-core 32-bit','240 MHz','4 MB','520 KB','3.3 V','25 usable','15','Wi-Fi + Bluetooth','≈ $6–10','Connected projects, IoT, fast prototypes'],
 pinx:{D2:'GPIO 2 · built-in blue LED',RX2:'serial 2 RX — receives data (3.3 V only)',TX2:'serial 2 TX — sends data',D21:'GPIO 21 · I²C SDA',D22:'GPIO 22 · I²C SCL',VP:'GPIO 36 · input only · ADC',VN:'GPIO 39 · input only · ADC',D34:'GPIO 34 · input only · ADC',D35:'GPIO 35 · input only · ADC',VIN:'5 V input from USB or an external supply',TX0:'serial 0 TX (USB)',RX0:'serial 0 RX (USB)'},
 parts:[['usbchip','CP2102 USB bridge','Converts USB into serial so you can upload code and read Serial.print().'],['reg','3.3 V regulator','The ESP32 runs on 3.3 V; this drops USB\'s 5 V down. Never feed 5 V to a GPIO pin.'],
  ['ledon','Power LED (red)','On when the board has power.'],['ledl','Built-in LED (blue)','Connected to GPIO 2.'],['en','EN button','Enable: press to reboot the chip.'],['boot','BOOT button','Hold while uploading if the board refuses to enter flashing mode.'],
  ['mod','ESP-WROOM-32 module','Under the metal shield: a dual-core 240 MHz processor, Wi-Fi and Bluetooth radios and 4 MB of flash. The zig-zag at the end is the antenna — keep metal away from it.'],
  ['usb','Micro-USB port','Power and programming.'],['pins','Pin headers','Thirty pins. Most are GPIO; several are input-only or used at boot, so check the pinout before wiring.']],
 comps:[['wmod',12.5,14,{w:25,d:18,can:15.5,t:'ESP-WROOM-32',p:'mod'}],['chip',33.5,18,{w:5,d:5,p:'usbchip'}],['reg',33.5,8.5,{p:'reg'}],['btn',43.5,5.6,{s:.6,c:'#2a2a2a',p:'en'}],['btn',43.5,22.4,{s:.6,c:'#2a2a2a',p:'boot'}],
  ['musb',49.2,14,{r:180,p:'usb'}],['led',39,8.5,{c:'#ff4030',on:1,p:'ledon'}],['led',39,19.5,{c:'#4090ff',p:'ledl',k:'L'}],
  ['mh',25.75,1.4,{n:15,down:1,p:'pins',pins:['EN','VP','VN','D34','D35','D32','D33','D25','D26','D27','D14','D12','D13','GND','VIN']}],
  ['mh',25.75,26.6,{n:15,down:1,p:'pins',pins:['D23','D22','TX0','RX0','D21','D19','D18','D5','TX2','RX2','D4','D2','D15','GND','3V3']}]]},
{id:'nodemcu',name:'NodeMCU (ESP8266)',maker:'NodeMCU team',year:2014,tag:'The board that made Wi-Fi cheap',level:'Intermediate',accent:'#26282b',volt:3.3,w:58,d:31,color:'#1b1c1e',down:1,
 silk:[['NodeMCU',36,22.5,1.8]],holes:[[2.2,2.2],[55.8,2.2],[2.2,28.8],[55.8,28.8]],
 spec:['ESP8266 · 32-bit','80 MHz','4 MB','≈ 50 KB free','3.3 V','11 usable','1','Wi-Fi','≈ $4–6','Simple Wi-Fi sensors and switches'],
 pinx:{D4:'GPIO 2 · built-in LED',D1:'GPIO 5 · I²C SCL',D2:'GPIO 4 · I²C SDA',D5:'GPIO 14 · PWM',D6:'GPIO 12 · PWM',D7:'GPIO 13 · PWM',D8:'GPIO 15 · PWM',A0:'the only analog input · 0 … 3.3 V',VIN:'5 V input from USB',RSV:'reserved'},
 parts:[['usbchip','USB-to-serial chip','Bridges USB to the ESP8266\'s serial port.'],['reg','3.3 V regulator','Feeds the 3.3 V chip from USB\'s 5 V.'],['rst','RST button','Reboots the chip.'],['flash','FLASH button','Puts the chip in upload mode.'],
  ['mod','ESP-12E Wi-Fi module','An ESP8266 with its flash memory and a PCB antenna under one shield — the part that put Wi-Fi in two-dollar gadgets.'],['usb','Micro-USB port','Power and programming.'],
  ['pins','Pin headers','D0–D8 are the usable GPIO. Note they are 3.3 V only, and there is just one analog input.']],
 comps:[['wmod',12.5,15.5,{w:24,d:16,can:15,t:'ESP-12E',p:'mod'}],['chip',38,15.5,{w:5,d:5,p:'usbchip'}],['reg',30.5,9,{p:'reg'}],['btn',49,7,{s:.6,c:'#2a2a2a',p:'rst'}],['btn',49,24,{s:.6,c:'#2a2a2a',p:'flash'}],
  ['musb',55.6,15.5,{r:180,p:'usb'}],
  ['mh',31,1.6,{n:15,down:1,p:'pins',pins:['A0','RSV','RSV','SD3','SD2','SD1','CMD','SD0','CLK','GND','3V3','EN','RST','GND','VIN']}],
  ['mh',31,29.4,{n:15,down:1,p:'pins',pins:['D0','D1','D2','D3','D4','3V3','GND','D5','D6','D7','D8','RX','TX','GND','3V3']}]]},
{id:'pico',name:'Raspberry Pi Pico',maker:'Raspberry Pi',year:2021,tag:'Two cores for four dollars',level:'Beginner',accent:'#2f8f4e',volt:3.3,w:51,d:21,color:'#279246',
 silk:[['Raspberry Pi Pico',27,16.3,1.25]],holes:[[2,4.8],[2,16.2],[49,4.8],[49,16.2]],
 spec:['RP2040 · dual Cortex-M0+','133 MHz','2 MB','264 KB','3.3 V','26','3','—','≈ $4','MicroPython, fast I/O, tight budgets'],
 pinx:{GP4:'GPIO 4 · I²C0 SDA',GP5:'GPIO 5 · I²C0 SCL',GP0:'GPIO 0 · UART0 TX',GP1:'GPIO 1 · UART0 RX',GP26:'GPIO 26 · ADC0',GP27:'GPIO 27 · ADC1',GP28:'GPIO 28 · ADC2',VBUS:'5 V straight from the USB cable',VSYS:'main supply input, 1.8–5.5 V','3V3_EN':'pull LOW to switch the 3.3 V supply off',VREF:'reference voltage for the ADC',GP15:'GPIO 15 · general-purpose I/O · 3.3 V logic'},
 parts:[['led','On-board LED','Wired to GPIO 25 — MicroPython calls it Pin("LED").'],['bootsel','BOOTSEL button','Hold it while plugging in and the Pico appears as a USB drive: drag a file onto it to program it.'],
  ['flash','2 MB flash memory','Stores your program. The RP2040 has no built-in storage, so this chip sits beside it.'],['xtal','12 MHz crystal','The reference the chip multiplies up to 133 MHz.'],['reg','Buck-boost regulator','Makes 3.3 V from anything between 1.8 and 5.5 V — two AA cells are enough.'],
  ['mcu','RP2040 microcontroller','Raspberry Pi\'s own chip: two Cortex-M0+ cores and programmable I/O blocks that can speak almost any protocol.'],['usb','Micro-USB port','Power, programming and a serial console.']],
 comps:[['musb',2.2,10.5,{p:'usb'}],['btn',12.5,6.8,{s:.6,c:'#f2f2f2',p:'bootsel'}],['led',5.4,3.8,{c:'#35e36a',on:1,p:'led',k:'L'}],['chip',27.5,10.5,{w:7,d:7,p:'mcu',t:'RP2040'}],['chip',17.5,13.2,{w:5,d:4,p:'flash',quad:0}],
  ['xtal',36,7,{s:.4,p:'xtal'}],['chip',41,12.5,{w:3,d:3,p:'reg'}],
  ['pads',25.5,1.1,{n:20,pins:['VBUS','VSYS','GND','3V3_EN','3V3','VREF','GP28','AGND','GP27','GP26','RUN','GP22','GND','GP21','GP20','GP19','GP18','GND','GP17','GP16']}],
  ['pads',25.5,19.9,{n:20,pins:['GP0','GP1','GND','GP2','GP3','GP4','GP5','GND','GP6','GP7','GP8','GP9','GND','GP10','GP11','GP12','GP13','GND','GP14','GP15']}]]},
{id:'stm32',name:'STM32 Blue Pill',maker:'Generic (STM32F103C8T6 board)',year:2014,tag:'32-bit power for pocket money',level:'Intermediate',accent:'#2d59a8',volt:3.3,w:53,d:22.5,color:'#2455a8',down:1,
 silk:[['STM32F103C8T6',33,18.2,1.2]],holes:[],
 spec:['STM32F103C8 · Cortex-M3','72 MHz','64 KB','20 KB','3.3 V','32','10','—','≈ $3–5','Fast control loops, learning ARM'],
 pinf:n=>/^A[0-7]$/.test(n)?'port A pin '+n.slice(1)+' · analog input (ADC), 0 … 3.3 V':/^[ABC]\d+$/.test(n)?'port '+n[0]+' pin '+n.slice(1)+' · general-purpose I/O · 3.3 V logic':null,
 pinx:{C13:'port C pin 13 · built-in LED',VB:'backup battery input for the clock',B6:'port B pin 6 · I²C SCL',B7:'port B pin 7 · I²C SDA',A9:'port A pin 9 · serial TX',A10:'port A pin 10 · serial RX',SWDIO:'debug data',SWCLK:'debug clock','5V':'5 V from USB'},
 parts:[['mcu','STM32F103 microcontroller','A 32-bit ARM Cortex-M3 at 72 MHz — far faster than an Uno, for a fraction of the price.'],['reg','3.3 V regulator','Supplies the chip from USB\'s 5 V.'],['xtal','8 MHz crystal','Multiplied inside the chip up to 72 MHz.'],
  ['ledon','Power LED','On when powered.'],['ledl','User LED (PC13)','The built-in LED; it lights when the pin is LOW.'],['reset','Reset button','Restarts the program.'],['usb','Micro-USB port','Power, and USB once a bootloader is installed.'],
  ['boot','Boot jumpers','Two yellow jumpers choose where the chip starts from: your program, or the built-in serial loader.'],['swd','SWD debug header','Four pins for an ST-Link programmer — the usual way to load code.'],['pins','Pin headers','Two rows of 20: ports A, B and C plus power.']],
 comps:[['musb',2.2,11.25,{p:'usb'}],['mh',13.5,11.25,{n:3,rows:2,r:90,p:'boot'}],['jmp',12.23,9.98,{p:'boot'}],['jmp',14.77,9.98,{p:'boot'}],['btn',21.5,11.25,{s:.6,c:'#efefef',p:'reset'}],
  ['chip',31,11.25,{w:7,d:7,r:45,p:'mcu'}],['xtal',40.5,7.6,{s:.5,p:'xtal'}],['chip',40.5,15,{w:3,d:3.4,p:'reg',quad:0}],['led',46,7.5,{c:'#ff4030',on:1,p:'ledon'}],['led',46,15,{c:'#35e36a',p:'ledl',k:'L'}],
  ['mh',51,11.25,{n:4,r:90,p:'swd',pins:['3V3','SWDIO','SWCLK','GND']}],
  ['mh',25.5,1.3,{n:20,down:1,p:'pins',pins:['B12','B13','B14','B15','A8','A9','A10','A11','A12','A15','B3','B4','B5','B6','B7','B8','B9','5V','GND','3V3']}],
  ['mh',25.5,21.2,{n:20,down:1,p:'pins',pins:['VB','C13','C14','C15','A0','A1','A2','A3','A4','A5','A6','A7','B0','B1','B10','B11','RST','3V3','GND','GND']}]]},
{id:'pi4',name:'Raspberry Pi 4 Model B',maker:'Raspberry Pi',year:2019,tag:'A real computer, credit-card sized',level:'Intermediate',accent:'#2f8f4e',volt:3.3,w:85,d:56,color:'#22964a',
 silk:[['Raspberry Pi 4 Model B',33,9.3,1.5]],holes:[[3.5,3.5],[61.5,3.5],[3.5,52.5],[61.5,52.5]],
 spec:['BCM2711 · quad Cortex-A72','1.5 GHz','microSD card','1–8 GB','3.3 V','28 GPIO','0','Wi-Fi + Bluetooth + Ethernet','from $35','Vision, AI, anything that needs Linux'],
 pinf:n=>/^GPIO\d+$/.test(n)?'GPIO '+n.slice(4)+' · general-purpose I/O · 3.3 V logic, never 5 V':null,
 pinx:{GPIO14:'GPIO 14 · serial TX — sends data',GPIO15:'GPIO 15 · serial RX — receives data (3.3 V only)',GPIO2:'GPIO 2 · I²C SDA',GPIO3:'GPIO 3 · I²C SCL',GPIO18:'GPIO 18 · hardware PWM',ID_SD:'reserved for HAT identification',ID_SC:'reserved for HAT identification','5V':'5 V straight from the USB-C supply'},
 parts:[['soc','Broadcom BCM2711 processor','The main chip under the metal lid: four 64-bit Cortex-A72 cores and a graphics core in one package. It runs Linux and all of your programs. It gets noticeably warm under load, which is why people often stick a heatsink on it.'],
  ['ram','LPDDR4 memory','The black chip next to the processor is the working memory of the computer: 1, 2, 4 or 8 GB depending on the board version. The more of it, the more programs and browser tabs can stay open at once.'],
  ['vl805','VL805 USB controller','Gives the board its two fast USB 3.0 ports. It talks to the processor over a single PCI Express lane.'],
  ['eth','BCM54213PE Ethernet chip','Handles wired networking at true gigabit speed.'],
  ['pmic','MxL7704 power controller','Splits the 5 V input into the several precise voltages the processor and memory need, and switches them on in the right order.'],
  ['wifi','Wi-Fi and Bluetooth module','The radio hides under the metal can: dual-band Wi-Fi (2.4 and 5 GHz) and Bluetooth 5.0. The can shields the radio from interference. The antenna is the shaped cut-out in the copper at the board edge — do not cover it with metal.'],
  ['ledp','PWR LED (red)','On when the supply is good. If it blinks or goes out, the power adapter is too weak.'],
  ['leda','ACT LED (green)','Flickers when the microSD card is being read or written.'],
  ['usbc','USB-C power input','Wants 5 V at up to 3 A. An underpowered charger is the most common cause of mysterious crashes.'],
  ['hdmi0','Micro-HDMI port HDMI0','The main display output, up to 4K. Use this one if you have a single screen.'],
  ['hdmi1','Micro-HDMI port HDMI1','A second display output — the Pi 4 can drive two monitors.'],
  ['jack','3.5 mm audio / video jack','Analog stereo sound and composite video on one four-pole socket.'],
  ['csi','CSI camera connector','The official Raspberry Pi camera plugs in here with a flat ribbon cable. It is the fastest way to give a robot eyes, because frames go straight into the processor. Lift the latch before sliding the ribbon in, then press it back down.'],
  ['dsi','DSI display connector','For the official touchscreen, on the same kind of flat ribbon as the camera.'],
  ['poe','PoE pins','Four pins that carry power from the Ethernet cable to an add-on PoE HAT.'],
  ['gpio','40-pin GPIO header','The bridge to the physical world: 28 programmable pins plus 5 V, 3.3 V and ground. All signals are 3.3 V — 5 V on a GPIO pin will damage the board.'],
  ['rj45','Ethernet jack (RJ45)','Gigabit wired network — more reliable than Wi-Fi for a robot on a tether.'],
  ['usb2','USB 2.0 ports','Two ordinary ports for a keyboard, mouse, webcam or an Arduino.'],
  ['usb3','USB 3.0 ports (blue)','Two fast ports with blue inserts — up to ten times the speed of USB 2.0, for SSDs and depth cameras.']],
 comps:[['can',29.5,29,{w:15,d:15,h:2.2,t:'BROADCOM\nBCM2711',p:'soc'}],['chip',45,26.5,{w:12,d:14.5,h:1.2,legs:0,t:'SAMSUNG\nK4F6E3S4',p:'ram'}],['chip',58.5,35.5,{w:7,d:7,p:'vl805',t:'VL805'}],
  ['chip',60.5,19,{w:6,d:6,p:'eth'}],['chip',17.5,44.5,{w:5,d:5,p:'pmic'}],['can',13,13.5,{w:12,d:10,h:1.6,t:'CYW43455',holes:1,p:'wifi'}],
  ['led',1.6,45.8,{c:'#ff4030',on:1,p:'ledp'}],['led',1.6,49.4,{c:'#35e36a',p:'leda',k:'L'}],
  ['usbc',11.2,53,{r:90,p:'usbc'}],['mhdmi',26,53,{r:90,p:'hdmi0'}],['mhdmi',39.5,53,{r:90,p:'hdmi1'}],['jack',54,50.5,{r:90,p:'jack'}],
  ['fpc',46.5,44,{r:90,p:'csi'}],['fpc',4,28,{r:90,p:'dsi'}],['mh',64,8.6,{n:2,rows:2,p:'poe'}],
  ['mh',32.5,3.5,{n:20,rows:2,p:'gpio',pins:['3V3','5V','GPIO2','5V','GPIO3','GND','GPIO4','GPIO14','GND','GPIO15','GPIO17','GPIO18','GPIO27','GND','GPIO22','GPIO23','3V3','GPIO24','GPIO10','GND','GPIO9','GPIO25','GPIO11','GPIO8','GND','GPIO7','ID_SD','ID_SC','GPIO5','GND','GPIO6','GPIO12','GPIO13','GND','GPIO19','GPIO16','GPIO26','GPIO20','GND','GPIO21']}],
  ['rj45',77.5,10.2,{r:180,p:'rj45'}],['usbA',79.2,29,{r:180,p:'usb3',c:'#2a6fd6'}],['usbA',79.2,47,{r:180,p:'usb2',c:'#161616'}],['sd',5,28,{}]]}
];
const BY=Object.fromEntries(BOARDS.map(b=>[b.id,b]));

const MODS=[
 ['led','5 mm LED module','Lights up when its pin goes HIGH.','Outputs'],['rgb','RGB LED module','Three LEDs in one lens: mixes any colour.','Outputs'],
 ['buzzer','Piezo buzzer module','Beeps and plays simple melodies.','Outputs'],['oled','OLED display 0.96" (SSD1306)','Tiny 128 × 64 pixel I²C screen.','Outputs'],
 ['button','Push-button module','Press it: OUT goes HIGH.','Inputs'],['pot','Potentiometer module (10 kΩ)','A knob that outputs 0 V … VCC.','Inputs'],
 ['hcsr04','HC-SR04 ultrasonic sensor','Measures distance with sound echoes.','Sensors'],['dht11','DHT11 temperature & humidity sensor','Reads air temperature and humidity.','Sensors'],
 ['ldr','Photoresistor (LDR) module','Senses how bright the light is.','Sensors'],['pir','PIR motion sensor (HC-SR501)','Notices a warm body moving nearby.','Sensors'],
 ['servo','SG90 micro servo','Turns its arm to an exact angle.','Actuators'],['motor','TT gear motor + wheel','Geared DC motor that drives a wheel.','Actuators'],['l298n','L298N motor driver','H-bridge: lets a board drive two motors.','Actuators'],
 ['batt','4 × AA battery holder','Portable 6 V supply for motors.','Power'],['llc','Logic level converter (4-channel)','Lets 5 V and 3.3 V parts talk.','Interface']];
const MOD=Object.fromEntries(MODS.map(m=>[m[0],{id:m[0],name:m[1],desc:m[2],cat:m[3]}]));
const PRICE={uno:27,nano:25,mega:48,esp32:8,nodemcu:5,pico:4,stm32:4,pi4:35,led:1,rgb:1.5,buzzer:1,oled:6,button:1,pot:1.5,hcsr04:3,dht11:3,ldr:1.5,pir:3,servo:4,motor:3,l298n:4,batt:2,llc:1.5};
const WCOL={red:'#c63a2b',black:'#1c1c1c',yellow:'#e2b53a',green:'#3f9c5a',blue:'#3a6fc4',orange:'#dd7a2b',white:'#ecebe6',purple:'#7c4db5'};

/* missions: items [key,def,x,z,rot,opts]; wires 'a.PIN>b.PIN|color|why' */
const MISSIONS=[
{n:'01',lvl:'Beginner',min:3,title:'Hello, LED',sub:'Make an LED blink with an Arduino Uno.',boards:'Arduino Uno R3',
 intro:'Every maker starts right here — blinking an LED is the "Hello, world!" of electronics. We\'ll hook one LED up to an Arduino Uno and switch it on and off, on and off. Two wires and a few lines of code, and you\'ve built your first working circuit.',
 items:[['uno','uno',-48,12],['led','led',72,-22]],
 wires:['uno.D13>led.SIG|yellow|D13 is the pin our sketch switches between 0 V and 5 V — it also drives the tiny "L" LED on the board.','uno.GND>led.GND|black|Current needs a way home. Ground closes the loop back to the board.'],
 learn:['A digital pin is a tiny switch: the sketch flips it between 0 V (LOW) and 5 V (HIGH)','Current only flows in a closed loop — out of the pin, through the LED, back into GND','An LED always needs a resistor to limit its current; this module has one on board','delay(500) pauses the sketch for 500 milliseconds — half a second'],
 code:`// Hello, LED — Arduino Uno
const int LED = 13;

void setup() {
  pinMode(LED, OUTPUT);     // D13 drives the LED
}

void loop() {
  digitalWrite(LED, HIGH);  // 5 V  -> LED on
  delay(500);
  digitalWrite(LED, LOW);   // 0 V  -> LED off
  delay(500);
}`,
 sim(S){const on=Math.floor(S.t/.5)%2===0;S.led('led',on?1:0);S.bled('uno',on);S.every(.5,()=>S.log('D13 = '+(on?'HIGH':'LOW')))}},
{n:'02',lvl:'Beginner',min:4,title:'Push to light',sub:'Hold a button and an Arduino Nano switches an LED on.',boards:'Arduino Nano',
 intro:'Blinking was output only — now let\'s give the board a sense of touch. An Arduino Nano will keep asking a push button "are you pressed?" and switch an LED to match. Read a pin, decide, write a pin: that little loop is the heartbeat of every robot.',
 items:[['nano','nano',0,48],['btn','button',-78,-34],['led','led',78,-34,0,{c:'#35e36a'}]],
 wires:['nano.5V>btn.VCC|red|The button module needs 5 V so it has a HIGH to pass along when you press it.','nano.GND>btn.GND|black|Ground is the 0 V reference: through the pull-down resistor it keeps OUT at LOW while the button is up.','btn.OUT>nano.D2|yellow|OUT carries the answer — HIGH while pressed — into pin D2, which the sketch reads.','nano.D9>led.SIG|green|D9 is the output: the sketch copies the button state onto it.','nano.GND>led.GND|black|The LED\'s way back to ground.'],
 learn:['digitalRead() tells the sketch whether a pin sees HIGH (5 V) or LOW (0 V)','A button module needs three wires: power, ground and the signal that carries the answer','Its pull-down resistor holds the signal at a clean LOW until you press — a loose input would read random values','loop() repeats many thousands of times a second, so the LED seems to react instantly'],
 code:`// Push to light — Arduino Nano
const int BUTTON = 2;
const int LED    = 9;

void setup() {
  pinMode(BUTTON, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  int pressed = digitalRead(BUTTON);  // HIGH while held
  digitalWrite(LED, pressed);
}`,
 sim(S){const p=S.val('btn','pressed');S.led('led',p?1:0);S.change('p',p,()=>S.log('D2 reads '+(p?'HIGH → LED on':'LOW  → LED off')))}},
{n:'03',lvl:'Beginner',min:5,title:'Knob dimmer',sub:'Turn a knob to set how bright an LED glows.',boards:'Arduino Uno R3',
 intro:'On and off is only two states. A potentiometer gives the board a whole range to read, and PWM lets it answer with a whole range of brightness. Turn the knob: the Uno measures a voltage and fades the LED to match.',
 items:[['uno','uno',-40,22],['pot','pot',-70,-62],['led','led',82,-30]],
 wires:['uno.5V>pot.VCC|red|One end of the knob\'s track goes to 5 V…','uno.GND>pot.GND|black|…and the other end to ground. The wiper slides between the two.','pot.OUT>uno.A0|yellow|The wiper voltage — anywhere from 0 to 5 V — goes to analog input A0.','uno.D9>led.SIG|green|D9 can do PWM: it flickers faster than the eye can see to fake any brightness.','uno.GND>led.GND|black|Ground for the LED.'],
 learn:['analogRead() turns a voltage between 0 and 5 V into a number from 0 to 1023','A potentiometer is a voltage divider: the knob picks a point between 5 V and ground','PWM switches a pin on and off very fast; the on-time share sets the apparent brightness','map() rescales one range of numbers onto another'],
 code:`// Knob dimmer — Arduino Uno
void setup() {
  pinMode(9, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(A0);              // 0 … 1023
  int level = map(knob, 0, 1023, 0, 255); // 0 … 255
  analogWrite(9, level);                  // PWM brightness
  Serial.println(level);
  delay(20);
}`,
 sim(S){const v=S.val('pot','v');S.led('led',v);S.every(.4,()=>S.log('A0 = '+Math.round(v*1023)+'   PWM = '+Math.round(v*255)))}},
{n:'04',lvl:'Beginner',min:5,title:'Servo follows the knob',sub:'Steer a servo arm by turning a potentiometer.',boards:'Arduino Uno R3',
 intro:'A servo does not just spin — it goes to the exact angle you ask for and holds it. Wire a knob as the input and the servo arm will mirror your hand. This is how robot arms, steering and grippers work.',
 items:[['uno','uno',-40,26],['pot','pot',-76,-60],['servo','servo',76,-40]],
 wires:['uno.5V>pot.VCC|red|Power for the knob.','uno.GND>pot.GND|black|Ground for the knob.','pot.OUT>uno.A0|yellow|The knob position, as a voltage, into A0.','uno.D9>servo.SIG|orange|The control pulse: its width tells the servo which angle to hold.','uno.5V>servo.VCC|red|A small servo can run from the board\'s 5 V pin.','uno.GND>servo.GND|black|Servo ground — signal and power must share it.'],
 learn:['A servo reads the width of a pulse sent 50 times a second: about 1 ms is 0°, 2 ms is 180°','The Servo library generates those pulses for you','Motors and the board must share a common ground, or the signal means nothing','Bigger servos need their own supply — they can pull more current than the board gives'],
 code:`// Servo follows the knob — Arduino Uno
#include <Servo.h>
Servo arm;

void setup() {
  arm.attach(9);
}

void loop() {
  int knob  = analogRead(A0);
  int angle = map(knob, 0, 1023, 0, 180);
  arm.write(angle);
  delay(15);
}`,
 sim(S){const v=S.val('pot','v');S.servo('servo',v*180);S.every(.4,()=>S.log('angle = '+Math.round(v*180)+'°'))}},
{n:'05',lvl:'Intermediate',min:6,title:'Parking sensor',sub:'Beep faster and faster as an object gets closer.',boards:'Arduino Uno R3',
 intro:'Your car does this every time you reverse. An ultrasonic sensor shouts a click too high to hear and times the echo; the Uno turns that time into centimetres and makes a buzzer beep faster the closer the obstacle gets.',
 items:[['uno','uno',-42,26],['us','hcsr04',-20,-62],['buz','buzzer',88,-24]],
 wires:['uno.5V>us.VCC|red|The sensor runs on 5 V.','uno.GND>us.GND|black|Sensor ground.','uno.D9>us.TRIG|orange|A short pulse on TRIG tells the sensor to send its burst of sound.','us.ECHO>uno.D10|yellow|ECHO stays HIGH for exactly as long as the sound was travelling.','uno.D8>buz.SIG|green|D8 drives the buzzer.','uno.GND>buz.GND|black|Buzzer ground.'],
 learn:['Sound travels about 343 m/s: distance = echo time × speed ÷ 2 (there and back)','pulseIn() measures how long a pin stays HIGH, in microseconds','tone() makes a pin vibrate at a chosen frequency','Mapping a measurement onto a pause length turns a number into something you can hear'],
 code:`// Parking sensor — Arduino Uno
const int TRIG = 9, ECHO = 10, BUZZ = 8;

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH);
  int cm  = us / 58;                 // echo time -> cm
  Serial.println(cm);
  if (cm < 100) {
    tone(BUZZ, 2000, 40);
    delay(map(cm, 2, 100, 40, 600)); // closer = faster
  }
}`,
 sim(S){const cm=S.val('us','dist');const gap=cm>=100?0:.04+(cm-2)/98*.56;if(gap){S.every(gap,()=>{S.beep('buz',2000,.04);S.log(Math.round(cm)+' cm')},'b')}else S.every(.6,()=>S.log(Math.round(cm)+' cm  (clear)'),'c')}},
{n:'06',lvl:'Intermediate',min:6,title:'Night light on 3.3 V',sub:'Measure light with an STM32 Blue Pill and switch a lamp on when it gets dark.',boards:'STM32 Blue Pill',
 intro:'Time to leave 5 V behind. The Blue Pill is a 32-bit board that runs on 3.3 V — like most modern chips. It will measure daylight with a photoresistor and switch a lamp on at dusk, exactly as a street light does.',
 items:[['stm','stm32',0,50],['ldr','ldr',-78,-36],['led','led',80,-34]],
 wires:['stm.3V3>ldr.VCC|red|Power the sensor from 3.3 V so its output can never exceed what the chip tolerates.','stm.GND>ldr.GND|black|Sensor ground.','ldr.OUT>stm.A0|yellow|The light level as a voltage, into analog pin PA0.','stm.B12>led.SIG|green|PB12 switches the lamp.','stm.GND>led.GND|black|Lamp ground.'],
 learn:['On a 3.3 V board every signal must stay at or below 3.3 V','A photoresistor conducts better in light; with a fixed resistor it forms a light-controlled voltage divider','The STM32\'s ADC is 12-bit: it reports 0 … 4095 instead of the Uno\'s 0 … 1023','A threshold turns a smooth measurement into a yes/no decision'],
 code:`// Night light — STM32 Blue Pill (Arduino core)
const int SENSOR = PA0;
const int LAMP   = PB12;

void setup() {
  pinMode(LAMP, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  int light = analogRead(SENSOR);     // 0 … 4095
  bool dark = light < 1600;
  digitalWrite(LAMP, dark);
  Serial.println(light);
  delay(100);
}`,
 sim(S){const l=S.val('ldr','light');S.led('led',l<.39?1:0);S.every(.4,()=>S.log('light = '+Math.round(l*4095)+(l<.39?'   dark → lamp ON':'   bright → lamp off')))}},
{n:'07',lvl:'Intermediate',min:8,title:'Two boards talking',sub:'Press a button on an Uno and light an LED on a Nano — over a serial link.',boards:'Arduino Uno R3 + Arduino Nano',
 intro:'Robots are teams of small computers. Here an Uno watches a button and tells a Nano what it saw, one byte at a time, over a single wire. That wire is UART — the oldest and simplest way for two boards to talk.',
 items:[['uno','uno',-70,30],['nano','nano',70,50],['btn','button',-90,-60],['led','led',88,-40]],
 wires:['uno.5V>btn.VCC|red|Power for the button.','uno.GND>btn.GND|black|Ground for the button.','btn.OUT>uno.D2|yellow|The Uno reads the button on D2.','uno.D1>nano.RX0|blue|TX on one board goes to RX on the other: one talks, the other listens.','uno.GND>nano.GND|black|Shared ground — without it the two boards disagree on what 0 V means.','nano.D9>led.SIG|green|The Nano shows what it heard.','nano.GND>led.GND|black|LED ground.'],
 learn:['UART sends bits one after another on a single wire, at an agreed speed (the baud rate)','TX always connects to RX — never TX to TX','Two boards can only understand each other if they share a ground','Both sides must use the same baud rate, here 9600'],
 code:`// --- Uno: the sender ---
void setup() { pinMode(2, INPUT); Serial.begin(9600); }
void loop() {
  Serial.write(digitalRead(2) ? '1' : '0');
  delay(50);
}

// --- Nano: the receiver ---
void setup() { pinMode(9, OUTPUT); Serial.begin(9600); }
void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    digitalWrite(9, c == '1');
  }
}`,
 sim(S){const p=S.val('btn','pressed');S.led('led',p?1:0);S.change('p',p,()=>S.log('Uno TX → \''+(p?1:0)+'\'    Nano: LED '+(p?'on':'off')))}},
{n:'08',lvl:'Intermediate',min:10,title:'5 V meets 3.3 V',sub:'Let a 5 V Uno command a 3.3 V ESP32 safely, through a level shifter.',boards:'Arduino Uno R3 + ESP32 DevKit V1',
 intro:'Plug a 5 V output straight into a 3.3 V chip and you can kill it. A logic level converter sits in between and translates. It needs both voltages as a reference, a shared ground, and then each channel carries one signal across the border.',
 items:[['uno','uno',-78,34],['esp','esp32',78,50],['llc','llc',0,-30],['led','led',100,-50]],
 wires:['uno.5V>llc.HV|red|HV is the high-voltage reference: the Uno\'s 5 V.','esp.3V3>llc.LV|orange|LV is the low-voltage reference: the ESP32\'s 3.3 V.','uno.GND>llc.GND|black|Ground from the 5 V side…','esp.GND>llc.GND|black|…and from the 3.3 V side. All grounds are one.','uno.D1>llc.HV1|blue|The Uno\'s 5 V serial output enters on the high side.','llc.LV1>esp.RX2|green|It leaves as a safe 3.3 V signal into the ESP32\'s RX2.','esp.D2>led.SIG|yellow|The ESP32 lights the LED when told to.','esp.GND>led.GND|black|LED ground.'],
 learn:['A 3.3 V input pin can be destroyed by 5 V','A level converter needs both supply voltages and a common ground','Each channel translates one signal; HV1 pairs with LV1','A 3.3 V output is usually high enough for a 5 V input to read as HIGH — the danger is only in the other direction'],
 code:`// --- Uno (5 V): sends a command every second ---
void setup() { Serial.begin(9600); }
void loop() {
  Serial.println("ON");  delay(1000);
  Serial.println("OFF"); delay(1000);
}

// --- ESP32 (3.3 V): obeys ---
void setup() {
  pinMode(2, OUTPUT);
  Serial2.begin(9600, SERIAL_8N1, 16, 17);  // RX2, TX2
}
void loop() {
  if (Serial2.available()) {
    String cmd = Serial2.readStringUntil('\\n');
    digitalWrite(2, cmd.startsWith("ON"));
  }
}`,
 sim(S){const on=Math.floor(S.t)%2===0;S.led('led',on?1:0);S.bled('esp',on);S.change('o',on,()=>S.log('Uno 5 V → "'+(on?'ON':'OFF')+'" → shifter → ESP32 3.3 V: LED '+(on?'on':'off')))}},
{n:'09',lvl:'Intermediate',min:8,title:'Pico weather screen',sub:'Show live temperature and humidity on an OLED with a Raspberry Pi Pico.',boards:'Raspberry Pi Pico',
 intro:'A sensor is only useful if you can see what it says. The Pico reads a DHT11 climate sensor and writes the numbers onto a tiny OLED over I²C — a bus where many devices share just two wires. This one is written in MicroPython.',
 items:[['pico','pico',0,50],['dht','dht11',-80,-40],['oled','oled',76,-40]],
 wires:['pico.3V3>dht.VCC|red|Power for the sensor.','pico.GND>dht.GND|black|Sensor ground.','dht.DATA>pico.GP15|yellow|One wire carries both temperature and humidity, as a timed stream of bits.','pico.3V3>oled.VCC|red|Power for the display.','pico.GND>oled.GND|black|Display ground.','pico.GP4>oled.SDA|blue|SDA: the I²C data line.','pico.GP5>oled.SCL|green|SCL: the I²C clock line.'],
 learn:['I²C needs only two signal wires — data (SDA) and clock (SCL) — however many devices share them','Each I²C device has an address; this OLED answers at 0x3C','The DHT11 is slow: ask it at most once a second','MicroPython lets you program a microcontroller in Python'],
 code:`# Pico weather screen — MicroPython
from machine import Pin, I2C
import dht, ssd1306, time

sensor = dht.DHT11(Pin(15))
i2c    = I2C(0, sda=Pin(4), scl=Pin(5))
oled   = ssd1306.SSD1306_I2C(128, 64, i2c)

while True:
    sensor.measure()
    oled.fill(0)
    oled.text("Temp  %d C" % sensor.temperature(), 0, 12)
    oled.text("Humid %d %%" % sensor.humidity(), 0, 36)
    oled.show()
    time.sleep(1)`,
 sim(S){const t=Math.round(S.val('dht','temp')),h=Math.round(S.val('dht','hum'));S.oled('oled',['Temp  '+t+' C','Humid '+h+' %']);S.every(1,()=>S.log('temp='+t+'C  humidity='+h+'%'))}},
{n:'10',lvl:'Advanced',min:10,title:'Wi-Fi weather node',sub:'Build an IoT node: a NodeMCU reads the climate, shows it as a colour and "posts" it over Wi-Fi.',boards:'NodeMCU (ESP8266)',
 intro:'Now the reading leaves the bench. A NodeMCU measures the air, shows the temperature as a colour — blue for cold, red for hot — and sends each reading to a server over Wi-Fi. That is all "Internet of Things" means.',
 items:[['mcu','nodemcu',0,52],['dht','dht11',-84,-40],['rgb','rgb',82,-40]],
 wires:['mcu.3V3>dht.VCC|red|Sensor power, 3.3 V.','mcu.GND>dht.GND|black|Sensor ground.','dht.DATA>mcu.D4|yellow|Climate data into D4.','mcu.D5>rgb.R|red|PWM for the red LED.','mcu.D6>rgb.G|green|PWM for the green LED.','mcu.D7>rgb.B|blue|PWM for the blue LED.','mcu.GND>rgb.GND|black|Common ground of the three LEDs.'],
 learn:['An RGB LED is three LEDs in one lens; three PWM pins mix any colour','A Wi-Fi board joins your network like a phone does, with a name and a password','HTTP POST is how a device hands data to a server','Never leave real passwords in code you share'],
 code:`// Wi-Fi weather node — NodeMCU (ESP8266)
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>
DHT dht(D4, DHT11);

void setup() {
  Serial.begin(115200); dht.begin();
  WiFi.begin("workshop", "********");
  while (WiFi.status() != WL_CONNECTED) delay(250);
}

void loop() {
  float t = dht.readTemperature();
  int warm = constrain(map(t, 10, 35, 0, 1023), 0, 1023);
  analogWrite(D5, warm);          // red
  analogWrite(D6, 120);           // a touch of green
  analogWrite(D7, 1023 - warm);   // blue
  WiFiClient net; HTTPClient http;
  http.begin(net, "http://example.local/climate");
  http.POST(String("{\\"temp\\":") + t + "}");
  http.end();
  delay(2000);
}`,
 sim(S){const t=S.val('dht','temp'),h=Math.round(S.val('dht','hum'));const k=Math.max(0,Math.min(1,(t-10)/25));S.rgb('rgb',k,.12,1-k);S.once('w',()=>{S.log('Connecting to "workshop" ....');S.log('Wi-Fi connected · 192.168.1.42')});S.every(2,()=>S.log('POST /climate {"temp":'+Math.round(t)+',"hum":'+h+'} → 200 OK'))}},
{n:'11',lvl:'Advanced',min:15,title:'Robot: brain and muscle',sub:'A Raspberry Pi 4 sends drive commands to an Arduino Mega, which runs two motors through an L298N.',boards:'Arduino Mega 2560 R3 + Raspberry Pi 4 Model B',
 intro:'Real robots split the work. A Raspberry Pi thinks — vision, planning, Wi-Fi. A microcontroller reacts — precise timing for motors. And because no logic pin can power a motor, an H-bridge driver and a battery supply the muscle.',
 items:[['pi','pi4',-125,-58],['mega','mega',-98,52],['drv','l298n',38,28],['m1','motor',132,-62],['m2','motor',132,82],['bat','batt',12,-78]],
 wires:['pi.GPIO14>mega.D19|blue|The Pi\'s serial TX into the Mega\'s RX1. A 3.3 V signal is safe for a 5 V input.','pi.GND>mega.GND|black|Shared ground between brain and muscle controller.','bat.+>drv.12V|red|Motor power comes from the battery, never from a logic pin.','bat.−>drv.GND|black|Battery ground to the driver.','mega.GND>drv.GND|black|…and the driver\'s ground to the Mega: one ground for everything.','mega.D9>drv.ENA|orange|PWM on ENA sets the speed of motor A.','mega.D8>drv.IN1|yellow|IN1 and IN2 choose motor A\'s direction.','mega.D7>drv.IN2|yellow|Swap HIGH and LOW on the pair to reverse.','mega.D5>drv.IN3|green|IN3 and IN4 choose motor B\'s direction.','mega.D4>drv.IN4|green|Second direction pin for motor B.','mega.D3>drv.ENB|orange|PWM on ENB sets the speed of motor B.','drv.OUT1>m1.M+|red|Driver output to the left motor.','drv.OUT2>m1.M−|black|Left motor return.','drv.OUT3>m2.M+|red|Driver output to the right motor.','drv.OUT4>m2.M−|black|Right motor return.'],
 learn:['A GPIO pin gives milliamps; a motor wants hundreds — a driver chip does the heavy switching','An H-bridge can push current through a motor in either direction','PWM on the enable pin controls speed','Split the job: a computer for decisions, a microcontroller for timing'],
 code:`# --- Raspberry Pi 4: the brain (Python) ---
import serial, time
mega = serial.Serial("/dev/serial0", 115200)
for cmd in [b"F", b"L", b"R", b"S"] * 100:
    mega.write(cmd)
    time.sleep(2)

// --- Arduino Mega: the muscle ---
void drive(int a, int b) {
  digitalWrite(8, a > 0); digitalWrite(7, a < 0);
  digitalWrite(5, b > 0); digitalWrite(4, b < 0);
  analogWrite(9, abs(a)); analogWrite(3, abs(b));
}
void setup() { Serial1.begin(115200); /* pins as OUTPUT */ }
void loop() {
  if (!Serial1.available()) return;
  switch (Serial1.read()) {
    case 'F': drive( 200,  200); break;
    case 'L': drive(-150,  150); break;
    case 'R': drive( 150, -150); break;
    case 'S': drive(   0,    0); break;
  }
}`,
 sim(S){const c=['F','L','R','S'][Math.floor(S.t/2)%4];const m={F:[1,1],L:[-.7,.7],R:[.7,-.7],S:[0,0]}[c];S.motor('m1',m[0]);S.motor('m2',m[1]);S.change('c',c,()=>S.log('Pi → \''+c+'\'   '+{F:'forward',L:'turn left',R:'turn right',S:'stop'}[c]))}},
{n:'12',lvl:'Intermediate',min:6,title:'Motion alarm',sub:'A PIR sensor spots movement and an Arduino Uno sounds the alarm.',boards:'Arduino Uno R3',
 intro:'Every hallway light and burglar alarm starts with this sensor. A PIR watches the heat a body gives off; when that picture changes, its output goes HIGH. The Uno turns that single bit into light and sound.',
 items:[['uno','uno',-44,30],['pir','pir',-70,-58],['buz','buzzer',70,-58],['led','led',104,-8]],
 wires:['uno.5V>pir.VCC|red|The PIR module runs on 5 V.','uno.GND>pir.GND|black|Sensor ground.','pir.OUT>uno.D2|yellow|OUT goes HIGH for a few seconds whenever something warm moves.','uno.D8>buz.SIG|green|D8 drives the siren.','uno.GND>buz.GND|black|Buzzer ground.','uno.D13>led.SIG|orange|D13 lights the warning lamp.','uno.GND>led.GND|black|Lamp ground.'],
 learn:['A PIR sensor does not see people, it sees changes in infrared heat','Its output is plain digital: HIGH means motion, LOW means still','One input can drive several outputs: the decision lives in the code','After power-up a PIR needs up to a minute to settle before it is reliable'],
 code:`// Motion alarm — Arduino Uno
const int PIR = 2, BUZZ = 8, LAMP = 13;

void setup() {
  pinMode(PIR, INPUT);
  pinMode(LAMP, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(PIR) == HIGH) {
    digitalWrite(LAMP, HIGH);
    tone(BUZZ, 1400, 120);
    Serial.println("Motion!");
    delay(240);
  } else {
    digitalWrite(LAMP, LOW);
  }
}`,
 sim(S){const m=S.val('pir','motion');S.led('led',m&&Math.floor(S.t*4)%2===0?1:0);S.bled('uno',m);if(m)S.every(.24,()=>{S.beep('buz',1400,.12);S.log('Motion!')},'m');S.change('m',m,()=>{if(!m)S.log('All quiet.')})}}
];

const LESSONS=[
 ['Voltage, current, ground','Voltage is the push, current is the flow, and ground is the place everything flows back to. Nothing happens until there is a complete loop: out of a pin, through your part, back to <code>GND</code>. A missing ground wire is the most common reason a circuit sits there doing nothing.'],
 ['Digital pins: yes or no','A digital pin knows two states. As an output your code sets it <code>HIGH</code> (5 V or 3.3 V) or <code>LOW</code> (0 V). As an input it reports which of the two it sees. An input connected to nothing "floats" and reads noise — that is what pull-up and pull-down resistors fix.'],
 ['Analog in, PWM out','The world is not just on and off. An analog input measures a voltage and hands you a number — 0 to 1023 on an Uno. To send out something in-between, boards cheat: PWM flicks a pin on and off so fast that an LED or motor only feels the average.'],
 ['Three ways to talk','<b>UART</b>: two boards, one wire each way, TX to RX. <b>I²C</b>: many devices on two shared wires, each with an address. <b>SPI</b>: fast, four wires, one device selected at a time. Sensors and displays nearly always use one of the three.'],
 ['5 V and 3.3 V do not mix','Classic Arduinos speak 5 V. Almost everything newer — ESP32, Pico, STM32, Raspberry Pi — speaks 3.3 V, and 5 V on one of their pins can destroy it. Going from 3.3 V to 5 V is usually fine; going the other way needs a level converter.'],
 ['Microcontroller or computer?','An Arduino runs one program, starts instantly and times things to the microsecond. A Raspberry Pi runs Linux: cameras, networks, Python libraries — but it boots slowly and cannot promise exact timing. Serious robots use both, each for what it is good at.']];

const QUIZ=[
 ['What is the job of the GND pin?',['It supplies 5 V to your parts','It is the common 0 V point that current returns to','It resets the board','It stores your program'],1,'Ground is the shared reference and the return path. Every part of a circuit — and every board that talks to another — must be connected to it.'],
 ['An LED module is wired from D13 to SIG, but its GND pin is left unconnected. D13 goes HIGH. What happens?',['The LED lights at half brightness','The LED lights normally','Nothing — there is no closed loop','The board resets'],2,'Current only flows in a complete loop. With no path back to ground, no current flows, so the LED stays dark.'],
 ['Which of these boards runs a full Linux operating system?',['Arduino Mega 2560','Raspberry Pi Pico','ESP32 DevKit','Raspberry Pi 4 Model B'],3,'The Pi 4 is a real computer with gigabytes of RAM. The Pico shares the brand but is a microcontroller: one program, no operating system.'],
 ['On an Uno, what does <code>analogWrite(9, 127)</code> produce on pin 9?',['A steady 2.5 V','A 5 V signal switched on about half of the time','127 millivolts','Nothing; pin 9 is input-only'],1,'It is PWM: the pin is still only ever 0 V or 5 V, but it is HIGH for roughly 50 % of each cycle, so an LED appears half as bright.'],
 ['You want a 5 V Uno output to drive an input pin of a 3.3 V ESP32. What do you need in between?',['Nothing, it just works','A longer wire','A logic level converter','A bigger battery'],2,'5 V on a 3.3 V input can damage the chip. A level converter (or a resistor divider) brings the signal down to a safe 3.3 V.'],
 ['Why does a push-button circuit include a pull-down resistor?',['To make the button click louder','To hold the input at a definite LOW when the button is not pressed','To protect the LED','To increase the voltage'],1,'Without it the input is connected to nothing while the button is up, and it reads random values. The resistor gently ties it to ground.'],
 ['Which bus connects many devices using just two signal wires called SDA and SCL?',['UART','I²C','SPI','USB'],1,'I²C: one data line, one clock line, and every device has its own address.'],
 ['Why can\'t you run a DC motor directly from a GPIO pin?',['Motors only work on 12 V','A pin can supply only a few milliamps; a motor needs far more','GPIO pins are input-only','You can, it is perfectly fine'],1,'A pin gives roughly 20 mA; a small motor wants hundreds. A driver such as the L298N switches the motor current from a separate supply.']];

