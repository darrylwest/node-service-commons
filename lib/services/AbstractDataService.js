/**
 * @class AbstractDataService
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 1:43 PM
 */
var dash = require('lodash');

var AbstractDataService = function(options) {
    'use strict';

    var service = this,
        log = options.log;

    /**
     * Parse the value looking for an integer.  If the parsed value is NaN, then the default
     * is returned.
     *
     * @param value - a number, string, null, etc
     * @param dflt - the number to use if value evaluates to NaN
     */
    this.parseInt = function(value, dflt) {
        var n = dash.parseInt( value );
        if (dash.isNaN( n )) {
            return dflt;
        } else {
            return n;
        }
    };

    // constructor tests
    if (!log) throw new Error('delegate must be constructed with a log');
};

AbstractDataService.extend = function(child, options) {
    'use strict';
    var parent = new AbstractDataService( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractDataService;