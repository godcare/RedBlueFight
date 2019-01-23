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
        redPre:
        {
            default: null,
            type: cc.Node,
        },
        bluePre:
        {
            default: null,
            type: cc.Node,
        },
        redBall:
        {
            default: null,
            type: cc.Node,
        },
        blueBall:
        {
            default: null,
            type: cc.Node,
        },
        jumpDownList: [],
        GameStatus: 0,//0未开始，1开始了，2结束了
        isRedDown: false,
        isBlueDown: false,
        isRedScored: false,
        isBlueScored: false,
        redScore: 0,
        blueScore: 0,
        ScoreSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        redScoreParent:
        {
            default: null,
            type: cc.Node,
        },
        blueScoreParent:
        {
            default: null,
            type: cc.Node,
        },
        redPanel:
        {
            default: null,
            type: cc.Node,
        },
        bluePanel:
        {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    },

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
            this.spawnBall(0);
            this.spawnBall(1);
        }, 4.5);

    },

    OnBallHit(ballName, hitName) {
        if (ballName == "redBall") {
            switch (hitName) {
                case "RightScore":
                    if (!this.isRedScored) {
                        this.redScore += 1;
                        this.isRedScored = true;
                        this.scheduleOnce(function () {
                            if (this.GameStatus == 1) {
                                this.spawnBall(0);
                                cc.log("red score" + this.redScore);
                                this.setScore(0, this.redScore);
                            }
                        }, 1);
                    }
                    break;
                case "LeftScore":
                case "Bottom":
                case "Top":
                    this.spawnBall(0);
                    break;
            }
        }
        else if (ballName == "blueBall") {
            switch (hitName) {
                case "LeftScore":
                    if (!this.isBlueScored) {
                        this.blueScore += 1;
                        this.isBlueScored = true;
                        this.scheduleOnce(function () {
                            if (this.GameStatus == 1) {
                                this.spawnBall(1);
                                // cc.log("red score" + this.redScore);
                                this.setScore(1, this.blueScore);
                            }
                        }, 1);
                    }
                    break;
                case "RightScore":
                case "Bottom":
                case "Top":
                    this.spawnBall(1);
                    break;
            }
        }
    },
    OnPanelHitBorder(panelName, boarderName) {
        cc.log(panelName + " hit " + boarderName);
        if (panelName == "redPanel") {
            if (boarderName == "left") {
                if (!this.isRedDown) {
                    this.isRedDown = true;
                    this.jumpDownBall(0);
                }
            }
            else if (boarderName == "redBall") {
                cc.log("red ball Add force");
                // this.redBall.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(2500, 0), true);
                this.SoundMGR.playRebounce2();
                this.redBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(this.redBall.getComponent(cc.RigidBody).linearVelocity.x + 10, this.redBall.getComponent(cc.RigidBody).linearVelocity.y);
            }
            else if (boarderName == "right") {
                if (this.redBall.x >= 100) {
                    this.jumpUpBall(0);
                }
            }
        }
        else if (panelName == "bluePanel") {
            if (boarderName == "left") {
                if (!this.isBlueDown) {
                    this.isBlueDown = true;
                    this.jumpDownBall(1);
                }
            }
            else if (boarderName == "blueBall") {
                cc.log("red ball Add force");
                // this.redBall.getComponent(cc.RigidBody).applyForceToCenter(new cc.Vec2(2500, 0), true);
                this.SoundMGR.playRebounce2();
                this.blueBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(this.blueBall.getComponent(cc.RigidBody).linearVelocity.x - 10, this.blueBall.getComponent(cc.RigidBody).linearVelocity.y);
            }
            else if (boarderName == "right") {
                if (this.blueBall.x >= 100) {
                    this.jumpUpBall(1);
                }
            }
        }
    },

    jumpDownBall(ballIndex) {
        this.SoundMGR.playRebounce();
        if (ballIndex == 0) {
            this.redBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(150, 300);
        }
        else {
            this.blueBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(-150, -300);
        }
    },

    jumpUpBall(ballIndex) {
        this.SoundMGR.playRebounce();
        if (ballIndex == 0) {
            this.redBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(200, 400);
        }
        else {
            this.blueBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(-200, -400);
        }
    },

    spawnBall(ballIndex) {
        if (ballIndex == 0) {

            // this.scheduleOnce(function () {
            var newBall = cc.instantiate(this.redPre);
            // this.redBall = cc.instantiate(this.redPre);

            newBall.active = true;
            newBall.parent = this.redPre.parent;
            // this.redBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            newBall.x = cc.find("Canvas/GameCore/RedPart/redSpawn").x;
            newBall.y = cc.find("Canvas/GameCore/RedPart/redSpawn").y;
            this.isRedDown = false;
            this.isRedScored = false;
            if (this.redBall != null) {
                this.redBall.destroy();
            }
            this.redBall = newBall;
            // }, 0.1);
            if (this.redPanel.x <= -145) {
                this.isRedDown = true;
                this.jumpDownBall(0);
            }
        }
        else {
            var newBall = cc.instantiate(this.bluePre);
            // this.redBall = cc.instantiate(this.redPre);

            newBall.active = true;
            newBall.parent = this.bluePre.parent;
            // this.redBall.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
            newBall.x = cc.find("Canvas/GameCore/BluePart/blueSpawn").x;
            newBall.y = cc.find("Canvas/GameCore/BluePart/blueSpawn").y;
            this.isBlueDown = false;
            this.isBlueScored = false;
            if (this.blueBall != null) {
                this.blueBall.destroy();
            }
            this.blueBall = newBall;
            // }, 0.1);
            if (this.bluePanel.x <= -145) {
                this.isBlueDown = true;
                this.jumpDownBall(1);
            }
        }
    },

    setScore(scoreIndex, score) {
        if (scoreIndex == 0) {
            for (var i = 0; i < score; i++) {
                cc.find(i.toString(), this.redScoreParent).getComponent(cc.Sprite).spriteFrame = this.ScoreSprites[0];
            }
        }
        else {
            for (var i = 0; i < score; i++) {
                cc.find(i.toString(), this.blueScoreParent).getComponent(cc.Sprite).spriteFrame = this.ScoreSprites[1];
            }
        }
        if (this.redScore >= 5) {
            this.GameStatus = 2;
            this.SoundMGR.playOver();
            this.scheduleOnce(function () {
                Global.GameData.CurrentWinner = 0;
                this.GameResultNode.active = true;
            }, 2);
        }
        else if (this.blueScore >= 5) {
            this.GameStatus = 2;
            this.SoundMGR.playOver();
            this.scheduleOnce(function () {
                Global.GameData.CurrentWinner = 1;
                this.GameResultNode.active = true;
            }, 2);
        }
    }
    // update (dt) {},
});
