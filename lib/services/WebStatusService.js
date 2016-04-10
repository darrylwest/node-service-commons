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
    util = require( 'util' );

const MINUTE_SECONDS = 60;
const HOUR_SECONDS = 60 * MINUTE_SECONDS;
const DAY_SECONDS = 24 * HOUR_SECONDS;

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
        var status = {
            version:version,
            env:env,
            epoch:epoch.toISOString(),
            uptime:service.formatElapsedTime(epoch, new Date()),
            warnings:warnings.length,
            errors:errors.length,
            process:{
                pid:process.pid,
                title:process.title
            },
            totalmem:os.totalmem(),
            freemem:os.freemem(),
            loadavg:os.loadavg(),
            arch:os.arch()
        };

        return status;
    };

    this.formatElapsedTime = function(startDate, endDate) {
        const seconds = ( endDate.getTime() - startDate.getTime() ) / 1000;

        const pad = function(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        };

        let duration = {
            days:pad(seconds / DAY_SECONDS ),
            hours:pad(seconds / HOUR_SECONDS),
            minutes:pad(seconds / MINUTE_SECONDS),
            seconds:pad(seconds)
        };

        log.info('format the duration between start ', startDate, ' and end ', endDate, ' = ', duration);

        return `${duration.days} days+${duration.hours}:${duration.minutes}:${duration.seconds}`;
    };

    this.serviceName = options.serviceName || serviceName;
    this.routes = [
        ServiceRoute.create( 'get', '/status', service.getWebStatus )
    ];

};

WebStatusService.SERVICE_NAME = serviceName;

module.exports = WebStatusService;
