/**
 * @class AbstractPageServiceTests
 *
 * @author darryl.west@raincitysoftware.com
 * @created 2016-09-22
 */
const should = require( 'chai' ).should(),
    dash = require( 'lodash' ),
    MockLogger = require('simple-node-logger').mocks.MockLogger,
    AbstractPageService = require( '../../lib/services/AbstractPageService' );

describe( 'AbstractPageService', function() {
    'use strict';

    const createOptions = function() {
        const opts = {};

        opts.log = MockLogger.createLogger('AbstractPageService');

        return opts;
    };

    describe( '#instance', function() {
        const service = new AbstractPageService( createOptions() ),
            methods = [
                'readTemplateFile',
                'getPageCache'
            ];

        it( 'should create an instance of AbstractPageService', function() {
            should.exist( service );
            service.should.be.instanceof( AbstractPageService );
        });

        it( 'should have all known methods by size and type', function() {
            dash.functions( service ).length.should.equal( methods.length );
            methods.forEach( method => {
                service[ method ].should.be.a( 'function' );
            });
        });

        it( 'should have an empty cache on construction', function() {
            const cache = service.getPageCache();

            Object.keys( cache ).length.should.equal( 0 );
        });
    });

    describe( 'readTemplateFile', function() {
        const knownFile = `${process.cwd()}/test/fixtures/template.html`;
        const unknownFile = `${process.cwd()}/test/fixtures/bad.file`;
        const service = new AbstractPageService( createOptions() );

        it('should read and cache a known file', function(done) {
            const callback = function(err, data) {
                should.not.exist( err );
                should.exist( data );

                data.length.should.be.above( 100 );

                const cache = service.getPageCache();
                Object.keys( cache ).length.should.equal( 1 );

                const obj = cache[ knownFile ];
                should.exist( obj );
                obj.text.should.be.a('string');
                obj.cacheDate.should.be.a('number');

                obj.text.should.equal( data );

                done();
            };

            service.readTemplateFile( knownFile, callback );
        });

        it('should return an error if the file is not found', function(done) {
            const callback = function(err, data) {
                should.exist( err );

                done();
            };

            service.readTemplateFile( unknownFile, callback );
        });
    });
});

