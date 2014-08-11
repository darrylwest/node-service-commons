/**
 * index
 *
 * @type definitions
 */
module.exports = {
    controllers: {
        AbstractApplicationFactory: require( './controllers/AbstractApplicationFactory' ),
        CommonBootStrap: require( './controllers/CommonBootStrap' )
    },
    models: {
        AbstractBaseModel: require( './models/AbstractBaseModel' ),
        ServiceResponse: require( './models/ServiceResponse' ),
        ServiceRoute: require( './models/ServiceRoute' ),
        AbstractField: require( './models/AbstractField' ),
        TextField: require( './models/TextField' ),
        BooleanField: require( './models/BooleanField' ),
        ListField: require( './models/ListField' ),
        IPField: require( './models/IPField' ),
        EmailField: require( './models/EmailField' ),
        NumberField: require( './models/NumberField' ),
        DateField: require( './models/DateField' )
    },
    delegates: {
        MiddlewareDelegate: require( './delegates/MiddlewareDelegate' ),
        DataModelCache: require( './delegates/DataModelCache' ),
        CommonValidator: require( './delegates/CommonValidator' ),
        AbstractModelDelegate: require('./delegates/AbstractModelDelegate')
    },
    services: {
        AbstractDataService: require( './services/AbstractDataService' ),
        AbstractWebService: require( './services/AbstractWebService' ),
        WebStatusService: require( './services/WebStatusService' ),
        IndexPageService: require( './services/IndexPageService' )
    },
    mocks: {
        MockExpress: require('./unit-test/mocks/MockExpress')
    },
    fixtures: {
        TestDataset: require('./unit-test/fixtures/TestDataset')
    }
};
