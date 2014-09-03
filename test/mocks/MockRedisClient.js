/**
 *
 * @author: darryl.west@roundpeg.com
 * @created: 9/3/14
 */
var dash = require('lodash');

var MockRedisClient = function() {
    'use strict';

    var mock = this,
        modelList;

    this.initModelList = function(list, callback) {
        modelList = list;

        callback(null,  modelList);
    };

    this.get = function(key, callback) {
        var id = key.split(':')[1],
            model = dash.find( modelList, { id:id }),
            json;

        if (model) {
            json = JSON.stringify( model );
        }

        callback(null, json);
    };

    this.set = function(key, value, callback) {
        // TODO back with redis-mock
        callback(null, 'ok');
    };
};

module.exports = MockRedisClient;