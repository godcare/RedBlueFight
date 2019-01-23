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
        MaxRound: 3,
        Winner: 0,//胜者，0-红，1-蓝，-1-无
        LevelIndex: 0,//下一关序号
        ShowPlayerY: 450,//展示时的Y轴坐标
        ShowOpY: 375,//菜单Y轴
        RedPlayer:
        {
            default: null,
            type: cc.Node,
        },
        BluePlayer:
        {
            default: null,
            type: cc.Node,
        },
        BlueSprites://第一张失败，第二张胜利
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        RedSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        ResultSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        NextSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        RedOp:
        {
            default: null,
            type: cc.Node,
        },
        BlueOp:
        {
            default: null,
            type: cc.Node,
        },
        redGraphics:
        {
            default: null,
            type: cc.Graphics,
        },
        blueGraphics:
        {
            default: null,
            type: cc.Graphics,
        },
        LoadingObj:
        {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.startAnimation();
    },

    startAnimation() {
        this.Winner = Global.GameData.CurrentWinner;
        Global.GameData.PlayedGameCount += 1;
        cc.log("Current Winner:" + this.Winner);

        this.redGraphics.circle(0, 0, this.RedPlayer.width / 2 + 0.5);
        this.redGraphics.fillColor = new cc.Color(234, 53, 74, 255);
        this.redGraphics.fill();
        this.blueGraphics.circle(0, 0, this.BluePlayer.width / 2 + 0.5);
        this.blueGraphics.fillColor = new cc.Color(42, 143, 228, 255);
        this.blueGraphics.fill();

        if (this.Winner == 0) {//red win
            cc.find("Player", this.RedPlayer).getComponent(cc.Sprite).spriteFrame = this.RedSprites[1];
            cc.find("Player", this.BluePlayer).getComponent(cc.Sprite).spriteFrame = this.BlueSprites[0];
            Global.GameData.RedPoint += 1;
        }
        else if (this.Winner == 1) {//blue win
            cc.find("Player", this.RedPlayer).getComponent(cc.Sprite).spriteFrame = this.RedSprites[0];
            cc.find("Player", this.BluePlayer).getComponent(cc.Sprite).spriteFrame = this.BlueSprites[1];
            Global.GameData.BluePoint += 1;
        }
        else {
            cc.find("Player", this.RedPlayer).getComponent(cc.Sprite).spriteFrame = this.RedSprites[0];
            cc.find("Player", this.BluePlayer).getComponent(cc.Sprite).spriteFrame = this.BlueSprites[1];

        }
        if (Global.GameData.ResultArray.length >= Global.GameData.TotalGameCount) {
            Global.GameData.ResultArray = [];
        }
        if (Global.GameData.PlayedGameCount >= Global.GameData.TotalGameCount) {
            cc.find("BtnNext", this.RedOp).getComponent(cc.Button).enabled = false;
            cc.find("BtnNext", this.RedOp).getComponent(cc.Sprite).spriteFrame = this.NextSprites[1];
            cc.find("BtnNext", this.BlueOp).getComponent(cc.Button).enabled = false;
            cc.find("BtnNext", this.BlueOp).getComponent(cc.Sprite).spriteFrame = this.NextSprites[1];

        }
        else {
            cc.find("BtnNext", this.RedOp).getComponent(cc.Button).enabled = true;
            cc.find("BtnNext", this.RedOp).getComponent(cc.Sprite).spriteFrame = this.NextSprites[0];
            cc.find("BtnNext", this.BlueOp).getComponent(cc.Button).enabled = true;
            cc.find("BtnNext", this.BlueOp).getComponent(cc.Sprite).spriteFrame = this.NextSprites[0];
        }

        Global.GameData.ResultArray.push(this.Winner);
        var currentPanel = this.node.getChildByName("ScoreWhen" + Global.GameData.TotalGameCount.toString());
        currentPanel.active = true;
        var blueMoveAction = cc.moveTo(0.5, 0, this.ShowPlayerY);
        this.BluePlayer.runAction(blueMoveAction);
        var redMoveAction = cc.moveTo(0.5, 0, -this.ShowPlayerY);
        this.RedPlayer.runAction(redMoveAction);

        cc.find("BtnNext", this.RedOp).active = !Global.GameData.IsPlayForFun;
        cc.find("BtnReplay", this.RedOp).active = Global.GameData.IsPlayForFun;
        cc.find("BtnNext", this.BlueOp).active = !Global.GameData.IsPlayForFun;
        cc.find("BtnReplay", this.BlueOp).active = Global.GameData.IsPlayForFun;

        var bOpMoveAction = cc.moveTo(1, 0, this.ShowOpY);
        this.BlueOp.runAction(bOpMoveAction);
        var rOpMoveAction = cc.moveTo(1, 0, -this.ShowOpY);
        this.RedOp.runAction(rOpMoveAction);

        for (var i = 0; i < Global.GameData.ResultArray.length; i++) {
            cc.find(i.toString(), currentPanel).getComponent(cc.Sprite).spriteFrame = this.ResultSprites[Global.GameData.ResultArray[i]];
        }
    },

    OnMainClick(event, customEventData) {
        cc.director.loadScene("MainMenu");
    },

    OnReplayClick(event, customEventData) {
        cc.director.loadScene(Global.GameData.LastSceneName);
    },

    OnNextClick(event, customEventData) {
        this.showLoading();
        cc.log("played:" + Global.GameData.PlayedGameCount + " max scheduler:" + Global.GameData.MaxSchedulerCount);
        if (Global.GameData.PlayedGameCount < Global.GameData.MaxSchedulerCount) {
            cc.director.loadScene("GameScene" + Global.GameData.ScheduledGames[Global.GameData.PlayedGameCount.toString()]);
        }
    },

    showLoading() {
        this.LoadingObj.active = true;
        var ra = cc.rotateBy(100, 36000);
        cc.find("LoadingCircle", this.LoadingObj).runAction(ra);
    }
    // update (dt) {},
});
