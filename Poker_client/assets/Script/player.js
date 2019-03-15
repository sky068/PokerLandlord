// var pomelo = require('./Pomelo/pomelo-client');
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
        labelUid: cc.Label,
        talk: cc.Label,
        counts: cc.Label,       // 剩余手牌数量
        landlord: cc.Node,      // 地主标识
        icon: cc.Sprite
    },

    showTalk: function (text) {
        var self = this;
        if (this.talk.node.active)   return;
        this.talk.node.active = true;
        if (text){
            this.talk.string = text;
        }
        this.scheduleOnce(function () {
            self.talk.node.active = false;
        }, 3);
    },

    // use this for initialization
    onLoad: function () {

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
