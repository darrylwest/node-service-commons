/**
 * index
 *
 * @type definitions
 */
module.exports = {
    controllers: {
        AbstractApplicationFactory: require( './lib/controllers/AbstractApplicationFactory' ),
        AbstractServiceFactory: require( './lib/controllers/AbstractServiceFactory' ),
        CommonBootStrap: require( './lib/controllers/CommonBootStrap' )
    },
    models: {
        AbstractBaseModel: require( './lib/models/AbstractBaseModel' ),
        // AbstractField: require( './models/AbstractField' ),
        // TextField: require( './models/TextField' ),
        // BooleanField: require( './models/BooleanField' ),
        // ListField: require( './models/ListField' ),
        // IPField: require( './models/IPField' ),
        // EmailField: require( './models/EmailField' ),
        // NumberField: require( './models/NumberField' ),
        // DateField: require( './models/DateField' ),
        ServiceResponse: require( './lib/models/ServiceResponse' ),
        ServiceRoute: require( './lib/models/ServiceRoute' )

    },
    dao: {
        AbstractBaseDao: require( './lib/dao/AbstractBaseDao' )
    },
    delegates: {
        // AbstractModelDelegate: require('./delegates/AbstractModelDelegate'),
        // DataModelCache: require( './delegates/DataModelCache' ),
        CommonValidator: require( './lib/delegates/CommonValidator' ),
        MiddlewareDelegate: require( './lib/delegates/MiddlewareDelegate' )
    },
    services: {
        AbstractDataService: require( './lib/services/AbstractDataService' ),
        AbstractPageService: require( './lib/services/AbstractPageService' ),
        AbstractWebService: require( './lib/services/AbstractWebService' ),
        WebStatusService: require( './lib/services/WebStatusService' ),
        IndexPageService: require( './lib/services/IndexPageService' )
    },
    mocks: {
        MockExpress: require('./test/mocks/MockExpress'),
        MockAgent: require('./test/mocks/MockAgent')
    },
    fixtures: {
        TestDataset: require('./test/fixtures/TestDataset')
    }
};
