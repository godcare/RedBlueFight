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
        GameStatus: 0,//0未开始，1开始了，2结束了
        correctResult: 0,
        nList: [],
        oList: [],
        redFomulaLabel:
        {
            default: null,
            type: cc.Node,
        },
        blueFomulaLabel:
        {
            default: null,
            type: cc.Node,
        },
        roundIndex: 0,
        targetResult: 0,
        btnObjs:
        {
            default: [],
            type: [cc.Node],
        },
        redScore: 0,
        blueScore: 0,
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
        TotalSeconds: 45,
        tmpTimer: 0,
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

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.startAnimation();
    },

    startAnimation() {
        this.disableAddBtns();
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.createFormula();
        }, 4.5);

    },

    onAnswerClick(event, customEventData) {
        if (customEventData.indexOf("r") > -1) {
            this.disableAddBtns();
            this.SoundMGR.playPop();
            if (customEventData.indexOf(this.correctResult.toString()) > -1) {
                this.redScore += 1;
                this.redScoreNumber.setNumber(this.redScore);
                this.scheduleOnce(function () {
                    this.createFormula();
                }, 1);
            }
            else {
                this.SoundMGR.playOver();
                this.schedule(function () {
                    if (this.GameStatus == 1) {
                        this.redFomulaLabel.active = !this.redFomulaLabel.active;
                    }
                }, 0.2);
                this.scheduleOnce(function () {
                    this.GameStatus = 2;
                    Global.GameData.CurrentWinner = 1;
                    this.GameResultNode.active = true;
                }, 1);
            }

        }
        else if (customEventData.indexOf("b") > -1) {
            cc.log("b");
            this.disableAddBtns();
            this.SoundMGR.playPop();
            if (customEventData.indexOf(this.correctResult.toString()) > -1) {
                this.blueScore += 1;
                this.blueScoreNumber.setNumber(this.blueScore);
                this.scheduleOnce(function () {
                    this.createFormula();
                }, 1);
            }
            else {
                this.SoundMGR.playOver();
                this.schedule(function () {
                    if (this.GameStatus == 1) {
                        this.blueFomulaLabel.active = !this.blueFomulaLabel.active;
                    }
                }, 0.2);
                this.scheduleOnce(function () {
                    this.GameStatus = 2;
                    Global.GameData.CurrentWinner = 0;
                    this.GameResultNode.active = true;
                }, 1);
            }
        }
    },

    createFormula() {
        var fLength = 2;
        this.roundIndex += 1;
        if (this.roundIndex == 1 || this.roundIndex == 3) {
            fLength = 2;
        }
        else if (this.roundIndex < 10 && this.roundIndex != 6) {
            fLength = 3;
        }
        else {
            fLength = 4;
        }
        if (this.nList.length > 0)//之前有打过
        {
            var rsa = cc.scaleTo(0.3, 1, 0);
            var bsa = cc.scaleTo(0.3, 1, 0);
            this.redFomulaLabel.runAction(rsa);
            this.blueFomulaLabel.runAction(bsa);
        }

        this.nList = [];
        this.oList = [];
        this.correctResult = 0;
        this.targetResult = Math.floor(Math.random() * 3) + 1;
        for (var i = 0; i < fLength; i++) {
            var tmpN = Math.floor(Math.random() * 3) + 1;
            this.nList.push(tmpN);
        }

        //generate
        this.correctResult = this.nList[0];
        for (var i = 0; i < fLength - 1; i++) {
            var tmpO = Math.random();

            if (fLength == 2) {//两个数字，
                if (this.nList[0] == 3) {//第一个为3，则不能用加号，且第二个在1-2随机
                    tmpO = 0;
                    this.nList[1] = Math.floor(Math.random() * 2) + 1;
                }
                else if (this.nList[0] == 2)//第一个为2，第二个必定为1
                {
                    this.nList[1] = 1;
                }
                else {//第一个为1，必须用加号，且在1-2随机
                    tmpO = 0.7;
                    this.nList[1] = Math.floor(Math.random() * 2) + 1;
                }
            }
            else if (fLength == 3)//3 numbers
            {
                if (i == 1) {
                    if (this.correctResult < 1)//前面的值小于1
                    {
                        tmpO = 0.7;
                        if (this.correctResult == -1) {//-1,只能2-3随机
                            this.nList[2] = Math.floor(Math.random() * 2) + 2;
                        }
                        else if (this.correctResult == -2) {//-2，只能选3
                            this.nList[2] = 3;
                        }
                    }
                    else if (this.correctResult > 3) {
                        tmpO = 0;
                        if (this.correctResult == 5) {//5,只能2-3随机
                            this.nList[2] = Math.floor(Math.random() * 2) + 2;
                        }
                        else if (this.correctResult == 6) {//6，只能选3
                            this.nList[2] = 3;
                        }
                    }
                    else {
                        if (this.correctResult == 1) {
                            tmpO = 0.7;
                            this.nList[2] = Math.floor(Math.random() * 2) + 1;
                        }
                        else if (this.correctResult == 2) {
                            this.nList[2] = 1;
                        }
                        else if (this.correctResult == 3) {
                            tmpO = 0;
                            this.nList[2] = Math.floor(Math.random() * 2) + 1;
                        }
                    }
                }
            }
            else if (fLength == 4) {
                if (i == 2) {//最后一个操作位
                    if (this.correctResult > 3) {
                        if (this.correctResult == 4) {
                            tmpO = 0;
                        }
                        else if (this.correctResult == 5) {//5,只能2-3随机
                            this.nList[3] = Math.floor(Math.random() * 2) + 2;
                            tmpO = 0;
                        }
                        else if (this.correctResult == 6) {//6，只能选3
                            this.nList[3] = 3;
                            tmpO = 0;
                        }
                        else if (this.correctResult == 7)//2.2.3相加，随意改变一个为负号即可
                        {
                            var tmpOI = Math.floor(Math.random() * 2);
                            this.oList[tmpOI] = "-";
                            this.correctResult -= this.nList[tmpOI + 1] * 2;
                            if (this.correctResult == 1) {//1,只能1-2随机
                                tmpO = 0.7;
                                this.nList[3] = Math.floor(Math.random() * 2) + 1;
                            }
                            else if (this.correctResult == 3) {
                                tmpO = 0;
                                this.nList[3] = Math.floor(Math.random() * 2) + 1;
                            }
                        }
                        else if (this.correctResult == 8)//2,3,3相加，随意改变一个负号即可
                        {
                            var tmpOI = Math.floor(Math.random() * 2);
                            this.oList[tmpOI] = "-";
                            this.correctResult -= this.nList[tmpOI + 1] * 2;
                            if (this.correctResult == 4) {//4,只能减号
                                // this.nList[3] = Math.floor(Math.random() * 2) + 2;
                                tmpO = 0;
                            }
                            else if (this.correctResult == 2) {//2，最后只能为1
                                this.nList[3] = 1;
                            }
                        }
                        else if (this.correctResult == 9)//3,3,3相加，改变任意一个值到1-2，并且随意改变一个负号
                        {
                            var tmpNI = Math.floor(Math.random() * 3);
                            this.nList[tmpNI] = Math.floor(Math.random() * 2) + 1;
                            var tmpOI = Math.floor(Math.random() * 2);
                            this.oList[tmpOI] = "-";
                            this.correctResult -= (3 - this.nList[tmpNI] + this.nList[tmpOI + 1] * 2);
                            if (this.correctResult == 2) {//2,只能1
                                this.nList[3] = 1;
                            }
                            else if (this.correctResult == 1) {//1，只能选1-2
                                tmpO = 0.7;
                                this.nList[3] = Math.floor(Math.random() * 2) + 1;
                            }
                        }
                    }
                    else if (this.correctResult < 1) {
                        if (this.correctResult == 0) {
                            tmpO = 0.7;
                        }
                        else if (this.correctResult == -1) {//-1,只能2-3随机
                            this.nList[3] = Math.floor(Math.random() * 2) + 2;
                            tmpO = 0.7;
                        }
                        else if (this.correctResult == -2) {//-2，只能选3
                            this.nList[3] = 3;
                            tmpO = 0.7;
                        }
                        else if (this.correctResult == -3)//包含1个3，和两个相等的数
                        {
                            var tmpOI = Math.floor(Math.random() * 2);
                            this.oList[tmpOI] = "+";
                            this.correctResult += this.nList[tmpOI + 1] * 2;
                            if (this.correctResult == -1) {//-1,只能2-3随机+
                                this.nList[3] = Math.floor(Math.random() * 2) + 2;
                                tmpO = 0.7;
                            }
                            else if (this.correctResult == 1) {//1，只能选1-2+
                                this.nList[3] = Math.floor(Math.random() * 2) + 1;
                                tmpO = 0.7;
                            }
                            else if (this.correctResult == 3)//3,1-2-
                            {
                                this.nList[3] = Math.floor(Math.random() * 2) + 1;
                                tmpO = 0;
                            }
                        }
                        else if (this.correctResult == -4)//包含1个3，和一对相减=-1的数
                        {
                            var tmpOI = Math.floor(Math.random() * 2);
                            this.oList[tmpOI] = "+";
                            this.correctResult += this.nList[tmpOI + 1] * 2;
                            if (this.correctResult == 0) {//0,只能减号
                                tmpO = 0.7;
                            }
                            else if (this.correctResult == 2) {//2，最后只能为1
                                this.nList[3] = 1;
                            }
                        }
                        else if (this.correctResult == -5)//1,3,3相-,随意改变一个负号
                        {
                            var tmpOI = Math.floor(Math.random() * 2);
                            this.oList[tmpOI] = "+";
                            this.correctResult += 6;
                            this.nList[3] = Math.floor(Math.random() * 2) + 1;
                            tmpO = 0.7;
                        }
                    }
                    else {
                        if (this.correctResult == 1) {
                            tmpO = 0.7;
                            this.nList[3] = Math.floor(Math.random() * 2) + 1;
                        }
                        else if (this.correctResult == 2) {
                            this.nList[3] = 1;
                        }
                        else if (this.correctResult == 3) {
                            tmpO = 0;
                            this.nList[3] = Math.floor(Math.random() * 2) + 1;
                        }
                    }
                }
            }
            if (tmpO < 0.5)//+
            {
                this.oList.push("-");
                this.correctResult -= this.nList[i + 1];
            }
            else//-
            {
                this.oList.push("+");
                this.correctResult += this.nList[i + 1];
            }
        }
        var fStr = "";
        for (var i = 0; i < fLength; i++) {
            fStr += this.nList[i] + " ";
            if (i <= fLength - 2) {
                fStr += this.oList[i] + " ";
            }
        }
        fStr += "= ?";

        for (var i = 0; i < this.btnObjs.length; i++) {
            this.btnObjs[i].getComponent(cc.Button).enabled = true;
            this.btnObjs[i].opacity = 255;
        }
        this.scheduleOnce(function () {
            cc.find("n0", this.redFomulaLabel).getComponent(cc.Label).string = fStr;
            cc.find("n1", this.redFomulaLabel).getComponent(cc.Label).string = fStr;
            cc.find("n0", this.blueFomulaLabel).getComponent(cc.Label).string = fStr;
            cc.find("n1", this.blueFomulaLabel).getComponent(cc.Label).string = fStr;
            this.redFomulaLabel.active = true;
            this.blueFomulaLabel.active = true;
            var rsa = cc.scaleTo(0.3, 1, 1);
            var bsa = cc.scaleTo(0.3, 1, 1);
            this.redFomulaLabel.runAction(rsa);
            this.blueFomulaLabel.runAction(bsa);
            this.SoundMGR.playScore();

        }, 0.3);
    },

    disableAddBtns() {
        for (var i = 0; i < this.btnObjs.length; i++) {
            this.btnObjs[i].getComponent(cc.Button).enabled = false;
            this.btnObjs[i].opacity = 120;
        }
    },

    update(dt) {
        if (this.GameStatus == 1) {
            if (this.tmpTimer <= this.TotalSeconds) {
                this.tmpTimer += dt;
                this.redProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
                this.blueProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
            }
            else {
                this.GameStatus = 2;

                if (this.redScore > this.blueScore) {
                    this.SoundMGR.playOver();
                    this.scheduleOnce(function () {
                        Global.GameData.CurrentWinner = 0;
                        this.GameResultNode.active = true;
                    }, 1);
                }
                else if (this.redScore < this.blueScore) {
                    this.SoundMGR.playOver();
                    this.scheduleOnce(function () {
                        Global.GameData.CurrentWinner = 1;
                        this.GameResultNode.active = true;
                    }, 1);
                }
                else {
                    this.SoundMGR.playOver();
                    this.scheduleOnce(function () {
                        Global.GameData.CurrentWinner = 2;
                        this.GameResultNode.active = true;
                    }, 1);
                }
            }
        }
    },
});
