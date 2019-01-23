// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Game8Control = require("Game8Control");
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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            // this.SoundMGR.playVoice();
            cc.find("Canvas").getComponent(Game8Control).onTouchStart();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // this.opacity = 255;

            var delta = event.touch.getDelta();
            cc.log(this.y);

            if (this.y >= -65) {
                this.x += delta.x;
                this.y += delta.y;
                cc.find("Canvas").getComponent(Game8Control).bmoveDelta = delta;
            }
            else if (cc.find("Canvas").getComponent(Game8Control).blueCheckList.indexOf(this.name) == -1) {
                this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(cc.find("Canvas").getComponent(Game8Control).bmoveDelta.x * 15, cc.find("Canvas").getComponent(Game8Control).bmoveDelta.y * 15);
                cc.find("Canvas").getComponent(Game8Control).blueCheckList.push(this.name);
                cc.find("Canvas").getComponent(Game8Control).onCheckBall(this.name, this.parent.name);

            }



            // cc.log("move:" + this.name);
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {

            if (cc.find("Canvas").getComponent(Game8Control).blueCheckList.indexOf(this.name) == -1) {
                this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(cc.find("Canvas").getComponent(Game8Control).bmoveDelta.x * 15, cc.find("Canvas").getComponent(Game8Control).bmoveDelta.y * 15);
                cc.find("Canvas").getComponent(Game8Control).blueCheckList.push(this.name);
                cc.find("Canvas").getComponent(Game8Control).onCheckBall(this.name, this.parent.name);
            }

        }, this.node);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        // cc.log("Hit " + otherCollider.node.name);
        cc.find("Canvas").getComponent(Game8Control).onBallHit(selfCollider.node.name, otherCollider.node.name, selfCollider.node.parent.name);
    }
});