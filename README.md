# WS2801-Connect

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ce88ce0410ee4e6cb2182ead6ebd4acf)](https://www.codacy.com/app/Vertumnus/js-ws2801-connect?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Vertumnus/js-ws2801-connect&amp;utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/Vertumnus/js-ws2801-connect/badge.svg?branch=master)](https://coveralls.io/github/Vertumnus/js-ws2801-connect?branch=master)
[![npm](https://img.shields.io/npm/dt/ws2801-connect.svg)](https://www.npmjs.com/package/ws2801-connect)
[![npm](https://img.shields.io/npm/v/ws2801-connect.svg)](https://www.npmjs.com/package/ws2801-connect)
[![npm](https://img.shields.io/npm/l/ws2801-connect.svg)](https://www.npmjs.com/package/ws2801-connect)

This library contains a javascript class, which represents a WS2801 led stripe
connected via SPI. Whereby the SPI implementation is open and not necessarely 
coupled to the hardware SPI of your controler device of choice.

## Precondition
The library is implemented in ECMAScript 2015, so your project should support
at least this version.

## Installation
Install it via npm:
```shell
$ npm install ws2801-connect
```

## Usage
Start with importing the module via:
```js
var WS2801 = require("ws2801-connect")
```

Create an instance providing the number of led lights and a callback function
for the communication with the SPI.:
```js
// 32 led lights, callback with SPI communication
var leds = new WS2801(32, (data) => { spi.write(data) })
```
> The callback gets an array as parameter containing the data to be sent to
> the SPI and finally to the led stripe. 
> See [Examples](#examples) to get an idea how it works.

Make all led lights black with:
```js
leds.clear()
```

Fill all led lights with a color:
```js
leds.fill("#FF0000") //fill with red
leds.fill(0, 255, 0) //fill with green
leds.fill([0x00, 0x00, 0xff]) //fill with blue
```
> These are the three ways you can specify colors.

Set the color of a single led light by index (starting with 0):
```js
leds.setLight(0, "#FF0000") //set first light to red
leds.setLight(1, 0, 255, 0) //set second light to green
leds.setLight(2, [0x00, 0x00, 0xff]) //set third light to blue
```

Send finally your color configuration to the led stripe:
```js
leds.show()
```
> __Consider:__ After you have changed your color configuration through
> `clear()`, `fill()` and/or `setLight()` (several calls) you have to call `show()`.

## Examples

### rpi-softspi [![npm](https://img.shields.io/npm/v/rpi-softspi.svg)](https://www.npmjs.com/package/rpi-softspi)
> Software implementation of SPI to use any pin for the interface on Raspberry Pi
> instead of using the hardware SPI of the RPi.

First you have to instantiate the SPI representation and open the communication.
In the callback for the WS2801 you have to call the `write()` method.

```js
var sleep = require("sleep")
var SoftSPI = require("rpi-softspi")
var WS2801 = require("ws2801-connect")

/* we only need clock and mosi for the WS2801 led stripe
 * for all other options of SoftSPI we can use the default
 * begin SPI communication immediately
 */
var spi = new SoftSPI({
   clock: 5, // GPIO 3 - SCL
   mosi: 3 // GPIO 2 - SDA
})
spi.open()

// the led stripe has 32 lights; supply callback as lambda
var leds = new WS2801(32, (data) => { spi.write(data) })

// first make all lights black
leds.clear().show()
sleep(1) // wait a second
// next fill red
leds.fill("#FF0000").show()
sleep(1)
// fill green
leds.fill(0, 255, 0).show()
sleep(1)
// fill blue
leds.fill([0x00, 0x00, 0xff]).show()
sleep(1)
// and black again
leds.clear().show()

// end SPI communication
spi.close()
```

### rpio [![NPM version](https://badge.fury.io/js/rpio.svg)](http://badge.fury.io/js/rpio)
> High performance node.js addon which provides access to the Raspberry Pi GPIO interface
> including SPI

First you have to initiate the SPI communication with rpio.
In the callback for the WS2801 you have to call the `spiWrite()` method.

```js
var rpio = require("rpio")
var WS2801 = require("ws2801-connect")

// initiate SPI and begin communication
rpio.spiBegin()
// max. 25 MHz
rpio.spiSetClockDivider(10)
rpio.spiSetDataMode(0)

// the led stripe has 32 lights; supply callback as lambda
var leds = new WS2801(32, (data) => { 
                              let buf = Buffer.from(data)
                              rpio.spiWrite(buf, buf.length)
                           })

// first make all lights black
leds.clear().show()
rpio.sleep(1) // wait a second
// next fill red
leds.fill("#FF0000").show()
rpio.sleep(1)
// fill green
leds.fill(0, 255, 0).show()
rpio.sleep(1)
// fill blue
leds.fill([0x00, 0x00, 0xff]).show()
rpio.sleep(1)
// and black again
leds.clear().show()

// release SPI
rpio.spiEnd()
```

## API
Check out the [documentation](doc) for details.

## License
MIT