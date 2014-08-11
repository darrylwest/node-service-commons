/**
 * @class WebStatusServiceTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 2:49 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockExpress = require('../mocks/MockExpress' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    WebStatusService = require('../../lib/services/WebStatusService' ),
    moment = require('moment');

describe('WebStatusService', function() {
    'use strict';

    var express = new MockExpress(),
        createOptions;

    createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('WebStatusService');

        return opts;
    };

    describe('#instance', function() {
        var service = new WebStatusService( createOptions() ),
            methods = [
                'getWebStatus',
                'createWebStatus',
                'formatElapsedTime',
                // inherited
                'createSuccessResponse',
                'createFailedResponse',
                'createModelPayload',
                'createListPayload',
                'calculateDigest',
                'findIPAddress'
            ];

        it('should create instance of WebStatusService', function() {
            should.exist( service );
            service.should.be.instanceof( WebStatusService );

            service.serviceName.should.equal( 'WebStatusService' );
            WebStatusService.SERVICE_NAME.should.equal( 'WebStatusService' );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a( 'function' );
            });
        });
    });

});
