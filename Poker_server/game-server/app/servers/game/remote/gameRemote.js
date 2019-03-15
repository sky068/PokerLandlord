/**
 * Created by xujw on 2017/9/28.
 */

module.exports = function (app) {
    return new GameRemote(app);
};

var GameRemote = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

var CHANEL_NAME = "world";

GameRemote.prototype.add = function (uid, sid, cb) {
    var channel = this.channelService.getChannel(CHANEL_NAME, true);
    var param = {
        route: 'onAdd',
        user: uid
    };
    channel.pushMessage(param);

    if (!! channel){
        channel.add(uid, sid);
    }
    cb(this.getUsers(CHANEL_NAME));
};

/**
 *
 * @param name channelName
 * @return {Array} useIds
 */
GameRemote.prototype.getUsers = function (name) {
    var users = [];
    var channel = this.channelService.getChannel(name, true);
    if (!!channel){
        users = channel.getMembers();
    }
    return users;
};

GameRemote.prototype.kick = function (rid, uid, sid, cb) {
    var channel = this.channelService.getChannel(CHANEL_NAME, true);
    if (!!channel){
        channel.leave(uid, sid);
    }
    if (rid){
        channel = this.channelService.getChannel(rid, false);
        if (!!channel){
            channel.leave(uid, sid);
            if (channel.getMembers().length === 0){
                console.log('delete channel:' + rid);
                this.channelService.destroyChannel(rid);
            }
        }
    }
    var param = {
        route: 'onLeave',
        user: uid
    };
    channel.pushMessage(param);
    cb();
};

GameRemote.prototype.createRoom = function (uid, rid, sid, cb) {
    // 创建房间
    var channel = this.channelService.getChannel(rid, true);
    if (!! channel){
        channel.add(uid, sid);
    }
    //todo: 房卡剩余数量返回
    cb({rid:rid, users:this.getUsers(rid)});
};



























