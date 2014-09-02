/**
 * @class AbstractBaseModelTests
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
var should = require('chai').should(),
    Dataset = require( '../fixtures/TestDataset' ),
    AbstractBaseModel = require( "../../lib/models/AbstractBaseModel" );

describe('AbstractBaseModel', function() {
    'use strict';
    
    var dataset = new Dataset();

    describe('#instance', function() {
        it('should be instance of AbstractBaseModel', function() {
            var model = new AbstractBaseModel();

            should.exist( model );
            model.should.be.instanceof( AbstractBaseModel );

            should.not.exist( model.dateCreated );
            should.not.exist( model.lastUpdated );

            model.should.have.property( 'version' , 0);

            AbstractBaseModel.extend.should.be.a( 'function' );
        });

    });

    describe('#params-instance', function() {
        it('should be populated with params', function() {
            var params = dataset.createBaseModelParams();
            params.lastUpdated = new Date().toISOString();
            params.version = '2';

            var model = new AbstractBaseModel( params );

            should.exist( model );
            model.id.should.equal( params.id );
            model.version.should.equal( Number( params.version ) );

            model.dateCreated.should.be.instanceof( Date );
            model.lastUpdated.should.be.instanceof( Date );

            model.dateCreated.toISOString().should.equal( params.dateCreated );
            model.lastUpdated.toISOString().should.equal( params.lastUpdated );


        });

        describe('#long-dates', function() {
            it('should parse longs into dates', function() {
                var params = dataset.createBaseModelParams();
                params.dateCreated = new Date().getTime();
                params.lastUpdated = new Date().getTime();

                var model = new AbstractBaseModel( params );

                should.exist( model );
                model.id.should.equal( params.id );
                model.version.should.equal( params.version );

                model.dateCreated.should.be.instanceof( Date );
                model.lastUpdated.should.be.instanceof( Date );

                model.dateCreated.getTime().should.equal( params.dateCreated );
                model.lastUpdated.getTime().should.equal( params.lastUpdated );
            });
        });

        describe("extends", function() {
            it('should extend and object', function() {
                var User = function(params) {
                    AbstractBaseModel.extend( this, params );
                    this.username = params.username;
                };

                var params = dataset.createBaseModelParams();
                params.username = 'flarb';

                var user = new User( params );
                user.id.should.equal( params.id );

                user.dateCreated.should.be.instanceof( Date );
                user.lastUpdated.should.be.instanceof( Date );

                var dateCreated = new Date( params.dateCreated ).getTime();
                var lastUpdated = new Date( params.lastUpdated ).getTime();

                user.dateCreated.getTime().should.equal( dateCreated );
                user.lastUpdated.getTime().should.equal( lastUpdated );

                user.version.should.equal( params.version );
                user.username.should.equal( params.username );
            });
        });
    });
});
