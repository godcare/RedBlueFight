// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var MySpriteAnimation = require("MySpriteAnimation");
var CountDownControl = require("CountDownControl");
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
        RedStage:
        {
            default: null,
            type: cc.Node,
        },
        BlueStage:
        {
            default: null,
            type: cc.Node,
        },
        RedAwaitSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueAwaitSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        RedAttackSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueAttackSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        RedDefendSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueDefendSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        RedHurtSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueHurtSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        GameStatus: 0,//0未开始，1开始了，2结束了
        RedAttackBtn:
        {
            default: null,
            type: cc.Node,
        },
        RedDefendBtn:
        {
            default: null,
            type: cc.Node,
        },
        BlueAttackBtn:
        {
            default: null,
            type: cc.Node,
        },
        BlueDefendBtn:
        {
            default: null,
            type: cc.Node,
        },
        RedHint:
        {
            default: null,
            type: cc.Node,
        },
        BlueHint:
        {
            default: null,
            type: cc.Node,
        },
        RedStageFoul:
        {
            default: null,
            type: cc.Node,
        },
        BlueStageFoul:
        {
            default: null,
            type: cc.Node,
        },
        RedOpSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        BlueOpSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },

        RightOp: -1,//正确的操作
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

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
            this.ShowNextOp();
        }, 4.5);

    },

    ShowNextOp() {
        this.PlayAwait();
        this.switchBtnStatus(true);
        this.RightOp = -1;
        //等待一段时间，生成下一局，这期间按了操作，会被当作犯规
        this.scheduleOnce(function () {
            if (this.GameStatus != 2) {//游戏还未结束
                this.RightOp = Math.floor(Math.random() * 2);//随机生成0和1，若为0，则红进攻，反之则防守
                this.RedHint.active = true;
                this.BlueHint.active = true;
                this.RedHint.y = -400;
                this.BlueHint.y = -400;

                this.BlueHint.opacity = 0;
                this.RedHint.opacity = 0;
                this.RedHint.getComponent(cc.Sprite).spriteFrame = this.RedOpSprites[this.RightOp];
                this.BlueHint.getComponent(cc.Sprite).spriteFrame = this.BlueOpSprites[1 - this.RightOp];
                var rm = cc.moveTo(0.7, 0, -150);
                var ra = cc.fadeIn(0.7, 255);
                var bm = cc.moveTo(0.7, 0, -150);
                var ba = cc.fadeTo(0.7, 255);
                this.RedHint.runAction(rm);
                this.RedHint.runAction(ra);
                this.BlueHint.runAction(bm);
                this.BlueHint.runAction(ba);
            }
        }, 1);

    },

    switchBtnStatus(isEnabled) {
        this.RedAttackBtn.getComponent(cc.Button).enabled = isEnabled;
        this.RedDefendBtn.getComponent(cc.Button).enabled = isEnabled;
        this.BlueAttackBtn.getComponent(cc.Button).enabled = isEnabled;
        this.BlueDefendBtn.getComponent(cc.Button).enabled = isEnabled;
    },

    //红色点了进攻，如果是0，则红色胜利，如果是1或者-1则犯规，蓝胜利
    onRedAttackClick(event, customEventData) {
        this.switchBtnStatus(false);
        if (this.RightOp == 0) {
            this.onRedWin(false);
        }
        else {
            this.onBlueWin(true);
        }
    },

    //红色点了进攻，如果是1，则平局，红方防守，进行下一局，否则视为犯规，蓝方胜利
    onRedDefendClick(event, customEventData) {
        this.switchBtnStatus(false);
        if (this.RightOp == 1) {
            this.onDefend();
        }
        else {
            this.onBlueWin(true);
        }
    },

    //蓝色点了进攻，如果是1，则蓝色胜利，如果是0或者是-1则犯规，红胜利
    onBlueAttackClick(event, customEventData) {
        this.switchBtnStatus(false);
        if (this.RightOp == 1) {
            this.onBlueWin(false);
        }
        else {
            this.onRedWin(true);
        }
    },

    //蓝色点了防守，如果0，则平局，蓝方防守，进行下一局，否则视为犯规，红方胜利
    onBlueDefendClick(event, customEventData) {
        this.switchBtnStatus(false);
        if (this.RightOp == 0) {
            this.onDefend();
        }
        else {
            this.onRedWin(true);
        }
    },

    onRedWin(isFoul) {
        cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.RedAttackSprites;
        cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
        cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.BlueHurtSprites;
        cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
        cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.RedAttackSprites;
        cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
        cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.BlueHurtSprites;
        cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
        this.RedStageFoul.active = isFoul;
        this.BlueStageFoul.active = isFoul;
        this.RedStageFoul.x = 100;
        this.BlueStageFoul.x = 100;
        if (isFoul) {
            this.BlueHint.active = true;
            this.BlueHint.getComponent(cc.Sprite).spriteFrame = this.BlueOpSprites[2];
            this.BlueHint.y = -150;
            this.BlueHint.opacity = 255;
            this.SoundMGR.playFoul();
        }
        else
        {
            this.SoundMGR.playPunch();
        }
        this.GameStatus = 2;
        this.SoundMGR.playOver();
        this.scheduleOnce(function () {

            Global.GameData.CurrentWinner = 0;
            this.GameResultNode.active = true;
        }, 1);
    },

    onBlueWin(isFoul) {
        cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.RedHurtSprites;
        cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
        cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.BlueAttackSprites;
        cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
        cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.RedHurtSprites;
        cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
        cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.BlueAttackSprites;
        cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
        this.RedStageFoul.x = -100;
        this.BlueStageFoul.x = -100;
        this.RedStageFoul.active = isFoul;
        this.BlueStageFoul.active = isFoul;
        if (isFoul) {
            this.RedHint.active = true;
            this.RedHint.getComponent(cc.Sprite).spriteFrame = this.RedOpSprites[2];
            this.RedHint.y = -150;
            this.RedHint.opacity = 255;
            this.SoundMGR.playFoul();
        }
        else
        {
            this.SoundMGR.playPunch();
        }
        this.GameStatus = 2;
        this.SoundMGR.playOver();
        this.scheduleOnce(function () {

            Global.GameData.CurrentWinner = 1;
            this.GameResultNode.active = true;
        }, 1);
    },

    onDefend() {
        //蓝色成功防守
        this.SoundMGR.playPunch();
        if (this.RightOp == 0) {
            cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.RedAttackSprites;
            cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
            cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.BlueDefendSprites;
            cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
            cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.RedAttackSprites;
            cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
            cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.BlueDefendSprites;
            cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
        }
        else if (this.RightOp == 1) {
            cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.RedDefendSprites;
            cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
            cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.BlueAttackSprites;
            cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Play(false);
            cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.RedDefendSprites;
            cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
            cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.BlueAttackSprites;
            cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(false);
        }

        this.scheduleOnce(function () {
            this.CountDownNode.active = true;
            this.CountDownNode.getComponent(CountDownControl).Restart();
            this.BlueHint.active = false;
            this.RedHint.active = false;
            this.BlueStageFoul.active = false;
            this.RedStageFoul.active = false;
            this.PlayAwait();
        }, 1.5)

        this.scheduleOnce(function () {
            this.ShowNextOp();
        }, 4.5);
    },

    PlayAwait() {
        cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.RedAwaitSprites;
        cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Sprites = this.BlueAwaitSprites;
        cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.RedAwaitSprites;
        cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Sprites = this.BlueAwaitSprites;
        cc.find("RedPlayer", this.RedStage).getComponent(MySpriteAnimation).Play(true);
        cc.find("BluePlayer", this.RedStage).getComponent(MySpriteAnimation).Play(true);
        cc.find("RedPlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(true);
        cc.find("BluePlayer", this.BlueStage).getComponent(MySpriteAnimation).Play(true);
    }
    // update (dt) {},
});
