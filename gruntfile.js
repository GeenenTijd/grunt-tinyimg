module.exports = function (grunt) {
    grunt.initConfig({

        jshint: {
            options: {
                node: true,
                globalstrict: true
            },
            all: ['tasks/**/*.js']
        },

        tinyimg: {
            static: {
                options: {},
                files: {
                    'tmp/test.png': 'test/fixtures/test.png',
                    'tmp/test.jpg': 'test/fixtures/test.jpg',
                    'tmp/test.svg': 'test/fixtures/test.svg',
                    'tmp/test-uppercase.PNG': 'test/fixtures/test-uppercase.PNG',
                    'tmp/test-uppercase.JPG': 'test/fixtures/test-uppercase.JPG',
                    'tmp/test-uppercase.SVG': 'test/fixtures/test-uppercase.SVG'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('tasks');
};