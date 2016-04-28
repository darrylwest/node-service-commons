/**
 * @class WebStatusServiceTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 2:49 PM
 */
const should = require('chai').should(),
    dash = require('lodash' ),
    MockExpress = require('../mocks/MockExpress' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    WebStatusService = require('../../lib/services/WebStatusService' );

describe('WebStatusService', function() {
    'use strict';

    const express = new MockExpress();

    const createOptions = function() {
        const opts = {};

        opts.log = MockLogger.createLogger('WebStatusService');
        opts.dataService = {};

        return opts;
    };

    describe('#instance', function() {
        const service = new WebStatusService( createOptions() ),
            methods = [
                'getWebStatus',
                'createWebStatus',
                'formatElapsedTime',
                'warningHandler',
                'initListeners',
                // inherited
                'query',
                'save',
                'find',
                'createSuccessResponse',
                'createFailedResponse',
                'createModelPayload',
                'createListPayload',
                'calculateDigest',
                'findIPAddress',
                'createNotFoundError'
            ];

        it('should create instance of WebStatusService', function() {
            should.exist( service );
            service.should.be.instanceof( WebStatusService );

            service.serviceName.should.equal( 'WebStatusService' );
            WebStatusService.SERVICE_NAME.should.equal( 'WebStatusService' );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('formatEllapsedTime', function() {
        const service = new WebStatusService( createOptions() );

        it('should format a duration between start and end', function() {
            let startDate = new Date("2016-01-01T00:00:00"),
                endDate = new Date("2016-01-10T00:00:00");

            let str = service.formatElapsedTime( startDate, endDate );

            str.should.equal("09 days+00:00:00");

            endDate = new Date("2016-01-25T02:45:02");
            str = service.formatElapsedTime( startDate, endDate );

            str.should.equal("24 days+02:45:02");
        });
    });
});
