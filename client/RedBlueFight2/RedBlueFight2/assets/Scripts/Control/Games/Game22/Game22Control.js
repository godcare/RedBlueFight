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
        BeltParent:
        {
            default: null,
            type: cc.Node,
        },
        BallParent:
        {
            default: null,
            type: cc.Node,
        },
        ballSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        buttonSPrites:
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
        redProgress:
        {
            default: null,
            type: cc.ProgressBar,
        },
        blueProgress:
        {
            default: null,
            type: cc.ProgressBar,
        },
        moveSpeed: 1,
        currentScore: 0,
        TotalSeconds: 45,
        tmpTimer: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start() {
        this.startAnimation();
    },
    startAnimation() {
        for (var i = 0; i < 5; i++) {
            this.setBall(i);
        }
        for (var i = 0; i < 3; i++) {
            this.setCapsule(0, i);
            this.setCapsule(1, i);
        }
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;

        }, 4.5);

    },

    setBall(ballIndex) {
        var obj = cc.find("ball" + ballIndex, this.BallParent);
        cc.find("top", obj).active = false;
        cc.find("bottom", obj).active = false;
        var tmpR = Math.floor(Math.random() * 2);
        obj.getComponent(cc.Sprite).spriteFrame = this.ballSprites[tmpR];
    },

    setCapsule(placeIndex, numberIndex) {
        if (placeIndex == 0)//top
        {
            var obj = cc.find("top" + numberIndex, this.BallParent);
            var tmpR = Math.floor(Math.random() * 2);
            obj.getComponent(cc.Sprite).spriteFrame = this.buttonSPrites[tmpR];
            obj.scale = new cc.Vec2(1, 1);
            obj.active = true;
        }
        else {
            var obj = cc.find("bottom" + numberIndex, this.BallParent);
            var tmpR = Math.floor(Math.random() * 2);
            obj.getComponent(cc.Sprite).spriteFrame = this.buttonSPrites[tmpR];
            obj.scale = new cc.Vec2(1, 1);
            obj.active = true;
        }
    },

    checkSame(ballIndex) {

        var obj = cc.find("ball" + ballIndex, this.BallParent);
        if (cc.find("bottom", obj).active == true && cc.find("top", obj).active) {
            if (cc.find("top", obj).getComponent(cc.Sprite).spriteFrame == cc.find("bottom", obj).getComponent(cc.Sprite).spriteFrame) {
                //判断是否和球的颜色一致
                var isSame = false;
                if (obj.getComponent(cc.Sprite).spriteFrame == this.ballSprites[0] && cc.find("top", obj).getComponent(cc.Sprite).spriteFrame == this.buttonSPrites[0]) {
                    isSame = true;
                }
                else if (obj.getComponent(cc.Sprite).spriteFrame == this.ballSprites[1] && cc.find("top", obj).getComponent(cc.Sprite).spriteFrame == this.buttonSPrites[1]) {
                    isSame = true;
                }
                if (isSame) {
                    this.currentScore += 1;
                    this.redScoreLabel.setNumber(this.currentScore);
                    this.blueScoreLabel.setNumber(this.currentScore);
                }
            }
        }

    },


    onClickCapsule(event, customEventData) {
        if (this.GameStatus == 1) {
            if (customEventData.indexOf("top") != -1) {
                //top click
                var clickIndex = customEventData.substr(3, 1);
                // cc.log("click:" + clickIndex);
                var rightX = (clickIndex - 1) * 200;
                var haveFit = false;

                for (var i = 0; i < 5; i++) {
                    if (Math.abs(cc.find("ball" + i, this.BallParent).x - rightX) <= 40) {
                        var obj = cc.find("ball" + i, this.BallParent);
                        if (cc.find("top", obj).active != true) {
                            haveFit = true;
                            this.SoundMGR.playPop();
                            var sa = cc.scaleTo(0.5, 0, 0);
                            cc.find(customEventData, this.BallParent).runAction(sa);

                            cc.find("top", obj).getComponent(cc.Sprite).spriteFrame = cc.find(customEventData, this.BallParent).getComponent(cc.Sprite).spriteFrame;
                            cc.find("top", obj).active = true;
                            this.checkSame(i);
                            this.scheduleOnce(function () {
                                this.setCapsule(0, clickIndex);
                            }, 1)
                            break;
                        }


                    }
                }
                if (!haveFit) {
                    this.SoundMGR.playVoice();
                }
            }
            else {
                var clickIndex = customEventData.substr(6, 1);
                // cc.log("click:" + clickIndex);
                var rightX = (clickIndex - 1) * 200;
                var haveFit = false;

                for (var i = 0; i < 5; i++) {
                    if (Math.abs(cc.find("ball" + i, this.BallParent).x - rightX) <= 40) {

                        var obj = cc.find("ball" + i, this.BallParent);
                        if (cc.find("bottom", obj).active != true) {
                            haveFit = true;
                            this.SoundMGR.playPop();
                            var sa = cc.scaleTo(0.5, 0, 0);
                            cc.find(customEventData, this.BallParent).runAction(sa);
                            cc.find("bottom", obj).getComponent(cc.Sprite).spriteFrame = cc.find(customEventData, this.BallParent).getComponent(cc.Sprite).spriteFrame;
                            cc.find("bottom", obj).active = true;
                            this.checkSame(i);
                            this.scheduleOnce(function () {
                                this.setCapsule(1, clickIndex);
                            }, 1)
                            break;
                        }


                    }
                }
                if (!haveFit) {
                    this.SoundMGR.playVoice();
                }
            }
        }
    },


    update(dt) {
        if (this.GameStatus == 1) {
            //update timer
            if (this.tmpTimer <= this.TotalSeconds) {
                this.tmpTimer += dt;
                this.redProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
                this.blueProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
            }
            else {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentCopScore = this.currentScore;
                Global.GameData.CurrentCopHistoryScore = Global.GameData.CopHistoryScore[0];
                if(this.currentScore>Global.GameData.CurrentCopHistoryScore)
                {
                    Global.GameData.CurrentCopHistoryScore = this.currentScore;
                    Global.GameData.CopHistoryScore[0] = this.currentScore;
                    Global.GameData.SaveCache();
                }
                this.scheduleOnce(function () {
                    this.GameResultNode.active = true;
                }, 0.5);
            }

            for (var i = 0; i < 3; i++) {

                if (cc.find("Part" + i, this.BeltParent).x <= -1000) {
                    var index = i - 1;
                    if (i - 1 < 0) {
                        index = 2;
                    }
                    cc.find("Part" + i, this.BeltParent).x = cc.find("Part" + index, this.BeltParent).x + 815;
                }
                cc.find("Part" + i, this.BeltParent).x -= this.moveSpeed * dt;
            }
            for (var i = 0; i < 5; i++) {

                if (cc.find("ball" + i, this.BeltParent).x <= -600) {
                    var index = i - 1;
                    if (i - 1 < 0) {
                        index = 4;
                    }
                    cc.find("ball" + i, this.BallParent).x = cc.find("ball" + index, this.BallParent).x + 200;
                    this.setBall(i);
                }
                cc.find("ball" + i, this.BallParent).x -= this.moveSpeed * dt;
            }
        }
    },
});
