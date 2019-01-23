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
        titleBGM:
        {
            default: null,
            type: cc.AudioClip,
        },
        gameBGM:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxPush:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxTick:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxGameOver:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxRebounce:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxRebounce2:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxPop:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxOuch:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxShake:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxFart:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxPush2:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxPunch:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxFoul:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxBlob:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxVoice:
        {
            default: null,
            type: cc.AudioClip,
        },
        fxScore:
        {
            default: null,
            type: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.playTitleBGM("Sound/BGM/bgm_title");
    },

    playTitleBGM() {
        cc.audioEngine.playMusic(this.titleBGM, true);
    },

    playGameBGM() {
        cc.audioEngine.playMusic(this.gameBGM, true);
    },

    playShake() {
        cc.audioEngine.playEffect(this.fxShake, false);
    },

    playBlob() {
        cc.audioEngine.playEffect(this.fxBlob, false);
    },

    playVoice() {
        cc.audioEngine.playEffect(this.fxVoice, false);
    },

    playScore() {
        cc.audioEngine.playEffect(this.fxScore, false);
    },

    playPush2() {
        cc.audioEngine.playEffect(this.fxPush2, false);
    },

    playFart() {
        cc.audioEngine.playEffect(this.fxFart, false);
    },

    playPunch() {
        cc.audioEngine.playEffect(this.fxPunch, false);
    },
    playFoul() {
        cc.audioEngine.playEffect(this.fxFoul, false);
    },

    playPop() {
        cc.audioEngine.playEffect(this.fxPop, false);
    },


    playOuch() {
        cc.audioEngine.playEffect(this.fxOuch, false);
    },


    playPush() {
        cc.audioEngine.playEffect(this.fxPush, false);
    },

    playTick() {
        cc.audioEngine.playEffect(this.fxTick, false);
    },

    playOver() {
        cc.audioEngine.playEffect(this.fxGameOver, false);
    },

    playRebounce() {
        cc.audioEngine.playEffect(this.fxRebounce, false);
    },

    playRebounce2() {
        cc.audioEngine.playEffect(this.fxRebounce2, false);
    },

    // update (dt) {},
});
