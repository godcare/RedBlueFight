// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        xFrom: 0,
        xTo: 0,
        yFrom: 0,
        yTo: 0,
        speed: 1,
        dFlag: 1,
        shoudMove: false,
        xyRate: 1,
        xSpeed: 0,
        ySpeed: 0,
        dtIndex: 1000,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}, 

    start() {

    },

    update(dt) {
        if (this.shoudMove) {
            //from x > to x
            if (this.xFrom < this.xTo) {
                var tmpx = this.node.x + this.xSpeed * dt * this.dtIndex * this.dFlag;
                if (tmpx <= this.xFrom) {
                    this.dFlag *= -1;
                    tmpx = this.xFrom;
                }
                else if (tmpx >= this.xTo) {
                    this.dFlag *= -1;
                    tmpx = this.xTo;
                }
                this.node.x = tmpx;

                // if (tmpx < this.xFrom || this.tmpx > this.xTo) {
                //     if (this.node.x >= this.xFrom && this.node.x <= this.xTo) {
                //         this.node.x = tmpx;
                //         this.dFlag *= -1;
                //     }
                // }
                // else {
                //     this.node.x = tmpx;
                // }
                // if (this.node.x <= this.xFrom || this.node.x >= this.xTo) {
                //     this.dFlag *= -1;
                // }
            }
            else if (this.xFrom > this.xTo) {
                var tmpx = this.node.x - this.xSpeed * dt * this.dtIndex * this.dFlag;
                if (tmpx >= this.xFrom) {
                    this.dFlag *= -1;
                    tmpx = this.xFrom;
                }
                else if (tmpx <= this.xTo) {
                    this.dFlag *= -1;
                    tmpx = this.xTo;
                }
                this.node.x = tmpx;
            }

            if (this.yFrom < this.yTo) {
                var tmpy = this.node.y + this.ySpeed * dt * this.dtIndex * this.dFlag;
                if (tmpy <= this.yFrom) {
                    this.dFlag *= -1;
                    tmpy = this.yFrom;
                }
                else if (tmpy >= this.yTo) {
                    this.dFlag *= -1;
                    tmpy = this.yTo;
                }
                this.node.y = tmpy;
            }
            else if (this.yFrom > this.yTo) {
                var tmpy = this.node.y - this.ySpeed * dt * this.dtIndex * this.dFlag;
                if (tmpy >= this.yFrom) {
                    this.dFlag *= -1;
                    tmpy = this.yFrom;
                }
                else if (tmpy <= this.yTo) {
                    this.dFlag *= -1;
                    tmpy = this.yTo;
                }
                this.node.y = tmpy;
            }
        }
    },

    startMove() {
        this.shoudMove = true;
        this.xyRate = (this.yTo - this.yFrom) / (this.xTo - this.xFrom);
        this.xSpeed = Math.sqrt(this.speed * this.speed / (1 + this.xyRate) * (1 + this.xyRate));
        this.ySpeed = this.xSpeed * this.xyRate;
    },

    stopMove() {
        this.shoudMove = false;
    },
    
    
});
