/**
 * @class WebStatusService - a simple service to display the current service's status.  It should report how long it's been
 * active, any detected errors, memory use, etc.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 2:49 PM
 */
var serviceName = 'WebStatusService',
    ServiceRoute = require('../models/ServiceRoute' ),
    AbstractWebService = require('../services/AbstractWebService' ),
    os = require( 'os' ),
    util = require( 'util' ),
    moment = require('moment');

var WebStatusService = function(options) {
    'use strict';

    var service = this,
        log = options.log,
        epoch = options.epoch || new Date(),
        env = options.environment,
        version = options.version,
        warnings = [],
        errors = [];

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
            arch:os.arch()
        };

        return status;
    };

    this.formatElapsedTime = function(start, end) {
        var d = moment.duration( end - start ),
            pad;

        pad = function(n) {
            if (n < 10) {
                return '0' + n;
            } else {
                return n;
            }
        };

        log.info('format the duration between start ', start, ' and end ', end, ' = ', d);

        return d.days() + ' days+' + [ pad(d.hours()), pad(d.minutes()), pad(d.seconds()) ].join(':') ;
    };

    this.serviceName = options.serviceName || serviceName;
    this.routes = [
        ServiceRoute.create( 'get', '/status', service.getWebStatus )
    ];

    // constructor tests
    if (!log) throw new Error('web status service must be constructed with a log object');
};

WebStatusService.SERVICE_NAME = serviceName;

module.exports = WebStatusService;
