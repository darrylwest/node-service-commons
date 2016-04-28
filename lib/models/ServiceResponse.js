/**
 * @class ServiceResponse
 *
 * used as a wrapper for all JSON responses.  This class has two main uses; 1) when a success
 * response is to be returned, simply create and instance then attach the payload. 2) when a failure response needs
 * to be returned, use the static constructor createFailedResponse() and pass in a reason and an optional failure
 * code.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:51 AM
 */
const ServiceResponse = function( params ) {
    "use strict";
    if (!params) {
        params = {};
    }

    this.status = params.status || 'ok';
    this.ts = Date.now();
    this.version = '1.0';
};

ServiceResponse.OK = 'ok';
ServiceResponse.FAILED = 'failed';

ServiceResponse.createFailedResponse = function(reason, code) {
    'use strict';
    let response = new ServiceResponse();
    response.status = ServiceResponse.FAILED;
    response.reason = reason;
    response.failCode = code || 'unknown';

    return response;
};


module.exports = ServiceResponse;
