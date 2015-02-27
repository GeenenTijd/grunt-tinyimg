# [grunt-image](https://npmjs.org/package/grunt-image)

## About

Optimize PNG, JPEG, SVG images with grunt task. This plugin uses pngquant for png images, mozjpeg for jpegs and svgo for svg files.

## Install

```sh
$ npm install --save-dev grunt-tinyimg
```

## Usage

This is an example of `gruntfile.js`.

```js
module.exports = function (grunt) {
  grunt.initConfig({
    image: {
      static: {
        files: { 
          'dist/img.png': 'src/img.png',
          'dist/img.jpg': 'src/img.jpg',
          'dist/img.svg': 'src/img.svg'
        }
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/', 
          src: ['**/*.{png,jpg,svg}'],
          dest: 'dist/'
        }]
      }
    }
  });
    
  grunt.loadNpmTasks('grunt-tinyimg');
};
```

## License

MIT
