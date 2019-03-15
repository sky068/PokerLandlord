
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
        cardPre: {
            type: cc.Prefab,
            default: null
        },
        playerLeft: cc.Node,
        playerMid: cc.Node,
        playerRight: cc.Node,
        labelRid: cc.Label,
        editor: {
            default: null,
            type: cc.EditBox
        },

        cardBoard: cc.Node,     // 装载出牌的容器

        controlNode: cc.Node,

        _index: 0,   // 座次 0/1/2
        _leftIndex: 0,
        _rightIndex: 0,
        _uid: '',
        midCardContent: cc.Node,
        leftCardContent: cc.Node,
        rightCardContent: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        pomelo.on('onAddR', this.updateOtherPlayer.bind(this));
        pomelo.on('onChat', this.onChat.bind(this));
        pomelo.on('onLeave', this.onUserLeave.bind(this));
        pomelo.on('onDeal', this.onDeal.bind(this));

        this.labelRid.string = poker.roomInfo.rid;
        var users = poker.roomInfo.users;
        cc.log('room users:' + users.toString());
        this._index = users.length - 1;
        this._uid = users[this._index];
        this.playerMid.getComponent('player').labelUid.string = this._uid;
        this.updateOtherPlayer({users: users});
        this.selectCards = [];          // 当前选择的手牌
        this.selectCardsInfo = [];      // 当前选择的手牌的信息
    },

    updateOtherPlayer: function (data) {
        var users = data.users;
        cc.log('-------------------');
        cc.log('users:' + users.length);
        var leftIndex = this._index - 1;
        this._leftIndex = leftIndex = leftIndex < 0 ? 2 : leftIndex;
        var rightIndex = this._index + 1;
        cc.log("rr:" + rightIndex);
        this._rightIndex = rightIndex = rightIndex > 2 ? 0 : rightIndex;
        cc.log('this.index:' + this._index);
        cc.log('leftIndex:' + leftIndex + ', rightIndex:' + rightIndex);

        if (leftIndex <= users.length - 1){
            this.playerLeft.getComponent('player').labelUid.string = users[leftIndex];
        }
        if (rightIndex <= users.length - 1){
            this.playerRight.getComponent('player').labelUid.string = users[rightIndex];
        }
    },

    onChat: function (data) {
        var from = data.from;
        if (from !== this._uid){
            if (this.playerLeft.getComponent('player').labelUid.string === from) {
                this.playerLeft.getComponent('player').showTalk(data.msg);
            } else {
                this.playerRight.getComponent('player').showTalk(data.msg);
            }
        }
    },

    onUserLeave: function (data) {
        var user = data.user;
        if (this.playerLeft.getComponent('player').labelUid.string === user){
            this.playerLeft.getComponent('player').showTalk(user + '离开了游戏.');
            this.playerLeft.getComponent('player').labelUid.string = 'xxxxxxx';
        } else if (this.playerRight.getComponent('player').labelUid.string === user){
            this.playerRight.getComponent('player').showTalk(user + '离开了游戏.');
            this.playerRight.getComponent('player').labelUid.string = 'xxxxxxx';
        } else {
            this.playerMid.getComponent('player').showTalk(user + '离开了游戏.');
            this.playerMid.getComponent('player').labelUid.string = 'xxxxxxx';
        }
    },

    onBtnSend: function () {
        var self = this;
        if (this.editor.string == '') return;
        cc.log('editor:' + this.editor.string);
        this.playerMid.getComponent('player').showTalk(this.editor.string);
        var msg = {
            content: this.editor.string,
            target: '*'
        };
        pomelo.request("game.gameHandler.send",msg, function (data) {
            cc.log('send suc:' + data);
            self.editor.string = '';
        });
    },

    onKeyboardReturn: function () {
        this.onBtnSend(null);
    },

    // 开牌
    onDeal: function (data) {
        cc.log('~~~~~~~~~...onDeal...~~~~~~~~~');
        cc.log(JSON.stringify(data));
        this.allCards = data;
        var cards = data.cards;
        var bottom = data.bottom;
        // 初始化牌
        var leftCards = cards[this._leftIndex];
        var rightCards = cards[this._rightIndex];
        var myCards = cards[this._index];

        /***************test**************/
        // myCards = [];
        // for (var i=1; i<=3; i++){
        //     myCards.push({grade:11, face:i},{grade:12, face:i},{grade:13, face:i},{grade:14, face:i},{grade:15, face:i});
        // }
        // myCards.push({grade:16,face:-1},{grade:17,face:-1});
        /*************test end***********/

        this.dealCards(leftCards, 0);
        this.dealCards(myCards, 1);
        this.dealCards(rightCards, 2);
        // 1秒后排序自己的手牌
        setTimeout(function () {
            sortBig2Samll(myCards);
            cc.log('排序手牌.');
            this.dealCards(myCards, 1);
        }.bind(this),1000);

        // 如果自己是地主则把底牌加入 默认第一个玩家是地主
        if (this._index === 0){
            this.playerMid.getComponent('player').landlord.active = true;
            setTimeout(function () {
                myCards = myCards.concat(bottom);
                sortBig2Samll(myCards);
                this.dealCards(myCards, 1);
            }.bind(this), 3000);
        }
    },

    /**
     *  摆放手牌
     * @param cards 手牌
     * @param user  {Number} 0:left, 1:mid, 2:right
     */
    dealCards: function (cards, user) {
        var parent = null;
        switch (user){
            case 0:{
                parent = this.leftCardContent;
                this.playerLeft.getComponent('player').counts.string = cards.length;
                break;
            }
            case 1:{
                parent = this.midCardContent;
                this.playerMid.getComponent('player').counts.string = cards.length;
                break;
            }
            case 2:{
                parent = this.rightCardContent;
                this.playerRight.getComponent('player').counts.string = cards.length;
                break;
            }
            default: break;
        }
        for (var i=0; i<parent.getChildren().length; i++){
            var child = parent.getChildren()[i];
            child.destroy();
        }
        parent.removeAllChildren(true);

        this.selectCards.splice(0,this.selectCards.length);
        this.selectCardsInfo.splice(0,this.selectCardsInfo.length);

        var bottom = this.allCards.bottom;
        for (var i=0; i<cards.length; i++){
            var cardData = cards[i];
            var card = cc.instantiate(this.cardPre);
            card.getComponent('card').initCard(cardData, this.onCardTouch.bind(this));
            if (user === 1){
                card.getComponent('card').touchEnbaled = true;
            }
            card.parent = parent;
            card.setPosition(cc.v2(0,0));

            for (var j=0; j<bottom.length; j++){
                var tmp = bottom[j];
                if (cardData.grade === tmp.grade && cardData.face === tmp.face){
                    // 是底牌则默认是选择状态
                    card.getComponent('card').setSelected(true, false);
                    this.selectCards.push(card.getComponent('card'));
                    this.selectCardsInfo.push(cardData);
                }
            }
        }
    },

    onCardTouch: function (selected, card) {
        if (selected){
            this._addSelectedCard(card);
        } else {
            this._rmSelectedCard(card);
        }

        cc.log('当前选择手牌共' + this.selectCardsInfo.length + '张: ' + JSON.stringify(this.selectCardsInfo));
    },

    _addSelectedCard: function (card) {
        if (this._findSelectdCard(card) === -1){
            this.selectCards.push(card);
            this.selectCardsInfo.push(card.cardInfo);
        }
    },
    _rmSelectedCard: function (card) {
        var res = this._findSelectdCard(card);
        if (res !== -1){
            cc.log('移除');
            this.selectCards.splice(res,1);
            this.selectCardsInfo.splice(res,1);
        }
    },
    _findSelectdCard: function (card) {
        var res = -1;
        for (var i=0; i<this.selectCardsInfo.length; i++){
            var tmp = this.selectCardsInfo[i];
            if (tmp.grade === card.cardInfo.grade && tmp.face === card.cardInfo.face){
                res = i;
                break;
            }
        }
        return res;
    },
    
    onPutCard: function () {
        // 需要判断所选手牌是否符合规则
        cc.log('出牌:' + JSON.stringify(this.selectCardsInfo));
        var cardType = judgeCardType(this.selectCardsInfo);
        cc.log('cardType = ' + cardType);

        if (cardType !== CARD_TYPE_INVALID){
            // 把出的牌放到牌桌上
            // 先移除之前出的牌
            for (var i=0; i<this.cardBoard.getChildren().length; i++){
                var card = this.cardBoard.getChildren()[i];
                card.destroy();
            }
            this.cardBoard.removeAllChildren(true);

            for (var i=0; i<this.selectCards.length; i++){
                var card = this.selectCards[i];
                card.node.parent = this.cardBoard;
                card.node.setPosition(cc.v2(0,0));
            }

            this.selectCards.splice(0,this.selectCards.length);
            this.selectCardsInfo.splice(0,this.selectCardsInfo.length);

            // 出牌
            var msg = {
                cards: this.selectCardsInfo,
                index: this._index
            };
            pomelo.request("game.gameHandler.game", msg, function (data) {

            });
        }
    },

    onAbandon: function () {
        // 放弃
        this.selectCards.splice(0,this.selectCards.length);
        this.selectCardsInfo.splice(0,this.selectCardsInfo.length);

        var cards = this.midCardContent.getChildren();
        for (var i=0; i<cards.length; i++){
            var card = cards[i];
            if (card){
                card.getComponent('card').setSelected(false);
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
