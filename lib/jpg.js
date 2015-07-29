'use strict';

var execFile = require('child_process').execFile;
var mozjpeg = require('mozjpeg');

module.exports = function optimizeJpg(dest, src, next) {

  execFile(mozjpeg, ['-outfile', dest, src], next);

};
