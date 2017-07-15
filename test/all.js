/* 
 * Copyright 2017 Armin Junge.
 */

var assert = require("assert")
var mock = require("mock-require")
mock("sleep", { usleep: function(){} })

var WS2801 = require("../src/ws2801")

let spi = { 
      data: null,
      write: function(data){
         this.data = data
      } 
   }
let count = 4
let leds = new WS2801(count, (data) => { spi.write(data) })
   
describe("WS2801", function(){
   describe("#constructor", function(){
      it("should work also without a callback", function(){
         let ledsTest = new WS2801(count)
         ledsTest.clear().show()
      })
   })
   describe("#count", function(){
      it("should be " + count, function(){
         assert.equal(leds.count, count)
      })
   })
   describe("#setLight", function(){
      it("should throw an exception, because negative index", function(){
         assert.throws(() => { leds.setLight(-1, "#ffffff") },
                        /out of range/)
      })
      it("should throw an exception, because out of upper range", function(){
         assert.throws(() => { leds.setLight(5, "#ffffff") },
                        /out of range/)
      })
      it("should throw an exception, because missing color", function(){
         assert.throws(() => { leds.setLight(0) },
                        /number of arguments/)
      })
      it("should throw an exception, because a wrong argument", function(){
         assert.throws(() => { leds.setLight(0, () => { } ) },
                        /Wrong argument/)
      })
      it("should set the colors in correct way", function(){
         leds.setLight(0, "FFFFFF") //white
         leds.setLight(1, "#ff0000") //red
         leds.setLight(2, [0x00, 0xff, 0x00]) //green
         leds.setLight(3, 0, 0, 255) //blue
         let expected = [0xff, 0xff, 0xff, //white
                         0xff, 0x00, 0x00, //red
                         0x00, 0xff, 0x00, //green
                         0x00, 0x00, 0xff] //blue
         assert.deepEqual(leds.rgbLights, expected)
      })
   })
   describe("#clear", function(){
      it("should fill all lights with black", function(){
         leds.clear()
         let expected = [  0, 0, 0, 
                           0, 0, 0, 
                           0, 0, 0, 
                           0, 0, 0  ]
         assert.deepEqual(leds.rgbLights, expected)
      })
   })
   describe("#fill", function(){
      it("should throw an exception, because missing color", function(){
         assert.throws(() => { leds.fill() },
                              /number of arguments/)
      })
      it("should fill all lights with the same color", function(){
         leds.fill("#987654")
         let expected = [  0x98, 0x76, 0x54, 
                           0x98, 0x76, 0x54, 
                           0x98, 0x76, 0x54,
                           0x98, 0x76, 0x54 ]
         assert.deepEqual(leds.rgbLights, expected)
      })
   })
   describe("#show", function(){
      before(function(){
         leds.fill("#123456")
         leds.show()
      })
      it("should provide an Array to SPI", function(){
         assert.ok(Array.isArray(spi.data))
      })
      it("should provide the Array in the correct length", function(){
         assert.equal(spi.data.length, count * 3) //count * three colors (RGB)
      })
      it("should provide the correct data content to the SPI", function(){
         let expected = [  0x12, 0x34, 0x56,
                           0x12, 0x34, 0x56,
                           0x12, 0x34, 0x56,
                           0x12, 0x34, 0x56  ]
         assert.deepEqual(spi.data, expected)
      })
   })
   describe("#@@Iterator", function(){
      it("should deliver the correct data content", function(){
         leds.fill("#fedcba")
         let expected = [  [  0xfe, 0xdc, 0xba  ],
                           [  0xfe, 0xdc, 0xba  ],
                           [  0xfe, 0xdc, 0xba  ],
                           [  0xfe, 0xdc, 0xba  ]  ]
         assert.deepEqual([...leds], expected)
      })
   })
})