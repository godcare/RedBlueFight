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
        GameStatus: 0,

        BallParent:
        {
            default: null,
            type: cc.Node,
        },
        UpBtn:
        {
            default: null,
            type: cc.Node,
        },
        DownBtn:
        {
            default: null,
            type: cc.Node,
        },
        Ship:
        {
            default: null,
            type: cc.Node,
        },
        ballSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },

        redScoreLabel:
        {
            default: null,
            type: MySpriteNumber,
        },
        blueScoreLabel:
        {
            default: null,
            type: MySpriteNumber,
        },

        moveSpeed: 1,
        currentScore: 0,
        coinRate: 0.2,//刷金币的概率
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

    },

    onShipMoveClick(event, customEventData) {
        if (this.GameStatus == 1) {
            if (customEventData == "up") {
                if (this.Ship.y < 175) {
                    this.Ship.y += 175;
                    this.SoundMGR.playPop();
                }

            }
            else {
                if (this.Ship.y > -175) {
                    this.Ship.y -= 175
                    this.SoundMGR.playPop();
                }
            }
        }
    },

    start() {
        this.startAnimation();
    },
    startAnimation() {
        for (var i = 0; i < 5; i++) {
            this.setBall(i, 1);
        }
        this.UpBtn.getComponent(cc.Button).enabled = false;
        this.DownBtn.getComponent(cc.Button).enabled = false;
        this.UpBtn.color = cc.Color.GRAY;
        this.DownBtn.color = cc.Color.GRAY;
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.UpBtn.getComponent(cc.Button).enabled = true;
            this.DownBtn.getComponent(cc.Button).enabled = true;
            this.UpBtn.color = cc.Color.WHITE;
            this.DownBtn.color = cc.Color.WHITE;
        }, 4.5);

    },


    setBall(ballIndex, isNewSpawn) {
        var activeCount = 0;
        //同一个竖线上最多同时存在两个
        if (ballIndex < 3) {
            for (var i = 0; i < 3; i++) {
                if (cc.find("b" + i, this.BallParent).active) {
                    activeCount += 1;
                }
            }
        }
        else {
            for (var i = 3; i < 6; i++) {
                if (cc.find("b" + i, this.BallParent).active) {
                    activeCount += 1;
                }
            }
        }
        var tmpr = (Math.random() * 2 - 1) * 20;
        var nIndex = (ballIndex + 3) % 6;
        if (isNewSpawn == 0) {
            cc.find("b" + ballIndex, this.BallParent).x = cc.find("b" + nIndex, this.BallParent).x + 420 + tmpr;
        }
        else {
            cc.find("b" + ballIndex, this.BallParent).x += tmpr;
        }
        if (activeCount == 0) {
            var obj = cc.find("b" + ballIndex, this.BallParent);
            var tmp = Math.random();
            if (tmp <= this.coinRate) {
                obj.getComponent(cc.Sprite).spriteFrame = this.ballSprites[0];
            }
            else {
                obj.getComponent(cc.Sprite).spriteFrame = this.ballSprites[1];
            }

            obj.active = true;
        }
        else if (activeCount == 1) {
            var tmpR = Math.random();
            if (tmpR <= 0.5) {
                var obj = cc.find("b" + ballIndex, this.BallParent);
                var tmp = Math.random();
                if (tmp <= this.coinRate) {
                    obj.getComponent(cc.Sprite).spriteFrame = this.ballSprites[0];
                }
                else {
                    obj.getComponent(cc.Sprite).spriteFrame = this.ballSprites[1];
                }

                obj.active = true;
            }
            else {

                var obj = cc.find("b" + ballIndex, this.BallParent).active = false;
            }

        }
        else {
            var obj = cc.find("b" + ballIndex, this.BallParent).active = false;
        }
    },



    update(dt) {
        if (this.GameStatus == 1) {
            //update timer



            for (var i = 0; i < 6; i++) {

                if (cc.find("b" + i, this.BallParent).x <= -400) {
                    if (cc.find("b" + i, this.BallParent).active) {
                        // cc.find("b" + i, this.BallParent).active = false;
                        if (cc.find("b" + i, this.BallParent).getComponent(cc.Sprite).spriteFrame != this.ballSprites[0]) {
                            this.currentScore += 1;
                            cc.log(i + " score" + " x:" + (cc.find("b" + i, this.BallParent).x));
                            this.redScoreLabel.setNumber(this.currentScore);
                            this.blueScoreLabel.setNumber(this.currentScore);
                            this.moveSpeed = 200 + Math.floor((this.currentScore / 10)) * 40;
                            if (this.currentScore > 99) {
                                this.redScoreLabel.node.x = 370;
                                this.blueScoreLabel.node.x = 370;
                            }
                            else {
                                this.redScoreLabel.node.x = 325;
                                this.blueScoreLabel.node.x = 325;
                            }
                        }
                    }
                    cc.find("b" + i, this.BallParent).active = false;
                    this.setBall(i, 0);
                }
                else {
                    if (cc.find("b" + i, this.BallParent).active) {
                        var hitObj = cc.find("b" + i, this.BallParent);
                        if (hitObj.position.sub(this.Ship.position).mag() <= 100 && hitObj.active) {//判断距离
                            if (hitObj.getComponent(cc.Sprite).spriteFrame == this.ballSprites[0])//hit coin
                            {
                                this.currentScore += 1;
                                cc.log(hitObj.name + " coin score" + " x:" + hitObj.x);
                                this.redScoreLabel.setNumber(this.currentScore);
                                this.blueScoreLabel.setNumber(this.currentScore);
                                this.moveSpeed = 200 + Math.floor((this.currentScore / 10)) * 40;
                                this.SoundMGR.playScore();
                                // hitObj.x = 350 + tmpr;
                                hitObj.active = false;
                                // var tmpr = (Math.random() * 2 - 1) * 20;
                                // 
                                if (this.currentScore > 99) {
                                    this.redScoreLabel.node.x = 370;
                                    this.blueScoreLabel.node.x = 370;
                                    cc.log("changing score pos x when >= 100");
                                }
                                else {
                                    this.redScoreLabel.node.x = 325;
                                    this.blueScoreLabel.node.x = 325;
                                    cc.log("changing score pos x when < 100");
                                }
                                this.setBall(i, 0);


                            }
                            else {// game over
                                this.GameStatus = 2;
                                this.SoundMGR.playOver();
                                this.schedule(function () {
                                    this.Ship.active = !this.Ship.active;
                                }, 0.3);
                                Global.GameData.CurrentCopScore = this.currentScore;
                                Global.GameData.CurrentCopHistoryScore = Global.GameData.CopHistoryScore[1];

                                if (this.currentScore > Global.GameData.CurrentCopHistoryScore) {
                                    Global.GameData.CurrentCopHistoryScore = this.currentScore;
                                    Global.GameData.CopHistoryScore[1] = this.currentScore;
                                    Global.GameData.SaveCache();
                                }
                                this.scheduleOnce(function () {

                                    this.GameResultNode.active = true;
                                }, 1.5);
                            }
                        }
                    }
                }
                cc.find("b" + i, this.BallParent).x -= this.moveSpeed * dt;
            }
        }
    },
});
