// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// var GameDragMove = require("Game5DragMove");
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
        AllBalls:
        {
            default: [],
            type: [cc.Node],
        },
        AllPans:
        {
            default: [],
            type: [cc.Node],
        },
        PlacedBalls:
        {
            default: [],
        },

        PlacedPans:
        {
            default: [],
        },
        RedCount: 0,
        BlueCount: 0,
        PinchDistance: 60,//吸入的距离
        TouchableBalls: "",
        GameStatus: 0,//0未开始，1开始了，2结束了
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.startAnimation();
    },

    startAnimation() {
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            for (var i = 0; i < this.AllBalls.length; i++) {
                this.TouchableBalls += this.AllBalls[i].name;
            }
            this.GameStatus = 1;
            this.PauseNode.active = true;

        }, 4.5);

    },
    onTouchStart() {
        this.SoundMGR.playVoice();

    },
    onEndMove(movedBall) {
        cc.log("cancel move ball:" + movedBall);
        var ball = cc.find("Canvas/GameCore/" + movedBall);
        for (var j = 0; j < this.AllPans.length; j++) {
            //判断所有未装球的盘
            // cc.log("Pan:" + this.PlacedPans);
            var tmpJ = this.PlacedPans.indexOf(j.toString());
            if (tmpJ == -1) {
                var dist = Math.floor(Math.sqrt(Math.pow(ball.x - this.AllPans[j].x, 2) + Math.pow(ball.y - this.AllPans[j].y, 2)));//判断距离
                // cc.log("i:" + i + " j:" + j + " dist:" + dist + " pDist" + this.PinchDistance);
                if (dist <= this.PinchDistance) {
                    var i = movedBall.substr(movedBall.length - 1, 1);
                    this.PlacedBalls.push(i);
                    this.PlacedPans.push(j.toString());
                    cc.log("i:" + i + " j:" + j + " Dist:" + dist);
                    // this.AllBalls[i].getComponent(GameDragMove).enabled = false;
                    this.TouchableBalls = this.TouchableBalls.replace(movedBall, "");
                    var bm = cc.moveTo(0.2, this.AllPans[j].position);
                    this.SoundMGR.playBlob();
                    ball.runAction(bm);
                    if (i <= 3) {
                        this.BlueCount += 1;
                    }
                    else {
                        this.RedCount += 1;
                    }
                    if (this.RedCount >= 4) {
                        this.ShowResult(0);
                    }
                    else if (this.BlueCount >= 4) {
                        this.ShowResult(1);
                    }
                    break;
                }
            }
        }
    },

    ShowResult(winner) {
        this.TouchableBalls = "";
        this.GameStatus = 2;
        this.SoundMGR.playOver();
        this.scheduleOnce(function () {
            if (winner == 0) {

                for (var i = 0; i < this.PlacedBalls.length; i++) {
                    if (this.PlacedBalls[i] >= 4) {
                        var sa = cc.scaleTo(0.7, 1, 1);
                        var sr = cc.rotateBy(0.7, 360);
                        cc.find("Canvas/GameCore/" + this.PlacedBalls[i]).runAction(sa);
                        cc.find("Canvas/GameCore/" + this.PlacedBalls[i]).runAction(sr);
                    }

                }
                this.scheduleOnce(function () {
                    Global.GameData.CurrentWinner = 0;
                    this.GameResultNode.active = true;
                }, 2);
            }

            else if (winner == 1) {
                for (var i = 0; i < this.PlacedBalls.length; i++) {
                    if (this.PlacedBalls[i] <= 3) {
                        var sa = cc.scaleTo(0.7, 1, 1);
                        var sr = cc.rotateBy(0.7, 360);
                        cc.find("Canvas/GameCore/" + this.PlacedBalls[i]).runAction(sa);
                        cc.find("Canvas/GameCore/" + this.PlacedBalls[i]).runAction(sr);
                    }

                }
                this.scheduleOnce(function () {
                    Global.GameData.CurrentWinner = 1;
                    this.GameResultNode.active = true;
                }, 2);

            }
        }, 0.5)
    },
    // update (dt) {},
});
