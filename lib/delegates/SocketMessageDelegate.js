/**
 * @class SocketMessageDelegate
 * 
 * @author darryl.west@raincitysoftware.com
 * @created 2016-09-26
 */
const dash = require('lodash'),
    DAY = 24 * 60 * 60 * 1000;

const SocketMessageDelegate = function(options) {
    'use strict';

    const smd = this,
        log = options.log,
        origin = (dash.random(10000, 99999999999) + 100000000000).toString(19),
        messageCount = dash.isNumber(options.messageCount) ? Math.round( options.messageCount ) : 0;

    /**
     * create the standard request message wrapper
     */
    this.createRequestWrapper = function(mid) {
        const wrapper = {
            mid:mid || smd.createMessageId(),
            ts:Date.now()
        };

        log.info('wrapper: ', wrapper);

        return wrapper;
    };

    /**
     * combines origin, date trucated by day and message count + 100000
     */
    this.createMessageId = function() {
        return `${origin}-${(Date.now() % DAY).toString(16)}-${1000000 + messageCount}`;
    };

    /**
     * create the minimal response wrapper with mid, ts, and status ok
     * 
     * @Throws - if mid is missing; should be the original requests's message id
     */
    this.createResponseWrapper = function(mid) {
        if (!mid) {
            let err = new Error('message responses require a message id');
            log.error( err );
            throw err;
        }

        const wrapper = {
            mid:mid,
            ts:Date.now(),
            status: SocketMessageDelegate.OK
        };

        return wrapper;
    };

    /**
     * create the minimal failed response wrapper with mid, ts, status failed and optional reason
     * 
     * @Throws - if mid is missing; should be the original requests's message id
     */
    this.createFailedWrapper = function(mid, reason) {
        const wrapper = smd.createResponseWrapper( mid );
        wrapper.status = SocketMessageDelegate.FAILED;

        if (reason) {
            wrapper.reason = reason;
        }

        return wrapper;
    };

    if (!log) {
        throw new Error('SocketMessageDelegate must be constructed with a log object');
    }
};

SocketMessageDelegate.OK = 'ok';
SocketMessageDelegate.FAILED = 'failed';

module.exports = SocketMessageDelegate;
