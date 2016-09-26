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
        origin = (dash.random(10000, 99999999999) + 100000000000).toString(19);

    let messageCount = dash.isNumber(options.messageCount) ? Math.round( options.messageCount ) : 0;

    /**
     * serialize the wrapper and send a message ; return the error and message id in callback
     */
    this.sendSocketMessage = function(socket, wrapper, callback) {
        socket.send( JSON.stringify( wrapper ), (err) => {
            if (err) {
                log.error( 'message error: ', err, ' sending ', wrapper );
            }

            return callback( err, wrapper.mid );
        });
    };

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
     * combines origin, date trucated by day and message count + 100000; increments the message count
     */
    this.createMessageId = function() {
        messageCount++;
        return `${origin}-${(Date.now() % DAY).toString(16)}-${dash.padStart(messageCount, 6, '0')}`;
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

    this.getMessageCount = function() {
        return messageCount;
    };

    this.getOrigin = function() {
        return origin;
    };

    if (!log) {
        throw new Error('SocketMessageDelegate must be constructed with a log object');
    }
};

SocketMessageDelegate.OK = 'ok';
SocketMessageDelegate.FAILED = 'failed';

module.exports = SocketMessageDelegate;
