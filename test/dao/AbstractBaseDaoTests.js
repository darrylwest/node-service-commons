/**
 * @class AbstractBaseDao
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
const should = require('chai').should(),
    dash = require('lodash' ),
    MockLogger = require('simple-node-logger' ).mocks.MockLogger,
    Dataset = require('../fixtures/TestDataset'),
    MockClient = require('mock-redis-client'),
    AbstractBaseModel = require('../../lib/models/AbstractBaseModel' ),
    AbstractBaseDao = require('../../lib/dao/AbstractBaseDao');

describe('AbstractBaseDao', function() {
    'use strict';

    const createOptions = function() {
        const opts = {};

        opts.log = MockLogger.createLogger('AbstractBaseDao');
        opts.domain = 'MyDomainName';

        opts.createType = function(model) {
            return new AbstractBaseModel( model );
        };

        return opts;
    };

    const MockDao = function(options) {
        AbstractBaseDao.extend( this, options );
    };

    describe('#instance', function() {
        var dao = new AbstractBaseDao( createOptions() ),
            methods = [
                'createModelId',
                'createDomainKey',
                'query',
                'queryByIndexSet',
                'findById',
                'insert',
                'update',
                'updateAndExpire',
                'prepareUpdate',
                'parseModel',
                'parseModelList'
            ];

        it('should create an instance of AbstractBaseDao', function() {
            should.exist( dao );
            dao.should.be.instanceof( AbstractBaseDao );

            AbstractBaseDao.extend.should.be.a( 'function' );
        });

        it('should have all known methods by size and type', function() {
            dash.functionsIn( dao ).length.should.equal( methods.length );
            methods.forEach(function(method) {
                dao[ method ].should.be.a( 'function' );
            });
        });

        it('should extend an object to inherit all public methods', function() {
            var dao = new MockDao( createOptions() );

            should.exist( dao );
            dash.functionsIn( dao ).length.should.equal( methods.length );
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

            // console.log( id );
            should.exist( id );
            dash.size( id ).should.equal( 32 );
        });
    });

    describe('query', function() {
        const dao = new AbstractBaseDao( createOptions()),
            client = new MockClient(),
            list = new Dataset().createModelList(75);

        beforeEach(function(done) {
            let mlist = [];

            list.forEach(function(model) {
                var key = dao.createDomainKey( model.id );

                mlist.push( key );
                model.name = 'flarb';

                mlist.push( JSON.stringify( model ));
            });

            client.mset( mlist, done );
        });

        it('should return a list of model objects', function(done) {
            const callback = function(err, models) {
                should.not.exist( err );
                should.exist( models );

                list.length.should.equal( list.length );

                done();
            };

            dao.query( client, callback );
        });
    });

    describe('queryByIndexSet', function() {
        const dao = new AbstractBaseDao( createOptions()),
            client = new MockClient(),
            list = new Dataset().createModelList(15),
            indexSetName = 'my.set.name';

        beforeEach(function(done) {
            let mlist = [],
                keys = [];

            list.forEach(function(model) {
                const key = dao.createDomainKey( model.id );

                mlist.push( key );
                keys.push( key );
                model.name = 'fset me';

                mlist.push( JSON.stringify( model ));
            });

            client.mset( mlist, (err) => {
                client.sadd( indexSetName, keys, done );
            } );
        });

        it('should return a list of models from the index set', function(done) {
            /*
            const callback = function(err, list) {
                should.not.exist( err );
                should.exist( list );

                done();
            };

            dao.queryByIndexSet(client, indexSetName, callback);
            */

            // TODO : fix the redis mock to process sadd and smembers correctly
            done();
        });
    });

    describe('findById', function() {
        const dao = new AbstractBaseDao( createOptions()),
            client = new MockClient(),
            list = new Dataset().createModelList(5);

        beforeEach(function(done) {
            let mlist = [];

            list.forEach(function(model) {
                var key = dao.createDomainKey( model.id );

                mlist.push( key );
                mlist.push( JSON.stringify( model ));
            });

            client.mset( mlist, done );
        });

        it('should find and return a known model by id', function(done) {
            const ref = list[0];

            const callback = function(err, model) {
                should.not.exist( err );
                should.exist( model );

                model.dateCreated.getTime().should.equal( ref.dateCreated.getTime() );
                model.lastUpdated.getTime().should.equal( ref.lastUpdated.getTime() );
                model.version.should.equal( ref.version );

                model.should.be.instanceof( AbstractBaseModel );

                done();
            };

            // console.log( model );
            dao.findById( client, ref.id, callback );
        });

        it('should not find an unknown id', function(done) {
            const id = 'bad-id';

            const callback = function(err, model) {
                should.not.exist( err );
                should.not.exist( model );

                done();
            };

            // console.log( model );
            dao.findById( client, id, callback );
        });
    });

    describe('prepareUpdate', function() {
        const dao = new AbstractBaseDao( createOptions());

        it('should prepare a model for update', function() {
            const ref = new Dataset().createModel();
            ref.dateCreated = new Date("2015-01-01");
            ref.lastUpdated = new Date( Date.now() - 500 );
            ref.version = 25;

            const model = dao.prepareUpdate( ref );

            model.id.should.equal( ref.id );
            model.version.should.equal( ref.version );
            model.dateCreated.should.equal( ref.dateCreated );
            model.lastUpdated.getTime().should.be.above( ref.lastUpdated.getTime() );
        });

        it('should prepare a new model for insert', function() {
            const now = Date.now() - 1;
            const ref = new AbstractBaseModel();

            const model = dao.prepareUpdate( ref );

            should.exist( model.id );
            model.id.length.should.equal( 32 );
            model.version.should.equal( 0 );
            model.dateCreated.getTime().should.be.above( now );
            model.lastUpdated.getTime().should.be.above( now );
        });
    });

    describe('insert', function() {
        const dao = new AbstractBaseDao( createOptions()),
            client = new MockClient();

        it('should insert a new model with base properties', function(done) {
            const ref = new Dataset().createModel();

            const callback = function(err, model) {
                should.not.exist( err );
                should.exist( model );

                model.id.should.equal( ref.id );
                model.dateCreated.getTime().should.equal( ref.dateCreated.getTime() );
                // model.lastUpdated.getTime().should.equal( ref.lastUpdated.getTime() );
                model.version.should.equal( ref.version );

                done();
            };

            dao.insert( client, ref, callback );
        });

        it('should insert a new model with base properties', function(done) {
            const ref = new AbstractBaseModel();

            const callback = function(err, model) {
                should.not.exist( err );
                should.exist( model );

                should.exist( model.id );
                should.exist( model.dateCreated );
                should.exist( model.lastUpdated );
                model.version.should.equal( 0 );

                done();
            };

            dao.insert( client, ref, callback );
        });
    });

    describe('update', function() {
        const dao = new AbstractBaseDao( createOptions()),
            client = new MockClient(),
            list = new Dataset().createModelList(5);

        beforeEach(function(done) {
            let mlist = [];

            list.forEach(function(model) {
                const key = dao.createDomainKey( model.id );

                mlist.push( key );
                model.name = 'flarb';

                mlist.push( JSON.stringify( model ));
            });

            client.mset( mlist, done );
        });

        it('should update an existing model', function(done) {
            let ref = list[0];

            ref.name = 'newberg';

            const callback = function(err, model) {
                should.not.exist( err );
                should.exist( model );

                model.id.should.equal( ref.id );
                model.dateCreated.getTime().should.equal( ref.dateCreated.getTime() );
                model.lastUpdated.getTime().should.not.equal( ref.lastUpdated.getTime() );
                model.version.should.equal( ref.version + 1 );
                model.name.should.equal( ref.name );

                done();
            };

            dao.update( client, ref, callback );
        });
    });

    describe('updateAndExpire', function() {
        const dao = new AbstractBaseDao( createOptions());
        const client = new MockClient();

        it('should update or insert a record and set expire', function(done) {
            const ref = new Dataset().createModel();

            const callback = function(err, model) {
                should.not.exist( err );
                should.exist( model );

                model.id.should.equal( ref.id );
                model.dateCreated.getTime().should.equal( ref.dateCreated.getTime() );
                // model.lastUpdated.getTime().should.equal( ref.lastUpdated.getTime() );
                model.version.should.equal( ref.version );

                done();
            };

            const ttl = 1;
            dao.updateAndExpire( client, ref, ttl, callback );
        });
    });
});
