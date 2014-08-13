/**
 * @class AbstractServiceFactoryTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/13/14 9:07 AM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    AbstractServiceFactory = require('../../lib/controllers/AbstractServiceFactory' ),
    IndexPageService = require( '../../lib/services/IndexPageService' ),
    WebStatusService = require( '../../lib/services/WebStatusService' );

describe('AbstractServiceFactory', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('AbstractServiceFactory');
        opts.createLogger = MockLogger.createLogger;

        return opts;
    };

    describe('#instance', function() {
        var factory = new AbstractServiceFactory( createOptions() ),
            methods = [
                'createIndexPageService',
                'createWebStatusService'
            ];

        it('should create an instance of AbstractServiceFactory', function() {
            should.exist( factory );
            factory.should.be.instanceof( AbstractServiceFactory );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( factory ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                factory[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('createIndexPageService', function() {
        it('should create the index page service', function() {
            var factory = new AbstractServiceFactory( createOptions() ),
                service = factory.createIndexPageService();

            should.exist( service );
            service.should.be.instanceof( IndexPageService );
        });
    });

    describe('createWebStatusService', function() {
        it('should create a web status service', function() {
            var factory = new AbstractServiceFactory( createOptions() ),
                service = factory.createWebStatusService();

            should.exist( service );
            service.should.be.instanceof( WebStatusService );
        });
    });
});
