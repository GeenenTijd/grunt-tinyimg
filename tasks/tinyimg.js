'use strict';

var path = require('path');
var async = require('async');
var fs = require('fs');
var filesize = require('filesize');
var tmp = require('tmp');

var png = require('./png');
var jpg = require('./jpg');
var SVGO = require('svgo');

module.exports = function (grunt) {

    var svgo = new SVGO({});
    var total = 0;

    function optimizeFile(file, callback) {

        var src = file.src;
        var dest = file.dest;

        var extension = path.extname(file.src).toLowerCase();

        tmp.tmpName({
            postfix: extension
        }, function (error, tmpDest) {

            var next = function (err) {

                if (err) {
                    grunt.file.copy(src, dest);
                    grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
                    return callback(err);
                }

                var oldFile = fs.statSync(src).size;
                var newFile = fs.statSync(tmpDest).size;
                var savings = Math.floor((oldFile - newFile) / oldFile * 100);

                if (newFile < oldFile) {
                    total += oldFile - newFile;
                    grunt.file.copy(tmpDest, dest);
                    grunt.log.writeln('Optimized ' + dest.cyan +
                        ' [saved ' + savings + ' % - ' + filesize(oldFile, 1, false) + ' → ' + filesize(newFile, 1, false) + ']');
                } else {
                    grunt.file.copy(src, dest);
                    grunt.log.writeln('Skipped ' + dest.cyan + ' [no savings]');
                }

                callback();
            };

            if (extension === '.png') {
                grunt.file.copy(src, tmpDest);
                grunt.util.spawn(png(tmpDest), next);
            } else if (extension === '.jpg' || extension === '.jpeg') {
                grunt.util.spawn(jpg(tmpDest, src), next);
            } else if (extension === '.svg') {
                fs.readFile(src, 'utf8', function (err, data) {
                    if (err) {
                        next(err);
                    }
                    svgo.optimize(data, function (result) {
                        if (result.error) {
                          return next(new Error(result.error));
                        }
                        fs.writeFile(tmpDest, result.data, next);
                    });
                });
            } else {
                callback(new Error('Invalid image type.'));
            }
        });
    }

    function optimizeFiles(gruntFiles, callback) {

        var queue = async.queue(optimizeFile, 4);

        queue.drain = function () {

            grunt.log.writeln('Total savings: ' + filesize(total, 1, false).green);

            callback();
        };

        gruntFiles.forEach(function (f) {
            var dest = f.dest;
            var files = f.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('\nSource file "' + filepath + '" not found.');
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
