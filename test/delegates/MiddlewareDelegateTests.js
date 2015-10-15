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
        opts.acceptedProtocols = [ 'http', 'https' ];

        return opts;
    };

    // mock response
    var Response = function() {
        var r = this,
            status,
            params = {},
            values = {};

        this.header = function(key, value) {
            values[ key ] = value;
        };

        this.status = function(value) {
            status = value;
        };
        this.getStatus = function() {
            return status;
        };
        this.setHeader = function(key, value) {
            values[ key ] = value;
        };
        this.getValues = function() { return values; };
        this.set = function(key, value) {
            params[ key ] = value;
        };
        this.getParams = function() {
            return params;
        };

        this.set = function() {

        };

        this.send = function() {

        };
    };

    describe('#instance', function() {
        var delegate = new MiddlewareDelegate( createOptions() ),
            methods = [
                'checkAPIKey',
                'allowCrossDomain',
                'checkProtocol',
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

        it('should verify the the app/api keys match', function(done) {
            var opts = createOptions(),
                response = new Response(),
                request = {
                    ip:'170.3.44.2',
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
                response = new Response(),
                request = {
                    ip:'170.3.44.2',
                    headers:{
                        'x-api-key':opts.appkey
                    }
                },
                next,
                delegate;

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
                response = new Response(),
                request = {
                    ip:'170.3.44.2',
                    headers:{
                        'x-api-key':opts.appkey
                    }
                },
                next,
                delegate;

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
        it('should set the response header and invoke next', function(done) {
            var response = new Response(),
                request = {
                    ip:'170.3.44.2'
                },
                next,
                delegate;

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

        it('should not set response header if disable cors is set in options', function(done) {
            var response = new Response(),
                request = {
                    ip:'170.3.44.2'
                },
                next,
                delegate;

            next = function() {
                done();
            };

            var options = createOptions();
            options.enableCORS = false;
            delegate = new MiddlewareDelegate( options );
            delegate.allowCrossDomain( request, response, next );

            var values = response.getValues();
            values.should.not.have.property( "Access-Control-Allow-Origin" );
            values.should.not.have.property( "Access-Control-Allow-Methods" );
            values.should.not.have.property( "Access-Control-Allow-Headers" );
        });
    });

    describe( 'checkProtocol', function() {
        it('should accept a qualified list of protocols', function(done) {
            var request = {
                    ip:'170.3.44.2',
                    protocol:'http'
                },
                response = new Response(),
                delegate = new MiddlewareDelegate( createOptions() ),
                next;

            next = function() {
                done();
            };

            delegate.checkProtocol(request, response, next);
        });

        it('should reject a non-qualified protocol', function(done) {
            var request = {
                    ip:'170.3.44.2',
                    protocol:'http'
                },
                response = new Response(),
                delegate = new MiddlewareDelegate( createOptions() ),
                next;

            response.send = function() {
                done();
            };

            request.protocol = 'xxx';
            delegate.checkProtocol(request, response, next);

            response.getStatus().should.equal( 406 );
        });
    });
});
