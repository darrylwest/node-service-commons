/**
 * @class AbstractWebService
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 1:54 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    AbstractWebService = require('../../lib/services/AbstractWebService');

describe('AbstractWebService', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('AbstractWebService');

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
});
