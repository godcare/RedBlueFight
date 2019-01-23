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
        RedFake:
        {
            default: null,
            type: cc.Node,
        },
        BlueFake:
        {
            default: null,
            type: cc.Node,
        },
        GameStatus: 0,//0未开始，1开始了，2结束了
        RoundInterval: 2,
        safeOffsetY: 35,
        rPos: 3,
        bPos: 6,
        bluePipeParent:
        {
            default: null,
            type: cc.Node,
        },
        redPipeParent:
        {
            default: null,
            type: cc.Node,
        },
        outY: 295,
        safeY: 265,
        deadY: 265,
        safePipeY: -35,
        safeX1: -1,
        safeX2: -1,
        pipePushY: 155,
        pipeResetY: 50,
        roundCount: 0,
        yOffsets: [],//Y轴随机偏移量
        redRightBtn:
        {
            default: null,
            type: cc.Node,
        },
        redLeftBtn:
        {
            default: null,
            type: cc.Node,
        },
        BlueLeftBtn:
        {
            default: null,
            type: cc.Node,
        },
        BlueRightBtn:
        {
            default: null,
            type: cc.Node,
        },
        isRedDead: false,
        isBlueDead: false,
        isFirstRound: true,
        isSecondAliveBattle: false,//双方都没死，继续战斗
        maxOffsetY: 0.7,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    start() {
        this.startAnimation();
    },

    startAnimation() {
        var x1 = Math.floor(Math.random() * 10);
        while (x1 == this.rPos || x1 == this.bPos) {
            x1 = Math.floor(Math.random() * 10);
        }
        var x2 = Math.floor(Math.random() * 10);
        while (x2 == this.rPos || x2 == this.bPos || x2 == x1) {
            x2 = Math.floor(Math.random() * 10);
        }
        this.safeX1 = x1;
        this.safeX2 = x2;
        for (var i = 0; i < 10; i++) {
            if (i == x1 || i == x2) {
                cc.find(i.toString(), this.redPipeParent).y = this.safePipeY;
                cc.find(i.toString(), this.bluePipeParent).y = this.safePipeY;
            }
        }
        this.isFirstRound = true;
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {

            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.PrepareNextGame();
        }, 4.5);

    },

    PrepareNextGame() {
        if (!this.isFirstRound) {
            this.RedPlayer.active = false;
            this.BluePlayer.active = false;
            var x1 = Math.floor(Math.random() * 10);
            while (x1 == this.rPos || x1 == this.bPos) {
                x1 = Math.floor(Math.random() * 10);
            }
            var x2 = Math.floor(Math.random() * 10);
            while (x2 == this.rPos || x2 == this.bPos || x2 == x1) {
                x2 = Math.floor(Math.random() * 10);
            }
            this.safeX1 = x1;
            this.safeX2 = x2;
            this.setYOffsets();
            var rma = cc.moveTo(0.3, new cc.Vec2(0, this.pipeResetY));
            this.redPipeParent.runAction(rma);
            var bma = cc.moveTo(0.3, new cc.Vec2(0, this.pipeResetY));
            this.bluePipeParent.runAction(bma);
            for (var i = 0; i < 10; i++) {
                if (i == x1 || i == x2) {
                    var rppa = cc.moveTo(0.3, new cc.Vec2(cc.find(i.toString(), this.redPipeParent).x, this.safePipeY + this.yOffsets[i]));
                    var bppa = cc.moveTo(0.3, new cc.Vec2(cc.find(i.toString(), this.bluePipeParent).x, this.safePipeY - this.yOffsets[i]));
                    cc.find(i.toString(), this.redPipeParent).runAction(rppa);
                    cc.find(i.toString(), this.bluePipeParent).runAction(bppa);
                }
                else {
                    var rppa = cc.moveTo(0.3, new cc.Vec2(cc.find(i.toString(), this.redPipeParent).x, this.yOffsets[i]));
                    var bppa = cc.moveTo(0.3, new cc.Vec2(cc.find(i.toString(), this.bluePipeParent).x, -this.yOffsets[i]));
                    cc.find(i.toString(), this.redPipeParent).runAction(rppa);
                    cc.find(i.toString(), this.bluePipeParent).runAction(bppa);
                    // cc.find(i.toString(), this.redPipeParent).y = 0;
                    // cc.find(i.toString(), this.bluePipeParent).y = 0;
                }
            }
        }
        else {
            this.setYOffsets();
        }
        this.isFirstRound = false;
        this.scheduleOnce(function () {
            this.ShowBalls();
            this.BlueRightBtn.getComponent(cc.Button).enabled = true;
            this.BlueLeftBtn.getComponent(cc.Button).enabled = true;
            this.redRightBtn.getComponent(cc.Button).enabled = true;
            this.redLeftBtn.getComponent(cc.Button).enabled = true;
        }, 0.3);
        this.scheduleOnce(function () {
            this.pushStart()
        }, this.RoundInterval + 0.3);
    },

    setYOffsets() {
        this.yOffsets = [];
        if (this.isSecondAliveBattle) {
            for (var i = 0; i < 10; i++) {
                var tmp = Math.floor((Math.random() - 0.5) * 2 * this.maxOffsetY * this.safePipeY);
                this.yOffsets.push(tmp);
            }
        }
        else {

            for (var i = 0; i < 10; i++) {
                this.yOffsets.push(0);
            }
        }
    },

    pushStart() {
        this.roundCount += 1;
        this.RoundInterval -= this.roundCount * 0.15;
        if (this.RoundInterval <= 0.7) {
            this.RoundInterval = 0.7;
        }
        this.shakePipes(20, 5, 0.05, 1);
        this.SoundMGR.playShake();
        this.scheduleOnce(function () {
            //push pipes
            this.BlueRightBtn.getComponent(cc.Button).enabled = false;
            this.BlueLeftBtn.getComponent(cc.Button).enabled = false;
            this.redRightBtn.getComponent(cc.Button).enabled = false;
            this.redLeftBtn.getComponent(cc.Button).enabled = false;
            var rma = cc.moveTo(0.1, new cc.Vec2(0, this.pipePushY));
            var bma = cc.moveTo(0.1, new cc.Vec2(0, this.pipePushY));
            this.bluePipeParent.runAction(rma);
            this.redPipeParent.runAction(bma);

            this.RedFake.active = false;
            this.BlueFake.active = false;
            this.scheduleOnce(function () {
                var isAlive = true;
                if (this.rPos != this.safeX1 && this.rPos != this.safeX2) {//Red danger
                    // this.RedPlayer.active = true;
                    this.RedPlayer.y = this.deadY + this.yOffsets[this.rPos];
                    this.RedPlayer.height = 10;
                    this.isRedDead = true;
                    isAlive = false;
                    this.SoundMGR.playFart();
                    // var rsa = cc.scaleTo(0.3, new cc.Vec2(1, 1));                
                    // this.RedPlayer.runAction(rsa);
                }
                else {
                    this.isRedDead = false;
                }
                if (this.bPos != this.safeX1 && this.bPos != this.safeX2) {//Blue danger
                    // this.BluePlayer.active = true;
                    this.BluePlayer.y = this.deadY - this.yOffsets[this.bPos];
                    this.BluePlayer.height = 10;
                    this.isBlueDead = true;
                    this.SoundMGR.playFart();
                    isAlive = false;
                    // var bsa = cc.scaleTo(0.3, new cc.Vec2(1, 1));
                    // this.BluePlayer.runAction(bsa);
                }
                else {
                    this.isBlueDead = false;
                }
                if (isAlive) {
                    this.SoundMGR.playPush2();
                }
            }, 0.05);
        }, 1.1);

        this.scheduleOnce(function () {
            this.shakePipes(10, 5, 0.05, -1);
        }, 1.25);

        this.scheduleOnce(function () {
            var isDraw = false;
            if (this.isBlueDead && this.isRedDead) {
                isDraw = true;

                this.PrepareNextGame();
            }
            else if (!this.isBlueDead && !this.isRedDead) {
                isDraw = true;
                this.isSecondAliveBattle = true;
                this.PrepareNextGame();
            }
            else {
                if (this.isBlueDead) {
                    this.GameStatus = 2;
                    this.SoundMGR.playOver();
                    Global.GameData.CurrentWinner = 0;
                    this.GameResultNode.active = true;

                }
                else if (this.isRedDead) {
                    this.GameStatus = 2;
                    this.SoundMGR.playOver();
                    Global.GameData.CurrentWinner = 1;
                    this.GameResultNode.active = true;
                }
            }
        }, 2);
        // this.scheduleOnce(function () {
        //     this.shakePipes(20, 3, 0.05, 1);
        // }, this.RoundInterval);
    },

    shakePipes(shakeCount, shakeMaxOffset, shakeInterval, isReverse) {

        if (isReverse == 1) {
            var iflag = 1;
            var orY = this.redPipeParent.y;
            var obY = this.bluePipeParent.y;
            var j = 0;
            for (var i = 0; i < shakeCount; i++) {

                this.scheduleOnce(function () {
                    iflag *= -1;
                    j += 1;
                    cc.log(j);
                    var rma = cc.moveTo(shakeInterval, new cc.Vec2(0, orY + (shakeMaxOffset * iflag * (j + 1) / shakeCount)));
                    var bma = cc.moveTo(shakeInterval, new cc.Vec2(0, obY + (shakeMaxOffset * iflag * (j + 1) / shakeCount)));
                    this.redPipeParent.runAction(rma);
                    this.bluePipeParent.runAction(bma);

                }, i * shakeInterval);
            }
        }
        else {
            var iflag = 1;
            var orY = this.redPipeParent.y;
            var obY = this.bluePipeParent.y;
            var j = 0;
            for (var i = 0; i < shakeCount; i++) {
                cc.log("shake reverse");
                this.scheduleOnce(function () {
                    iflag *= -1;
                    j += 1;
                    // cc.log((i));
                    // cc.log(shakeMaxOffset * iflag * (shakeCount - i) / shakeCount);
                    var rma = cc.moveTo(shakeInterval, new cc.Vec2(0, orY + (shakeMaxOffset * iflag * (shakeCount - j) / shakeCount)));
                    var bma = cc.moveTo(shakeInterval, new cc.Vec2(0, obY + (shakeMaxOffset * iflag * (shakeCount - j) / shakeCount)));
                    this.redPipeParent.runAction(rma);
                    this.bluePipeParent.runAction(bma);

                }, i * shakeInterval);
            }
        }
    },

    ShowBalls() {
        this.setBallPos(0, this.rPos);
        this.setBallPos(1, this.bPos);
        this.RedPlayer.active = true;
        this.BluePlayer.active = true;
        this.RedFake.active = true;
        this.BlueFake.active = true;
        this.RedPlayer.opacity = 0;
        this.BluePlayer.opacity = 0;
        this.RedFake.opacity = 0;
        this.BlueFake.opacity = 0;
        this.BluePlayer.height = 104;
        this.RedPlayer.height = 104;
        var rboa = cc.fadeTo(0.3, 255);
        var rfoa = cc.fadeTo(0.3, 120);
        var bboa = cc.fadeTo(0.3, 255);
        var bfoa = cc.fadeTo(0.3, 120);
        this.RedPlayer.runAction(rboa);
        this.BluePlayer.runAction(bboa);
        this.RedFake.runAction(rfoa);
        this.BlueFake.runAction(bfoa);
    },

    setBallPos(ballType, ballPos) {
        if (ballType == 0)//red
        {
            this.RedPlayer.x = cc.find(ballPos.toString(), this.redPipeParent).x;
            if (this.safeX1 != ballPos && this.safeX2 != ballPos) {
                this.RedPlayer.y = this.outY + this.yOffsets[ballPos];
            }
            else {
                this.RedPlayer.y = this.safeY + this.yOffsets[ballPos];
            }
            this.RedFake.x = cc.find(ballPos.toString(), this.bluePipeParent).x;
            if (this.safeX1 != ballPos && this.safeX2 != ballPos) {
                this.RedFake.y = this.outY - this.yOffsets[ballPos];
            }
            else {
                this.RedFake.y = this.safeY - this.yOffsets[ballPos];
            }

        }
        else {
            this.BluePlayer.x = cc.find(ballPos.toString(), this.bluePipeParent).x;
            if (this.safeX1 != ballPos && this.safeX2 != ballPos) {
                this.BluePlayer.y = this.outY - this.yOffsets[ballPos];
            }
            else {
                this.BluePlayer.y = this.safeY - this.yOffsets[ballPos];
            }
            this.BlueFake.x = cc.find(ballPos.toString(), this.redPipeParent).x;
            if (this.safeX1 != ballPos && this.safeX2 != ballPos) {
                this.BlueFake.y = this.outY + this.yOffsets[ballPos];
            }
            else {
                this.BlueFake.y = this.safeY + this.yOffsets[ballPos];
            }
        }
    },

    onRedMove(event, customEventData) {
        cc.log("red move:" + customEventData);
        if (customEventData == "-1") {
            if (this.rPos > 0) {
                if ((this.rPos - 1) != this.bPos) {
                    this.rPos -= 1;
                }
                else if (this.rPos - 2 >= 0) {
                    this.rPos -= 2;
                }
                this.setBallPos(0, this.rPos);
            }
        }
        else {
            if (this.rPos < 9) {
                if ((this.rPos + 1) != this.bPos) {
                    this.rPos += 1;
                }
                else if (this.rPos + 2 <= 9) {
                    this.rPos += 2;
                }
                this.setBallPos(0, this.rPos);
            }
        }
    },

    onBlueMove(event, customEventData) {
        if (customEventData == -1) {
            if (this.bPos > 0) {
                if ((this.bPos - 1) != this.rPos) {
                    this.bPos -= 1;
                }
                else if (this.bPos - 2 >= 0) {
                    this.bPos -= 2;
                }
                this.setBallPos(1, this.bPos);
            }
        }
        else {
            if (this.bPos < 9) {
                if ((this.bPos + 1) != this.rPos) {
                    this.bPos += 1;
                }
                else if (this.bPos + 2 <= 9) {
                    this.bPos += 2;
                }
                this.setBallPos(1, this.bPos);
            }
        }
    },
    // update (dt) {},
});
