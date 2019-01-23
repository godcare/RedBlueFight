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
        RedBottle:
        {
            default: null,
            type: cc.Node,
        },
        BlueBottle:
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

        redScore: 0,
        blueScore: 0,

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
        GameStatus: 0,//0未开始，1开始了，2结束了
        redFailList: [],
        blueFailList: [],
        redSuccessList: [],
        blueSuccessList: [],
        rBaseIndex: 0,
        rBallIndex: 0,
        bBaseIndex: 0,
        bBallIndex: 0,
        rPendingName: "",
        bPendingName: "",
        isRedWaiting: false,
        isBlueWaiting: false,
        waitSeconds: 3,
        rMoveFlag: 1,
        bMoveFlag: 1,
        moveStep: 1,
        rMoveSpeed: 1,
        bMoveSpeed: 1,
        rStackNumber: 0,//红色堆叠数量
        bStackNumber: 0,
        //-200 200, -587
    },
    onLoad() {
        cc.director.getPhysicsManager().enabled = true;

    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    update(dt) {
        if (this.GameStatus == 1) {
            //timer update
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

            if (!this.isRedWaiting) {
                this.RedBottle.x += dt * this.rMoveSpeed * this.rMoveFlag;
                if (this.RedBottle.x >= 200) {
                    this.RedBottle.x = 200;
                    this.rMoveFlag *= -1;
                }
                else if (this.RedBottle.x <= -200) {
                    this.RedBottle.x = -200;
                    this.rMoveFlag *= -1;
                }
                cc.find(this.rPendingName, this.RedBallParent).x = this.RedBottle.x;
            }

            if (!this.isBlueWaiting) {
                this.BlueBottle.x += dt * this.bMoveSpeed * this.bMoveFlag;
                if (this.BlueBottle.x >= 200) {
                    this.BlueBottle.x = 200;
                    this.bMoveFlag *= -1;
                }
                else if (this.BlueBottle.x <= -200) {
                    this.BlueBottle.x = -200;
                    this.bMoveFlag *= -1;
                }
                cc.find(this.bPendingName, this.BlueBallParent).x = this.BlueBottle.x;
            }
        }
    },


    onPanelClicked(event, customEventData) {
        if (customEventData == "r") {
            //drop red ball
            if (!this.isRedWaiting) {
                this.redFailList = [];

                this.isRedWaiting = true;
                var obj = cc.find(this.rPendingName, this.RedBallParent);
                obj.getComponent(cc.RigidBody).gravityScale = 2;
                var sa1 = cc.scaleTo(0.2, 0.4, 0.7);
                obj.runAction(sa1);
                this.SoundMGR.playVoice();
                this.scheduleOnce(function () {
                    var sa2 = cc.scaleTo(0.2, 0.7, 0.7);
                    // obj.stopAction(sa1);
                    obj.runAction(sa2);
                },
                    0.2);
                this.scheduleOnce(function () {
                    this.checkThrowResult(0);
                }, this.waitSeconds);

            }
        }
        else {
            if (!this.isBlueWaiting) {
                this.blueFailList = [];

                this.isBlueWaiting = true;
                var obj = cc.find(this.bPendingName, this.BlueBallParent);
                obj.getComponent(cc.RigidBody).gravityScale = -2;
                var sa1 = cc.scaleTo(0.2, 0.4, 0.7);
                obj.runAction(sa1);
                this.SoundMGR.playVoice();
                this.scheduleOnce(function () {
                    var sa2 = cc.scaleTo(0.2, 0.7, 0.7);
                    // obj.stopAction(sa1);
                    obj.runAction(sa2);
                },
                    0.2);
                this.scheduleOnce(function () {
                    this.checkThrowResult(1);
                }, this.waitSeconds);

            }
        }
    },

    checkThrowResult(bIndex) {
        if (bIndex == 0) {
            if (this.redFailList.indexOf(this.rPendingName) != -1) {//失败

                for (var i = 0; i < this.redFailList.length; i++) {
                    var sa = cc.scaleTo(0.3, 0, 0);
                    var obj = cc.find(this.redFailList[i], this.RedBallParent);
                    obj.runAction(sa);

                }
                this.scheduleOnce(function () {
                    for (var i = 0; i < this.redFailList.length; i++) {

                        var obj = cc.find(this.redFailList[i], this.RedBallParent);
                        obj.destroy();

                    }
                    if (this.redFailList.length > 1) {
                        this.rStackNumber -= 1;
                    }

                    if (this.rStackNumber < 0) {
                        this.rStackNumber = 0;
                    }
                    this.SpawnNewBall(0);
                }, 0.5);
            }
            else {
                if (this.redSuccessList.indexOf(this.rPendingName) == -1) {
                    this.redSuccessList.push(this.rPendingName);
                }
                this.rStackNumber += 1;
                if (this.redSuccessList.length >= 3) {
                    this.AddScore(0);
                    this.DestroyStack(0);
                    this.rMoveSpeed += this.moveStep;
                }
                else {
                    this.SpawnNewBall(0);
                }


            }
        }
        else {
            if (this.blueFailList.indexOf(this.bPendingName) != -1) {//失败

                for (var i = 0; i < this.blueFailList.length; i++) {
                    var sa = cc.scaleTo(0.3, 0, 0);
                    var obj = cc.find(this.blueFailList[i], this.BlueBallParent);
                    obj.runAction(sa);

                }
                this.scheduleOnce(function () {
                    for (var i = 0; i < this.blueFailList.length; i++) {

                        var obj = cc.find(this.blueFailList[i], this.BlueBallParent);
                        obj.destroy();

                    }
                    if (this.blueFailList.length > 1) {
                        this.bStackNumber -= 1;
                    }

                    if (this.bStackNumber < 0) {
                        this.bStackNumber = 0;
                    }
                    this.SpawnNewBall(1);
                }, 0.5);
            }
            else {
                if (this.blueSuccessList.indexOf(this.bPendingName) == -1) {
                    this.blueSuccessList.push(this.bPendingName);
                }
                this.bStackNumber += 1;
                if (this.blueSuccessList.length >= 3) {
                    this.AddScore(1);
                    this.DestroyStack(1);
                    this.bMoveSpeed += this.moveStep;
                }
                else {
                    this.SpawnNewBall(1);
                }


            }
        }
    },

    //销毁堆叠的球并且生成新的球
    DestroyStack(bIndex) {
        if (bIndex == 0) {
            for (var i = 0; i < this.redSuccessList.length; i++) {
                var obj = cc.find(this.redSuccessList[i], this.RedBallParent);
                var sa = cc.scaleTo(0.3, 0, 0);
                obj.runAction(sa);
            }
            this.scheduleOnce(function () {
                for (var i = 0; i < this.redSuccessList.length; i++) {

                    var obj = cc.find(this.redSuccessList[i], this.RedBallParent);
                    obj.destroy();

                }
                this.SpawnBaseBall(0);
                this.SpawnNewBall(0);
            }, 0.5);
        }
        else {
            for (var i = 0; i < this.blueSuccessList.length; i++) {
                var obj = cc.find(this.blueSuccessList[i], this.BlueBallParent);
                var sa = cc.scaleTo(0.3, 0, 0);
                obj.runAction(sa);
            }
            this.scheduleOnce(function () {
                for (var i = 0; i < this.blueSuccessList.length; i++) {

                    var obj = cc.find(this.blueSuccessList[i], this.BlueBallParent);
                    obj.destroy();

                }
                this.SpawnBaseBall(1);
                this.SpawnNewBall(1);
            }, 0.5);
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
            this.SpawnBaseBall(0);
            this.SpawnNewBall(0);
            this.SpawnBaseBall(1);
            this.SpawnNewBall(1);
        }, 4.5);

    },

    onBallHit(selfName, otherName) {
        // cc.log("self:" + selfName + " other:" + otherName);
        if (otherName == "RedBottom") {
            if (selfName.indexOf("rball") != -1) {
                this.redFailList.push(selfName);
                if (this.redSuccessList.indexOf(selfName) != -1) {
                    this.redSuccessList.splice(this.redSuccessList.indexOf(selfName), 1);
                }
            }
        }
        else if (otherName == "BlueBottom") {
            if (selfName.indexOf("bball") != -1) {
                this.blueFailList.push(selfName);
                if (this.blueSuccessList.indexOf(selfName) != -1) {
                    this.blueSuccessList.splice(this.blueSuccessList.indexOf(selfName), 1);
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

    //生成最下面的球
    SpawnBaseBall(bIndex) {
        if (bIndex == 0)//red
        {
            this.SoundMGR.playPop();
            this.rBaseIndex += 1;
            var rd = Math.floor(Math.random() * 3);
            // cc.log(rd);
            var newObj = cc.instantiate(this.RedBallPres[rd]);
            newObj.active = true;
            // newObj.name = this.redIndex.toString();
            newObj.parent = this.RedBallParent;
            var tmpX = (Math.random() * 2 - 1) * 200;
            newObj.setPosition(tmpX, -587);
            newObj.scale = new cc.Vec2(0.7, 0.7);
            newObj.name = "rbase" + this.rBaseIndex;
            this.rStackNumber = 0;
            this.redSuccessList = [];
            this.redSuccessList.push(newObj.name);
        }
        else {
            this.SoundMGR.playPop();
            this.bBaseIndex += 1;
            var rd = Math.floor(Math.random() * 3);
            // cc.log(rd);
            var newObj = cc.instantiate(this.BlueBallPres[rd]);
            newObj.active = true;
            // newObj.name = this.redIndex.toString();
            newObj.parent = this.BlueBallParent;
            var tmpX = (Math.random() * 2 - 1) * 200;
            newObj.setPosition(tmpX, -587);
            newObj.scale = new cc.Vec2(0.7, 0.7);
            newObj.name = "bbase" + this.bBaseIndex;
            this.bStackNumber = 0;
            this.blueSuccessList = [];
            this.blueSuccessList.push(newObj.name);
        }
    },

    SpawnNewBall(bIndex) {
        if (bIndex == 0)//spawn red
        {
            this.rBallIndex += 1;
            this.SoundMGR.playPop();
            this.isRedWaiting = false;

            var rd = Math.floor(Math.random() * 3);
            var newObj = cc.instantiate(this.RedBallPres[rd]);

            newObj.active = true;
            newObj.name = "rball" + this.rBallIndex.toString();
            newObj.parent = this.RedBallParent;
            newObj.scale = new cc.Vec2(0.7, 0.7);
            newObj.position = this.RedBottle.position;
            newObj.getComponent(cc.RigidBody).gravityScale = 0;

            this.rPendingName = newObj.name;
            // newObj.parent = this.RedBallParent;
            // newObj.x = this.RedBallParent.x;
            // newObj.y = this.RedBallParent.y;
            // cc.log(newObj.position);


        }
        else {
            this.bBallIndex += 1;
            this.SoundMGR.playPop();
            this.isBlueWaiting = false;

            var rd = Math.floor(Math.random() * 3);
            var newObj = cc.instantiate(this.BlueBallPres[rd]);

            newObj.active = true;
            newObj.name = "bball" + this.bBallIndex.toString();
            newObj.parent = this.BlueBallParent;
            newObj.scale = new cc.Vec2(0.7, 0.7);
            newObj.position = this.BlueBottle.position;
            newObj.getComponent(cc.RigidBody).gravityScale = 0;

            this.bPendingName = newObj.name;
        }
    }
});
