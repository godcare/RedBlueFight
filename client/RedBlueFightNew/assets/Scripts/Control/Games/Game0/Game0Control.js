// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameResultControl = require("GameResultControl");
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
        RedPlayer:
        {
            default: null,
            type: cc.Node,
        },
        BluePlayer:
        {
            default: null,
            type: cc.Node,
        },
        RedSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueSprite:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        TargetY: 360,
        TargetScale: 1.5,
        ForceDown: 2,//力度衰减
        MaxForce: 10,
        GameStatus: 0,//0未开始，1开始了，2结束了
        OverY: 0,//结束判定
        GameResultNode:
        {
            default: null,
            type: cc.Node,
        },
        CountDownNode:
        {
            default: null,
            type: cc.Node,
        },
        PauseNode:
        {
            default: null,
            type: cc.Node,
        },
        redGraphics:
        {
            default: null,
            type: cc.Graphics,
        },
        blueGraphics:
        {
            default: null,
            type: cc.Graphics,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    },
    // onLoad () {},
    update() {
        if (this.GameStatus == 1) {
            if (this.BluePlayer.position.y <= this.OverY) {
                cc.log("Blue Win");
                this.GameStatus = 2;
                this.RedPlayer.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, -this.MaxForce * 3);
                this.RedPlayer.getComponent(cc.Button).enabled = false;
                this.BluePlayer.getComponent(cc.Button).enabled = false;

                cc.find("Player", this.RedPlayer).getComponent(cc.Sprite).spriteFrame = this.RedSprites[0];
                cc.find("Player", this.BluePlayer).getComponent(cc.Sprite).spriteFrame = this.BlueSprite[1];
                this.SoundMGR.playOver();
                this.scheduleOnce(function () {

                    Global.GameData.CurrentWinner = 1;
                    this.GameResultNode.active = true;

                }, 1.5);

            }
            else if (this.RedPlayer.position.y >= -this.OverY) {
                cc.log("Red Win");
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                this.BluePlayer.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, this.MaxForce * 3);
                this.RedPlayer.getComponent(cc.Button).enabled = false;
                this.BluePlayer.getComponent(cc.Button).enabled = false;

                cc.find("Player", this.RedPlayer).getComponent(cc.Sprite).spriteFrame = this.RedSprites[1];
                cc.find("Player", this.BluePlayer).getComponent(cc.Sprite).spriteFrame = this.BlueSprite[0];
                this.scheduleOnce(function () {
                    Global.GameData.CurrentWinner = 0;
                    this.GameResultNode.active = true;

                }, 1.5);
            }
        }
        else {

        }
    },
    onClickBall(event, customEventData) {
        if (this.GameStatus == 1) {
            this.SoundMGR.playPush();
            if (customEventData == 0)//红色点击
            {
                cc.log("Red Click");
                this.RedPlayer.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, this.MaxForce);
            }
            else if (customEventData == 1) {//蓝色点击
                cc.log("Blue Click");
                this.BluePlayer.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, -this.MaxForce);
            }
        }
    },

    start() {
        cc.log("Start");
        this.GameStatus = 0;
        this.startAnimation();


    },

    startAnimation: function () {
        this.RedPlayer.getComponent(cc.Button).enabled = false;
        this.BluePlayer.getComponent(cc.Button).enabled = false;
        var redScaleAction = cc.scaleTo(0.5, this.TargetScale, this.TargetScale);
        var blueScaleAction = cc.scaleTo(0.5, this.TargetScale, this.TargetScale);
        this.RedPlayer.runAction(redScaleAction);
        this.BluePlayer.runAction(blueScaleAction);

        this.scheduleOnce(function () {
            var blueMoveAction = cc.moveTo(0.5, 0, this.TargetY);
            this.BluePlayer.runAction(blueMoveAction);
            var redMoveAction = cc.moveTo(0.5, 0, -this.TargetY);
            this.RedPlayer.runAction(redMoveAction);

        }, 0.8);

        this.scheduleOnce(function () {
            this.redGraphics.circle(0, 0, this.RedPlayer.width / 2 + 0.5);
            this.redGraphics.fillColor = new cc.Color(234, 53, 74, 255);
            // this.redGraphics.stroke();
            this.redGraphics.fill();
            this.blueGraphics.circle(0, 0, this.BluePlayer.width / 2 + 0.5);
            this.blueGraphics.fillColor = new cc.Color(42, 143, 228, 255);
            // this.redGraphics.stroke();
            this.blueGraphics.fill();
        }, 0.85);
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 1.3)
        this.scheduleOnce(function () {
            this.RedPlayer.getComponent(cc.Button).enabled = true;
            this.BluePlayer.getComponent(cc.Button).enabled = true;
            this.GameStatus = 1;
            this.PauseNode.active = true;
        }, 4.3);
    }

    // update (dt) {},
});
