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
        blueTouch:
        {
            default: null,
            type: cc.Node,
        },
        Sucker:
        {
            default: null,
            type: cc.Node,
        },
        ballSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },

        blueScoreLabel:
        {
            default: null,
            type: MySpriteNumber,
        },
        blueProgress:
        {
            default: null,
            type: cc.ProgressBar,
        },
        moveSpeed: 1,
        currentScore: 0,
        currentDoorIndex: -1,
        rMoveDelta: 0,
        hitList: [],
        TotalSeconds: 45,
        tmpTimer: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

    },

    onBallHit(selfName, otherName) {
        if (selfName.indexOf("b") != -1) {
            if (otherName == "Up")//hit and score
            {
                if (this.GameStatus == 1) {
                    if (this.hitList.indexOf(selfName) == -1) {
                        this.hitList.push(selfName);
                        cc.find(selfName, this.BallParent).getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
                        // var sa = cc.scaleTo(0.1, 0, 0);
                        // cc.find(selfName, this.BallParent).runAction(sa);
                        cc.find(selfName, this.BallParent).active = false;
                        this.showDoor();
                        this.AddScore();
                        this.scheduleOnce(function () {
                            cc.find(selfName, this.BallParent).active = true;
                            this.setBall(selfName.substr(1, 1), 1);
                            cc.log("create new ball after hit");
                        }, 0.3);
                    }
                }
            }
            else if (otherName == "over") {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentCopScore = this.currentScore;
                Global.GameData.CurrentCopHistoryScore = Global.GameData.CopHistoryScore[2];
                if (this.currentScore > Global.GameData.CurrentCopHistoryScore) {
                    Global.GameData.CurrentCopHistoryScore = this.currentScore;
                    Global.GameData.CopHistoryScore[2] = this.currentScore;
                    Global.GameData.SaveCache();
                }
                this.scheduleOnce(function () {
                    this.GameResultNode.active = true;
                }, 0.5);

            }
        }
    },

    AddScore() {
        this.currentScore += 1;
        this.blueScoreLabel.setNumber(this.currentScore);
        this.SoundMGR.playScore();
    },

    start() {
        this.startAnimation();

    },
    startAnimation() {
        this.showDoor();
        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
        }, 0.5)
        this.scheduleOnce(function () {
            this.GameStatus = 1;
            this.PauseNode.active = true;
            for (var i = 0; i < 4; i++) {
                this.setBall(i, 0);

            }
            this.blueTouch.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                // this.opacity = 255;
                // cc.log("blue touch move");
                var delta = event.getDelta();
                if (cc.find("Up", this).y >= -200) {
                    cc.find("Up", this).x += delta.x;
                    var tmpy = cc.find("Up", this).y + delta.y;

                    if (tmpy < -200) {
                        tmpy = -200;
                    }
                    cc.find("Up", this).y = tmpy;
                }
            }, this.blueTouch);
        }, 4.5);

    },

    showDoor() {
        var newIndex = Math.floor(Math.random() * 4);
        if (newIndex == this.currentDoorIndex) {
            newIndex = this.currentDoorIndex - 1;
            if (newIndex < 0) {
                newIndex = 3;
            }
        }
        if (this.currentDoorIndex == -1) {
            cc.find("door" + newIndex, this.BallParent).active = true;
            this.currentDoorIndex = newIndex;
        }
        else {
            //hide old,how new

            for (var i = 0; i < 3; i++) {
                // var doorObj = cc.find("door" + this.currentDoorIndex, this.BallParent);
                // cc.find(i, doorObj).runAction(aa);

                var aa = cc.fadeTo(0.3, 0);
                cc.find("door" + this.currentDoorIndex + "/" + i, this.BallParent).runAction(aa);
            }
            this.scheduleOnce(function () {
                // cc.log("newIndex:" + newIndex);
                cc.find("door" + this.currentDoorIndex, this.BallParent).active = false;
                cc.find("door" + newIndex, this.BallParent).active = true;

                this.currentDoorIndex = newIndex;
                for (var i = 0; i < 3; i++) {
                    var aa1 = cc.fadeTo(0.3, 255);
                    // cc.find("door" + newIndex + "/" + i, this.BallParent).opacity = 0;
                    cc.find("door" + newIndex + "/" + i, this.BallParent).runAction(aa1);

                }
            }, 0.35);
        }
    },
    setBall(ballIndex, newFlag) {
        var obj = cc.find("b" + ballIndex, this.BallParent);
        obj.active = true;
        var tmpScale = Math.random() / 2 + 0.3;
        var tmpX = Math.random() * 400 + 100;
        var tmpY = Math.random() * 10;
        var tmpSprite = Math.floor(Math.random() * 2);
        obj.getComponent(cc.Sprite).spriteFrame = this.ballSprites[tmpSprite];
        obj.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(tmpX, tmpY);
        obj.scale = new cc.Vec2(tmpScale, tmpScale);
        if (this.hitList.indexOf("b" + ballIndex) != -1) {
            this.hitList.splice(this.hitList.indexOf("b" + ballIndex), 1);
        }

        if (newFlag == 1) {
            //new y -100~-500
            var tmpNewY = -(Math.random() * 400 + 100);
            obj.position = new cc.Vec2(-480, tmpNewY);
        }
    },



    update(dt) {
        if (this.GameStatus == 1) {
            //update timer

            if (this.tmpTimer <= this.TotalSeconds) {
                this.tmpTimer += dt;

                this.blueProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
            }
            else {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                Global.GameData.CurrentCopScore = this.currentScore;
                Global.GameData.CurrentCopHistoryScore = Global.GameData.CopHistoryScore[2];
                if (this.currentScore > Global.GameData.CurrentCopHistoryScore) {
                    Global.GameData.CurrentCopHistoryScore = this.currentScore;
                    Global.GameData.CopHistoryScore[2] = this.currentScore;
                    Global.GameData.SaveCache();
                }
                this.scheduleOnce(function () {
                    this.GameResultNode.active = true;
                }, 0.5);
            }

            for (var i = 0; i < 4; i++) {
                var obj = cc.find("b" + i, this.BallParent);
                if (obj.x >= 430 || obj.x <= -500) {
                    this.setBall(i, 1);
                }

            }


        }
    },
});
