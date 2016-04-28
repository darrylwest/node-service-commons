/**
 * @class CommonBootStrap - load and possibly extend this class to parse command line options.
 *
 * @author: darryl.west@roundpeg.com
 * @created: 8/10/14 3:42 PM
 */
const parser = require('commander' );

const CommonBootStrap = function(version) {
    'use strict';
    const bootStrap = this;

    // set the command line args and defaults, but just once
    parser.options = [];
    parser.commands = [];
    parser
        .version( version )
        .option('-e, --env [env]', 'set the environment, defaults to production', 'production')
        .option('-c --configfile [configfile]', 'set the config file' )
        .option('-l, --logfile [logfile]', 'set the logfile', 'node-service-' + process.pid + '.log' );

    /**
     * return the parser to enable adding more switches
     */
    this.getParser = function() {
        return parser;
    };

    /**
     * parse the command line options
     */
    this.parseCommandLine = function(argv) {
        parser.parse( argv );

        return parser;
    };
};

module.exports = CommonBootStrap;
