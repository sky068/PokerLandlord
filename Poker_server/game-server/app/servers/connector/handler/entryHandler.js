var Code = require("../../../../../shared/code");
module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
var CHANEL_NAME = "world";

Handler.prototype.enter = function (msg, session, next) {
    var self = this;
    var uid = msg.uid;
    var sid = this.app.get('serverId');
    var sessionService = self.app.get('sessionService');
    if (!! sessionService.getByUid(uid)){
        next(null, {
            code: Code.FAIL,
            error: true
        });
        return;
    }
    console.log("user enter:" + uid);
    session.bind(uid);
    session.set('rid', CHANEL_NAME);
    session.push('rid', function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });

    // 后端推送使用
    session.set('sid', sid);
    session.push('sid', function (err) {
       if(err){
           console.error("set sid for session service failed! error is: %j", err.stack);
       }
    });

    session.on('closed', onUserLeave.bind(null, self.app));

    self.app.rpc.game.gameRemote.add(session, uid, sid, function (users) {
        next(null, {users: users});
    });
};

var onUserLeave = function (app, session) {
    if (!session || !session.uid) {
        return;
    }
    console.log("user leave: " + session.uid);
    app.rpc.game.gameRemote.kick(session, session.get('rid'), session.uid, app.get('serverId'), null);
};


/**************poker start**************/
// 开房间
Handler.prototype.openRoom = function (msg, session, next) {
    var self = this;
    var uid = session.uid;
    var sid = self.app.get("serverId");
    var channelService = this.app.get('channelService');
    // 随机一个房间号
    var rid = (Math.random() * 10000000).toFixed();
    rid = (rid.toString() + "0000000").substr(0,7);   // 七位房间号码
    while (channelService.getChannel(rid, false)){
        rid = (Math.random() * 10000000).toFixed();
        rid = rid.toString().substr(0,7);
    }
    session.set('rid', rid);
    session.push('rid', function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });

    self.app.rpc.game.gameRemote.createRoom(session, uid, rid, sid, function (data) {
        next(null, data);
    });
};

/**************poker end*************/


/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function (msg, session, next) {
    var result = {
        topic: 'publish',
        payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
    };
    next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function (msg, session, next) {
    var result = {
        topic: 'subscribe',
        payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
    };
    next(null, result);
};
