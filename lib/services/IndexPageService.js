/**
 * @class IndexPageService - by default, most services return json results to a given request. The index
 * page is the exception.  It shows basic information about the service, e.g., version, title,
 * copyright, etc.  It may also be extended to show up-time, load, etc.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 2:36 PM
 */
var ServiceRoute = require('../models/ServiceRoute' ),
    ServiceName = 'IndexPageService';

var IndexPageService = function(options) {
    'use strict';

    var service = this,
        log = options.log,
        body = options.body,
        apptitle = options.apptitle,
        copyright = options.copyright,
        version = options.version,
        environment = options.environment;

    this.getIndexPage = function( request, response ) {
        log.info('process the request from: ', request.ip);
        response.send( service.createIndexPage() );
    };

    /**
     * create the page body
     *
     * @returns the page
     */
    this.createIndexPage = function() {
        if (!body) {
            // TODO replace this with a simple html page builder
            body = [
                '<h2>', apptitle, '</h2>',
                '<p>Copyright ', copyright, ' --- Version ', version, '</p>',
                '<p>env: ', environment, '</p>',
                '<p>ts: {TIMESTAMP}</p>'
            ];
        }

        log.debug("body ", body);

        return body.join('').replace('{TIMESTAMP}', Date.now());
    };

    this.serviceName = options.serviceName || ServiceName;
    this.routes = [
        ServiceRoute.create( 'get', '/', service.getIndexPage )
    ];

    // constructor tests
    if (!log) throw new Error('delegate must be constructed with a log');
};

IndexPageService.SERVICE_NAME = ServiceName;

module.exports = IndexPageService;
