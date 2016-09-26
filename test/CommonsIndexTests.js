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

        it('should contain ApplicationServiceFactory', function() {
            commons.controllers.AbstractServiceFactory.should.be.a('function');
        });

        it('should contain CommonBootStrap', function() {
            commons.controllers.CommonBootStrap.should.be.a('function');
        });
    });

    describe('#delegates', function() {
        it('should contain CommonValidator', function() {
            commons.delegates.CommonValidator.should.be.a('function');
        });

        it('should contain MiddlewareDelegate', function() {
            commons.delegates.MiddlewareDelegate.should.be.a('function');
        });
    });

    describe('#dao', function() {
        it ('should contain AbstractBaseDao', function() {
            commons.dao.AbstractBaseDao.should.be.a('function');
        });
    });

    describe('#models', function() {
        it ('should contain AbstractBaseModel', function() {
            commons.models.AbstractBaseModel.should.be.a('function');
        });

        it('should contain ServiceResponse', function() {
            commons.models.ServiceResponse.should.be.a('function');
        });

        it('should contain ServiceRoute', function() {
            commons.models.ServiceRoute.should.be.a('function');
        });
    });

    describe('#mocks', function() {
        it('should contain a MockExpress', function() {
            commons.mocks.MockExpress.should.be.a('function');
        });
        it('should contain a MockAgent', function() {
            commons.mocks.MockAgent.should.be.a('function');
        });
    });

    describe('#services', function() {
        it('should contain AbstractDataService', function() {
            commons.services.AbstractDataService.should.be.a('function');
        });

        it('should contain AbstractPageService', function() {
            commons.services.AbstractPageService.should.be.a('function');
        });

        it('should contain AbstractWebService', function() {
            commons.services.AbstractWebService.should.be.a('function');
        });

        it('should contain IndexPageService', function() {
            commons.services.IndexPageService.should.be.a('function');
        });

        it('should contain WebStatusService', function() {
            commons.services.WebStatusService.should.be.a('function');
        });
    });
});
