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
        redWheel:
        {
            default: null,
            type: cc.Node,
        },
        blueWheel:
        {
            default: null,
            type: cc.Node,
        },
        bBallParent:
        {
            default: null,
            type: cc.Node,
        },
        rBallParent:
        {
            default: null,
            type: cc.Node,
        },
        redCircle:
        {
            default: null,
            type: cc.Node,
        },
        blueCircle:
        {
            default: null,
            type: cc.Node,
        },
        GameStatus:0,
        maxRotateSpeed: 7,
        speedReduce: 2,//速度衰减
        speedUp: 2,//速度增加
        currentRSpeed: 0,//当前红色转速
        currentBSpeed: 0,//当前蓝色转速
        targetRSpeed: 0,//红色目标转速
        targetBSpeed: 0,//蓝色目标转速
        alphaReduce: 100,//透明度衰减速度

    },

    // LIFE-CYCLE CALLBACKS:



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
            // var ra = cc.rotateBy(10, 2160);
            // this.redWheel.runAction(ra);
            for (var i = 0; i < 7; i++) {
                cc.find("r" + i.toString(), this.rBallParent).getComponent(cc.RigidBody).gravityScale = 1;
                cc.find("r" + i.toString(), this.bBallParent).getComponent(cc.RigidBody).gravityScale = -1;
            }
        }, 4.5);

    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
    },
    update(dt) {
        if (this.GameStatus == 1) {
            //set red rotation
            if (this.targetRSpeed == 0) {
                if (this.currentRSpeed > 0) {
                    this.currentRSpeed -= this.speedReduce * dt;
                }
                else {
                    this.currentRSpeed += this.speedReduce * dt;
                }
            }
            else if (this.targetRSpeed < this.currentRSpeed) {
                this.currentRSpeed -= this.speedUp * dt;
            }
            else if (this.targetRSpeed > this.currentRSpeed) {
                this.currentRSpeed += this.speedUp * dt;
            }
            this.redWheel.rotation += this.currentRSpeed;
            //set blue rotation
            if (this.targetBSpeed == 0) {
                if (this.currentBSpeed > 0) {
                    this.currentBSpeed -= this.speedReduce * dt;
                }
                else {
                    this.currentBSpeed += this.speedReduce * dt;
                }
            }
            else if (this.targetBSpeed < this.currentBSpeed) {
                this.currentBSpeed -= this.speedUp * dt;
            }
            else if (this.targetBSpeed > this.currentBSpeed) {
                this.currentBSpeed += this.speedUp * dt;
            }
            this.blueWheel.rotation += this.currentBSpeed;

            //set balls
            for (var i = 0; i < 7; i++) {
                if (cc.find("r" + i, this.rBallParent).active) {
                    var targetObj = cc.find("r" + i, this.rBallParent);                   
                    // cc.log("target pos" + targetObj.convertToWorldSpaceAR(targetObj.getPosition()));
                    // cc.log("red circle pos" + this.redCircle.convertToWorldSpaceAR(this.redCircle.getPosition()));
                    // var dist = targetObj.convertToWorldSpaceAR(targetObj.getPosition()).sub(this.redCircle.convertToWorldSpaceAR(this.redCircle.getPosition())).mag();
                    var dist = targetObj.position.sub(this.redCircle.position).mag();
                    // cc.log("dist:" + dist + " name:" + targetObj.name);   
                    if (dist <= 40) {
                        targetObj.opacity -= this.alphaReduce * dt;
                        if (targetObj.opacity < 20) {
                            targetObj.active = false;
                            this.SoundMGR.playScore();
                            if (i == 0)//red win
                            {
                                this.GameStatus = 2;
                                this.SoundMGR.playOver();

                                Global.GameData.CurrentWinner = 0;
                                this.GameResultNode.active = true;

                            }
                        }
                    }
                    else {
                        targetObj.opacity = 255;
                    }
                }
                if (cc.find("r" + i, this.bBallParent).active) {
                    var targetObj = cc.find("r" + i, this.bBallParent);                   
                    // cc.log("target pos" + targetObj.convertToWorldSpaceAR(targetObj.getPosition()));
                    // cc.log("red circle pos" + this.redCircle.convertToWorldSpaceAR(this.redCircle.getPosition()));
                    // var dist = targetObj.convertToWorldSpaceAR(targetObj.getPosition()).sub(this.redCircle.convertToWorldSpaceAR(this.redCircle.getPosition())).mag();
                    var dist = targetObj.position.sub(this.blueCircle.position).mag();
                    // cc.log("dist:" + dist + " name:" + targetObj.name);   
                    if (dist <= 40) {
                        targetObj.opacity -= this.alphaReduce * dt;
                        if (targetObj.opacity < 20) {
                            targetObj.active = false;
                            if (i == 0)//red win
                            {
                                this.GameStatus = 2;
                                this.SoundMGR.playOver();

                                Global.GameData.CurrentWinner = 1;
                                this.GameResultNode.active = true;

                            }
                        }
                    }
                    else {
                        targetObj.opacity = 255;
                    }
                }
            }
        }
    },



    onRotate(colorIndex, speed) {
        if (colorIndex == 0)//red
        {
            // cc.log(speed);
            if (Math.abs(speed) >= this.maxRotateSpeed) {
                if (speed > 0) {
                    this.targetRSpeed = -this.maxRotateSpeed;
                }
                else if (speed < 0) {
                    this.targetRSpeed = this.maxRotateSpeed;
                }
                else {
                    this.targetRSpeed = 0;
                }
            }
            else {
                this.targetRSpeed = -speed;
            }
        }
        else {
            if (Math.abs(speed) >= this.maxRotateSpeed) {
                if (speed > 0) {
                    this.targetBSpeed = -this.maxRotateSpeed;
                }
                else if (speed < 0) {
                    this.targetBSpeed = this.maxRotateSpeed;
                }
                else {
                    this.targetBSpeed = 0;
                }
            }
            else {
                this.targetBSpeed = -speed;
            }
        }
    },
});
