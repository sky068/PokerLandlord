/**
 * Created by xujw on 2017/9/28.
 */

var Code = require("../../../../../shared/code");
var dispatcher = require("../../../../util/dispatcher");
var GateHandler = function (app) {
    this.app = app;
};

module.exports = function (app) {
    return new GateHandler(app);
};

GateHandler.prototype.queryEntry = function (msg, session, next) {
    var uid = msg.uid;
    if (!uid){
        next(null, {
            code: Code.FAIL
        });
        return;
    }

    var connectors = this.app.getServersByType('connector');
    if (!connectors || connectors.length === 0){
        next(null,{
            code: Code.GATE.FA_NO_SERVER_AVALABLE,
            error: true
        });
        return;
    }

    var connector = dispatcher.dispatch(uid, connectors);
    next(null, {
        code: Code.OK,
        host: connector.host,
        port: connector.clientPort
    });
};
