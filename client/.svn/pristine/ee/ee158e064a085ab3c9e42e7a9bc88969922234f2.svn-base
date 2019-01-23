// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var SoundManager = require("SoundManager");
var MySpriteNumber = require("MySpriteNumber");
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
        redRope:
        {
            default: null,
            type: cc.Node,
        },
        blueRope:
        {
            default: null,
            type: cc.Node,
        },
        GameStatus: 0,//0未开始，1开始了，2结束了
        rSpeed: 0,
        bSpeed: 0,
        rLength: 275,
        bLength: 275,
        maxLength: 275,
        minLength: 60,
        minSpeed: 50,
        lengthChangeSpeed: 100,
        redEar:
        {
            default: null,
            type: cc.Node,
        },
        blueEar:
        {
            default: null,
            type: cc.Node,
        },
        redHit:
        {
            default: null,
            type: cc.Node,
        },
        blueHit:
        {
            default: null,
            type: cc.Node,
        },
        pPre:
        {
            default: null,
            type: cc.Node,
        },
        rflag: -1,
        bflag: -1,
        spawnIndex: 0,
        maxPontNumber: 10,
        spawnParent:
        {
            default: null,
            type: cc.Node,
        },
        redScore: 0,
        blueScore: 0,
        redTouchPanel:
        {
            default: null,
            type: cc.Node,
        },
        redScoreNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
        redScoreTotalNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
        blueScoreNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
        blueScoreTotalNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    },

    start() {
        // this.redScoreTotalNumber.setNumber(20);
        this.startAnimation();

    },
    startAnimation() {

        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.SpawnNewPoint(2);
            this.blueRope.active = true;
            this.redRope.active = true;
            this.schedule(function () {
                this.SpawnNewPoint(2);
            }, 1)
        }, 4.5);

    },

    update(dt) {
        if (this.GameStatus == 1) {
            //red rope process
            this.rLength += dt * this.lengthChangeSpeed * this.rflag;
            if (this.rLength < this.minLength) {
                this.rLength = this.minLength;

            }
            else if (this.rLength > this.maxLength) {
                this.rLength = this.maxLength;

            }
            this.redRope.width = this.rLength;
            var rate = this.maxLength / this.rLength;
            rate *= rate;
            if (rate > 20) {
                rate = 20;
            }
            else if (rate < 1) {
                rate = 1;
            }
            this.rSpeed = this.minSpeed * rate;
            this.redRope.rotation += dt * this.rSpeed;
            this.redEar.x = this.rLength + 35;
            this.redHit.x = this.redEar.x;
            this.redHit.y = this.redEar.y;

            //blue rope process
            this.bLength += dt * this.lengthChangeSpeed * this.bflag;
            if (this.bLength < this.minLength) {
                this.bLength = this.minLength;

            }
            else if (this.bLength > this.maxLength) {
                this.bLength = this.maxLength;

            }
            this.blueRope.width = this.bLength;
            var rate1 = this.maxLength / this.bLength;
            rate1 *= rate1;
            if (rate1 > 20) {
                rate1 = 20;
            }
            else if (rate1 < 1) {
                rate1 = 1;
            }
            this.bSpeed = this.minSpeed * rate1;
            this.blueRope.rotation += dt * this.bSpeed;
            this.blueEar.x = this.bLength + 35;
            this.blueHit.x = this.blueEar.x;
            this.blueHit.y = this.blueEar.y;
        }
    },

    OnTouchPanelStart(touchName) {
        if (touchName == "redTouch") {
            this.rflag = -1.5;
        }
        else if (touchName == "blueTouch") {
            this.bflag = -1.5
        }
    },

    OnTouchPanelEnd(touchName) {
        if (touchName == "redTouch") {
            this.rflag = 1.5;
        }
        else if (touchName == "blueTouch") {
            this.bflag = 1.5;
        }
    },

    OnBallHit(ballName, hitName) {
        cc.log(ballName + " hit " + hitName);
        if (this.GameStatus == 1) {
            if (ballName == "redHit" && hitName.indexOf("pBall") > -1) {
                cc.find(hitName, this.spawnParent).destroy();
                this.redScore += 1;
                this.SoundMGR.playScore();
                this.redScoreNumber.setNumber(this.redScore);
                if (this.redScore >= 20) {
                    this.GameStatus = 2;
                    this.SoundMGR.playOver();
                    this.scheduleOnce(function()
                    {
                        Global.GameData.CurrentWinner = 0;
                        this.GameResultNode.active = true;
                    },1);
                }
                // this.scheduleOnce(function () {
                //     this.SpawnNewPoint(1);
                // }, 1);

            }
            else if (ballName == "blueHit" && hitName.indexOf("pBall") > -1) {
                cc.find(hitName, this.spawnParent).destroy();
                this.blueScore += 1;
                this.SoundMGR.playScore();
                this.blueScoreNumber.setNumber(this.blueScore);
                if (this.blueScore >= 20) {
                    this.GameStatus = 2;
                    this.SoundMGR.playOver();
                    this.scheduleOnce(function()
                    {
                        Global.GameData.CurrentWinner = 1;
                        this.GameResultNode.active = true;
                    },1);
                }
                // this.scheduleOnce(function () {
                //     this.SpawnNewPoint(1);
                // }, 1);
            }
        }
    },

    SpawnNewPoint(ballCount) {
        for (var i = 0; i < ballCount; i++) {
            if (this.spawnParent.getChildren().length < this.maxPontNumber) {
                this.spawnIndex += 1;
                var newObj = cc.instantiate(this.pPre);
                newObj.parent = this.spawnParent;
                newObj.x = (Math.random() - 0.5) * 550;
                newObj.y = (Math.random() - 0.5) * 550;
                // cc.log(newObj.x + ":" + newObj.y);
                newObj.name = "pBall" + this.spawnIndex.toString();
                newObj.active = true;
                this.SoundMGR.playBlob();
            }
        }
    },


});
