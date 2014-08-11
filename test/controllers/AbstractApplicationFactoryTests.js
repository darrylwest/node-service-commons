/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 4:13 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    Logger = require( 'simple-node-logger' ).Logger,
    AbstractApplicationFactory = require( '../../lib/controllers/AbstractApplicationFactory' );

describe('AbstractApplicationFactory', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        return opts;
    };

    describe('#instance', function() {
        var factory = new AbstractApplicationFactory(),
            methods = [
                'createLogger',
                'createMiddlewareDelegate',
                'createValidator',
                'addService',
                'findService',
                'getServices',
                'createIndexPageService',
                'createWebStatusService',
                'assignRoutes',
                'createRoutePath'
            ];

        it('should create instance of AbstractApplicationFactory', function() {
            should.exist( factory );
            factory.should.be.instanceof( AbstractApplicationFactory );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( factory ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                factory[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('createLogger', function() {
        it('should create a simple console logger with specified level', function() {
            var factory = new AbstractApplicationFactory(),
                log = factory.createLogger( 'Test', 'debug' );

            should.exist( log );
            log.should.be.instanceof( Logger );
            log.getLevel().should.equal('debug');
        });

        it('should create a simple console logger with default level', function() {
            var factory = new AbstractApplicationFactory(),
                log = factory.createLogger( 'Test' );

            should.exist( log );
            log.should.be.instanceof( Logger );
            log.getLevel().should.equal('info');
        });
    });
});