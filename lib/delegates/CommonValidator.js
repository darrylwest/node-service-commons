/**
 * @class CommonValidator
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:06 AM
 */
var dash = require('lodash' ),
    validator = require('validator');

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
            if (!validator.isEmail( value )) {
                errors.push( [ 'FIELD value: "', value, '" is not a valid email' ].join('') );
            }
        } else {
            errors.push( [ 'FIELD is empty and not a valid email' ].join('') );
        }

        return errors;
    };

    this.isIP = function(ip, errors) {
        if (!errors) errors = [];

        if (ip && typeof ip === 'string') {
            if (!validator.isIP( ip )) {
                errors.push( [ 'FIELD is not a valid IP address format: ', ip ].join(''));
            }
        } else {
            errors.push( 'FIELD value is null or is not a string and not a valid IP address' );
        }

        return errors;
    };

    this.isURL = function(url, errors) {
        if (!errors) errors = [];

        if (!validator.isURL( url )) {
            errors.push( [ 'FIELD is not a valid URL format: ', url ].join(''));
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

    /* jshint -W016 */
    /**
     * return true/false based on 0/1 value of bit position 1..n; see unit tests for examples
     *
     * @param flags - the bit flags
     * @param bitPosition 1..n
     * @returns true if bit = 1, false if bit = 0
     */
    this.isBitSet = function(flags, bitPosition) {
        var bp = bitPosition - 1,
            f = (flags >>> bp) & 1;

        log.debug('flags: ', f, ', bp: ', bp, ', f: ', f);

        return f === 1;
    };

    /**
     * set a bit to 1 based on bit position 1..n
     *
     * @flags the bit flags
     * @param bitPosition 1..n
     * @returns flags with the bit set to 1
     */
    this.setBitFlag = function(flags, bitPosition) {
        var bp = bitPosition - 1,
            mask = (1 << bp);

        log.debug('bp: ', bitPosition, '=', mask, '=', mask.toString(2));

        return flags | mask;
    };
    /* jshint +W016 */

    // constructor tests
    if (!log) throw new Error('delegate must be constructed with a log');
};

module.exports = CommonValidator;
