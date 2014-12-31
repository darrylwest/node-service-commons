/**
 * @class MockAgent - mock for superagent
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 12/31/14 8:00 AM
 */
var dash = require('lodash' ),
    superagent = require('superagent');

var MockAgent = function(options) {
    'use strict';

    var mock = this,
        agent = superagent;

    if (!options) options = {};

    this.response = options.response;
    this.err = options.err;

    this.get = function(url) {
        return mockEnd( agent.get( url ) );
    };

    this.post = function(url) {
        return mockEnd( agent.post( url ) );
    };

    this.del = function(url) {
        return mockEnd( agent.del( url ) );
    };

    var mockEnd = function(req) {
        var res = mock.response,
            err = mock.err;

        if (!res) res = mock.createStandardResponse();

        req.end = function(callback) {
            req.abort();

            if (callback) {
                callback( err, res );
            }

            return res;
        };

        return req;
    };

    this.createStandardResponse = function(params) {
        var res = {};

        res.status = res.statusCode = 200;
        res.type = 2;
        res.ok = true;
        res.error = false;
        res.info = false;
        res.redirect = false;
        res.serverError = false;
        res.type = 'application/json';

        res.headers = {
            date:new Date(),
            expires:'-1',
            'content-type': 'application/json'
        };

        res.body = params || {};

        return res;
    };
};

module.exports = MockAgent;
