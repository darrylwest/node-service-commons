/**
 * @ServiceRouteTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:28 AM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    ServiceRoute = require('../../lib/models/ServiceRoute');

describe('ServiceRoute', function() {
    'use strict';

    var noop = function() { };

    describe( '#instance', function() {
        it('should be a minimal instance of ServiceRoute', function() {
            var route = new ServiceRoute();

            should.exist( route );
            route.should.have.property( 'method' );
            route.should.have.property( 'path' );
            route.should.have.property( 'fn' );
        });

        it('should be a full instance of ServiceRoute', function() {
            var route = new ServiceRoute({ path:'/', fn:noop });

            should.exist( route );
            route.should.have.property( 'method' );
            route.should.have.property( 'path' );
            route.should.have.property( 'fn' );
        });

        it('should be a fully constructed instance of ServiceRoute', function() {
            var route = ServiceRoute.create( 'get', '/', noop );

            should.exist( route );
            route.should.have.property( 'method' );
            route.should.have.property( 'path' );
            route.should.have.property( 'fn' );

            route.method.should.equal( 'get' );
            route.path.should.equal( '/' );
            route.fn.should.equal( noop );
        });
    });
});
