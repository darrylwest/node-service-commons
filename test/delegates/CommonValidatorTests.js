/**
 * @class CommonValidatorTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 11:08 AM
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    CommonValidator = require('../../lib/delegates/CommonValidator');

describe('CommonValidator', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = new MockLogger.createLogger('MiddlewareDelegate');

        return opts;
    };

    describe('#instance', function() {
        var delegate = new CommonValidator( createOptions() ),
            methods = [
                'inList',
                'inLength',
                'isDate',
                'isBoolean',
                'isEmail',
                'isIP',
                'isNumberBetween',
                'isURL',
                'isBitSet',
                'setBitFlag'
            ];

        it('should create instance of MiddlewareDelegate', function() {
            should.exist( delegate );
            delegate.should.be.instanceof( CommonValidator );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( delegate ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                delegate[ method ].should.be.a( 'function' );
            });
        });
    });

    describe("inList", function() {
        var validator = new CommonValidator( createOptions() );

        it('should validate a single value that is in a list', function() {
            var list = [ 'a', 'b', 'c' ];

            var errors = [];
            var items = [ 'a', 'c', 'b', 'a' ];

            items.forEach(function(item) {
                validator.inList( item, list, errors );
                errors.length.should.equal( 0 );
            });
        });

        it('should in-validate a single value that is not in a list', function() {
            var list = [ 'a', 'b', 'c' ];

            var errors = [];
            var items = [ 'f', 'g', 'k' ];

            items.forEach(function(item) {
                var errors = validator.inList( item, list );
                errors.length.should.equal( 1 );
            });
        });
    });

    describe("inLength", function() {
        var validator = new CommonValidator( createOptions() );

        it("should validate the string lengths", function() {
            var list = [ 'this is a test',  'this is another long string test' ],
                min = list[0].length,
                max = list[1].length,
                errors = [];

            list.forEach(function(value) {
                validator.inLength( value, min, max, errors );
                errors.length.should.equal( 0 );
            });
        });

        it("should report errors for string lengths out of bounds", function() {
            var list = [ 'this is a test',  'this is another long string test' ],
                min = list[0].length + 1,
                max = list[1].length - 1,
                errors = null;

            list.forEach(function(value) {
                errors = validator.inLength( value, min, max );
                errors.length.should.equal( 1 );
            });
        });

        it("should accept null strings", function() {
            var value = null,
                errors = null;

            errors = validator.inLength( value );
            errors.length.should.equal( 0 );

            errors = validator.inLength( value, 1 );
            errors.should.have.lengthOf( 1 );
        });
    });

    describe("isIP", function() {
        var validator = new CommonValidator( createOptions() );

        it("should validate an IP address", function() {
            var list = [ '127.0.0.1', '254.255.255.255', '0.0.0.0' ];

            list.forEach(function(ip) {
                var errors = validator.isIP( ip );

                errors.length.should.equal( 0 );
            });
        });

        it("should reject non-IP addresses", function() {
            var list = [ '299.0.0.1', '254', '0.a.0.z', null ];

            list.forEach(function(ip) {
                var errors = validator.isIP( ip );

                errors.length.should.equal( 1 );
            });
        });
    });

    describe("isEmail", function() {
        var validator = new CommonValidator( createOptions() );

        it("should validate an email address", function() {
            var list = [ 'dpw@rp.com', 'jonny.smith@yahoo.com.uk', 'al@al.com' ];

            list.forEach(function(email) {
                var errors = validator.isEmail( email );

                errors.length.should.equal( 0 );
            });
        });

        it("should reject non-email addresses", function() {
            var list = [ 'dp@rcs', '254', '0.a.0.z', null ];

            list.forEach(function(email) {
                var errors = validator.isEmail( email );

                errors.length.should.equal( 1 );
            });
        });
    });

    describe("isNumberBetween", function() {
        var validator = new CommonValidator( createOptions() );

        it("should validate a number between min and max", function() {
            var errors = validator.isNumberBetween( 0, -1, 1 );

            errors.length.should.equal( 0 );
        });
        it("should fail when number is below minimum", function() {
            var errors = validator.isNumberBetween( 0, 5, 10);

            errors.length.should.equal( 1 );
        });
        it("should fail when number is above maximum", function() {
            var errors = validator.isNumberBetween( 10, 5, 6);

            errors.length.should.equal( 1 );
        });
        it("should fail when number is null", function() {
            var errors = validator.isNumberBetween( null, 5, 6);

            errors.length.should.equal( 1 );
        });
        it("should fail when value is not a number", function() {
            var errors = validator.isNumberBetween( '234sbx', 5, 6);

            errors.length.should.equal( 1 );
        });
    });

    describe("isDate", function() {
        var validator = new CommonValidator( createOptions() );

        it("should validate a set of known dates", function() {
            var list = [ new Date(), new Date(2012, 1, 1) ];

            list.forEach(function(date) {
                var errors = validator.isDate( date );

                errors.length.should.equal( 0 );
            });
        });

        it("should reject non-dates", function() {
            var list = [ 'dp@rcs', '254', '0.a.0.z', null ];

            list.forEach(function(date) {
                var errors = validator.isDate( date );

                errors.length.should.equal( 1 );
            });
        });
    });

    describe('isURL', function() {
        var validator = new CommonValidator( createOptions() );

        it('should validate a URL', function() {
            var list = [ 'http://raincitysoftware.com' ];

            list.forEach(function(url) {
                var errors = validator.isURL( url );

                errors.length.should.equal( 0 );
            });
        });
    });

    describe('isBitSet', function() {
        var validator = new CommonValidator( createOptions() );

        it('should return true if a bit flag is set', function() {
            var flags = 10,
                bitPosition = 2;

            validator.isBitSet( flags, bitPosition ).should.equal( true );
        });

        it('should return false if a bit flag is clear', function() {
            var flags = 10,
                bitPosition = 1;

            validator.isBitSet( flags, bitPosition ).should.equal( false );
        });

        it('should return true for a group of flags that are set', function() {
            var flags = 255,
                bp = 8;

            while (bp > 0) {
                validator.isBitSet( flags, bp ).should.equal( true );

                bp--;
            }
        });
    });

    describe('setBitFlag', function() {
        var validator = new CommonValidator( createOptions() );

        it('should set a bit to 1 based on bit position', function() {
            var flags = 0,
                bitPosition = 8;

            flags = validator.setBitFlag( flags, bitPosition );
            flags.should.equal( 128 );
        });
    });
});
