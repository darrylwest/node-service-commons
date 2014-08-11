/**
 * @class CommonValidator
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:06 AM
 */
var dash = require('lodash');

var CommonValidator = function(options) {
    'use strict';

    var delegate = this,
        log = options.log;

    /**
     * Validate the the value is in the list.  if not, report the error
     *
     * @param value
     * @param list
     * @param errors - can be null
     * @returns error array
     */
    this.inList = function(value, list, errors) {
        if (!errors) errors = [];

        if (!dash.contains( list, value )) {
            var s = [ 'value:', value, 'is not in list of', list ].join(' ');
            log.info( s );

            errors.push( s );
        }

        return errors;
    };

    /**
     * Validate the the value's length is between min and max.  Report the errors
     *
     * @param value
     * @param min - can be null, defaults to 0
     * @param max - can be null, defaults to MAX_VALUE
     * @param errors - can be null
     * @returns error array
     */
    this.inLength = function(value, min, max, errors) {
        if (!errors) errors = [];
        if (!min) min = 0;
        if (!max) max = Number.MAX_VALUE;

        log.debug('validate ', value, ' between ', min, ' and ', max);

        if (value && value.hasOwnProperty('length')) {
            var len = value.length;
            if (len < min) {
                errors.push( [ 'FIELD value: "', value, '" is less ', min, ' characters.' ].join('') );
            } else if (len > max) {
                errors.push( [ 'FIELD value: "', value, '" is larger than ', max, ' characters.' ].join('') );
            }
        } else if (min && min > 0) {
            errors.push( [ 'FIELD value is empty but should be at least ', min, ' characters.' ].join('') );
        }

        return errors;
    };

    this.isDate = function(value, errors) {
        if (!errors) errors = [];

        if (value) {
            if (!dash.isDate( value )) {
                errors.push( [ 'FIELD value: ', value, ' is not a valid date' ].join('') );
            }
        } else {
            errors.push( [ 'FIELD is empty and not a valid date' ].join('') );
        }

        return errors;
    };

    this.isBoolean = function(value, errors) {
        if (!errors) errors = [];

        if (value !== null && value !== undefined) {
            if (!dash.isBoolean( value )) {
                errors.push( [ 'FIELD value: ', value, ' is not a valid boolean' ].join('') );
            }
        } else {
            errors.push( [ 'FIELD is empty and not a valid boolean' ].join('') );
        }

        return errors;
    };

    this.isEmail = function(value, errors) {
        if (!errors) errors = [];

        if (value && typeof value === 'string') {
            var re = /\S+@\S+\.\S+/;
            if (!re.test( value )) {
                errors.push( [ 'FIELD value: "', value, '" is not a valid email' ].join('') );
            }
        } else {
            errors.push( [ 'FIELD is empty and not a valid email' ].join('') );
        }

        return errors;
    };

    this.isIP = function(ip, errors) {
        if (!errors) errors = [];

        if (ip && typeof ip === "string") {
            var ss = ip.split('.');
            if (ss.length !== 4) {
                errors.push( [ 'FIELD is not a valid IP address format: ', ip ].join(''));
            } else {
                var ok = true;
                ss.forEach(function(s) {
                    var n = dash.parseInt( s );
                    if (dash.isNaN( n ) || n < 0 || n > 255) {
                        ok = false;
                    }
                });
                if (!ok) {
                    errors.push( [ 'FIELD value is not a valid IP address format: ', ip ].join(''));
                }
            }
        } else {
            errors.push( 'FIELD value is null or is not a string and not a valid IP address' );
        }

        return errors;
    };

    this.isNumberBetween = function(value, min, max, errors) {
        if (!errors) errors = [];
        if (!min) min = Number.MIN_VALUE;
        if (!max) max = Number.MAX_VALUE;

        if (typeof value === 'undefined') {
            errors.push( 'FIELD value is undefined' );
        } else if (!dash.isNumber( value ) || dash.isNaN( value )) {
            errors.push( [ 'FIELD value ', value, ' is not a number' ].join('') );
        } else {
            if (value < min) {
                errors.push( [ 'FIELD value ', value, ' is less than minimum: ', min ].join(''));
            } else if (value > max) {
                errors.push( [ 'FIELD value ', value, ' is greater than maximum: ', max ].join(''));
            }
        }

        return errors;
    };

    // constructor tests
    if (!log) throw new Error('delegate must be constructed with a log');
};

module.exports = CommonValidator;
