/**
 *
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 3:02 PM
 */
var should = require('chai').should(),
    commons = require('../index.js');

describe('CommonsIndex', function() {
    'use strict';

    describe('#controllers', function() {
        it('should contain AbstractApplicationFactory', function() {
            commons.controllers.AbstractApplicationFactory.should.be.a('function');
        });

        it('should contain CommonBootStrap', function() {
            commons.controllers.CommonBootStrap.should.be.a('function');
        });
    });
});