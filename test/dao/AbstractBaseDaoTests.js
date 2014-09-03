/**
 * @class AbstractBaseDao
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    RedisMock = require('redis-mock'),
    AbstractBaseDao = require('../../lib/dao/AbstractBaseDao');

describe('AbstractBaseDao', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = MockLogger.createLogger('AbstractBaseDao');
        opts.domain = 'MyDomainName';

        return opts;
    };

    var MockDao = function(options) {
        AbstractBaseDao.extend( this, options );
    };

    describe('#instance', function() {
        var dao = new AbstractBaseDao( createOptions() ),
            methods = [
                'createModelId',
                'createDomainKey',
                'query',
                'findById',
                'insert',
                'update'
            ];

        it('should create an instance of AbstractBaseDao', function() {
            should.exist( dao );
            dao.should.be.instanceof( AbstractBaseDao );

            AbstractBaseDao.extend.should.be.a( 'function' );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( dao ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                dao[ method ].should.be.a( 'function' );
            });
        });

        it('should extend an object to inherit all public methods', function() {
            var dao = new MockDao( createOptions() );

            should.exist( dao );
            dash.methods( dao ).length.should.equal( methods.length );
        });
    });

    describe('createDomainKey', function() {
        var opts = createOptions(),
            dao = new AbstractBaseDao( opts );

        it('should create a domain key suitable for simple key/value stores', function() {
            var id = '12345',
                key = dao.createDomainKey( id );

            key.should.equal('MyDomainName:12345');

            // if the key is passed in, its simply returned
            dao.createDomainKey( key ).should.equal( key );
        });
    });

    describe('createModelId', function() {
        var dao = new AbstractBaseDao( createOptions() );

        it('should create a standard model id guid');
    });

    describe('findById', function() {
        var dao = new AbstractBaseDao( createOptions()),
            client = RedisMock.createClient();
        
        it('should find and return a known model by id');
        it('should not find an unknown id');
    });
});