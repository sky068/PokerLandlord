var gameConst = require('./gameConst');
cc.Class({
    ctor: function () {
        this._userData = JSON.parse(cc.sys.localStorage.getItem(gameConst.KEY_USER_DATA));
        if (!this._userData){
            this._userData = {};
        }

    },

    saveUserData: function () {
        cc.log('saveUserData called.');
        cc.sys.localStorage.setItem(gameConst.KEY_USER_DATA, JSON.stringify(this._userData));
    },

    getUid: function () {
        var uid = this._userData[gameConst.KEY_USER_ID];
        if (!uid){
            uid = null;
        }
        return uid;
    },

    saveUid: function (uid) {
        this._userData[gameConst.KEY_USER_ID] = uid;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
