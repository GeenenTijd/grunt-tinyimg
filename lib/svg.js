'use strict';

var fs = require('fs');
var SVGO = require('svgo');
var svgo = new SVGO({});

module.exports = function optimzeSvg(dest, src, next) {

  fs.readFile(src, 'utf8', function read(err, data) {
    if (err) {
      return next(err);
    }

    svgo.optimize(data, function(result) {

      if (result.error) {
        return next(new Error(result.error));
      }

      fs.writeFile(dest, result.data, 'utf8', next);
    });
  });

};
