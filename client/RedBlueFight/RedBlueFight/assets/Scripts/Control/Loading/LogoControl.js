// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        targetProgress: {
            default: null,
            type: cc.ProgressBar
        },
        targetProgressValue: 0,
        speed: 1
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    update: function (dt) {
        if (this.targetProgress.progress < this.targetProgressValue && this.targetProgress.progress < 1) {
            this.targetProgress.progress += dt * 1;
            if (this.targetProgress.progress >= 1) {
                cc.director.loadScene("MainMenu");
            }
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.targetProgressValue += 0.15;

    }

    // update (dt) {},
});
