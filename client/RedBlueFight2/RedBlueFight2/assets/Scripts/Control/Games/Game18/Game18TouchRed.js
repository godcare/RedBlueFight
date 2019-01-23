// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Game18Control = require("Game18Control");
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
            if (cc.find("Canvas").getComponent(Game18Control).GameStatus == 1) {
                var delta = event.touch.getDelta();
                var pos = event.touch.getLocation();
                // cc.log(pos + " " + delta);
                //如果是朝右滑动
                if (delta.x > 0) {
                    if (pos.y < 260) {
                        cc.find("Canvas").getComponent(Game18Control).onRotate(0, Math.sqrt(delta.x * delta.x + delta.y * delta.y));
                    }
                    else {
                        cc.find("Canvas").getComponent(Game18Control).onRotate(0, -Math.sqrt(delta.x * delta.x + delta.y * delta.y));
                    }
                }
                else {
                    if (pos.y > 260) {
                        cc.find("Canvas").getComponent(Game18Control).onRotate(0, Math.sqrt(delta.x * delta.x + delta.y * delta.y));
                    }
                    else {
                        cc.find("Canvas").getComponent(Game18Control).onRotate(0, -Math.sqrt(delta.x * delta.x + delta.y * delta.y));
                    }
                }
            }

        }, this.node);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.find("Canvas").getComponent(Game18Control).onRotate(0, 0);

        }, this.node);
    },

    // update (dt) {},
});
