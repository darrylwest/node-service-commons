/**
 * @class WebStatusService - a simple service to display the current service's status.  It should report how long it's been
 * active, any detected errors, memory use, etc.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 2:49 PM
 */
const serviceName = 'WebStatusService',
    ServiceRoute = require('../models/ServiceRoute' ),
    AbstractWebService = require('../services/AbstractWebService' ),
    os = require( 'os' ),
    util = require( 'util' ),
    dtdelta = require('datetimejs').dtdelta;

const WebStatusService = function(options) {
    'use strict';

    const service = this,
        log = options.log,
        epoch = options.epoch || new Date(),
        env = options.environment,
        version = options.version;

    let warnings = [],
        errors = [];

    if (!options.listName) options.listName = 'webStatus';
    if (!options.modelName) options.modelName = 'webStatus';
    if (!options.domain) options.domain = 'webStatus';

    // extend the base class first to allow method override
    AbstractWebService.extend( this, options );

    this.getWebStatus = function(request, response) {
        log.info('return the web status');

        var status = service.createWebStatus( request.params );

        response.send( service.createSuccessResponse( 'webStatus', status ) );
    };

    this.createWebStatus = function(params) {
        log.info('create the web status object for params: ', params);

        // TODO create a data model for this and update in background
        const status = {
            version:version,
            env:env,
            epoch:epoch.toISOString(),
            uptime:service.formatElapsedTime(epoch, new Date()),
            warnings:warnings.length,
            errors:errors.length,
            process:{
                pid:process.pid,
                title:process.title,
                vers:process.version
            },
            totalmem:os.totalmem(),
            freemem:os.freemem(),
            loadavg:os.loadavg(),
            arch:os.arch()
        };

        return status;
    };

    this.formatElapsedTime = function(startDate, endDate) {
        const d = dtdelta.delta( startDate, endDate );

        // pad to two digits
        let c = d.composite.map( v => {
            return v < 10 ? '0' + v : '' + v;
        });

        log.info('format the duration between start ', startDate, ' and end ', endDate, ' = ', d.composite);

        return `${c[0]} days+${c[1]}:${c[2]}:${c[3]}`;
    };

    this.warningHandler = function(warning) {
        log.warn('warning handler: ', warning);
        warnings.push( warning );
    };

    this.initListeners = function() {
        process.on('warning', service.warningHandler);
        // process.on('error')
    };

    this.serviceName = options.serviceName || serviceName;
    this.routes = [
        ServiceRoute.create( 'get', '/status', service.getWebStatus )
    ];
};

WebStatusService.SERVICE_NAME = serviceName;

module.exports = WebStatusService;
