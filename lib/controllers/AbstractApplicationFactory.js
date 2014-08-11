/**
 * @class AbstractApplicationFactory
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 4:12 PM
 */
var dash = require('lodash' ); // ,
    // CommonValidator = require( '../delegates/CommonValidator' ),
    // MiddlewareDelegate = require( '../delegates/MiddlewareDelegate' ),
    // IndexPageService = require( '../services/IndexPageService' ),
    // WebStatusService = require( '../services/WebStatusService' );

var AbstractApplicationFactory = function(options) {
    'use strict';

    if (!options) options = {};

    var factory = this,
        config = options,
        logManager = options.logManager,
        log = options.log,
        services = [],
        middlewareDelegate = options.middlewareDelegate,
        validator = options.validator;


    /**
     * create a logger for the specific category, i.e., class
     *
     * @param name - the category name, usually the class name
     * @param level - the designated log level, defaults to info
     * @returns the logger
     */
    this.createLogger = function(name, level) {
        if (!logManager) {
            var Manager = require('simple-node-logger');

            if (typeof config.readLoggerConfig === 'function') {
                logManager = new Manager( config.readLoggerConfig() );
            } else {
                logManager = new Manager( config );

                logManager.createConsoleAppender( config );
            }
        }

        return logManager.createLogger( name, level );
    };

    /**
     * create and return the middleware delegate; will only create a single instance
     *
     * @returns the delegate
     */
    this.createMiddlewareDelegate = function() {
        if (!middlewareDelegate) {
            log.info('create MiddlewareDelegate');

            var opts = dash.clone( config );
            opts.log = factory.createLogger( 'MiddlewareDelegate' );

            // middlewareDelegate = new MiddlewareDelegate( opts );
        }

        return middlewareDelegate;
    };

    this.createValidator = function() {
        if (!validator) {
            log.info("create common validator");

            var opts = {};

            opts.log = factory.createLogger( 'CommonValidator' );

            // validator = new CommonValidator( opts );
        }

        return validator;
    };

    /**
     * add the service
     */
    this.addService = function(service) {
        if (!service.hasOwnProperty( 'serviceName' )) {
            throw new Error('Attempt to add a service without a serviceName property');
        }

        var svc = factory.findService( service.serviceName );
        if (!svc) {
            services.push( service );
        }
    };

    /**
     * find the service by name
     *
     * @param name the service name as defined by service.serviceName
     * @returns if found, the service, else null
     */
    this.findService = function(name) {
        var list = services.filter(function(svc) {
            return svc.serviceName === name;
        });

        if (list.length === 1) {
            return list[0];
        } else {
            return null;
        }
    };

    /**
     * return the services collection
     * @returns services
     */
    this.getServices = function() { return services; };

    /**
     * creates a single instance of IndexPageService
     *
     * @returns the index page service
     */
    this.createIndexPageService = function() {
        /*
        var service = factory.findService( IndexPageService.SERVICE_NAME );

        if (!service) {
            log.info("create index page service");

            var opts = dash.clone( config );
            opts.log = factory.createLogger( IndexPageService.SERVICE_NAME );

            service = new IndexPageService( opts );
        }

        return service;
        */
    };

    /**
     * creates a single instance of WebStatusService
     *
     * @returns the service instance
     */
    this.createWebStatusService = function() {
        /*
        var service = factory.findService( WebStatusService.SERVICE_NAME );

        if (!service) {
            log.info("create web status service");

            var opts = dash.clone( config );
            opts.log = factory.createLogger( WebStatusService.SERVICE_NAME );

            service = new WebStatusService( opts );
        }

        return service;
        */
    };

    /**
     * iterate over all services and add all routes to the app object
     *
     * @param app - an express or compatible app
     */
    this.assignRoutes = function(app) {
        log.info('assign routes to the application');

        services.forEach(function(service) {
            log.info('add routes for ', service.serviceName);
            service.routes.forEach(function(route) {
                var fullPath = factory.createRoutePath( config.baseURI, route.path );
                log.info('route path: ', fullPath, ', method: ', route.method );

                app[ route.method ]( fullPath, route.fn );
            });
        });
    };

    /**
     * create a full route path given base and service paths
     *
     * @param basePath - the path for the primary service, e.g. MyPrimaryService or /MyPrimaryService/ (no scheme)
     * @param servicePath - the path for the specific service, e.g, /user or /admin
     */
    this.createRoutePath = function(basePath, servicePath) {
        // check for base and service

        return [ basePath.replace(/\/+$/, ''), servicePath.replace(/^\/+/, '') ].join('/');
    };

};

/**
 * extend the public methods of this abstract class to a child class.  create the
 * parent object using options passed from the child class.
 *
 * Typical use:
 *
 * var parent = AbstractApplicationFactory.extend( this, options );
 *
 * @param child
 * @param options
 * @returns parent object
 */
AbstractApplicationFactory.extend = function(child, options) {
    'use strict';
    var parent = new AbstractApplicationFactory( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractApplicationFactory;
