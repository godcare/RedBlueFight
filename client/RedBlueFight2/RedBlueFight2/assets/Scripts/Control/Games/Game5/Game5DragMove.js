// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Game5Control = require("Game5Control");
var SoundManager = require("SoundManager");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        SoundMGR:
        {
            default: null,
            type: SoundManager,
        },
        GameControl5:
        {
            default: null,
            type: cc.Node,
        },
        EventData: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.log("load " + this.GameControl5.name);
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // this.SoundMGR.playVoice();
            cc.find("Canvas").getComponent(Game5Control).onTouchStart();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // this.opacity = 255;
            // cc.log("move "+this.GameControl5.name);

            var tmpStr = cc.find("Canvas").getComponent(Game5Control).TouchableBalls;
            cc.log("touchable:" + tmpStr);
            if (tmpStr.indexOf(this.name) != -1) {
                var delta = event.touch.getDelta();
                this.x += delta.x;
                this.y += delta.y;
            }
            // cc.log("move:" + this.name);
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var tmpStr = cc.find("Canvas").getComponent(Game5Control).TouchableBalls;
            cc.log("touchable:" + tmpStr);
            if (tmpStr.indexOf(this.name) != -1) {
                cc.find("Canvas").getComponent(Game5Control).onEndMove(this.name);
            }
        }, this.node);
    },

    start() {

    },

    // update (dt) {},
});
