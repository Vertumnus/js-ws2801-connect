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
module.exports = function (grunt) {
   // Project configuration.
   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat: {
         options: { separator: ';' },
         dist: {
            src: ["src/*.js"],
            dest: "dist/<%= pkg.name %>.js"
         }
      },
      uglify: {
         options: {
            banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"
         },
         dist: {
            files: {
               "bin/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
            }
         }
      },
      jshint: {
         files: ["Gruntfile.js", "src/*.js", "test/*.js"],
         options: {
            esversion: 6,
            asi: true
         }
      }
   });
   
   grunt.loadNpmTasks('grunt-contrib-uglify')
   grunt.loadNpmTasks('grunt-contrib-jshint')
   grunt.loadNpmTasks('grunt-contrib-concat')
   
   grunt.registerTask('test', ['jshint'])
   grunt.registerTask('default', ['jshint', 'concat', 'uglify'])
};
