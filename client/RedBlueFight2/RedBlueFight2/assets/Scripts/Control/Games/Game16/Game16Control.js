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
cc.Class({
    extends: cc.Component,

    properties: {
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
        GameStatus: 0,//0未开始，1开始了，2结束了
        CountDownLabel:
        {
            default: null,
            type: cc.Label,
        },
        ClockObj:
        {
            default: null,
            type: cc.Node,
        },
        RedBalls:
        {
            default: [],
            type: [cc.Node],
        },
        BlueBalls:
        {
            default: [],
            type: [cc.Node],
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
        redBallSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        blueBallSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        cloclSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        randomListRed: [],
        randomListBlue: [],
        playStatus: -1,//正在打的状态，0为红，1为蓝,-1为刚开局的待定
        isRedEnabled: false,
        isBlueEnabled: false,
        countDownSeconds: 10,//倒计时
        tmpTimer: 0,
        redFlag: 0,
        blueFlag: 0,
        orderFlag: -1,//先手顺序，-1为待定，0为红，1位蓝色
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.startAnimation();
        // cc.log(this.Coin.scaleX);
    },
    startAnimation() {

        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.generateList(0);
            this.generateList(1);
            this.showList(0);
            this.showList(1);
            cc.log(this.randomListBlue);
        }, 4.5);

    },

    onClickBall(event, customEventData) {
        if (customEventData.indexOf("r") != -1) {//red click
            var clickIndex = customEventData.substr(1, 1);
            if (this.playStatus == -1 || this.playStatus == 0 || this.isRedEnabled) {
                if (this.redFlag == this.randomListRed[clickIndex - 1] - 1) {
                    this.redFlag += 1;
                    this.SoundMGR.playPop();
                    cc.find("Canvas/GameCore/" + customEventData + "/ball", this.Node).getComponent(cc.Sprite).spriteFrame = this.redBallSprites[1];
                    if (this.redFlag >= 4) {
                        this.redFlag = 0;
                        if (this.orderFlag == -1) {
                            this.orderFlag = 0;
                            this.HideBalls(0);
                            this.countDownSeconds = 10;

                            this.playStatus = 1;
                            this.ClockObj.rotation = 180;
                            cc.find("Image", this.ClockObj).getComponent(cc.Sprite).spriteFrame = this.cloclSprites[0];
                            this.ClockObj.active = true;
                        }
                        else {
                            this.playStatus = 2;
                            this.SwitchBalls(0);
                            this.scheduleOnce(function () {
                                this.generateList(1);
                                this.ShowBalls(1);
                                this.showList(1);
                                cc.find("Image", this.ClockObj).getComponent(cc.Sprite).spriteFrame = this.cloclSprites[0];
                                this.playStatus = 1;
                                if (this.orderFlag == 1) {
                                    this.countDownSeconds += 5;
                                    if (this.countDownSeconds > 10) {
                                        this.countDownSeconds = 10;
                                    }
                                }
                            }, 1);
                        }
                    }
                }
                else if (this.redFlag < this.randomListRed[clickIndex - 1] - 1) {
                    this.SoundMGR.playRebounce();
                    this.countDownSeconds -= 1;
                    if (this.countDownSeconds < 0) {
                        this.countDownSeconds = 0;
                    }
                }
            }
        }
        else if (customEventData.indexOf("b") != -1) {//blue click
            var clickIndex = customEventData.substr(1, 1);
            if (this.playStatus == -1 || this.playStatus == 1 || this.isBlueEnabled) {
                cc.log("blue flag:" + this.blueFlag + " array:" + this.randomListBlue + " clicked:" + clickIndex);
                if (this.blueFlag == this.randomListBlue[clickIndex - 1] - 1) {
                    this.blueFlag += 1;
                    this.SoundMGR.playPop();
                    cc.find("Canvas/GameCore/" + customEventData + "/ball", this.Node).getComponent(cc.Sprite).spriteFrame = this.blueBallSprites[1];
                    if (this.blueFlag >= 4) {

                        this.blueFlag = 0;
                        if (this.orderFlag == -1) {
                            this.orderFlag = 1;
                            this.HideBalls(1);
                            this.playStatus = 0;
                            this.countDownSeconds = 10;
                            this.ClockObj.rotation = 0;
                            cc.find("Image", this.ClockObj).getComponent(cc.Sprite).spriteFrame = this.cloclSprites[1];
                            this.ClockObj.active = true;
                        }
                        else {
                            this.playStatus = 2;
                            this.SwitchBalls(1);
                            this.scheduleOnce(function () {
                                this.generateList(0);
                                this.ShowBalls(0);
                                this.showList(0);
                                this.playStatus = 0;
                                cc.find("Image", this.ClockObj).getComponent(cc.Sprite).spriteFrame = this.cloclSprites[1];
                                if (this.orderFlag == 0) {
                                    this.countDownSeconds += 5;
                                    if (this.countDownSeconds > 10) {
                                        this.countDownSeconds = 10;
                                    }
                                }
                            }, 1);
                        }
                    }
                }
                else if (this.blueFlag < this.randomListBlue[clickIndex - 1] - 1) {
                    this.SoundMGR.playRebounce();
                    this.countDownSeconds -= 1;
                    if (this.countDownSeconds < 0) {
                        this.countDownSeconds = 0;
                    }
                }
            }

        }
    },


    ShowBalls(colorIndex) {
        if (colorIndex == 0) {
            for (var i = 0; i < 4; i++) {
                this.RedBalls[i].scale = new cc.Vec2(0, 0);
                this.RedBalls[i].y = -350;
                this.RedBalls[i].active = true;
                var sa = cc.scaleTo(0.1, 1, 1);

                this.RedBalls[i].runAction(sa);

            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                this.BlueBalls[i].scale = new cc.Vec2(0, 0);
                this.BlueBalls[i].y = 350;
                this.BlueBalls[i].active = true;
                var sa = cc.scaleTo(0.1, 1, 1);

                this.BlueBalls[i].runAction(sa);
            }
        }
    },

    HideBalls(colorIndex) {
        if (colorIndex == 0)//red
        {
            for (var i = 0; i < 4; i++) {
                var ra = cc.rotateBy(1, 2160);

                var sa = cc.scaleTo(1, 0, 0);
                this.RedBalls[i].runAction(ra);
                this.RedBalls[i].runAction(sa);

            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                var ra = cc.rotateBy(1, 2160);

                var sa = cc.scaleTo(1, 0, 0);
                this.BlueBalls[i].runAction(ra);
                this.BlueBalls[i].runAction(sa);

            }
        }
    },

    SwitchBalls(colorIndex) {
        cc.find("Image", this.ClockObj).getComponent(cc.Sprite).spriteFrame = this.cloclSprites[2];
        if (colorIndex == 0)//red
        {
            var cra = cc.rotateBy(1, 180);
            this.ClockObj.runAction(cra);
            for (var i = 0; i < 4; i++) {
                var ra = cc.rotateBy(1, 2160);
                var ma = cc.moveTo(1, this.RedBalls[i].x, 350);
                var sa = cc.scaleTo(1, 0, 0);

                this.RedBalls[i].runAction(ra);
                this.RedBalls[i].runAction(sa);
                this.RedBalls[i].runAction(ma);
                this.isBlueEnabled = false;
                this.isRedEnabled = false;
            }
        }
        else {
            var cra = cc.rotateBy(1, 180);
            this.ClockObj.runAction(cra);
            for (var i = 0; i < 4; i++) {
                var ra = cc.rotateBy(1, 2160);
                var ma = cc.moveTo(1, this.BlueBalls[i].x, -350);
                var sa = cc.scaleTo(1, 0, 0);
                this.BlueBalls[i].runAction(ra);
                this.BlueBalls[i].runAction(sa);
                this.BlueBalls[i].runAction(ma);
                this.isBlueEnabled = false;
                this.isRedEnabled = false;
            }
        }
    },

    showList(colorIndex) {
        if (colorIndex == 0)//red
        {
            // cc.log(this.randomListRed);
            for (var i = 0; i < 4; i++) {
                cc.find("index", this.RedBalls[i]).getComponent(cc.Sprite).spriteFrame = this.redSprites[this.randomListRed[i] - 1];
                cc.find("index", this.RedBalls[i]).opacity = 0;
                cc.find("index", this.RedBalls[i]).active = true;
                this.RedBalls[i].getComponent(cc.Button).enabled = true;
                cc.find("ball", this.RedBalls[i]).getComponent(cc.Sprite).spriteFrame = this.redBallSprites[0];
                var aa = cc.fadeTo(0.3, 255);
                cc.find("index", this.RedBalls[i]).runAction(aa);
                this.isRedEnabled = true;
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                cc.find("index", this.BlueBalls[i]).getComponent(cc.Sprite).spriteFrame = this.blueSprites[this.randomListBlue[i] - 1];
                cc.find("index", this.BlueBalls[i]).opacity = 0;
                cc.find("index", this.BlueBalls[i]).active = true;
                this.BlueBalls[i].getComponent(cc.Button).enabled = true;
                cc.find("ball", this.BlueBalls[i]).getComponent(cc.Sprite).spriteFrame = this.blueBallSprites[0];
                var aa = cc.fadeTo(0.3, 255);
                cc.find("index", this.BlueBalls[i]).runAction(aa);
                this.isBlueEnabled = true;
            }
        }
    },

    generateList(colorIndex) {

        if (colorIndex == 0)//red
        {
            var tmpListr = [1, 2, 3, 4];
            this.randomListRed = [];
            for (var i = 0; i < 4; i++) {
                var tr = Math.floor(Math.random() * tmpListr.length);
                var ti = tmpListr[tr];
                this.randomListRed.push(ti.toString());
                tmpListr.splice(tr, 1);
            }
        }
        else {
            var tmpListb = [1, 2, 3, 4];
            this.randomListBlue = [];
            for (var i = 0; i < 4; i++) {
                var tr = Math.floor(Math.random() * tmpListb.length);
                var ti = tmpListb[tr];
                this.randomListBlue.push(ti.toString());
                tmpListb.splice(tr, 1);
            }
        }
    },


    update(dt) {
        if (this.GameStatus == 1) {
            if (this.playStatus == 0 || this.playStatus == 1) {
                this.tmpTimer += dt;
                if (this.tmpTimer >= 1) {
                    this.tmpTimer = 0;
                    this.countDownSeconds -= 1;
                    if (this.countDownSeconds <= 0) {
                        this.countDownSeconds = 0;

                    }
                }
                this.CountDownLabel.string = this.countDownSeconds;
            }
            else {
                this.tmpTimer += dt;
                if (this.tmpTimer >= 1) {
                    this.tmpTimer = 0;
                    this.countDownSeconds -= 1;
                    if (this.countDownSeconds <= 0) {
                        this.countDownSeconds = 0;

                    }
                }
            }

            if (this.countDownSeconds == 0) {
                if (this.playStatus == 0)//blue win
                {
                    this.GameStatus = 2;
                    Global.GameData.CurrentWinner = 1;
                    this.GameResultNode.active = true;
                }
                else {
                    this.GameStatus = 2;
                    Global.GameData.CurrentWinner = 0;
                    this.GameResultNode.active = true;
                }
            }

        }
    },
});
