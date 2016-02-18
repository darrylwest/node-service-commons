/**
 * @class AbstractApplicationFactoryTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 4:13 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    Logger = require( 'simple-node-logger' ).Logger,
    MockExpress = require( '../mocks/MockExpress' ),
    AbstractApplicationFactory = require( '../../lib/controllers/AbstractApplicationFactory' ),
    IndexPageService = require('../../lib/services/IndexPageService' ),
    WebStatusService = require('../../lib/services/WebStatusService' ),
    CommonValidator = require('../../lib/delegates/CommonValidator' ),
    MiddlewareDelegate = require('../../lib/delegates/MiddlewareDelegate' ),
    AbstractServiceFactory = require('../../lib/controllers/AbstractServiceFactory');

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
            dash.functionsIn( factory ).length.should.equal( methods.length );
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
        it('should create web services in list', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                opts = {},
                serviceFactory;

            opts.log = MockLogger.createLogger('ServiceFactory');
            opts.createLogger = MockLogger.createLogger;

            serviceFactory = new AbstractServiceFactory( opts );

            factory.createWebServices( serviceFactory, [ 'IndexPageService', 'WebStatusService' ]);
        });
    });

    describe('initAppDefaults', function() {
        it('should enable and disable app settings', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                app = new MockExpress();

            factory.initAppDefaults( app );

            app.enables.length.should.equal( 1 );
            app.disables.length.should.equal( 1 );
        });
    });

    describe('initMiddleware', function() {
        it('should create middleware and use in app', function() {
            var factory = new AbstractApplicationFactory( createOptions() ),
                app = new MockExpress();

            factory.initMiddleware( app );

            app.uses.length.should.equal( 5 );
        });
    });
});
