/**
 * Created by xujw on 2017/9/28.
 */

var Dispatcher = require("./dispatcher");

module.exports.gameRoute  = function (session, msg, app, cb) {
    var gameServers = app.getServersByType('game');
    if (!gameServers || gameServers.length === 0){
        cb(new Error("Can not find game servers."));
        return;
    }
    var gameServer = Dispatcher.dispatch(session.get("rid"), gameServers);
    cb(null, gameServer.id);
};

