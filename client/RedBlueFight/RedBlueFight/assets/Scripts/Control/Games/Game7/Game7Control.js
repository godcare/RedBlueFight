// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var MySpriteNumber = require("MySpriteNumber");
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
        RedScoreNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
        BlueScoreNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
        bmoveDelta:
        {
            default: new cc.Vec2(),
        },
        rmoveDelta:
        {
            default: new cc.Vec2(),
        },
        UnTouchList:
        {
            default: [],
        },
        MovedList:
        {
            default: [],
        },
        Distance4: 20,
        Distance3: 57,
        Distance2: 97,
        Distance1: 150,
        CenterObj:
        {
            default: null,
            type: cc.Node,
        },
        redBalls:
        {
            default: [],
            type: [cc.Node],
        },
        blueBalls:
        {
            default: [],
            type: [cc.Node],
        },
        redIndex: -1,
        blueIndex: -1,
        checkInterval: 0.2,
        tmpTimer: 0,
        redScore: 0,
        blueScore: 0,
        isNewBallGenerated: false,
        GameStatus: 0,//0未开始，1开始了，2结束了
    },
    update(dt) {
        if (this.GameStatus == 1) {
            this.tmpTimer += dt;
            if (this.tmpTimer >= this.checkInterval) {
                this.tmpTimer = 0;
                var tmpRScore = 0;
                var tmpBScore = 0;
                var rStopFlag = 1;
                var bStopFlag = 1;
                // cc.log(this.MovedList);
                for (var i = 0; i < this.MovedList.length; i++) {
                    if (this.MovedList[i].substr(0, 1) == "r") {
                        var obj = cc.find("Canvas/GameCore/" + this.MovedList[i]);
                        // cc.log(obj.getComponent(cc.RigidBody).linearVelocity.x + " " + obj.getComponent(cc.RigidBody).linearVelocity.y);
                        if (Math.abs(obj.getComponent(cc.RigidBody).linearVelocity.x) <= 10 && Math.abs(obj.getComponent(cc.RigidBody).linearVelocity.y) <= 10) {
                            rStopFlag *= 1;
                            obj.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
                            // tmpR = obj.position;
                            var dist = Math.sqrt(obj.x * obj.x + obj.y * obj.y);
                            // cc.log("Dist: " + dist + " d1:" + this.Distance1 + " d2:" + this.Distance2 + " d3:" + this.Distance3 + " d4:" + this.Distance4);
                            if (dist <= this.Distance4) {
                                tmpRScore += 4;
                                // cc.log("4 p Dist: " + dist + "at distance:" + this.Distance4);
                            }
                            else if (dist <= this.Distance3) {
                                tmpRScore += 3;
                                // cc.log("3 p Dist: " + dist+ "at distance:" + this.Distance3);
                            }
                            else if (dist <= this.Distance2) {
                                tmpRScore += 2;
                                // cc.log("2 p Dist: " + dist+ "at distance:" + this.Distance2);
                            }
                            else if (dist <= this.Distance1) {
                                tmpRScore += 1;
                                // cc.log("1 p Dist: " + dist+ "at distance:" + this.Distance1);
                            }
                            cc.log("tmpRScore: " + tmpRScore);
                        }
                        else {
                            rStopFlag *= 0;
                        }

                    }
                    else if (this.MovedList[i].substr(0, 1) == "b") {
                        var obj = cc.find("Canvas/GameCore/" + this.MovedList[i]);
                        // var tmpB = 0;

                        if (Math.abs(obj.getComponent(cc.RigidBody).linearVelocity.x) <= 10 && Math.abs(obj.getComponent(cc.RigidBody).linearVelocity.y) <= 10) {
                            bStopFlag *= 1;
                            obj.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
                            var dist = Math.sqrt(obj.x * obj.x + obj.y * obj.y);
                            if (dist <= this.Distance4) {
                                tmpBScore += 4;
                            }
                            else if (dist <= this.Distance3) {
                                tmpBScore += 3;
                            }
                            else if (dist <= this.Distance2) {
                                tmpBScore += 2;
                            }
                            else if (dist <= this.Distance1) {
                                tmpBScore += 1;
                            }
                        }
                        else {
                            bStopFlag *= 0;
                        }
                    }
                }

                if (bStopFlag == 1 && rStopFlag == 1) {
                    if (tmpRScore != this.redScore) {
                        this.SoundMGR.playScore();
                        this.redScore = tmpRScore;
                        this.RedScoreNumber.setNumber(this.redScore);
                    }
                    if (tmpBScore != this.blueScore) {
                        this.blueScore = tmpBScore;
                        this.SoundMGR.playScore();
                        this.BlueScoreNumber.setNumber(this.blueScore);
                    }
                    if (this.MovedList.length >= 8) {
                        this.GameStatus = 2;
                        this.SoundMGR.playOver();
                        if (this.redScore > this.blueScore) {
                            this.scheduleOnce(function () {
                                Global.GameData.CurrentWinner = 0;
                                this.GameResultNode.active = true;
                            }, 1);
                        }
                        else if (this.redScore < this.blueScore) {
                            this.scheduleOnce(function () {
                                Global.GameData.CurrentWinner = 1;
                                this.GameResultNode.active = true;
                            }, 1);
                        }
                        else {
                            this.scheduleOnce(function () {
                                Global.GameData.CurrentWinner = 2;
                                this.GameResultNode.active = true;
                            }, 1);
                        }
                    }
                    else {
                        if (this.isNewBallGenerated != true) {
                            this.isNewBallGenerated = true;
                            if (this.redIndex > this.blueIndex) {
                                this.SpawnNewBall(1);
                            }
                            else {
                                this.SpawnNewBall(0);
                            }
                        }
                    }
                }
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

    },

    onTouchStart() {
        this.SoundMGR.playVoice();

    },

    start() {
        this.startAnimation();
        cc.log("Untouch List:" + this.UnTouchList);
        for (var i = 0; i < this.redBalls.length; i++) {
            this.UnTouchList.push(this.redBalls[i].name);
        }
        for (var i = 0; i < this.blueBalls.length; i++) {
            this.UnTouchList.push(this.blueBalls[i].name);
        }

    },

    startAnimation() {
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.SpawnNewBall(0);
        }, 4.5);

    },

    SpawnNewBall(newIndex) {
        this.isNewBallGenerated = true;
        cc.log("Spawn" + newIndex);
        if (newIndex == 0)//spawn red
        {
            if (this.redIndex < this.redBalls.length - 1) {
                this.redIndex += 1;
                this.redBalls[this.redIndex].setPosition(0, -560);
                this.redBalls[this.redIndex].opacity = 255;
                this.UnTouchList.splice(this.UnTouchList.indexOf(this.redBalls[this.redIndex].name), 1);
                this.SoundMGR.playBlob();
            }
        }
        else {
            if (this.blueIndex < this.blueBalls.length - 1) {
                this.blueIndex += 1;
                this.blueBalls[this.blueIndex].setPosition(0, 560);
                this.blueBalls[this.blueIndex].opacity = 255;
                this.UnTouchList.splice(this.UnTouchList.indexOf(this.blueBalls[this.blueIndex].name), 1);
                this.SoundMGR.playBlob();
            }
        }
    },
    onBallHit(selfName, otherName) {
        // if (this.MovedList.indexOf(otherName) == -1) {
        //     this.MovedList.push(otherName);
        // }
    },
    // update (dt) {},
});
