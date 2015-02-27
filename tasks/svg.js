'use strict';

module.exports = function (dest) {
    return {
        cmd: './node_modules/svgo/bin/svgo',
        args: [dest, dest]
    };
};