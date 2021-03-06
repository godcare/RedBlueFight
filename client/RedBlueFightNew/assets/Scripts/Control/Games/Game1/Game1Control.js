// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var DragMove = require("Game1DragMove");
var SoundManager = require("SoundManager");
cc.Class({
    extends: cc.Component,

    properties: {
       
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
        GameStatus: 0,//0未开始，1开始了，2结束了
        BallSpriteWhenRed:
        {
            default: null,
            type: cc.SpriteFrame,
        },
        BallSpriteWhenBlue:
        {
            default: null,
            type: cc.SpriteFrame,
        },

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
        Ball:
        {
            default: null,
            type: cc.Node,
        },
        offsetY: 1.1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

    },

    start() {
        this.startAnimation();
    },

    startAnimation() {
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.RedPlayer.getComponent(DragMove).enabled = true;
            this.BluePlayer.getComponent(DragMove).enabled = true;
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.Ball.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(2, 800);
            this.Ball.getComponent(cc.RigidBody).angularVelocity = 5;
        }, 3.5);

    },

    onBallHit(hitTarget) {

        cc.log("Game Control Detect Hit:" + hitTarget.toString());
        if (hitTarget == "RedPlayer") {
            this.Ball.getComponent(cc.Sprite).spriteFrame = this.BallSpriteWhenRed;
            // this.Ball.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(this.Ball.getComponent(cc.RigidBody).linearVelocity.x, this.Ball.getComponent(cc.RigidBody).linearVelocity.offsetY * this.offsetY);
            this.SoundMGR.playRebounce2();
        }
        else if (hitTarget == "BluePlayer") {
            this.Ball.getComponent(cc.Sprite).spriteFrame = this.BallSpriteWhenBlue;
            // this.Ball.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(this.Ball.getComponent(cc.RigidBody).linearVelocity.x, this.Ball.getComponent(cc.RigidBody).linearVelocity.offsetY * this.offsetY);
            this.SoundMGR.playRebounce2();
        }
        else if (hitTarget == "Top") {
            //Red win
            cc.log("Red Win");

            this.GameStatus = 2;
            this.SoundMGR.playOver();
            this.RedPlayer.getComponent(DragMove).enabled = false;
            this.BluePlayer.getComponent(DragMove).enabled = false;
            this.scheduleOnce(function () {

                Global.GameData.CurrentWinner = 0;
                this.GameResultNode.active = true;
            }, 0.5);
        }
        else if (hitTarget == "Bottom") {
            //Blue win
            cc.log("Blue Win");
            this.GameStatus = 2;
            this.SoundMGR.playOver();
            this.RedPlayer.getComponent(DragMove).enabled = false;
            this.BluePlayer.getComponent(DragMove).enabled = false;
            this.scheduleOnce(function () {

                Global.GameData.CurrentWinner = 1;
                this.GameResultNode.active = true;
            }, 0.5);
        }
    }

    // update (dt) {},
});
