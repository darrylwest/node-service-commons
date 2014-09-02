/**
 * @class
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
var dash = require('lodash');

var AbstractBaseDao = function(options) {
    'use strict';

    var dao = this,
        log = options.log,
        domain = options.domain;

    /**
     * create a domain key by combining domain, colon and the id
     * @param id
     * @returns {*}
     */
    this.createDomainKey = function(id) {
        if (id && id.indexOf( domain ) === 0) {
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
        callback( new Error('not implemented yet') );
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