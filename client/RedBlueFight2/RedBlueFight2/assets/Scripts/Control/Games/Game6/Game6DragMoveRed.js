// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Game6Control = require("Game6Control");
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
        GameControl:
        {
            default: null,
            type: Game6Control,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.find("Canvas").getComponent(Game6Control).onTouchStart();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // this.opacity = 255;

            var delta = event.touch.getDelta();
            cc.log("Touched");
            if (cc.find("Canvas").getComponent(Game6Control).UnTouchList.indexOf(this.name) == -1 && cc.find("Canvas").getComponent(Game6Control).EnterList.indexOf(this.name) == -1) {
                if (this.x <= 200 && this.y <= 0) {
                    this.x += delta.x;
                    this.y += delta.y;
                    cc.find("Canvas").getComponent(Game6Control).rmoveDelta = delta;
                }
                else {
                    if (cc.find("Canvas").getComponent(Game6Control).UnTouchList.indexOf(this.name) == -1) {
                        this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(cc.find("Canvas").getComponent(Game6Control).rmoveDelta.x  * 15, cc.find("Canvas").getComponent(Game6Control).rmoveDelta.y * 15);
                        cc.find("Canvas").getComponent(Game6Control).UnTouchList.push(this.name);
                    }

                }
            }
            // cc.log("move:" + this.name);
        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            // this.opacity = 255;

            // var delta = event.touch.getDelta();
            if (cc.find("Canvas").getComponent(Game6Control).UnTouchList.indexOf(this.name) == -1 && cc.find("Canvas").getComponent(Game6Control).EnterList.indexOf(this.name) == -1) {
                this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(cc.find("Canvas").getComponent(Game6Control).rmoveDelta.x * 15, cc.find("Canvas").getComponent(Game6Control).rmoveDelta.y * 15);
            }
            // cc.find("Canvas").getComponent(Game6Control).UnTouchList.push(this.name);

            // cc.log("move:" + this.name);
        }, this.node);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        // cc.log("Hit " + otherCollider.node.name);
        this.GameControl.onBallHit(selfCollider.node.name, otherCollider.node.name);
    }
    // update (dt) {},
});
