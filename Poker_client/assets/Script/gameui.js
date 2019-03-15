// var pomelo = require('./Pomelo/pomelo-client');
var dataMgr = require('./dataMgr');

// 方便全局使用
window.poker = window.poker || {};
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        alertPre: {
            type: cc.Prefab,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        poker.showAlert = function(text) {
            var alert = cc.instantiate(self.alertPre);
            alert.getComponent('alert').content.string = text;
            alert.setPosition(cc.v2(0,0));
            cc.director.getScene().getChildByName('Canvas').addChild(alert);
        };
        poker.roomInfo = {};

        poker.dataMgr = new dataMgr();
    },

    start: function (){
        cc.game.addPersistRootNode(this.node);

        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.log("游戏进入后台");
            poker.dataMgr.saveUserData();

        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.log("游戏返回前台");
        });
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
