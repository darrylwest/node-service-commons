/**
 * @class AbstractBaseModel
 *
 * @author: darryl.west@raincitysoftware.com
 * @created: 9/2/14
 */
var dash = require('lodash');

var AbstractBaseModel = function(params) {
    'use strict';

    if (!params) params = {};

    this.id = params.id;

    this.dateCreated = params.dateCreated ? new Date( params.dateCreated ) : params.dateCreated ;
    this.lastUpdated = params.lastUpdated ? new Date( params.lastUpdated ) : params.lastUpdated ;

    this.version = params.version ? Number( params.version ) : 0 ;
};

AbstractBaseModel.extend = function(model, params) {
    'use strict';

    var base = new AbstractBaseModel( params );

    dash.extend( model, base );

    return base;
};

module.exports = AbstractBaseModel;