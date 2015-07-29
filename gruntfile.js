'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      options: {
        node: true,
        globalstrict: true
      },
      all: ['tasks/**/*.js']
    },

    tinyimg: {
      static: {
        files: {
          'tmp/test.png': 'test/fixtures/test.png',
          'tmp/test.jpg': 'test/fixtures/test.jpg',
          'tmp/test.svg': 'test/fixtures/test.svg',
          'tmp/test-uppercase.PNG': 'test/fixtures/test-uppercase.PNG',
          'tmp/test-uppercase.JPG': 'test/fixtures/test-uppercase.JPG',
          'tmp/test-uppercase.SVG': 'test/fixtures/test-uppercase.SVG'
        }
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: 'test/fixtures',
          src: ['**/*.{png,jpg,svg}'],
          dest: 'tmp/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadTasks('tasks');
};
