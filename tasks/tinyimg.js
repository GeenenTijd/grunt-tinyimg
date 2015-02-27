'use strict';

module.exports = function (grunt) {

    var path = require('path');
    var async = require('async');
    var fs = require('fs');
    var filesize = require('filesize');

    var png = require('./png');
    var jpg = require('./jpg');
    var svg = require('./svg');

    function optimizeFile(file, callback) {

        var src = file.src;
        var dest = file.dest;

        var extension = path.extname(file.src).toLowerCase();
        var process = null;
        if (extension === '.png') {
            grunt.file.copy(src, dest);
            process = png(dest);
        } else if (extension === '.jpg' || extension === '.jpeg') {
            process = jpg(dest, src);
        } else if (extension === '.svg') {
            grunt.file.copy(src, dest);
            process = svg(dest);
        } else {
            callback(new Error('Invalid image type.'));
        }

        grunt.util.spawn(process, function (err) {

            if (err) {
                grunt.log.warn(src + ' - Failed!');
                return callback(err);
            }

            var oldFile = fs.statSync(src).size;
            var newFile = fs.statSync(dest).size;
            var savings = Math.floor((oldFile - newFile) / oldFile * 100);

            grunt.log.writeln('Optimized ' + dest.cyan +
                ' [saved ' + savings + ' % - ' + filesize(oldFile, 1, false) + ' → ' + filesize(newFile, 1, false) + ']');

            callback();
        });
    }

    function optimizeFiles(gruntFiles, callback) {

        var queue = async.queue(optimizeFile, 4);

        queue.drain = callback;

        gruntFiles.forEach(function (f) {
            var dest = f.dest;
            var files = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function (filepath) {
                return {
                    src: filepath,
                    dest: dest
                };
            });

            if (files.length === 0) {
                grunt.log.writeln('No images were found in this path(s): ' + f.orig.src.join(', '));
            }
            queue.push(files);
        });
    }

    grunt.registerMultiTask('tinyimg', 'Optimize png, jpg and svg images.', function () {
        optimizeFiles(this.files, this.async());
    });
};