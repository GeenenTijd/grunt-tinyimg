'use strict';

module.exports = function (dest) {
    return {
        cmd: __dirname + '/../node_modules/svgo/bin/svgo',
        args: [dest, dest]
    };
};