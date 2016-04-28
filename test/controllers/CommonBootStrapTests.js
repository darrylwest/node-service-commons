/**
 * @class CommonBootStrapTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 3:40 PM
 */
const should = require('chai').should(),
    dash = require('lodash' ),
    CommonBootStrap = require( '../../lib/controllers/CommonBootStrap' );

describe('CommonBootStrap', function() {
    'use strict';

    let logfile = '/tmp/junk.log',
        createCommandLine;

    createCommandLine = function(env) {
        if (!env) {
            env = 'test';
        }

        const args = [
            "/usr/local/bin/node",
            "/response-averages/app/app.js",
            "--env",
            env
        ];

        return args;
    };

    describe( '#instance', function() {
        const bootStrap = new CommonBootStrap( 'test-version' ),
            methods = [
                'getParser',
                'parseCommandLine'
            ];

        it( 'should be instance of CommonBootStrap', function() {
            should.exist( bootStrap );
            bootStrap.should.be.instanceof( CommonBootStrap );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( bootStrap ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                bootStrap[ method ].should.be.a( 'function' );
            });
        });
    });

    describe( 'parseCommandLine', function() {
        it( 'should parse the command line to set options', function() {

            const args = createCommandLine('test');
            const bootStrap = new CommonBootStrap( 'test-version' );

            const options = bootStrap.parseCommandLine( args );

            should.exist( options );

            // console.log( options.version() );

            options.should.have.property( 'env' );
            options.should.have.property( 'logfile' );
            should.not.exist( options.configfile );
            options.should.have.property( 'version' );

            options.env.should.equal( 'test' );
            options.logfile.should.equal( 'node-service-' + process.pid + '.log' );
            options.version().should.equal( 'test-version' );

        });
    });

    describe( 'parseLogFile', function() {
        it( 'should parse the command line log file', function() {

            var args = createCommandLine('testa');
            var bootStrap = new CommonBootStrap( 'test-versiona' );

            args.push( '--logfile' );
            args.push( logfile );

            var options = bootStrap.parseCommandLine( args );

            should.exist( options );

            // console.log( options.version() );

            options.should.have.property( 'env' );
            options.should.have.property( 'logfile' );
            options.should.have.property( 'version' );

            options.env.should.equal( 'testa' );
            options.logfile.should.equal( logfile );
            options.version().should.equal( 'test-versiona' );

        });
    });

    describe( 'parseConfigFile', function() {
        it( 'should parse the command line config file', function() {

            var args = createCommandLine('testa');
            var bootStrap = new CommonBootStrap( 'test-versiona' );

            args.push( '--configfile' );
            args.push( 'vendor-config.json' );

            var options = bootStrap.parseCommandLine( args );

            should.exist( options );

            // console.log( options.version() );

            options.should.have.property( 'env' );
            options.should.have.property( 'logfile' );
            options.should.have.property( 'configfile' );
            options.should.have.property( 'version' );

            options.env.should.equal( 'testa' );
            options.configfile.should.equal( 'vendor-config.json' );
            options.version().should.equal( 'test-versiona' );

        });
    });

});
