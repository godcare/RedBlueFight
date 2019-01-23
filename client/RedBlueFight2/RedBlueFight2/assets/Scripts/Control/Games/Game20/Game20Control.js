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

        bBallParent:
        {
            default: null,
            type: cc.Node,
        },
        rBallParent:
        {
            default: null,
            type: cc.Node,
        },
        redSign:
        {
            default: null,
            type: cc.Node,
        },
        blueSign:
        {
            default: null,
            type: cc.Node,
        },
        redSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        blueSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        redScoreNumber:
        {
            default: null,
            type: MySpriteNumber,
        },

        blueScoreNumber:
        {
            default: null,
            type: MySpriteNumber,
        },
        GameStatus: 0,
        scaleSpeed: 1,
        isRedTouching: false,
        isBlueTouching: false,
        currentTouchRed: "",
        currentTouchBlue: "",
        rScore: 0,
        bScore: 0,

    },

    // LIFE-CYCLE CALLBACKS:



    start() {
        this.startAnimation();

    },

    startAnimation() {

        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.showNewBall(0);
            this.showNewBall(1);
        }, 4.5);

    },

    showNewBall(colorIndex) {
        if (colorIndex == 0) //red
        {
            //随机生成1-2个
            var totalCount = Math.floor(Math.random() * 2) + 1;
            var currentCount = 0;
            for (var i = 0; i < 3; i++) {
                if (cc.find("r" + i, this.rBallParent).active != true) {
                    var obj = cc.find("r" + i, this.rBallParent);
                    var tempI = Math.floor(Math.random() * this.redSprites.length);
                    var tempX = (Math.random() * 2 - 1) * 250;
                    var tempY = (Math.random() * 2 - 1) * 200;
                    obj.getComponent(cc.Sprite).spriteFrame = this.redSprites[tempI];
                    obj.scale = new cc.Vec2(1, 1);
                    obj.position = new cc.Vec2(tempX, tempY);
                    obj.active = true;
                    currentCount += 1;
                    if (currentCount >= totalCount) {
                        break;
                    }

                }
            }
        }
        else {
            var totalCount = Math.floor(Math.random() * 2) + 1;
            var currentCount = 0;
            for (var i = 0; i < 3; i++) {
                if (cc.find("b" + i, this.bBallParent).active != true) {
                    var obj = cc.find("b" + i, this.bBallParent);
                    var tempI = Math.floor(Math.random() * this.blueSprites.length);
                    var tempX = (Math.random() * 2 - 1) * 250;
                    var tempY = (Math.random() * 2 - 1) * 200;
                    obj.getComponent(cc.Sprite).spriteFrame = this.blueSprites[tempI];
                    obj.scale = new cc.Vec2(1, 1);
                    obj.position = new cc.Vec2(tempX, tempY);
                    obj.active = true;
                    currentCount += 1;
                    if (currentCount >= totalCount) {
                        break;
                    }
                }
            }
        }
    },


    update(dt) {
        if (this.GameStatus == 1) {

            if (this.isRedTouching) {
                var tmpSx = cc.find(this.currentTouchRed, this.rBallParent).scaleX;
                tmpSx -= this.scaleSpeed * dt;
                if (tmpSx <= 0) {
                    tmpSx = 0;
                    this.redSign.active = false;
                    cc.find(this.currentTouchRed, this.rBallParent).active = false;
                    this.isRedTouching = false;
                    this.currentTouchRed = "";
                    this.AddScore(0);
                    this.showNewBall(0);
                }
                else {
                    this.redSign.position = cc.find(this.currentTouchRed, this.rBallParent).position;
                    cc.find(this.currentTouchRed, this.rBallParent).scale = new cc.Vec2(tmpSx, tmpSx);
                    this.redSign.scale = new cc.Vec2(tmpSx, tmpSx);
                    this.redSign.active = true;
                }
            }
            else {
                for (var i = 0; i < 3; i++) {
                    var obj = cc.find("r" + i, this.rBallParent);
                    if (obj.active) {
                        if (obj.scaleX <= 0.5 && obj.scaleX > 0) {
                            var tmpx = obj.scaleX;
                            tmpx -= this.scaleSpeed * dt;
                            if (tmpx <= 0) {
                                tmpx = 0;
                                this.AddScore(0);
                                obj.active = false;
                                this.showNewBall(0);
                            }
                            else {
                                obj.scale = new cc.Vec2(tmpx, tmpx);
                            }
                        }
                    }
                }
            }

            if (this.isBlueTouching) {
                var tmpSx = cc.find(this.currentTouchBlue, this.bBallParent).scaleX;
                tmpSx -= this.scaleSpeed * dt;
                if (tmpSx <= 0) {
                    tmpSx = 0;
                    this.blueSign.active = false;
                    cc.find(this.currentTouchBlue, this.bBallParent).active = false;
                    this.isBlueTouching = false;
                    this.currentTouchBlue = "";
                    this.AddScore(1);
                    this.showNewBall(1);
                }
                else {
                    this.blueSign.position = cc.find(this.currentTouchBlue, this.bBallParent).position;
                    cc.find(this.currentTouchBlue, this.bBallParent).scale = new cc.Vec2(tmpSx, tmpSx);
                    this.blueSign.scale = new cc.Vec2(tmpSx, tmpSx);
                    this.blueSign.active = true;
                }
            }
            else {
                for (var i = 0; i < 3; i++) {
                    var obj = cc.find("b" + i, this.bBallParent);
                    if (obj.active) {
                        if (obj.scaleX <= 0.5 && obj.scaleX > 0) {
                            var tmpx = obj.scaleX;
                            tmpx -= this.scaleSpeed * dt;
                            if (tmpx <= 0) {
                                tmpx = 0;
                                obj.active = false;
                                this.AddScore(1);
                                this.showNewBall(1);
                            }
                            else {
                                obj.scale = new cc.Vec2(tmpx, tmpx);
                            }
                        }
                    }
                }
            }
        }
    },

    AddScore(colorIndex) {
        if (colorIndex == 0)//red
        {
            this.rScore += 1;
            this.redScoreNumber.setNumber(this.rScore);
            this.SoundMGR.playScore();
            if (this.rScore >= 10) {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentWinner = 0;
                this.GameResultNode.active = true;
            }
        }
        else {
            this.bScore += 1;
            this.blueScoreNumber.setNumber(this.bScore);
            this.SoundMGR.playScore();
            if (this.bScore >= 10) {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentWinner = 1;
                this.GameResultNode.active = true;
            }
        }
    },

    onBallTouch(ballName) {
        if (ballName.indexOf("r") != -1) {// red touch
            this.isRedTouching = true;
            this.currentTouchRed = ballName;
        }
        else {
            this.isBlueTouching = true;
            this.currentTouchBlue = ballName;
        }
    },

    onBallRelease(ballName) {
        if (ballName.indexOf("r") != -1) {
            this.isRedTouching = false;
            this.currentTouchRed = "";
            this.redSign.active = false;
        }
        else {
            this.isBlueTouching = false;
            this.currentTouchBlue = "";
            this.blueSign.active = false;
        }

    },

});
