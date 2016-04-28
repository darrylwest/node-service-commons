/**
 * @class ServiceRoute
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:25 AM
 */
const ServiceRoute = function( opts ) {
    'use strict';
    if ( !opts ) {
        opts = {};
    }

    this.method = opts.method || 'get';
    this.path = opts.path;
    this.fn = opts.fn;
};

/**
 * a construction helper method for creating standard route objects -- although this breaks our > 2 parameter
 * per call rule, it is provided for use by createGet, createPost, etc.
 *
 * @param method - the http method, get, post, put, delete
 * @param path - the url path
 * @param fn - the handler function
 * @returns the service route object
 */
ServiceRoute.create = function( method, path, fn ) {
    'use strict';
    return new ServiceRoute( { method: method, path: path, fn: fn } );
};

module.exports = ServiceRoute;
