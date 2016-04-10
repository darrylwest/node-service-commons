/**
 * Standard Server Gruntfile
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 2014-08-06
 */
module.exports = function(grunt) {
    'use strict';

    var mochaReporter = process.env.reporter || 'nyan';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        dirs: {
            lib:'lib',
            bin:'bin',
            test: 'test'
        },
        watch:{
            scripts:{
                files:[
                    'index.js',
                    '<%= dirs.lib %>/*.js',
                    '<%= dirs.lib %>/*/*.js',
                    '<%= dirs.bin %>/*.js',
                    '<%= dirs.test %>/*.js',
                    '<%= dirs.test %>/*/*.js'
                ],
                tasks: [
                    'mochaTest',
                    'jshint'
                ],
                options:{
                    spawn: true
                }
            }
        },
        jshint: {
            options:{
                jshintrc: '.jshintrc',
                verbose: true,
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'index.js',
                '<%= dirs.lib %>/*.js',
                '<%= dirs.lib %>/*/*.js',
                '<%= dirs.bin %>/*.js',
                '<%= dirs.test %>/*.js',
                '<%= dirs.test %>/*/*.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: mochaReporter
                },
                src: [
                    '<%= dirs.test %>/*.js',
                    '<%= dirs.test %>/*/*.js'
                ]
            }
        },
        jsdoc: {
            dist:{
                src:[
                    '<%= dirs.lib %>/*/*.js'
                ],
                options:{
                    destination:'jsdoc'
                }
            }
        }
    });

    grunt.registerTask('watchall', [
        'mochaTest',
        'jshint',
        'watch'
    ]);

    grunt.registerTask('test', [
        'mochaTest',
        'jshint'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'mochaTest',
        'validate-package',
        'jsdoc'
    ]);
};

