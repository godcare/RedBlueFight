// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Game10Control = require("Game10Control");
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
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // this.opacity = 255;
            if (cc.find("Canvas").getComponent(Game10Control).GameStatus == 1) {
                var delta = event.touch.getDelta();
                if (this.x >= -150 && this.x <= 150) {
                    this.x -= delta.x;
                    this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(delta.x * 15, 0);
                }
                else if ((this.x - delta.x) > -150 || (this.x - delta.x) < 150) {
                    this.x -= delta.x;
                    this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(delta.x * 15, 0);
                }
            }
      
        }, this.node);
    },

    update(dt) {
        this.node.y = -90;
        if (this.node.x < -150) {

            this.node.x = -150;
            this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            // cc.find("Canvas").getComponent(Game10Control).OnPanelHitBorder(this.node.name, "left");
        }
        else if (this.node.x > 150) {
            this.node.x = 150;
            this.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            // cc.find("Canvas").getComponent(Game10Control).OnPanelHitBorder(this.node.name, "right");
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        // cc.log("Hit " + otherCollider.node.name);
        cc.find("Canvas").getComponent(Game10Control).OnPanelHitBorder(selfCollider.node.name, otherCollider.node.name);
    }

});
