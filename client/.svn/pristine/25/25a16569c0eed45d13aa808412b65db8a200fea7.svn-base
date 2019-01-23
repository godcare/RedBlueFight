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
        GameStatus: 0,//0未开始，1开始了，2结束了
        redViruses:
        {
            default: [],
            type: [cc.Node],
        },
        blueViruses:
        {
            default: [],
            type: [cc.Node],
        },
        redCannon:
        {
            default: null,
            type: cc.Node,
        },
        blueCannon:
        {
            default: null,
            type: cc.Node,
        },
        bulletSpeed: 300,
        redBullet:
        {
            default: null,
            type: cc.Node,
        },
        blueBullet:
        {
            default: null,
            type: cc.Node,
        },
        redParent:
        {
            default: null,
            type: cc.Node,
        },
        blueParent:
        {
            default: null,
            type: cc.Node,
        },
        redCount: 8,
        blueCount: 8,
        rIndex: 0,
        bIndex: 0,
        hitList: [],
        rotateSpeed: 0.1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    },

    start() {
        // this.redScoreTotalNumber.setNumber(20);
        this.startAnimation();

    },

    update(dt) {

    },

    startAnimation() {

        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            this.initViruses();
            this.scheduleOnce(function () {
                this.Shoot();
            }, 0.5);
            this.schedule(function () {
                if (this.GameStatus == 1) {
                    this.Shoot();
                }
            }, 3);

        }, 4.5);

    },

    initViruses() {
        for (var i = 0; i < 8; i++) {
            var r1 = Math.random() - 0.5;
            var r2 = Math.random() - 0.5;
            if (this.redViruses[i] != null) {
                this.redViruses[i].getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(r1 * 400, r2 * 400);
                this.redViruses[i].active = true;
            }
            if (this.blueViruses[i] != null) {
                this.blueViruses[i].getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(r1 * 400, r2 * 400);
                this.blueViruses[i].active = true;
            }
        }

    },

    OnTouchPanelStart(panelName, touchX, moveY) {
        if (this.GameStatus == 1) {
            if (panelName == "redTouch") {
                if (this.redCannon.rotation >= -45 && this.redCannon.rotation <= 45) {
                    if (touchX <= 360) {
                        this.redCannon.rotation += moveY * this.rotateSpeed;
                    }
                    else {
                        this.redCannon.rotation -= moveY * this.rotateSpeed;
                    }

                    if (this.redCannon.rotation > 45) {
                        this.redCannon.rotation = 45;
                    }
                    else if (this.redCannon.rotation < -45) {
                        this.redCannon.rotation = -45;
                    }
                }

            }
            else if (panelName == "blueTouch") {
                if (this.blueCannon.rotation >= 135 && this.blueCannon.rotation <= 225) {
                    if (touchX <= 360) {
                        this.blueCannon.rotation += moveY * this.rotateSpeed;
                    }
                    else {
                        this.blueCannon.rotation -= moveY * this.rotateSpeed;
                    }

                    if (this.blueCannon.rotation > 225) {
                        this.blueCannon.rotation = 225;
                    }
                    else if (this.blueCannon.rotation < 135) {
                        this.blueCannon.rotation = 135;
                    }
                }
            }
        }
    },

    Shoot() {
        if (this.redParent.getChildren.length == 0) {
            this.redParent.x = this.redCannon.x;
            this.redParent.y = this.redCannon.y;
            this.redParent.rotation = this.redCannon.rotation;
            var newRed = cc.instantiate(this.redBullet);
            this.rIndex += 1;
            newRed.name = "rBullet" + this.rIndex;
            newRed.parent = this.redParent;
            newRed.x = 0;
            newRed.y = 0;
            newRed.active = true;
        }
        if (this.blueParent.getChildren.length == 0) {
            this.blueParent.x = this.blueCannon.x;
            this.blueParent.y = this.blueCannon.y;
            this.blueParent.rotation = this.blueCannon.rotation;
            var newBlue = cc.instantiate(this.blueBullet);
            this.bIndex += 1;
            newBlue.name = "bBullet" + this.bIndex;
            newBlue.parent = this.blueParent;
            newBlue.x = 0;
            newBlue.y = 0;
            newBlue.active = true;
        }
    },

    OnBulletHit(ballName, otherName) {
        cc.log(ballName + " hit " + otherName);
        if (this.GameStatus == 1) {
            if (ballName.indexOf("rBullet") > -1 && this.hitList.indexOf(ballName) == -1) {
                if (otherName.indexOf("virusBlue") > -1)//red hit blue
                {
                    this.SoundMGR.playScore();
                    cc.find("Canvas/GameCore/" + otherName).destroy();
                    if (cc.find(ballName, this.redParent) != null) {
                        cc.find(ballName, this.redParent).destroy();
                    }
                    this.blueCount -= 1;
                    this.hitList.push(ballName);
                }
                else if (otherName.indexOf("virusRed") > -1)//red hit red
                {
                    this.SoundMGR.playRebounce2();
                    cc.find("Canvas/GameCore/" + otherName).destroy();
                    if (cc.find(ballName, this.redParent) != null) {
                        cc.find(ballName, this.redParent).destroy();
                    }
                    this.redCount -= 1;
                    this.hitList.push(ballName);
                }
            }
            else if (ballName.indexOf("bBullet") > -1 && this.hitList.indexOf(ballName) == -1) {
                if (otherName.indexOf("virusBlue") > -1)//blue hit blue
                {
                    this.SoundMGR.playRebounce2();
                    cc.find("Canvas/GameCore/" + otherName).destroy();
                    if (cc.find(ballName, this.blueParent) != null) {
                        cc.find(ballName, this.blueParent).destroy();
                    }
                    this.blueCount -= 1;
                    this.hitList.push(ballName);
                }
                else if (otherName.indexOf("virusRed") > -1)//red hit red
                {
                    this.SoundMGR.playScore();
                    cc.find("Canvas/GameCore/" + otherName).destroy();
                    if (cc.find(ballName, this.blueParent) != null) {
                        cc.find(ballName, this.blueParent).destroy();
                    }
                    this.redCount -= 1;
                    this.hitList.push(ballName);
                }
            }

            if (this.redCount == 0) {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                this.scheduleOnce(function () {
                    Global.GameData.CurrentWinner = 1;
                    this.GameResultNode.active = true;
                }, 1.5);
            }
            else if (this.blueCount == 0) {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                this.scheduleOnce(function () {
                    Global.GameData.CurrentWinner = 0;
                    this.GameResultNode.active = true;
                }, 1.5);
            }
        }
    },
});
