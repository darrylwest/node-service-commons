/**
 * @class AbstractWebService
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 1:54 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    crypto = require('crypto' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    TestDataset = require('../fixtures/TestDataset' ),
    ServiceResponse = require('../../lib/models/ServiceResponse' ),
    AbstractWebService = require('../../lib/services/AbstractWebService');

describe('AbstractWebService', function() {
    'use strict';

    var dataset = new TestDataset(),
        createOptions;

    createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('AbstractWebService');
        opts.algorithm = 'sha256';

        return opts;
    };

    describe('#instance', function() {
        var service = new AbstractWebService( createOptions() ),
            methods = [
                'createSuccessResponse',
                'createFailedResponse',
                'createModelPayload',
                'createListPayload',
                'calculateDigest',
                'findIPAddress'
            ];

        it('should create instance of AbstractWebService', function() {
            should.exist( service );
            service.should.be.instanceof( AbstractWebService );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a( 'function' );
            });
        });
    });

    describe( 'createSuccessResponse', function() {
        it( 'should create a success response', function() {
            var service = new AbstractWebService( createOptions() );

            var response = service.createSuccessResponse( 'mything', { a:'the a', b:'the b' } );

            should.exist( response );
            response.should.be.instanceof( ServiceResponse );

            response.should.have.property( 'status' );
            response.should.have.property( 'mything' );

            response.status.should.equal( ServiceResponse.OK );
        });
    });

    describe( 'createFailedResponse', function() {
        it( 'should create a failed response', function() {
            var service = new AbstractWebService( createOptions() );

            var response = service.createFailedResponse( 'myreason', 'web.status.broken' );

            should.exist( response );
            response.should.be.instanceof( ServiceResponse );

            response.should.have.property( 'status' );
            response.should.have.property( 'reason' );
            response.should.have.property( 'failCode' );

            response.status.should.equal( ServiceResponse.FAILED );
        });
    });

    describe( 'createModelPayload', function() {
        var service = new AbstractWebService( createOptions() ),
            session = '7D5C110A-B794-490A-B502-D79210139DCB';

        it( 'should create model or error payload', function() {
            var model = { id:1234, dateCreated:Date.now() },
                payload,
                hmac = crypto.createHmac( 'sha256', session ),
                code;

            hmac.update( JSON.stringify( model ) );
            code = hmac.digest( 'hex' );

            payload = service.createModelPayload( null, 'flarb', model, session );

            should.exist( payload );

            payload.hmac.should.equal( code );

            payload.status.should.equal( 'ok' );
            payload.ts.should.be.within( 1, Number.MAX_VALUE );
            payload.version.should.equal( '1.0' );

            should.exist( payload.flarb );
            payload.flarb.id.should.equal( model.id );
        });

        it( 'should create an error payload', function() {
            var err = new Error('my test error');

            var payload = service.createModelPayload( err, 'flarb', null );

            should.exist( payload );
            payload.status.should.equal('failed');
            payload.ts.should.be.within( 1, Number.MAX_VALUE );
            should.exist( payload.reason );
            should.exist( payload.failCode );
        });
    });

    describe( 'createListPayload', function() {
        var service = new AbstractWebService( createOptions() ),
            session = '7D5C110A-B794-490A-B502-D79210139DCB';

        it( 'should create list payload', function() {
            var list = dataset.createModelList(20, dataset.createBaseModelParams),
                payload,
                hmac = crypto.createHmac( 'sha256', session ),
                code;

            hmac.update( JSON.stringify( list ) );
            code = hmac.digest( 'hex' );

            payload = service.createListPayload( null, 'flarbs', list, session );

            should.exist( payload );

            payload.hmac.should.equal( code );

            payload.status.should.equal( 'ok' );
            payload.ts.should.be.within( 1, Number.MAX_VALUE );
            payload.version.should.equal( '1.0' );

            should.exist( payload.flarbs );
            payload.flarbs.should.equal( list );
        });

        it( 'should create an error payload', function() {
            var err = new Error('my test error');

            var payload = service.createListPayload( err, 'flarbs', null );

            should.exist( payload );
            payload.status.should.equal('failed');
            payload.ts.should.be.within( 1, Number.MAX_VALUE );
            should.exist( payload.reason );
            should.exist( payload.failCode );
        });
    });

    describe( 'calculateDigest', function() {
        var service = new AbstractWebService( createOptions() ),
            list = dataset.createModelList(20, dataset.createBaseModelParams);

        it('should calculate a digest for a know object', function() {
            var json = JSON.stringify( list ),
                session = '7D5C110A-B794-490A-B502-D79210139DCB',
                hmac = crypto.createHmac( 'sha256', session ),
                refcode,
                code,
                payload;

            hmac.update( json );
            refcode = hmac.digest( 'hex' );

            code = service.calculateDigest( list, session );

            code.should.equal( refcode );
        });
    });

    describe( 'findIPAddress', function() {
        var service = new AbstractWebService( createOptions() );

        it('should find the correct ip address', function() {
            var req = {
                ip:'127.0.0.1',
                ips:[ '127.0.0.1', '206.43.23.204' ]
            };

            var ip = service.findIPAddress( req );

            ip.should.equal( '206.43.23.204' );
        });
    });
});
