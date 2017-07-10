/* 
 * Copyright 2017 Armin Junge.
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
               "lib/<%= pkg.name %>.min.js": ["<%= concat.dist.dest %>"]
            }
         }
      },
      jshint: {
         files: ["Gruntfile.js", "src/*.js", "test/*.js"],
         options: {
            esversion: 6,
            asi: true
         }
      },
      nodeunit: {
         all: ["test/tst_*.js"]
      },
      jsdoc: {
         dist: {
            src: ['src/*.js'],
            options: {
               dest: 'doc'
            }
         }
      }
   });
   
   grunt.loadNpmTasks('grunt-contrib-uglify')
   grunt.loadNpmTasks('grunt-contrib-jshint')
   grunt.loadNpmTasks('grunt-contrib-concat')
   grunt.loadNpmTasks('grunt-contrib-nodeunit')
   grunt.loadNpmTasks('grunt-jsdoc')
   
   grunt.registerTask('check', ['jshint'])
   grunt.registerTask('doc', ['jsdoc'])
   grunt.registerTask('test', ['nodeunit'])
   grunt.registerTask('default', ['jshint', 'jsdoc', 'concat', 'uglify', 'nodeunit'])
};
