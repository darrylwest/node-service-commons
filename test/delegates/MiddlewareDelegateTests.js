/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 10:12 AM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    MiddlewareDelegate = require('../../lib/delegates/MiddlewareDelegate');

describe('MiddlewareDelegate', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = new MockLogger.createLogger('MiddlewareDelegate');
        opts.appkey = 'ae3b1d1c-7a44-45f6-82f5-0a4eb789ae10';

        return opts;
    };

    describe('#instance', function() {
        var delegate = new MiddlewareDelegate( createOptions() ),
            methods = [
                'checkAPIKey',
                'allowCrossDomain',
                'shutdown'
            ];

        it('should create instance of MiddlewareDelegate', function() {
            should.exist( delegate );
            delegate.should.be.instanceof( MiddlewareDelegate );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( delegate ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                delegate[ method ].should.be.a( 'function' );
            });
        });
    });

    describe('checkAPIKey', function() {
        var Response = function() {
            var r = this,
                httpStatus,
                values = {};

            this.header = function(key, value) {
                values[ key ] = value;
            };

            this.status = function(n) {
                httpStatus = n;
            };

            this.setHeader = this.header;
            this.getValues = function() { return values; };

            this.set = function(value) {

            };

            this.send = function() {

            };
        };

        it('should verify the the app/api keys match', function(done) {
            var opts = createOptions(),
                response,
                request = {
                    headers:{
                        'x-api-key':opts.appkey
                    }
                },
                next,
                delegate;

            response = new Response();

            next = function() {
                done();
            };

            // opts.appkeyTimeout = 50;
            delegate = new MiddlewareDelegate( opts );
            delegate.checkAPIKey( request, response, next );
        });

        it('should reject a request with a bad api key', function(done) {
            var opts = createOptions(),
                response,
                request = {
                    headers:{
                        'x-api-key':opts.appkey
                    }
                },
                next,
                delegate;

            response = new Response();
            response.send = function() {
                done();
            };

            next = function() {
                should.equal( false );
            };

            opts.appkeyTimeout = 50;
            opts.appkey = 'bad-request-key';
            delegate = new MiddlewareDelegate( opts );
            delegate.checkAPIKey( request, response, next );
        });

        it('should ignore the API key mismatch on option set', function(done) {
            var opts = createOptions(),
                response,
                request = {
                    headers:{
                        'x-api-key':opts.appkey
                    }
                },
                next,
                delegate;

            response = new Response();
            next = function() {
                done();
            };

            opts.appkeyTimeout = 50;
            opts.appkey = 'bad-request-key';
            opts.includeXAPIKey = false;
            delegate = new MiddlewareDelegate( opts );
            delegate.checkAPIKey( request, response, next );
        });
    });

    describe( 'allowCrossDomain', function() {
        // mock response
        var Response = function() {
            var r = this,
                values = {};

            this.header = function(key, value) {
                values[ key ] = value;
            };

            this.setHeader = this.header;
            this.getValues = function() { return values; };
        };

        it('should set the response header and invoke next', function(done) {
            var response,
                request = {},
                next,
                delegate;

            response = new Response();
            next = function() {
                done();
            };

            delegate = new MiddlewareDelegate( createOptions() );
            delegate.allowCrossDomain( request, response, next );

            var values = response.getValues();
            values.should.have.property( "Access-Control-Allow-Origin" );
            values.should.have.property( "Access-Control-Allow-Methods" );
            values.should.have.property( "Access-Control-Allow-Headers" );
        });
    });
});
