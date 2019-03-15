/**
 * Created by xujw on 2017/9/28.
 */

var gameRemote = require('../remote/gameRemote');
var Code = require('../../../../../shared/code');
var Card = require('../../../../util/pokerCard');
var Utils = require('../../../../util/pokerUitls');


module.exports = function (app) {
    return new GameHandler(app);
};

var GameHandler = function (app) {
    this.app = app;
    this.cards = {};
};

var gameHandler = GameHandler.prototype;
var CHANEL_NAME = "world";
gameHandler.send = function (msg, session, next) {
    var uid = session.uid;
    var rid = session.get('rid');
    var channelService = this.app.get('channelService');
    var param = {
        msg: msg.content,
        from: uid,
        target: msg.target
    };
    var channel = channelService.getChannel(rid, false);
    if (msg.target == '*'){
        channel.pushMessage('onChat', param);
    }else {
        var tuid = msg.target;
        var tsid = channel.getMember(tuid)['sid'];
        channelService.pushMessageByUids('onChat', param, [{
            uid: tuid,
            sid: tsid
        }]);
    }

    next(null, {
        route: msg.route
    });
};


/*************poker start*************/
gameHandler.enterRoom = function (msg, session, next) {
    var self = this;
    var rid = msg.rid;
    var channelService = this.app.get('channelService');
    var channel = channelService.getChannel(rid, false);
    if (!rid || !channel){
        next(null, {code: Code.GAME.FA_ROOM_NOT_EXIST, error: true });
        return;
    }

    if (channel.getMembers().length > 2){
        next(null, {code: Code.GAME.FA_ROOM_FULL, error: true });
        return;
    }
    session.set('rid', rid);
    session.push('rid', function(err) {
        if(err) {
            console.error('set rid for session service failed! error is : %j', err.stack);
        }
    });
    // 将玩家加入房间
    channel.add(session.uid, session.get('sid'));
    var users = channel.getMembers();
    var param = {
        uid: session.uid,
        users: users
    };

    // this.app.get('channelService').broadcast("onAddR", {user: session.uid});

    next(null,{code: Code.GAME.FA_ROOM_OK, users: users});
    channel.pushMessage('onAddR', param);

    if (channel.getMembers().length === 3){
        // 人齐了，开牌
        setTimeout(function () {
            var cards = self.shuffleCards();
            console.log('开始发牌.');
            console.log('共：' + cards.length + '牌.');
            // 每人17张牌， 三张底牌
            var param = {
                cards:[cards.slice(0,17), cards.slice(17,34), cards.slice(34,51)],
                bottom: cards.slice(51,cards.length)
            };
            self.cards[rid.toString()] = param;
            channel.pushMessage('onDeal', param);
        }, 500);
    }
};

/**
 *  初始化牌堆(54张)
 *
 */
gameHandler.shuffleCards = function () {
    var cardsArr = [];
    // 牌面3-K、4花色(黑、红、花、块）
    for (var i=3; i<=15; i++){
        for(var j=1; j<=4; j++){
            var card = new Card(i, j);
            cardsArr.push(card);
        }
    }
    // 大小王
    cardsArr.push(new Card(16,0));
    cardsArr.push(new Card(17,0));
    // 洗牌
    Utils.shuffle(cardsArr);
    return cardsArr;
};
/******************poker end*****************/
