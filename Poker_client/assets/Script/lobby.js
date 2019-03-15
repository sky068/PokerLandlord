
// var pomelo = require('./Pomelo/pomelo-client');
var dataMgr = require('./dataMgr');
cc.Class({
    extends: cc.Component,

    properties: {

        // defaults, set visually when attaching this script to the Canvas
        editor: {
            type: cc.EditBox,
            default: null
        },
        inputNode: cc.Node,
        inputShiled: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        // listen
        var self = this;
        pomelo.on("onAdd", function (data) {
            cc.log("user:" + data.user + " enter game.");
        });
        pomelo.on('onLeave', function(data) {
            var user = data.user;
            cc.log("user:" + user + " leave game.");
        });

        var uid = poker.dataMgr.getUid();
        if (!uid){
            uid = this.uid = "u" + parseInt(new Date().getTime() / 1000);
            poker.dataMgr.saveUid(uid);
        }
        cc.log("uid = " + uid);
        pomelo.init({
            host: '127.0.0.1',
            port: '3014'
        }, function () {
            pomelo.request("gate.gateHandler.queryEntry",{uid: uid},function (data) {
                // pomelo.disconnect();
                if (data.code === 500){
                    poker.showAlert('login error(500)');
                    return;
                }
                cc.log('connect to gate server suc.');
                // 连接connector
                pomelo.init({
                    host: data.host,
                    port: data.port
                }, function () {
                    pomelo.request("connector.entryHandler.enter", {uid: uid}, function (data) {
                        if (data.code === 500){
                            poker.showAlert('connect error.');
                            return;
                        }
                        cc.log("---------entryHandler.enter--------");
                        cc.log("now users counts:" + data.users.length);
                    });
                });
            })
        });

    },

    onOpenRoom: function (sender) {
        pomelo.request("connector.entryHandler.openRoom", function (data) {
            // 开房间成功刷新房卡
            cc.log("open room success!roomId:" + data.rid + " num:" + data.users.length);
            poker.roomInfo.rid = data.rid;
            poker.roomInfo.users = data.users;

            cc.director.loadScene('game');
        });
    },

    onEnterRoom: function (sender) {
        this.inputNode.active = true;
        this.inputShiled.on(cc.Node.EventType.TOUCH_START, function () {
            // 屏蔽触摸
        });
    },

    onInputOk: function () {
        var self = this;
        pomelo.request("game.gameHandler.enterRoom",{rid:self.editor.string}, function (data) {
            if (data.code !== 3000){
                poker.showAlert('enter room failed!code:' + data.code);
                this.onInputCancle(null);
            }else {
                poker.roomInfo.users = data.users;
                poker.roomInfo.rid = self.editor.string;

                cc.director.loadScene('game');
            }
        });
    },

    onInputCancle: function () {
        // this.inputShiled.off(cc.Node.EventType.TOUCH_START);
        this.inputNode.active = false;
    }

    // called every frame
    // update: function (dt) {
    //
    // }
});
