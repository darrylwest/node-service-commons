/**
 * @class AbstractBaseDao
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
var should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    AbstractBaseModel = require('../../lib/models/AbstractBaseModel'),
    Dataset = require('../fixtures/TestDataset'),
    MockClient = require('../mocks/MockRedisClient'),
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
                'update',
                'parseModel'
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

        it('should create a standard model id guid', function() {
            var id = dao.createModelId();

            console.log( id );
            should.exist( id );
            dash.size( id ).should.equal( 32 );
        });
    });

    describe('findById', function() {
        var dao = new AbstractBaseDao( createOptions()),
            client = new MockClient(),
            list = new Dataset().createModelList();

        beforeEach(function(done) {
            client.initModelList( list, done );
        });

        it('should find and return a known model by id', function(done) {
            var ref = list[0],
                callback;

            callback = function(err, model) {
                should.not.exist( err );
                should.exist( model );

                model.dateCreated.getTime().should.equal( ref.dateCreated.getTime() );
                model.lastUpdated.getTime().should.equal( ref.lastUpdated.getTime() );
                model.version.should.equal( ref.version );

                done();
            };

            // console.log( model );
            dao.findById( client, ref.id, callback );
        });

        it('should not find an unknown id', function(done) {
            var id = 'bad-id',
                callback;

            callback = function(err, model) {
                should.not.exist( err );
                should.not.exist( model );

                done();
            };

            // console.log( model );
            dao.findById( client, id, callback );
        });
    });
});