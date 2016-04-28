/**
 * @class AbstractDataService
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 1:43 PM
 */
const dash = require('lodash');

const AbstractDataService = function(options) {
    'use strict';

    const service = this,
        log = options.log;

    /**
     * override to implement; this method is invoked from web service to query a list of models
     *
     * @param params
     * @param responseCallback
     */
    this.query = function(params, responseCallback) {
        log.info('query markup: ', params);

        responseCallback( new Error('not implemented yet') );
    };

    /**
     * override to implement; this method is invoked from web service to insert, update or delete a model
     *
     * @param params
     * @param responseCallback
     */
    this.save = function(params, responseCallback) {
        log.info('save the markup model: ', params);

        responseCallback( new Error('not implemented yet') );
    };

    /**
     * override to implement; this method is invoked from web service to find a single model
     *
     * @param params
     * @param responseCallback
     */
    this.find = function(params, responseCallback) {
        log.info('find the markup record: ', params);

        responseCallback( new Error('not implemented yet') );
    };

    /**
     * Parse the value looking for an integer.  If the parsed value is NaN, then the default
     * is returned.
     *
     * @param value - a number, string, null, etc
     * @param dflt - the number to use if value evaluates to NaN
     */
    this.parseInt = function(value, dflt) {
        const n = dash.parseInt( value );
        if (dash.isNaN( n )) {
            return dflt;
        } else {
            return n;
        }
    };

    // constructor tests
    if (!log) {
        throw new Error('delegate must be constructed with a log');
    }
};

AbstractDataService.extend = function(child, options) {
    'use strict';
    const parent = new AbstractDataService( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractDataService;
