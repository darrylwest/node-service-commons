/**
 * @class IndexPageServiceTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 2:41 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockExpress = require('../mocks/MockExpress' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    IndexPageService = require('../../lib/services/IndexPageService');

describe('IndexPageService', function() {
    'use strict';

    var express = new MockExpress(),
        createOptions;
    
    createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('IndexPageService');

        return opts;
    };

    describe('#instance', function() {
        var service = new IndexPageService( createOptions() ),
            methods = [
                'createIndexPage',
                'getIndexPage'
            ];

        it('should create instance of IndexPageService', function() {
            should.exist( service );
            service.should.be.instanceof( IndexPageService );

            service.serviceName.should.equal( 'IndexPageService' );
            IndexPageService.SERVICE_NAME.should.equal( 'IndexPageService' );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a( 'function' );
            });
        });
    });

    describe( 'createIndexPage', function() {
        it( 'should return the index page', function() {
            var service = new IndexPageService( createOptions() );

            var page = service.createIndexPage();
            should.exist( page );
            page.should.be.a('string');

        });
    });

    describe( 'getIndexPage', function() {
        it( 'should create an http response', function() {
            var service = new IndexPageService( createOptions() );

            var request = express.createRequest({
                method:'GET',
                url:'/',
                params: {}
            });

            var response = express.createResponse();

            service.getIndexPage( request, response );

            var body = response._getData();
            should.exist( body );

            // check for the basics
            body.length.should.be.above( 20 );
            body.indexOf('Version' ).should.be.above( 20 );
            body.indexOf('Copyright' ).should.be.above( 10 );

            // express sets this, so we need a better express mock
            // response.statusCode.should.equal( 200 );

        });
    });

    describe( 'routes', function() {
        it( 'should have routes', function() {
            var service = new IndexPageService( createOptions() );

            service.routes.length.should.equal( 1 );
            var route = service.routes[0];

            route.should.have.property('method');
            route.should.have.property('path');
            route.should.have.property('fn');

            route.method.should.equal('get');
            route.path.should.equal('/');
            route.fn.should.equal( service.getIndexPage );
        });
    });
});
