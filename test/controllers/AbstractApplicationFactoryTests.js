/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 4:13 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    Logger = require( 'simple-node-logger' ).Logger,
    AbstractApplicationFactory = require( '../../lib/controllers/AbstractApplicationFactory' ),
    IndexPageService = require('../../lib/services/IndexPageService' ),
    WebStatusService = require('../../lib/services/WebStatusService' ),
    CommonValidator = require('../../lib/delegates/CommonValidator' ),
    MiddlewareDelegate = require('../../lib/delegates/MiddlewareDelegate');

describe('AbstractApplicationFactory', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.logManager = MockLogger;
        opts.log = MockLogger.createLogger('AbstractApplicationFactory');

        return opts;
    };

    describe('#instance', function() {
        var factory = new AbstractApplicationFactory(),
            methods = [
                'createLogger',
                'createMiddlewareDelegate',
                'createCommonValidator',
                'addService',
                'findService',
                'getServices',
                'getConfiguration',
                'createIndexPageService',
                'createWebStatusService',
                'assignRoutes',
                'createRoutePath',
                'createWebServices',
                'initAppDefaults',
                'initMiddleware'
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

    describe('createIndexPageService', function() {
        it('should create the index page service', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                service = factory.createIndexPageService();

            should.exist( service );
            service.should.be.instanceof( IndexPageService );
        });
    });

    describe('createWebStatusService', function() {
        it('should create a web status service', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                service = factory.createWebStatusService();

            should.exist( service );
            service.should.be.instanceof( WebStatusService );
        });
    });

    describe('createCommonValidator', function() {
        it('should create an instance of common validator', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                delegate = factory.createCommonValidator();

            should.exist( delegate );
            delegate.should.be.instanceof( CommonValidator );
        });
    });

    describe('createMiddlewareDelegate', function() {
        it('should create an instance of middleware delegate', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                delegate = factory.createMiddlewareDelegate();

            should.exist( delegate );
            delegate.should.be.instanceof( MiddlewareDelegate );
        });
    });

    describe('createWebServices', function() {
        it('should create web services in list');
    });
});