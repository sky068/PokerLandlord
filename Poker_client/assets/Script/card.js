/**
 * grade 牌面点数(3-13:3-K, 14:A, 15:2, 16:小王 17:大王)
 * face  牌面花色(1:黑桃、2:红桃、3:梅花、4:方块)
 */
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
        labelCount: cc.Label,
        labelFace: cc.Label,
        labelCount2: cc.Label,
        labelFace2: cc.Label,
        // cardCount: {
        //     default: 0,
        //     visible: false
        // },
        // cardFace: {
        //     default: 0,
        //     visible: false
        // },
        //

        touchEnbaled: {
            default: false,
            visible: false
        },
        selected: {
            default: false,
            visible: false
        },
        cardInfo: {
            default:null,
            visible: false
        }
},

    // use this for initialization
    onLoad: function () {
        if (this.touchEnbaled){
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        }
    },

    onTouchStart: function () {
        this.setSelected(!this.selected);
        if (this.touchCalback){
            this.touchCalback(this.selected,this);
        }
        return true;
    },

    setSelected: function (select, act) {
        if (act === undefined) act = true;
        this.selected = select;
        this.node.stopAllActions();
        var posY = this.selected?20:0;
        if (act){
            this.node.runAction(cc.moveTo(0.1,cc.v2(0,posY)));
        }else {
            this.node.y = posY;
        }
    },

    initCard: function (cardInfo, touchCall) {
        var faceInfo = {
            '1': '黑\n桃',
            '2': '红\n桃',
            '3': '梅\n花',
            '4': '方\n块'
        };
        var grade = cardInfo.grade;
        var face = cardInfo.face;
        this.cardInfo = cardInfo;
        this.touchCalback = touchCall;
        if (grade <= 15){
            cc.assert(face>=1 && face<=4);
            this.labelFace.string = faceInfo[face.toString()];
            this.labelFace2.string = faceInfo[face.toString()];

            if (grade <= 10){
                this.labelCount.string = grade;
                this.labelFace2.string = grade;
            } else if (grade === 11){
                this.labelCount.string = 'J';
                this.labelFace2.string = 'J';
            } else if (grade === 12){
                this.labelCount.string = 'Q';
                this.labelFace2.string = 'Q';
            } else if (grade === 13) {
                this.labelCount.string = 'K';
                this.labelFace2.string = 'K';
            } else if (grade === 14) {
                this.labelCount.string = 'A';
                this.labelFace2.string = 'A';
            } else {
                this.labelCount.string = '2';
                this.labelFace2.string = '2';
            }
        } else if (grade === 16){
            this.labelCount.string = '小\n王';
            this.labelFace2.string = '小\n王';
            this.labelFace.node.active = false;
            this.labelFace2.node.active = false;
        } else if (grade === 17){
            this.labelCount.string = '大\n王';
            this.labelFace2.string = '大\n王';
            this.labelFace.node.active = false;
            this.labelFace2.node.active = false;
        } else {
            cc.assert(count <= 17 && face <=4,'wrong card count or face.');
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
