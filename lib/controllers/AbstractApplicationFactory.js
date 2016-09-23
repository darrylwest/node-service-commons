/**
 * @class AbstractApplicationFactory
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 4:12 PM
 */
const dash = require('lodash' ),
    CommonValidator = require( '../delegates/CommonValidator' ),
    MiddlewareDelegate = require( '../delegates/MiddlewareDelegate' ),
    bodyParser = require('body-parser' ),
    AbstractServiceFactory = require( './AbstractServiceFactory' );

const AbstractApplicationFactory = function(options) {
    'use strict';

    if (!options) {
        options = {};
    }

    const factory = this,
        config = options;

    let logManager = options.logManager,
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
        /* jshint -W073 */
        if (!logManager) {
            const Manager = require('simple-node-logger');

            if (typeof config.readLoggerConfig === 'function') {
                const opts = config.readLoggerConfig();

                logManager = new Manager( opts );

                // auto-config with rolling appender
                if (opts.logDirectory && opts.fileNamePattern) {
                    logManager.createRollingFileAppender( opts );

                    if (opts.refresh && opts.loggerConfigFile) {
                        process.nextTick( logManager.startRefreshThread );
                    }
                }
            } else {
                logManager = new Manager( config );

                logManager.createConsoleAppender( config );
            }
        }
        /* jshint +W073 */

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

            const opts = dash.clone( config );
            opts.log = factory.createLogger( 'MiddlewareDelegate' );

            middlewareDelegate = new MiddlewareDelegate( opts );
        }

        return middlewareDelegate;
    };

    /**
     * create and return the common validator
     */
    this.createCommonValidator = function() {
        if (!validator) {
            log.info("create common validator");

            const opts = dash.clone( config );

            opts.log = factory.createLogger( 'CommonValidator' );

            validator = new CommonValidator( opts );
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

        let svc = factory.findService( service.serviceName );
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
        let list = services.filter(function(svc) {
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
    this.getServices = function() {
        return services;
    };

    /**
     * return the configuration
     */
    this.getConfiguration = function() {
        return config;
    };

    this.createWebServices = function(serviceFactory, list) {
        if (!serviceFactory) {
            throw new Error('service factory cannot be null');
        }
        if (!list) {
            throw new Error('web service list cannot be null');
        }

        list.forEach(name => {
            let service = factory.findService( name );
            if (!service) {
                const closure = 'create' + name;
                log.info('invoking: ', closure);

                if (typeof serviceFactory[ closure ] === 'function') {
                    service = serviceFactory[ closure ].call();
                } else {
                    log.error( 'WebService method: ', closure, ' is not available...' );
                }

                if (service) {
                    factory.addService( service );
                } else {
                    console.error('service not found for: ', name);
                }
            }
        });

        log.info('service count: ', factory.getServices().length);

        return factory.getServices();
    };

    /**
     * initialize the app defaults
     *
     * @param app - an express or express like object
     */
    this.initAppDefaults = function(app) {
        log.info('init default trust and x-powered-by values');

        app.enable('trust proxy');
        app.disable('x-powered-by');
    };

    /**
     * initialize the standard middleware.  if the delegate is missing, then create; if
     * the list is missing then pull the list from the middleware public methods
     *
     * @param app - an express or express like object
     * @param middleware - the optional middleware delegate
     * @param list - an optional list of middleware functions
     */
    this.initMiddleware = function(app, middleware, list) {
        if (!middleware) {
            log.info("create the standard middleware delegate...");
            middleware = factory.createMiddlewareDelegate();
        }

        if (!list) {
            list = dash.functionsIn( middleware );
        }

        log.info('create the standard middleware, methods: ', list);
        list.forEach(function(method) {
            // add the middleware, or die trying
            app.use( middleware[ method ] );
        });

        // always enable the json body parser
        app.use( bodyParser.json() );
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
                const fullPath = factory.createRoutePath( config.baseURI, route.path );
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

    // create the factory log
    log = factory.createLogger('AbstractApplicationFactory');
};

/**
 * extend the public methods of this abstract class to a child class.  create the
 * parent object using options passed from the child class.
 *
 * Typical use:
 *
 * const parent = AbstractApplicationFactory.extend( this, options );
 *
 * @param child
 * @param options
 * @returns parent object
 */
AbstractApplicationFactory.extend = function(child, options) {
    'use strict';
    const parent = new AbstractApplicationFactory( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractApplicationFactory;
