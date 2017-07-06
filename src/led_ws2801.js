/* 
 * Copyright Armin Junge
 */


/* global Symbol */

var sleep = require("sleep")

class LED_WS2801
{
   constructor(count, spi)
   {
      this.assert(spi.write, "SPI interface must have function write")
      this.count = count
      this.spi = spi
   }

   assert(expression, message)
   {
      if(!expression)
         throw message
   }

   set count(number)
   {
      this.assert(number > 0, "Only natural numbers are valid")
      // Each light has three colors, so we need the tripple of count
      this.rgbLights = Array(3 * number)
   }
   get count()
   {
      return this.rgbLights.length / 3
   }

   static rgbFrom(color)
   {
      let r, g, b
      switch(color.length)
      {
         case 1:
            let rgb = (color[0][0] == '#')?color[0].slice(1):color[0]
            r = parseInt(rgb.substr(0,2), 16)
            g = parseInt(rgb.substr(2,2), 16)
            b = parseInt(rgb.substr(4,2), 16)
            return [r, g, b]
         case 3:
            return color
         default:
            this.assert(false, "Wrong number of arguments")
            return [0, 0, 0]
      }
   }

   setLight(number, ...color)
   {
      this.assert(number >= 0 && number < this.count, "Given Number is out of range")
      let r, g, b
      [r, g, b] = LED_WS2801.rgbFrom(color)
      
      this.rgbLights[3*number+0] = r & 0xff
      this.rgbLights[3*number+1] = g & 0xff
      this.rgbLights[3*number+2] = b & 0xff
      
      return this
   }

   [Symbol.iterator]()
   {
      var my = this
      return function* ()
         {
            var n = 0
            while(n < my.count)
               yield [my.rgbLights[3*n+0],my.rgbLights[3*n+1],my.rgbLights[3*n+2]]
         }
   }
   
   show()
   {
      this.spi.write(this.rgbLights)
      sleep.usleep(600)
      return this
   }
   
   clear()
   {
      this.rgbLights.fill(0)
      return this
   }
   
   fill(...color)
   {
      let rgb = LED_WS2801.rgbFrom(color)
      this.rgbLights.forEach(function(item, index, arr){
         arr[index] = rgb[index % 3]
      })
      return this
   }
}

module.exports = LED_WS2801
