# grunt-tinyimg

## About

Optimize PNG, JPEG, SVG images with grunt task. This plugin uses pngquant for png images, mozjpeg for jpegs and svgo for svg files. Inspired by grunt-pngmin.

The reason this plugin is created is because most image optimization plugins either don't compress images decently or are terribly slow in doing so. The intention is to have a fast compression plugin without bells and whistles.

## Install

```sh
$ npm install --save-dev grunt-tinyimg
```

## Usage

This is an example of `gruntfile.js`.

```js
module.exports = function (grunt) {
  grunt.initConfig({
    tinyimg: {
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
