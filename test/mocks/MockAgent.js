/**
 * @class MockAgent - mock for superagent
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 12/31/14 8:00 AM
 */
const dash = require('lodash' ),
    superagent = require('superagent'); // requires version 2

const MockAgent = function(options) {
    'use strict';

    const mock = this,
        agent = superagent;

    if (!options) {
        options = {};
    }

    const mockEnd = function(req) {
        let res = mock.response,
            err = mock.err;

        if (!res) {
            res = mock.createStandardResponse();
        }

        // override the end method
        req.end = function(callback) {
            req.abort();

            if (callback) {
                return callback( err, res );
            } else {
                return res;
            }
        };

        return req;
    };

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

    this.createStandardResponse = function(body) {
        var res = {};

        res.status = res.statusCode = 200;
        res.statusType = 2;
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

        res.body = body || { status:'ok', ts:Date.now(), version:'1.0' };

        return res;
    };
};

module.exports = MockAgent;
