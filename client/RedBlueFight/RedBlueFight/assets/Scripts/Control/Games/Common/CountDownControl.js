// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
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
        RedNumber:
        {
            default: null,
            type: cc.Node,
        },
        BlueNumber:
        {
            default: null,
            type: cc.Node,
        },
        RedSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        nIndex: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.startAnimation();
    },

    Restart() {
        this.startAnimation();
    },
    startAnimation() {
        
        this.nIndex = 0;
        this.RedNumber.getComponent(cc.Sprite).spriteFrame = this.RedSprites[this.nIndex];
        this.BlueNumber.getComponent(cc.Sprite).spriteFrame = this.BlueSprites[this.nIndex];
        this.RedNumber.setScale(4, 4);
        this.BlueNumber.setScale(4, 4);
        var ra = cc.scaleTo(0.3, 1, 1);
        var ba = cc.scaleTo(0.3, 1, 1);
        this.RedNumber.runAction(ra);
        this.BlueNumber.runAction(ba);   
        this.SoundMGR.playTick();
        this.scheduleOnce(function () {
            this.nIndex++;
            this.RedNumber.getComponent(cc.Sprite).spriteFrame = this.RedSprites[this.nIndex];
            this.BlueNumber.getComponent(cc.Sprite).spriteFrame = this.BlueSprites[this.nIndex];
            this.RedNumber.setScale(4, 4);
            this.BlueNumber.setScale(4, 4);
            var ra1 = cc.scaleTo(0.3, 1, 1);
            var ba1 = cc.scaleTo(0.3, 1, 1);
            this.RedNumber.runAction(ra1);
            this.BlueNumber.runAction(ba1);
            this.SoundMGR.playTick();
        }, 1);

        this.scheduleOnce(function () {
            this.nIndex++;
            this.RedNumber.getComponent(cc.Sprite).spriteFrame = this.RedSprites[this.nIndex];
            this.BlueNumber.getComponent(cc.Sprite).spriteFrame = this.BlueSprites[this.nIndex];
            this.RedNumber.setScale(4, 4);
            this.BlueNumber.setScale(4, 4);
            var ra1 = cc.scaleTo(0.3, 1, 1);
            var ba1 = cc.scaleTo(0.3, 1, 1);
            this.RedNumber.runAction(ra1);
            this.BlueNumber.runAction(ba1);
            this.SoundMGR.playTick();
        }, 2);

        this.scheduleOnce(function () {
            this.nIndex++;
            this.RedNumber.getComponent(cc.Sprite).spriteFrame = this.RedSprites[this.nIndex];
            this.BlueNumber.getComponent(cc.Sprite).spriteFrame = this.BlueSprites[this.nIndex];
            this.RedNumber.setScale(4, 4);
            this.BlueNumber.setScale(4, 4);
            var ra1 = cc.scaleTo(0.3, 1, 1);
            var ba1 = cc.scaleTo(0.3, 1, 1);
            this.RedNumber.runAction(ra1);
            this.BlueNumber.runAction(ba1);
            this.SoundMGR.playTick();
        }, 3);

        this.scheduleOnce(function () {
            var ra1 = cc.scaleTo(0.3, 0, 0);
            var ba1 = cc.scaleTo(0.3, 0, 0);
            this.RedNumber.runAction(ra1);
            this.BlueNumber.runAction(ba1);
        }, 3.5);
        this.scheduleOnce(function () {
            this.node.active = false;
        }, 4);
    }
    // update (dt) {},
});
