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
        Sprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        IsPlaying: false,
        FrameRate: 12,
        Interval: 0,
        findex: 0,
        tmpTimer: 0,
        TargetSprite:
        {
            default: null,
            type: cc.Sprite,
        },
        PlayOnAwake: true,
        IsLoop: true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.Interval = 1 / this.FrameRate;
        if (this.PlayOnAwake) {
            this.IsPlaying = true;
        }
    },

    update(dt) {
        if (this.IsPlaying) {
            this.tmpTimer += dt;
            if (this.tmpTimer >= this.Interval) {
                this.tmpTimer = 0;
                if (this.findex < this.Sprites.length - 1) {
                    this.findex += 1;
                }
                else if (this.IsLoop) {
                    this.findex = 0;
                }
                else {
                    this.IsPlaying = false;
                    this.tmpTimer = 0;
                }
                this.TargetSprite.spriteFrame = this.Sprites[this.findex];
            }
        }
    },

    Play(loop) {
        this.TargetSprite.spriteFrame = this.Sprites[0];
        this.IsPlaying = true;
        this.IsLoop = loop;
        this.findex = 0;
        this.tmpTimer = 0;
    },

    StopPlay() {
        this.IsPlaying = false;
    },


});
