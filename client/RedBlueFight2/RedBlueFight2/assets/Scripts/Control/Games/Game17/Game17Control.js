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
        rSprite:
        {
            default: null,
            type: cc.SpriteFrame,
        },
        bSprite:
        {
            default: null,
            type: cc.SpriteFrame,
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
        GameStatus: 0,//0未开始，1开始了，2结束了
        rListRed: [],
        rListBlue: [],
        rBallParent:
        {
            default: null,
            type: cc.Node,
        },
        bBallParent:
        {
            default: null,
            type: cc.Node,
        },
        rLineIndex: 2,
        bLineIndex: 2,
        rScore: 0,
        bScore: 0,
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
            this.generateAllList();
        }, 4.5);

    },
    generateAllList() {
        for (var i = 0; i < 5; i++) {
            var tmpr = Math.floor(Math.random() * 4);
            var tmpb = Math.floor(Math.random() * 4);
            this.rListRed.push(tmpr);
            this.rListBlue.push(tmpb);
            for (var j = 0; j < 4; j++) {
                //set red
                if (j == tmpr) {
                    cc.find("r" + i + j, this.rBallParent).getComponent(cc.Sprite).spriteFrame = this.rSprite;

                }
                else {
                    cc.find("r" + i + j, this.rBallParent).getComponent(cc.Sprite).spriteFrame = this.bSprite;
                }
                if (i == this.rLineIndex) {
                    cc.find("r" + i + j, this.rBallParent).color = cc.Color.WHITE;
                    cc.find("r" + i + j, this.rBallParent).getComponent(cc.Button).enabled = true;
                }
                else {
                    cc.find("r" + i + j, this.rBallParent).color = cc.Color.GRAY;
                    cc.find("r" + i + j, this.rBallParent).getComponent(cc.Button).enabled = false;
                }
                //set blue
                if (j == tmpb) {
                    cc.find("b" + i + j, this.bBallParent).getComponent(cc.Sprite).spriteFrame = this.bSprite;

                }
                else {
                    cc.find("b" + i + j, this.bBallParent).getComponent(cc.Sprite).spriteFrame = this.rSprite;
                }
                if (i == this.bLineIndex) {
                    cc.find("b" + i + j, this.bBallParent).color = cc.Color.WHITE;
                    cc.find("b" + i + j, this.bBallParent).getComponent(cc.Button).enabled = true;
                }
                else {
                    cc.find("b" + i + j, this.bBallParent).color = cc.Color.GRAY;
                    cc.find("b" + i + j, this.bBallParent).getComponent(cc.Button).enabled = false;
                }
            }


        }
        this.rBallParent.active = true;
        this.bBallParent.active = true;
    },

    onBallClick(event, customEventData) {
        if (this.GameStatus == 1) {
            if (customEventData.indexOf("r") != -1) {
                if (cc.find(customEventData, this.rBallParent).getComponent(cc.Sprite).spriteFrame == this.rSprite) {
                    this.moveDown(0);
                    
                }
                else {
                    cc.log("red wrong");
                    this.SoundMGR.playRebounce();
                }
            }
            else {
                if (cc.find(customEventData, this.bBallParent).getComponent(cc.Sprite).spriteFrame == this.bSprite) {
                    this.moveDown(1);
                }
                else {
                    cc.log("blue wrong");
                    this.SoundMGR.playRebounce();
                }
            }
        }
    },

    moveDown(colorIndex) {
        if (colorIndex == 0)//red move down
        {
            for (var i = 0; i < 5; i++) {

                for (var j = 0; j < 4; j++) {
                    var ma = cc.moveBy(0.3, new cc.Vec2(0, -135));
                    cc.find("r" + i + j, this.rBallParent).runAction(ma);
                }

            }
            this.rScore += 1;
            this.redScoreNumber.setNumber(this.rScore);
            this.SoundMGR.playScore();
            if (this.rScore >= 25) {

                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentWinner = 0;
                this.GameResultNode.active = true;
            }
            this.scheduleOnce(function () {
                var tmpLine = this.rLineIndex + 1;
                if (tmpLine > 4) {
                    tmpLine = 0;
                }
                this.rLineIndex -= 1;
                if (this.rLineIndex < 0) {
                    this.rLineIndex = 4;
                }
                var tmpr = Math.floor(Math.random() * 4);
                for (var k = 0; k < 4; k++) {
                    cc.find("r" + tmpLine + k, this.rBallParent).y = 270;
                    cc.find("r" + tmpLine + k, this.rBallParent).color = cc.Color.GRAY;
                    cc.find("r" + tmpLine + k, this.rBallParent).getComponent(cc.Button).enabled = false;
                    if (k == tmpr) {
                        cc.find("r" + tmpLine + k, this.rBallParent).getComponent(cc.Sprite).spriteFrame = this.rSprite;

                    }
                    else {
                        cc.find("r" + tmpLine + k, this.rBallParent).getComponent(cc.Sprite).spriteFrame = this.bSprite;
                    }
                    cc.find("r" + this.rLineIndex + k, this.rBallParent).color = cc.Color.WHITE;
                    cc.find("r" + this.rLineIndex + k, this.rBallParent).getComponent(cc.Button).enabled = true;
                }
            }
                , 0.3);
        }
        else {
            for (var i = 0; i < 5; i++) {

                for (var j = 0; j < 4; j++) {
                    var ma = cc.moveBy(0.3, new cc.Vec2(0, -135));
                    cc.find("b" + i + j, this.bBallParent).runAction(ma);
                }

            }
            this.bScore += 1;
            this.blueScoreNumber.setNumber(this.bScore);
            this.SoundMGR.playScore();
            if (this.bScore >= 25) {

                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentWinner = 1;
                this.GameResultNode.active = true;
            }
            this.scheduleOnce(function () {
                var tmpLine = this.bLineIndex + 1;
                if (tmpLine > 4) {
                    tmpLine = 0;
                }
                this.bLineIndex -= 1;
                if (this.bLineIndex < 0) {
                    this.bLineIndex = 4;
                }
                var tmpb = Math.floor(Math.random() * 4);
                for (var k = 0; k < 4; k++) {
                    cc.find("b" + tmpLine + k, this.bBallParent).y = 270;
                    cc.find("b" + tmpLine + k, this.bBallParent).color = cc.Color.GRAY;
                    cc.find("b" + tmpLine + k, this.bBallParent).getComponent(cc.Button).enabled = false;
                    if (k == tmpb) {
                        cc.find("b" + tmpLine + k, this.bBallParent).getComponent(cc.Sprite).spriteFrame = this.bSprite;

                    }
                    else {
                        cc.find("b" + tmpLine + k, this.bBallParent).getComponent(cc.Sprite).spriteFrame = this.rSprite;
                    }
                    cc.find("b" + this.bLineIndex + k, this.bBallParent).color = cc.Color.WHITE;
                    cc.find("b" + this.bLineIndex + k, this.bBallParent).getComponent(cc.Button).enabled = true;
                }
            }
                , 0.3);
        }
    },
    // update (dt) {},
});
