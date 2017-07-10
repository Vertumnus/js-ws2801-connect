# WS2801-Connect
This library contains a javascript class, which represents a WS2801 led stripe
connected via SPI. Whereby the SPI implementation is open and not necessarely 
coupled to the hardware SPI of your controler device of choise.

## Precondition
The library is implemented in ECMAScript 2015, so your project should support
at least this version.

## Installation
Install it via npm:
```
$ npm install ws2801-connect
```

## Usage
Start with importing the module via:
```
var ws2801 = require('ws2801-connect')
```

Create an instance providing the number of led lights and a SPI implementation:
```
var leds = new ws2801(32, spi) // 32 led lights, representation of SPI
```
The SPI implementation is responsible for the communication to the led stripe.
It must provide a function/method called __write__ with one parameter accepting
an Array with data.

Make all led lights black with:
```
leds.clear()
```

Fill all led lights with a color:
```
leds.fill("#FF0000") //fill with red
leds.fill(0, 255, 0) //fill with green
leds.fill([0x00, 0x00, 0xff]) //fill with blue
```

Set the color of a single led light by index (starting with 0):
```
leds.setLight(0, "#FF0000") //set first light to red
leds.setLight(1, 0, 255, 0) //set second light to green
leds.setLight(2, [0x00, 0x00, 0xff]) //set third light to blue
```

Send finally your color configuration to the led stripe:
```
leds.show()
```

## API
Check out the [documentation](./doc/index.html) for details.

## Examples
_TODO_

## License
MIT