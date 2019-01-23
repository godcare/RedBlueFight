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
        RedBallParent:
        {
            default: null,
            type: cc.Node,
        },
        BlueBallParent:
        {
            default: null,
            type: cc.Node,
        },
        RedBallPres:
        {
            default: [],
            type: [cc.Node],
        },
        BlueBallPres:
        {
            default: [],
            type: [cc.Node],
        },
        UnTouchList:
        {
            default: [],
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
        redIndex: 10000,//生成球的起始编号
        blueIndex: 50000,
        redScore: 0,
        blueScore: 0,
        rmoveDelta:
        {
            default: new cc.Vec2(),

        },
        bmoveDelta:
        {
            default: new cc.Vec2(),

        },
        TotalSeconds: 30,
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
        GameStatus: 0,//0未开始，1开始了，2结束了
        DestroyList:
        {
            default: [],
        },
        EnterList:
        {
            default: [],
        },
        newRed: 0,
        newBlue: 0,
    },
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    update(dt) {
        if (this.GameStatus == 1) {
            if (this.tmpTimer <= this.TotalSeconds) {
                this.tmpTimer += dt;
                this.redProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
                this.blueProgress.progress = (this.TotalSeconds - this.tmpTimer) / this.TotalSeconds;
            }
            else {
                this.GameStatus = 2;
                this.SoundMGR.playOver();
                if (this.redScore > this.blueScore) {
                    this.scheduleOnce(function () {
                        Global.GameData.CurrentWinner = 0;
                        this.GameResultNode.active = true;
                    }, 2);
                }
                else if (this.redScore < this.blueScore) {
                    this.scheduleOnce(function () {
                        Global.GameData.CurrentWinner = 1;
                        this.GameResultNode.active = true;
                    }, 2);
                }
                else {
                    this.scheduleOnce(function () {
                        Global.GameData.CurrentWinner = 2;
                        this.GameResultNode.active = true;
                    }, 2);
                }
            }
        }
    },
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
            this.SpawnNewBall(0);
            this.SpawnNewBall(1);
        }, 3.5);

    },

    onTouchStart() {
        this.SoundMGR.playVoice();

    },

    onBallHit(selfName, otherName) {
        cc.log("self:" + selfName + " other:" + otherName);
        if (otherName == "Destroy") {
            if (this.DestroyList.indexOf(selfName) == -1) {
                if (selfName < 50000) {
                    cc.find(selfName, this.RedBallParent).destroy();
                    this.newRed -= 1;
                    this.SpawnNewBall(0);
                }
                else {
                    cc.find(selfName, this.BlueBallParent).destroy();
                    this.newBlue -= 1;
                    this.SpawnNewBall(1);
                }
                this.DestroyList.push(selfName);
            }
        }
        if (otherName == "Dish") {
            var tmpI = this.UnTouchList.indexOf(selfName);
            if (tmpI != -1) {
                this.UnTouchList.splice(tmpI, 1);
            }
        }
        if (otherName == "RedEnter") {
            if (this.EnterList.indexOf(selfName) == -1) {
                this.EnterList.push(selfName);
                this.newRed -= 1;
                var obj = cc.find(selfName, this.RedBallParent);
                obj.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
                if (this.UnTouchList.indexOf(selfName) == -1) {
                    this.UnTouchList.push(selfName);
                }
                if (selfName < 50000) {

                    this.scheduleOnce(function () {
                        this.SpawnNewBall(0);
                    }, 1);
                    this.AddScore(0);
                }
            }
            else {
                // this.EnterList.push(selfName);
                this.scheduleOnce(function () {
                    if (this.EnterList.indexOf(selfName) == -1) {
                        this.SpawnNewBall(1);
                    }
                }, 1)
                // this.AddScore(1);
            }

        }

        if (otherName == "BlueEnter") {
            if (this.EnterList.indexOf(selfName) == -1) {
                this.EnterList.push(selfName);
                this.newBlue -= 1;
                var obj = cc.find(selfName, this.BlueBallParent);
                obj.getComponent(cc.RigidBody).linearVelocity = new cc.Vec2(0, 0);
                if (this.UnTouchList.indexOf(selfName) == -1) {
                    this.UnTouchList.push(selfName);
                }
                if (selfName < 50000) {
                    this.scheduleOnce(function () {

                        this.SpawnNewBall(0)


                    }, 1)

                    // this.AddScore(0);
                }
                else {
                    this.scheduleOnce(function () {

                        this.SpawnNewBall(1)



                    }, 1);
                    this.AddScore(1);
                }
            }

        }
    },
    DestroyBall() {

    },
    //addindex=0，红色加分
    AddScore(addIndex) {
        if (addIndex == 0) {
            this.redScore += 1;
            this.redScoreLabel.setNumber(this.redScore);
            this.SoundMGR.playScore();
        }
        else {
            this.blueScore += 1;
            this.blueScoreLabel.setNumber(this.blueScore);
            this.SoundMGR.playScore();
        }
    },
    // update (dt) {},
    SpawnNewBall(bIndex) {
        if (bIndex == 0)//spawn red
        {
            if (this.newRed < 1) {
                this.SoundMGR.playBlob();
                this.redIndex += 1;
                var rd = Math.floor(Math.random() * 4);
                cc.log(rd);
                var newObj = cc.instantiate(this.RedBallPres[rd]);
                newObj.active = true;
                newObj.name = this.redIndex.toString();
                newObj.parent = this.RedBallParent;
                newObj.setPosition(0, 0);
                // newObj.parent = this.RedBallParent;
                // newObj.x = this.RedBallParent.x;
                // newObj.y = this.RedBallParent.y;
                cc.log(newObj.position);
                this.newRed += 1;
            }
        }
        else {
            if (this.newBlue < 1) {
                this.SoundMGR.playBlob();
                this.blueIndex += 1;
                var rd = Math.floor(Math.random() * 4);
                cc.log(rd);
                var newObj = cc.instantiate(this.BlueBallPres[rd]);
                newObj.active = true;
                newObj.name = this.blueIndex.toString();
                newObj.parent = this.BlueBallParent;
                newObj.setPosition(0, 0);
                // newObj.parent = this.RedBallParent;
                // newObj.x = this.RedBallParent.x;
                // newObj.y = this.RedBallParent.y;
                cc.log(newObj.position);
                this.newBlue += 1;
            }
        }
    }
});
