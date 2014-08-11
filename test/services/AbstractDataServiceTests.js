/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 1:44 PM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    AbstractDataService = require('../../lib/services/AbstractDataService');

describe('AbstractDataService', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('AbstractDataService');

        return opts;
    };

    describe('#instance', function() {
        var service = new AbstractDataService( createOptions() ),
            methods = [
                'parseInt'
            ];

        it('should create instance of AbstractDataService', function() {
            should.exist( service );
            service.should.be.instanceof( AbstractDataService );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a( 'function' );
            });
        });
    });
});
