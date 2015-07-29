'use strict';

var path = require('path');
var async = require('async');
var fs = require('fs');
var filesize = require('filesize');
var tmp = require('tmp');

var png = require('../lib/png');
var jpg = require('../lib/jpg');
var svg = require('../lib/svg');

module.exports = function(grunt) {

  var total = 0;

  function optimizeFile(file, callback) {

    var src = file.src;
    var dest = file.dest;

    var extension = path.extname(file.src).toLowerCase();

    tmp.tmpName({
      postfix: extension
    }, function(error, tmpDest) {

      if (error || !tmpDest) {

        // Copy original to destination
        grunt.file.copy(src, dest);
        grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
        grunt.log.error('Failed to create temporary file.');

        return callback(error);
      }

      function next(err) {

        if (err) {

          // Copy original to destination
          grunt.file.copy(src, dest);
          grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
          grunt.log.error(err.message);

          console.log(err);

          return callback(err);
        }

        var oldFile = fs.statSync(src).size;
        var newFile = fs.statSync(tmpDest).size;
        var savings = Math.floor((oldFile - newFile) / oldFile * 100);

        // Only copy the temp file if it's smaller than the original
        if (newFile < oldFile) {
          total += oldFile - newFile;
          grunt.file.copy(tmpDest, dest);
          grunt.log.writeln('Optimized ' + dest.cyan +
              ' [saved ' + savings + ' % - ' + filesize(oldFile, 1, false) + ' → ' + filesize(newFile, 1, false) + ']');
        } else {
          grunt.file.copy(src, dest);
          grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
        }

        return callback();
      }

      if (extension === '.png') {
        png(tmpDest, src, next);
      } else if (extension === '.jpg' || extension === '.jpeg') {
        jpg(tmpDest, src, next);
      } else if (extension === '.svg') {
        svg(tmpDest, src, next);
      } else {
        grunt.log.writeln(src.cyan + ' not supported.');
        return callback();
      }
    });
  }

  function optimizeFiles(gruntFiles, callback) {

    var queue = async.queue(optimizeFile, 4);

    queue.drain = function() {
      grunt.log.writeln('Total savings: ' + filesize(total, 1, false).green);
      return callback();
    };

    gruntFiles.forEach(function(f) {
      var dest = f.dest;
      var files = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('\nSource file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return {
          src: filepath,
          dest: dest
        };
      });

      if (files.length === 0) {
        grunt.log.writeln('No images were found for given path(s): ' + f.orig.src.join(', '));
        return callback();
      }

      queue.push(files);
    });
  }

  grunt.registerMultiTask('tinyimg', 'Optimize png, jpg and svg images.', function() {
    optimizeFiles(this.files, this.async());
  });
};
