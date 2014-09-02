/**
 * @class
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
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

    this.query = function(client, request, callback) {
        callback( new Error('not implemented yet') );
    };

    this.findById = function(client, id, callback) {
        callback( new Error('not implemented yet') );
    };

    this.insert = function(client, model, callback) {
        callback( new Error('not implemented yet') );
    };

    this.update = function(client, model, callback) {
        callback( new Error('not implemented yet') );
    };

    // constructor validations
    if (!log) throw new Error('dao must be constructed with a log');
    if (!domain) throw new Error('dao must be constructed with a domain');
};

module.exports = AbstractBaseDao;