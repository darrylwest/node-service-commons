/**
 * @class TestDataset
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/11/14 10:36 AM
 */
const dash = require("lodash" ),
    uuid = require('node-uuid'),
    AbstractBaseModel = require('../../lib/models/AbstractBaseModel');

const TestDataset = function() {
    "use strict";

    const dataset = this;

    /**
     * create the standard ID using uuid without separators
     * @returns generated id
     */
    this.createId = function() {
        let id = uuid.v4();

        return id.replace(/-/g, '');
    };

    /**
     * create a standard uuid
     * @returns uuid
     */
    this.createUUID = function() {
        return uuid.v4();
    };

    /**
     * generate params for a base model object, id, dateCreated, lastUpdated and version
     *
     * @returns obj with values id, dateCreated, lastUpdated, version
     */
    this.createBaseModelParams = function() {
        var obj = {};

        obj.id = dataset.createId();

        var dt = new Date();
        obj.dateCreated = dt.toISOString();
        obj.lastUpdated = dt.toISOString();

        obj.version = 0;

        return obj;
    };

    this.createModel = function() {
        return new AbstractBaseModel( dataset.createBaseModelParams() );
    };

    /**
     * create a list of data models
     *
     * @param count - the number of models to create
     * @param fn - a closure to create a single model
     */
    this.createModelList = function(count, fn) {
        let n = (typeof count === "number") ? count : 10;
        if (!fn) {
            fn = dataset.createModel;
        }

        let list = [];

        for (var i = 0; i < n; i++) {
            list.push( fn.call() );
        }

        return list;
    };

    /**
     * create a random IPV4 address
     */
    this.createRandomIP = function() {
        var parts = [
            dash.random(1,255),
            dash.random(1,255),
            dash.random(1,127),
            dash.random(1,99)
        ];

        return parts.join('.');
    };
};

/**
 * extend the child class
 *
 * @param child
 * @returns parent
 */
TestDataset.extend = function(child) {
    'use strict';
    var parent = new TestDataset();

    dash.extend( child, parent );

    return parent;
};

module.exports = TestDataset;
