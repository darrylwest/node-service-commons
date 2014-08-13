/**
 * @MockExpress
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 10:43 AM
 */
var httpMocks = require('express-mocks-http' );

var MockExpress = function() {
    'use strict';

    var mock = this;

    this.port = -1;
    this.routes = [];
    this.uses = [];
    this.enables = [];
    this.disables = [];

    this.get = function(path, fn) {
        mock.routes.push( { method:'get', path:path, fn:fn });
    };

    this.post = function(path, fn) {
        mock.routes.push( { method:'post', path:path, fn:fn });
    };

    this.put = function(path, fn) {
        mock.routes.push( { method:'put', path:path, fn:fn });
    };

    this.del = function(path, fn) {
        mock.routes.push({ method:'del', path:path, fn:fn });
    };

    this.enable = function(value) {
        mock.enables.push( value );
    };

    this.disable = function(value) {
        mock.disables.push( value );
    };

    this.use = function(obj) {
        mock.uses.push( obj );
    };

    this.listen = function(port) {
        mock.port = port;
    };

    this.createRequest = function(obj) {
        if (!obj.method) obj.method = 'GET';

        var request = httpMocks.createExpressRequest( obj );
        request.ip = '127.0.0.1';

        return request;
    };

    /**
     * create a response that will trigger a callback after 'end' to enable asynchronous tests
     *
     * @param callback - the testing callback, invoked after 'end'
     * @returns the mock response object
     */
    this.createResponse = function(callback) {
        var response = httpMocks.createExpressResponse();

        // TODO override send and json to set the statusCode

        if (typeof callback === 'function') {
            response.callEnd = response.end;
            response.end = function(data, encoding) {
                response.callEnd(data, encoding);

                callback.call();
            };
        }

        return response;
    };
};

module.exports = MockExpress;
