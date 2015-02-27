'use strict';

var pngquant = require('pngquant-bin').path;

module.exports = function (dest) {
    return {
        cmd: pngquant,
        args: ['--force', '--ext=.png', dest]
    };
};