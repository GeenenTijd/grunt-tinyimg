'use strict';

var mozjpeg = require('mozjpeg').path;

module.exports = function (dest, src) {
    return {
        cmd: mozjpeg,
        args: ['-optimize', '-progressive', '-outfile', dest, src]
    };
};