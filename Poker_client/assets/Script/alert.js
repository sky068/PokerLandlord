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
        content: {
            type: cc.Label,
            default: null
        },
        shield: {
            type: cc.Node,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        this.shield.on(cc.Node.EventType.TOUCH_START, function(){
            return false;
        });
    },

    onBtnOk: function() {
        this.node.removeFromParent(true);
        this.node.destroy();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
