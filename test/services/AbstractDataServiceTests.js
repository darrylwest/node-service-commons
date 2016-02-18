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
                'query',
                'save',
                'find',
                'parseInt'
            ];

        it('should create instance of AbstractDataService', function() {
            should.exist( service );
            service.should.be.instanceof( AbstractDataService );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( service ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                service[ method ].should.be.a( 'function' );
            });
        });
    });

    describe("parseInt", function() {
        var service = new AbstractDataService( createOptions() );

        it("should parse integers and return values", function() {
            var list = [ 23, '44', '22', 54443 ];

            list.forEach(function(value) {
                var n = service.parseInt( value, 1 );
                n.should.equal( Number( value ));
            });
        });

        it("should fail parse of non-numbers and return defaults", function() {
            var list = [ 'zzz', 'z432L', 'abba' ],
                dflt = 9999;

            list.forEach(function(value) {
                var n = service.parseInt( value, dflt );
                n.should.equal( dflt );
            });
        });
    });
});
