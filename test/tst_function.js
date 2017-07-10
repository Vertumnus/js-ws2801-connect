/* 
 * Copyright 2017 Armin Junge.
 */

var mock = require('mock-require')
mock('sleep', { usleep: function(){} })

var ws2801 = require('../lib/ws2801-connect.min')

module.exports.test = {
   setUp: function(cb){
      this.spi = { write: function(){} }
      this.leds = new ws2801(this.count = 4, this.spi)
      cb()
   },
   testCount: function(test){
      test.expect(1)
      test.equal(this.leds.count, this.count, "Wrong count")
      test.done()
   },
   testSetLight: function(test){
      test.expect(1)
      try{
         this.leds.setLight(-1, "#ffffff")
         test.ok(false, "Exception expected, because negative index")
      }
      catch(e){}
      try{
         this.leds.setLight(5, "#ffffff")
         test.ok(false, "Exception expected, because out of upper range")
      }
      catch(e){}
      try{
         this.leds.setLight(0)
         test.ok(false, "Exception expected, because missing color")
      }
      catch(e){}
      this.leds.setLight(0, "#FFFFFF") //white
      this.leds.setLight(1, "#ff0000") //red
      this.leds.setLight(2, [0x00, 0xff, 0x00]) //green
      this.leds.setLight(3, 0, 0, 255) //blue
      let expected = [0xff, 0xff, 0xff, //white
                      0xff, 0x00, 0x00, //red
                      0x00, 0xff, 0x00, //green
                      0x00, 0x00, 0xff] //blue
      test.deepEqual(this.leds.rgbLights, expected, "At least one light is set wrong")
      test.done()
   },
   testClear: function(test){
      test.expect(1)
      this.leds.clear()
      let expected = [  0, 0, 0, 
                        0, 0, 0, 
                        0, 0, 0, 
                        0, 0, 0  ]
      test.deepEqual(this.leds.rgbLights, expected, "Lights are not black")
      test.done()
   },
   testFill: function(test){
      test.expect(1)
      try{
         this.leds.fill()
         test.ok(false, "Exception expected, because missing color")
      }
      catch(e){}
      this.leds.fill("#987654")
      let expected = [  0x98, 0x76, 0x54, 
                        0x98, 0x76, 0x54, 
                        0x98, 0x76, 0x54,
                        0x98, 0x76, 0x54 ]
      test.deepEqual(this.leds.rgbLights, expected, "Lights are not filled correct")
      test.done()
   },
   testShow: function(test){
      test.expect(3)
      this.leds.fill("#123456")
      let count = this.count
      let expected = [  0x12, 0x34, 0x56,
                        0x12, 0x34, 0x56,
                        0x12, 0x34, 0x56,
                        0x12, 0x34, 0x56  ]
      this.spi.write = function(arr){
         test.ok(Array.isArray(arr), "SPI write doesn't get an Array")
         test.ok(arr.length == count * 3, "SPI write got an Array with a wrong length")
         test.deepEqual(arr, expected, "SPI write got wrong content")
      }
      this.leds.show()
      test.done()
   },
   testIterator: function(test){
      test.expect(1)
      this.leds.fill("#fedcba")
      let expected = [  [  0xfe, 0xdc, 0xba  ],
                        [  0xfe, 0xdc, 0xba  ],
                        [  0xfe, 0xdc, 0xba  ],
                        [  0xfe, 0xdc, 0xba  ]  ]
      test.deepEqual([...this.leds], expected, "Iterator doesn't work")
      test.done()
   }
}