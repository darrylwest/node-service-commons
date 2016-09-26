/**
 * @class SocketMessageDelegate
 * 
 * @author darryl.west@raincitysoftware.com
 * @created 2016-09-26
 */
const should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    SocketMessageDelegate = require('../../lib/delegates/SocketMessageDelegate');

describe('SocketMessageDelegate', function() {
    'use strict';

    const createOptions = function() {
        const opts = {};
        opts.log = MockLogger.createLogger('SocketMessageDelegate');

        return opts;
    };

    describe('#instance', function() {
        const delegate = new SocketMessageDelegate( createOptions() ),
            methods = [
                'createRequestWrapper',
                'createMessageId',
                'createResponseWrapper',
                'createFailedWrapper'
            ];

        it('should create instance of SocketMessageDelegate', function() {
            should.exist( delegate );
            delegate.should.be.instanceof( SocketMessageDelegate );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( delegate ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                delegate[ method ].should.be.a( 'function' );
            });
        });
    });
});
