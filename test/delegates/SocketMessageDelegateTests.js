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

    const MockSocket = function(err) {
        const mock = this;

        this.messages = [];

        this.send = function(wrapper, callback) {
            mock.messages.push( wrapper );
            callback( err, wrapper.mid );
        };
    };

    const createOptions = function() {
        const opts = {};
        opts.log = MockLogger.createLogger('SocketMessageDelegate');

        return opts;
    };

    describe('#instance', function() {
        const delegate = new SocketMessageDelegate( createOptions() ),
            methods = [
                'sendSocketMessage',
                'createRequestWrapper',
                'createMessageId',
                'createResponseWrapper',
                'createFailedWrapper',
                'getMessageCount',
                'getOrigin'
            ];

        it('should create instance of SocketMessageDelegate', function() {
            should.exist( delegate );
            delegate.should.be.instanceof( SocketMessageDelegate );
            delegate.getMessageCount().should.equal( 0 );
            should.exist( delegate.getOrigin() );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( delegate ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                delegate[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('sendSocketMessage', function() {
        const delegate = new SocketMessageDelegate( createOptions() ),
            mockSocket = new MockSocket();

        it('should send the wrapped message and return the message id', done => {
            const msg = delegate.createRequestWrapper();
            const callback = function(err, id) {
                should.not.exist( err );
                should.exist( id );

                id.should.equal( msg.mid );

                done();
            };

            delegate.sendSocketMessage( mockSocket, msg, callback );
        });
    });

    describe('createMessageId', function() {
        const delegate = new SocketMessageDelegate( createOptions() );

        it('should return a generated message id', function() {
            const m1 = delegate.createMessageId();

            should.exist( m1 );
            m1.length.should.equal( 26 );
            delegate.getMessageCount().should.equal( 1 );

            const m2 = delegate.createMessageId();
            m2.should.not.equal( m1 );
            delegate.getMessageCount().should.equal( 2 );
        });
    });

    describe('#getters', function() {
        const delegate = new SocketMessageDelegate( createOptions() );

        it('should return the origin', function() {
            const origin = delegate.getOrigin();

            should.exist( origin );
            origin.length.should.equal( 9 );
        });

        it('should return the message count', function() {
            delegate.getMessageCount().should.equal( 0 );
            delegate.createRequestWrapper();
            delegate.getMessageCount().should.equal( 1 );
            delegate.createRequestWrapper();
            delegate.getMessageCount().should.equal( 2 );
        });
    });

    describe('#wrappers', function() {
        const delegate = new SocketMessageDelegate( createOptions() );

        it('should return a standard request wrapper', function() {
            const wrapper = delegate.createRequestWrapper();
            should.exist( wrapper );
            should.exist( wrapper.mid );
            should.exist( wrapper.ts );
            Object.keys( wrapper ).length.should.equal( 2 );
        });

        it('should return a standard response wrapper', function() {
            const wrapper = delegate.createResponseWrapper('1234');
            should.exist( wrapper );
            wrapper.mid.should.equal( '1234' );
            should.exist( wrapper.ts );
            wrapper.status.should.equal( 'ok' );
        });

        it('should return a standard failed wrapper', function() {
            const wrapper = delegate.createFailedWrapper('1234');
            should.exist( wrapper );
            wrapper.mid.should.equal( '1234' );
            should.exist( wrapper.ts );
            wrapper.status.should.equal( 'failed' );
        });

        it('should return a standard failed wrapper with reason', function() {
            const wrapper = delegate.createFailedWrapper('1234', 'because');
            should.exist( wrapper );
            wrapper.mid.should.equal( '1234' );
            should.exist( wrapper.ts );
            wrapper.status.should.equal( 'failed' );
            wrapper.reason.should.equal( 'because' );
        });
    });
});
