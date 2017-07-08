/* 
 * The MIT License
 *
 * Copyright 2017 Armin Junge.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
      this.clear()
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
            if(typeof color[0] === 'string')
            {
               let rgb = (color[0][0] == '#')?color[0].slice(1):color[0]
               r = parseInt(rgb.substr(0,2), 16)
               g = parseInt(rgb.substr(2,2), 16)
               b = parseInt(rgb.substr(4,2), 16)
               return [r, g, b]
            }
            else
               if(Array.isArray(color[0]) && color[0].length == 3)
                  return color[0]
               else
                  this.assert(false, "Wrong arguments")
            break;
         case 3:
            return color
         default:
            this.assert(false, "Wrong number of arguments")
      }
      return [0, 0, 0]
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

   *[Symbol.iterator]()
   {
      for(let n = 0, end = this.count; n < end; ++n)
         yield [this.rgbLights[3*n+0],this.rgbLights[3*n+1],this.rgbLights[3*n+2]]
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
