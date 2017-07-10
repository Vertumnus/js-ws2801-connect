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

/**
 * Represents your WS2801 led stripe
 */
class ws2801
{
   /**
    * Creates the representation of the led stripe.
    * @param {Number} count - number of the led lights on your stripe
    * @param {Object} spi - Defines the SPI representation to be used. 
    * It must have a function called "write" accepting the data as Array.
    * @returns {ws2801}
    */
   constructor(count, spi)
   {
      this.assert(spi.write, "SPI interface must have function write")
      this.count = count
      this.spi = spi
   }

   /**
    * Helper method for the assertion of the given expression. 
    * If the expression is false, the method throws the given message as exception.
    * @private
    * @param {Boolean} expression - any logical expression
    * @param {String} message - text, which will be thrown as exception
    * @returns {undefined}
    */
   assert(expression, message)
   {
      if(!expression)
         throw message
   }

   /**
    * Sets the number of supported led lights.
    * @param {Number} number - number of led lights
    * @returns {undefined}
    */
   set count(number)
   {
      this.assert(number > 0, "Only natural numbers are valid")
      // Each light has three colors, so we need the tripple of count
      this.rgbLights = Array(3 * number)
      this.clear()
   }
   /**
    * Returns the number of supported led lights.
    * @returns {Number}
    */
   get count()
   {
      return this.rgbLights.length / 3
   }

   /**
    * Static helper method to determine red, green and blue values.
    * Either from a string like "#fe12a9"
    * or from the elements of the array, where the elements are red, green and blue
    * or from an array as once element, which is identical to the returning one.
    * 
    * Usually this method will be called using a rest parameter. 
    * See {@link ws2801#setLight setLight()} or {@link ws2801#fill fill()}
    * @example //with String
    * let r, g, b
    * [r, g, b] = ws2801.rgbFrom(["#fe12a9"])
    * // r = 0xfe, g = 0x12, b = 0xa9
    * @example //with Elements
    * let r, g, b
    * [r, g, b] = ws2801.rgbFrom([0xfe, 0x12, 0xa9])
    * // r = 0xfe, g = 0x12, b = 0xa9
    * @example //with Array
    * let r, g, b
    * [r, g, b] = ws2801.rgbFrom([[0xfe, 0x12, 0xa9]])
    * // r = 0xfe, g = 0x12, b = 0xa9
    * @example //with rest parameter
    * function rgb(...color) {
    *    return ws2801.rgbFrom(color)
    * }
    * rgb("#fe12a9")
    * rgb(0xfe, 0x12, 0xa9)
    * rgb([0xfe, 0x12, 0xa9])
    * @param {Array} color - Having one element with a string or an array
    * containing red, green and blue as elements or having three elements
    * representing red, green and blue
    * @returns {Array} Contains red, green and blue as elements
    */
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

   /**
    * Sets the color of the led light specified by the given index number.
    * @example //Usage
    * leds.setLight(0, "#ff0000") //set first light to red
    * leds.setLight(1, 0, 255, 0) //set second light to green
    * leds.setLight(2, [0x00, 0x00, 0xff]) //set third light to blue
    * @param {Number} number - Index of the led light, starting at 0. 
    * Must not exceed number of led lights.
    * @param {String|...Number|Array} color - Contains a string like "#fe12a9"
    * or an array with red, green and blue as elements like [0xfe, 0x12, 0xa9]
    * or a parameter list of three elments as red, green and blue like (..., 0xfe, 0x12, 0xa9)
    * @returns {ws2801}
    */
   setLight(number, ...color)
   {
      this.assert(number >= 0 && number < this.count, "Given Number is out of range")
      let r, g, b
      [r, g, b] = ws2801.rgbFrom(color)
      
      this.rgbLights[3*number+0] = r & 0xff
      this.rgbLights[3*number+1] = g & 0xff
      this.rgbLights[3*number+2] = b & 0xff
      
      return this
   }

   /**
    * Iterator for the supported led lights. Each element is always an array
    * with three elements representing red, green and blue.
    * @returns {Generator}
    */
   *[Symbol.iterator]()
   {
      for(let n = 0, end = this.count; n < end; ++n)
         yield [this.rgbLights[3*n+0],this.rgbLights[3*n+1],this.rgbLights[3*n+2]]
   }
   
   /**
    * Writes the led lights colors to the led stripe using the supplied SPI instance.
    * You have to call this method everytime you want to see the set colors
    * on your led stripe.
    * @returns {ws2801}
    */
   show()
   {
      this.spi.write(this.rgbLights)
      sleep.usleep(600)
      return this
   }
   
   /**
    * Sets all supported led lights to black.
    * @returns {ws2801}
    */
   clear()
   {
      this.rgbLights.fill(0)
      return this
   }
   
   /**
    * Sets all supported led lights to the given color.
    * @example //Usage
    * leds.fill("#ff0000") // set all led lights to red
    * leds.fill(0, 255, 0) // set all led lights to green
    * leds.fill([0x00, 0x00, 0xff]) // set all led lights to blue
    * @param {String|...Number|Array} color - Contains a string like "#fe12a9"
    * or an array with red, green and blue as elements like [0xfe, 0x12, 0xa9]
    * or a parameter list of three elments as red, green and blue like (..., 0xfe, 0x12, 0xa9)
    * @returns {ws2801}
    */
   fill(...color)
   {
      let rgb = ws2801.rgbFrom(color)
      this.rgbLights.forEach(function(item, index, arr){
         arr[index] = rgb[index % 3]
      })
      return this
   }
}

module.exports = ws2801
