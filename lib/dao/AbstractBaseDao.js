/**
 * @class AbstractBaseDao
 * @classdesc A NoSQL basic implementation optimized for redis.  It also serves as a facade
 * for other NoSQL databases like leveldb, couch, etc.
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
var dash = require('lodash'),
    uuid = require('node-uuid');

var AbstractBaseDao = function(options) {
    'use strict';

    var dao = this,
        log = options.log,
        domain = options.domain;

    /**
     * create a unique model id
     * @returns a guid-like thing
     */
    this.createModelId = function() {
        return uuid.v4().replace(/-/g, '');
    };

    /**
     * create a domain key by combining domain, colon and the id
     *
     * @param id - the model id; if id is null an error is thrown
     * @returns domain key
     */
    this.createDomainKey = function(id) {
        if (!id) throw new Error('domain key requires model id');

        if (id.indexOf( domain ) === 0) {
            return id;
        } else {
            return [ domain, ':', id ].join('');
        }
    };

    /**
     * query the domain for rows.  this is a no-op implementation
     *
     * @param client - a nosql client, e.g. redis
     * @param request - the query request object
     * @param callback err, response
     */
    this.query = function(client, request, callback) {
        callback( new Error('not implemented yet') );
    };

    /**
     * find the domain row for the given id.  this is a no-op implementation
     *
     * @param client - a nosql client, e.g. redis
     * @param id - the id of the object
     * @param callback err, response
     */
    this.findById = function(client, id, callback) {
        var key = dao.createDomainKey( id),
            foundCallback;

        foundCallback = function(err, result) {
            var model;

            if (result) {
                model = JSON.parse( result );
            }

            callback( err, result );
        };

        log.info('find the model with key: ', key);
        client.get( key, foundCallback );
    };

    /**
     * insert the domain model.  this is a no-op implementation
     *
     * @param client - a nosql client, e.g. redis
     * @param model - the domain data model object
     * @param callback err, response
     */
    this.insert = function(client, model, callback) {
        callback( new Error('not implemented yet') );
    };

    /**
     * update the domain model.  this is a no-op implementation
     *
     * @param client - a nosql client, e.g. redis
     * @param model - the domain data model object
     * @param callback err, response
     */
    this.update = function(client, model, callback) {
        callback( new Error('not implemented yet') );
    };

    // constructor validations
    if (!log) throw new Error('dao must be constructed with a log');
    if (!domain) throw new Error('dao must be constructed with a domain');
};

/**
 * extend the public methods of this abstract class to a child class.
 *
 * @param child - the extending class/object
 * @param options - must inclue a log and domain
 * @returns parent reference
 */
AbstractBaseDao.extend = function(child, options) {
    'use strict';

    var parent = new AbstractBaseDao( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractBaseDao;