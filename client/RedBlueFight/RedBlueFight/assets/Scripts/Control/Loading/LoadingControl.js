// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameData = require("GameData");
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
        loadingProgress:
        {
            default: null,
            type: cc.ProgressBar
        },
        targetBall:
        {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad: function () {
        cc.director.getPhysicsManager().enabled = true;
        cc.log("Create GameData");
        Global.GameData = new GameData();
        if (CC_WECHATGAME) {
            wx.showShareMenu({ withShareTicket: true });
            cc.loader.loadRes("Images/Share", function (err, data) {
                if (err) {
                    cc.log(err.message);
                }
                
                wx.onShareAppMessage(function (res) {
                    return {
                        title: "超经典游戏红蓝大作战2登陆小程序啦！一起来玩吧！",

                        imageUrl: data.url,
                        success(res) {
                            console.log(res)
                        },
                        fail(res) {
                            console.log(res)
                        }
                    }
                })

            });
        }
    },
    start() {
        this.InitData();
    },

    InitData: function () {
        this.scheduleOnce(function () {
            cc.log("called" + this.targetBall.name);
            this.targetBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(-2000, 1000);
        }, 1.5);
    },

    // update (dt) {},
});
