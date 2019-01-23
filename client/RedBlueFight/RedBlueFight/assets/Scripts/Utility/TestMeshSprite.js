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
        targetSprite:
        {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let frame = this.targetSprite.getComponent(cc.Sprite).spriteFrame;
        let tgSprite = this.targetSprite.getComponent(cc.Sprite);
        // frame.vertices = new cc.vertices(0, 0, 0);
        // let newV = {
        //     x=[0, 10, 20, 30],
        //     y=[0, -10, -20, -30],
        //     triangles=[10, 20, 30],
        //     nu=[0, 10, 20, 30],
        //     nv=[0, -10, -20, -30],
        // }
        frame.vertices = [];
        for (var i = 0; i < 6; i++) {
            let x = i * 10;
            let y = i * 10;
            let u = i * 10;
            let v = i * -10;
            let nu = i * 10;
            let nv = i * -10;
            let t = (i + 1);
            frame.vertices.push({ x, y, u, v, nu, nv, t });
            // frame.vertices.triangles = [];

        }

        cc.log(frame.vertices.length);
        cc.log(tgSprite._renderData);
    },

    start() {

    },

    // update (dt) {},
});
