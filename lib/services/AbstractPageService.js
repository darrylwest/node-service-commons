/**
 * @class AbstractPageService
 *
 * @author darryl.west@raincitysoftware.com
 * @created 2016-09-22
 */
const dash = require('lodash'),
    uuid = require('uuid'),
    fs = require('fs');

const AbstractPageService = function(options) {
    'use strict';

    const service = this,
        log = options.log;

    let pageCache = {};

    this.getPageCache = function() {
        return pageCache;
    };

    const readFile = function(file, callback) {
        log.info('read the template file: ', file);

        fs.readFile( file, (err, data) => {
            if (err) {
                log.error( err );
                // emit the error
                return callback(err, `<h2>File Read Error: ${err.message}</h2>`);
            }

            let text = data.toString();

            pageCache[ file ] = {
                cacheDate:Date.now(),
                text:text
            };

            return callback(null, text);
        });
    };

    /**
     * read the template file from the template path
     */
    this.readTemplateFile = function(file, callback) {
        const obj = pageCache[ file ];

        if (!obj) {
            return readFile( file, callback );
        }

        fs.stat( file, (err, stats) => {
            if (err) {
                log.error( err );
                return callback( null, obj.text );
            } else if (stats.mtime.getTime() > obj.cacheDate) {
                log.info('file changed, so re-read file: ', file);
                return readFile( file, callback );
            } else {
                return callback( null, obj.text );
            }
        });
    };

    if (!log) {
        throw new Error('ProposalPageService must be constructed with a log object');
    }
};

AbstractPageService.extend = function(child, options) {
    'use strict';

    let parent = new AbstractPageService( options );
    dash.extend( child, parent );

    return parent;
};

module.exports = AbstractPageService;
