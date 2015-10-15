/**
 * @class AbstractWebService
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 1:54 PM
 */
var dash = require('lodash'),
    crypto = require('crypto'),
    ServiceRoute = require( '../models/ServiceRoute' ),
    ServiceResponse = require( '../models/ServiceResponse' );

var AbstractWebService = function(options) {
    'use strict';

    var service = this,
        log = options.log,
        algorithm = options.algorithm,
        hmacEncoding = options.hmacEncoding || 'hex',
        dataService = options.dataService,
        listName = options.listName,
        modelName = options.modelName,
        domain = options.domain;

    /**
     * standard query method
     *
     * @param request
     * @param response
     */
    this.query = function(request, response) {
        var session = request.headers.session,
            responseCallback;

        log.info('query for a ', listName, ', session: ', session, ', url: ', request.url);

        responseCallback = function(err, list) {
            var payload = service.createListPayload( err, listName, list, session );

            log.debug( 'payload: ', payload );

            response.send( payload );
        };

        try {
            dataService.query( request.query, responseCallback );
        } catch(err) {
            log.error( 'fatal error in query: ', err );
            responseCallback( err, null );
        }
    };

    /**
     * standard save method used to insert, update, and delete individual rows
     *
     * @param request
     * @param response
     */
    this.save = function(request, response) {
        var session = request.headers.session,
            id = request.params.id || request.query.id,
            body = request.body,
            responseCallback;

        if (!body) {
            log.warn('save requires a valid json body...');
        } else if (id) {
            body.id = id;
        }

        log.info('save request from ip: ', request.ip, ', ip list: ', request.ips, ', protocol: ', request.protocol);
        log.info('save ', domain, ', body: ', body);

        responseCallback = function(err, model) {
            var payload = service.createModelPayload( err, modelName, model, session );

            log.debug( "payload: ", payload );

            response.send( payload );
        };

        try {
            dataService.save( body, responseCallback );
        } catch (err) {
            log.error( "fatal error in query: ", err );
            responseCallback( err, null );
        }
    };

    /**
     * the standard find method use to find a single row
     *
     * @param request
     * @param response
     */
    this.find = function(request, response) {
        var id = request.params.id || request.query.id,
            session = request.headers.session;

        log.info('find the ', domain, ' from ip: ', request.ip, ', ip list: ', request.ips, ', protocal: ', request.protocol);
        log.info('find the ', domain, ' for the given id: ', id);

        var responseCallback = function(err, model) {
            log.info( domain, ' model: ', model );
            if (!model) {
                if (!err) {
                    var msg = 'no ' + domain + ' found for id: ' + id;
                    err = new Error( msg );
                }
            }

            var payload = service.createModelPayload( err, modelName, model, session );

            log.debug( "payload: ", payload );

            response.send( payload );
        };

        try {
            dataService.find( id, responseCallback );
        } catch(err) {
            log.error('find error: ', err);
            responseCallback( err, null );
        }
    };

    /**
     * an array of the standard service routes
     */
    this.routes = [
        ServiceRoute.create( 'get', domain + '/query', service.query ),
        ServiceRoute.create( 'post', domain + '/save', service.save ),
        ServiceRoute.create( 'put', domain + '/save/:id', service.save ),
        ServiceRoute.create( 'delete', domain + '/save/:id', service.save ),
        ServiceRoute.create( 'get', domain + '/find/:id', service.find ),
        ServiceRoute.create( 'get', domain + '/find', service.find )
    ];

    /**
     * create the service response wrapper object
     *
     * @param key - the object's key
     * @param value - the object's value
     * @returns response object wrapped with service response
     */
    this.createSuccessResponse = function(key, value, session) {
        var response = new ServiceResponse();

        response[ key ] = value;

        if (algorithm && session) {
            response.hmac = service.calculateDigest( value, session );
        }

        log.debug( response );

        return response;
    };

    /**
     * create the failed service response wrapper object
     *
     * @param reason - a description of the failure(s)
     * @param value - a code, or code word that points to the error message
     * @returns response object wrapped with service response
     */
    this.createFailedResponse = function(reason, code) {
        var response = ServiceResponse.createFailedResponse( reason, code );

        log.debug( response );

        return response;
    };

    /**
     * creates a payload for a single data model, or for errors
     *
     * @param err - errors or null
     * @param name - the model's name
     * @param model - the model object
     *
     * @returns payload
     */
    this.createModelPayload = function(err, name, model, session) {
        var payload = null;

        if (err) {
            payload = service.createFailedResponse( err.message, err.failCode );
        } else {
            payload = service.createSuccessResponse( name, model, session );
        }

        return payload;
    };

    /**
     * create a list payload or error payload
     *
     * @param err - and error object or null
     * @param name - name of the list
     * @param list - this list object/array/collection
     *
     * @returns payload
     */
    this.createListPayload = function(err, name, list, session) {
        var payload = null;

        if (err) {
            payload = service.createFailedResponse( err.message, err.failCode );
        } else {
            payload = service.createSuccessResponse( name, list, session );
        }

        return payload;
    };

    this.calculateDigest = function(value, key) {
        var json = JSON.stringify( value ),
            hmac = crypto.createHmac( algorithm, key ),
            code;

        hmac.update( json );
        code = hmac.digest( hmacEncoding );

        return code;
    };

    /**
     * find the ip using the list; if the list has more than one element, use the last element; else, use the
     * standard request.ip
     *
     * @param request
     * @returns the ip address
     */
    this.findIPAddress = function(request) {
        if (request.ips && request.ips.length > 1) {
            return dash.last( request.ips );
        } else {
            return request.ip;
        }
    };

    // constructor tests
    if (!log) throw new Error('delegate must be constructed with a log');
    if (!dataService) throw new Error('delegate must be constructed with a data service');
};

/**
 * extend the public methods of this abstract class to a child class.  create the
 * parent object using options passed from the child class.
 *
 * Typical use:
 *
 * var parent = AbstractWebService.extend( this, options );
 *
 * @param child
 * @param options
 * @returns parent object
 */
AbstractWebService.extend = function(child, options) {
    'use strict';
    var parent = new AbstractWebService( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractWebService;