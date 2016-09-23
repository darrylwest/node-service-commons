/**
 * @class MiddlewareDelegate
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 10:12 AM
 */
const dash = require('lodash');

const MiddlewareDelegate = function(options) {
    'use strict';

    const delegate = this,
        log = options.log;

    let appkey = options.appkey,
        appkeyTimeout = options.appkeyTimeout,
        acceptedProtocols = options.acceptedProtocols,
        enableCORS = dash.isBoolean( options.enableCORS ) ? options.enableCORS : true,
        includeXAPIKey = dash.isBoolean( options.includeXAPIKey ) ? options.includeXAPIKey : true ,
        verifySecure = options.verifySecure,
        hostname = options.hostname;

    if (!appkeyTimeout) {
        appkeyTimeout = 20000;
    }

    /**
     * check the api/app key for a match; reject if no-match;
     *
     * curl -H 'x-api-key: <key>' ...
     *
     * @param request
     * @param response
     * @param next
     */
    this.checkAPIKey = function(request, response, next) {
        let key = request.headers[ 'x-api-key' ];

        if (includeXAPIKey && request.ip.indexOf('127.0.0.1') < 0) {
            if (key === appkey) {
                next();
            } else {
                log.warn(`x-api-key should match: ${appkey} != "${key}", url: ${request.url}`);
                log.error('REQUEST WITH INVALID KEY: ', key, ' FROM IP: ', request.ip);
                log.info('wait for timeout: ', appkeyTimeout);
                response.set('Content-Type', 'application/json');
                response.status( 406 );
                setTimeout(function() {
                    response.send(new Buffer(JSON.stringify({ "id":"wha?", "ip":request.ip })));
                }, appkeyTimeout );
            }
        } else {
            log.info('skip the x-api-key check');
            next();
        }
    };

    /**
     * forceSecure - forces a redirect to https when required and x-forwarded-proto exists
     */
    this.forceSecure = function(request, response, next) {
        const proto = request.headers[ 'x-forwarded-proto' ];

        if (verifySecure && proto === 'http' && request.ip.indexOf('127.0.0.1') < 0) {
            let host = request.hostname;
            if (!host || host.length < 3) {
                host = options.hostname;
            }

            let path = request.originalUrl;

            const url = `https://${host}${path}`;
            log.info('redirect to: ', url);

            response.redirect( url );
        } else {
            next();
        }
    };

    /**
     * allowCrossDomain - enables cross domain calls using CORS header settings
     *
     * @param request - http request
     * @param response - http response
     * @param next - what's next
     */
    this.allowCrossDomain = function(request, response, next) {
        if (enableCORS) {
            response.header( 'Access-Control-Allow-Origin', '*' );
            response.header( 'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,HEAD,OPTIONS' );
            response.header( 'Access-Control-Allow-Headers', 'Content-Type' );
        }

        next();
    };

    this.checkProtocol = function(request, response, next) {
        if (acceptedProtocols && acceptedProtocols.length > 0 && request.ip.indexOf('127.0.0.1') < 0) {
            if (dash.includes( acceptedProtocols, request.protocol )) {
                next();
            } else {
                log.warn('reject protocol: ', request.protocol);
                response.set('Content-Type', 'application/json');
                response.status( 406 );
                setTimeout(function() {
                    response.send(new Buffer(JSON.stringify({ "id":"rejected", "ip":request.ip })));
                }, 100 );
            }
        } else {
            next();
        }
    };

    /**
     * shutdown the service - must post directly to the listening port
     *
     * @param request
     * @param response
     * @param next
     */
    this.shutdown = function(request, response, next) {
        if (request.method === 'POST' && request.path === '/shutdown' && request.ip.indexOf('127.0.0.1' >= 0)) {
            log.info( "shutdown route: ", request.path, ', host: ', request.hostname );

            response.set('Content-Type', 'text/plain');
            response.send(new Buffer('shutting down...'));

            log.warn( "shutdown request scheduling process kill for pid: ", process.pid);

            process.nextTick(function() {
                console.log('>>>> killing process: ', process.pid);
                process.kill( process.pid );
            });
        } else {
            next();
        }
    };

    // constructor tests
    if (!log) {
        throw new Error('MiddlewareDelegate must be constructed with a log');
    }

    if (options.verifySecure && !hostname) {
        throw new Error('MiddlewareDelegate: if verifySecure is true, then you must supply a hostname');
    }
};

module.exports = MiddlewareDelegate;
