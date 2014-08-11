/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:53 AM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    ServiceResponse = require('../../lib/models/ServiceResponse');

describe( 'ServiceResponse', function() {
    'use strict';
    
    describe( '#instance', function() {
        it( 'should be a ServiceResponse instance', function() {
            var response = new ServiceResponse();

            should.exist( response );
            response.should.have.property( 'status' );
            response.should.have.property( 'ts' );
            response.should.have.property( 'version' );

            response.status.should.equal( 'ok' );
            response.version.should.equal( '1.0' );
            response.ts.should.be.above( Date.now() - 100 );
            response.ts.should.be.below( Date.now() + 100 );

            ServiceResponse.OK.should.equal( 'ok' );
            ServiceResponse.FAILED.should.equal( 'failed' );

        });
    });

    describe( '#failed-instance', function() {
        it( 'should have status of failed', function() {
            var reason = 'just because';
            var response = ServiceResponse.createFailedResponse( reason );

            should.exist( response );
            response.should.have.property( 'status' );
            response.should.have.property( 'reason' );
            response.should.have.property( 'failCode' );

            response.status.should.equal( 'failed' );
            response.version.should.equal( '1.0' );
            response.reason.should.equal( reason );
            response.failCode.should.equal( 'unknown' );
        });
    });
});