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
        domain = options.domain,
        createType = options.createType;

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
     * query the domain for rows.  this is a very simple implementation that pulls
     * all rows for the given domain.  for production you probably want to override
     * this with a fully implemented query method.  but if your row count is less than
     * a few hundred, then this should work.
     *
     * @param client - a nosql client, e.g. redis
     * @param request - the query request object
     * @param callback err, response
     */
    this.query = function(client, request, callback) {
        if (!callback && typeof request === 'function') {
            callback = request;
        }

        var keysCallback = function(err, keys) {
            var list = [];

            if (err) {
                log.error( err );
                callback( err );
            }

            var loopCallback = function(err, model) {
                if (err) {
                    log.error( err );
                } else if (model) {
                    list.push( model );
                }

                var key = keys.shift();

                if (key) {
                    dao.findById( client, key, loopCallback );
                } else {
                    return callback( err, list );
                }
            };

            loopCallback();
        };

        // pull all the keys
        client.keys( dao.createDomainKey( '*' ), keysCallback );
    };

    /**
     * find the domain row for the given id.
     *
     * @param client - a nosql client, e.g. redis
     * @param id - the id of the object
     * @param callback err, response
     */
    this.findById = function(client, id, callback) {
        var key = dao.createDomainKey( id ),
            foundCallback;

        foundCallback = function(err, result) {
            var model;

            if (result) {
                model = dao.parseModel( result );
            }

            callback( err, model );
        };

        log.debug('find the model with key: ', key);
        client.get( key, foundCallback );
    };

    /**
     * insert the domain model.
     *
     * @param client - a nosql client, e.g. redis
     * @param model - the domain data model object
     * @param callback err, response
     */
    this.insert = function(client, model, callback) {
        var key,
            json,
            insertCallback;

        // get a copy...
        model = dash.clone( model );

        if (!model.id) {
            model.id = dao.createModelId();
        }

        key = dao.createDomainKey( model.id );

        if (!model.dateCreated) {
            model.dateCreated = new Date();
        }

        model.lastUpdated = new Date();
        model.version = 0;

        json = JSON.stringify( model );

        insertCallback = function(err, status) {
            callback( err, model );
        };

        log.debug('insert model: ', model);
        client.set(key, json, insertCallback);
    };

    /**
     * update the domain model.
     *
     * @param client - a nosql client, e.g. redis
     * @param model - the domain data model object
     * @param callback err, response
     */
    this.update = function(client, model, callback) {
        var key,
            json,
            updateCallback;

        // get a copy...
        model = dash.clone( model );

        if (!model.id) {
            return callback( new Error('update model has no id'));
        }

        key = dao.createDomainKey( model.id );

        if (!model.dateCreated) {
            return callback( new Error('update model has no date created'));
        }

        model.lastUpdated = new Date();
        model.version = model.version + 1;

        json = JSON.stringify( model );

        updateCallback = function(err, status) {
            callback( err, model );
        };

        log.debug('update model: ', model);
        client.set(key, json, updateCallback);
    };

    /**
     * parse the model (if JSON string) and set dateCreated and lastUpdated to date types
     *
     * @param value JSON string or model object
     * @returns model
     */
    this.parseModel = function(value) {
        var model;

        if (typeof value === 'string') {
            model = JSON.parse( value );
        } else {
            model = value;
        }

        if (typeof model.dateCreated === 'string') {
            model.dateCreated = new Date( model.dateCreated );
        }

        if (typeof model.lastUpdated === 'string') {
            model.lastUpdated = new Date( model.lastUpdated );
        }

        if (typeof createType === 'function') {
            return createType( model );
        } else {
            return model;
        }
    };

    // constructor validations
    if (!log) throw new Error('dao must be constructed with a log');
    if (!domain) throw new Error('dao must be constructed with a domain');
};

/**
 * extend the public methods of this abstract class to a child class.
 *
 * @param child - the extending class/object
 * @param options - must include a log and domain
 * @returns parent reference
 */
AbstractBaseDao.extend = function(child, options) {
    'use strict';

    var parent = new AbstractBaseDao( options );

    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractBaseDao;
