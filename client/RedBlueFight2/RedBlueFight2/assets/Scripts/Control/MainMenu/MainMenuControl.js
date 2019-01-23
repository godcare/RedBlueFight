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
var MoveRepeat = require("MoveRepeat");
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
        MaxSchedulerLabel:
        {
            default: null,
            type: cc.Label,
        },
        RedPoint:
        {
            default: null,
            type: cc.Label,
        },
        BluePoint:
        {
            default: null,
            type: cc.Label,
        },
        SchedulerLabel:
        {
            default: null,
            type: cc.Label,
        },
        GameIcons:
        {
            default: [],
            type: [cc.Node],

        },
        GameIconSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        ScheduleSelectSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        StartSprite:
        {
            default: null,
            type: cc.Node,
        },
        IsSelectPanelOn:
        {
            default: false,
        },
        SelectedGamePanel:
        {
            default: null,
            type: cc.Node,
        },
        SelectGameSwitch:
        {
            default: null,
            type: cc.Node,
        },
        GameListPanel:
        {
            default: null,
            type: cc.Node,
        },
        ScheduleGameParent:
        {
            default: null,
            type: cc.Node,
        },
        SoundBtn:
        {
            default: null,
            type: cc.Node,
        },
        SoundFxBtn:
        {
            default: null,
            type: cc.Node,
        },
        FillOrRandomBtn:
        {
            default: null,
            type: cc.Node,
        },
        SelectGameWarn:
        {
            default: null,
            type: cc.Node,
        },
        StartGameWarn:
        {
            default: null,
            type: cc.Node,
        },
        soundSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        soundFxSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        schedulerGameBGSprites:
        {
            default: [],
            type: [cc.SpriteFrame],
        },
        schedulerGameBG:
        {
            default: null,
            type: cc.Node,
        },
        viewNotCop:
        {
            default: null,
            type: cc.Node,
        },
        viewCop:
        {
            default: null,
            type: cc.Node,
        },
        loadingObj:
        {
            default: null,
            type: cc.Node,
        },

        currentSelectedIndex: -1,
        lastClickPointBGTime: 0,
        lastAdIndex: -1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        //开启右上角的分享

        //监听右上角的分享调用 




    },

    start() {
        this.InitData();

    },

    InitData: function () {
        //初始化游戏图标
        for (var i = 0; i < Global.GameData.MaxFinishedCount; i++) {
            this.GameIcons[i].getChildByName("Name").getComponent(cc.Label).string = Global.GameData.AllGames[i].displayName;
        }
        Global.GameData.PlayedGameCount = 0;
        this.SoundMGR.playTitleBGM();
        if (cc.audioEngine.getMusicVolume() > 0) {
            this.SoundBtn.getComponent(cc.Sprite).spriteFrame = this.soundSprites[1];
        }
        else {
            this.SoundBtn.getComponent(cc.Sprite).spriteFrame = this.soundSprites[0];
        }
        if (cc.audioEngine.getEffectsVolume() > 0) {
            this.SoundFxBtn.getComponent(cc.Sprite).spriteFrame = this.soundFxSprites[1];
        }
        else {
            this.SoundFxBtn.getComponent(cc.Sprite).spriteFrame = this.soundFxSprites[0];
        }
        this.RedPoint.string = Global.GameData.RedPoint.toString();
        this.BluePoint.string = Global.GameData.BluePoint.toString();
        this.GameListPanel.getComponent(cc.PageView).enabled = false;
        this.SetScheduler();



    },

    onSoundSwitch(event, customEventData) {
        cc.log(cc.audioEngine.getMusicVolume());
        if (cc.audioEngine.getMusicVolume() > 0) {
            cc.audioEngine.setMusicVolume(0.0);
            this.SoundBtn.getComponent(cc.Sprite).spriteFrame = this.soundSprites[0];
        }
        else {
            cc.audioEngine.setMusicVolume(1);
            this.SoundBtn.getComponent(cc.Sprite).spriteFrame = this.soundSprites[1];
        }
    },

    onSoundFxSwitch(event, customEventData) {
        if (cc.audioEngine.getEffectsVolume() > 0) {
            cc.audioEngine.setEffectsVolume(0);
            this.SoundFxBtn.getComponent(cc.Sprite).spriteFrame = this.soundFxSprites[0];
        }
        else {
            cc.audioEngine.setEffectsVolume(1);
            this.SoundFxBtn.getComponent(cc.Sprite).spriteFrame = this.soundFxSprites[1];
        }

    },
    //设置排上日程的游戏列表
    SetScheduler: function () {
        if (Global.GameData.CurrentGameType == 1) {
            for (var i = 0; i < Global.GameData.AllGames.length - 3; i++) {
                if (Global.GameData.SGame1.indexOf(i.toString()) == -1) {//如果未安排且已解锁，且不在未安排列表里，添加到未安排列表里
                    if (Global.GameData.USGame1.indexOf(i.toString()) == -1 && Global.GameData.LockedGames.indexOf(i.toString()) == -1) {
                        Global.GameData.USGame1.push(i.toString());
                    }
                }
                else {
                    if (Global.GameData.USGame1.indexOf(i.toString()) != -1) {//如果已安排，且在未安排列表里，从未安排列表里移除
                        Global.GameData.USGame1.splice(Global.GameData.USGame1.indexOf(i.toString()), 1);
                    }
                }
            }
            this.schedulerGameBG.getComponent(cc.Sprite).spriteFrame = this.schedulerGameBGSprites[Global.GameData.CurrentGameType - 1];
            Global.GameData.ScheduledGames = Global.GameData.SGame1;
            Global.GameData.UnScheduledGames = Global.GameData.USGame1;
            this.viewNotCop.active = true;
            this.viewCop.active = false;
        }
        else if (Global.GameData.CurrentGameType == 2) {
            for (var i = 0; i < Global.GameData.AllGames.length - 3; i++) {
                if (Global.GameData.SGame2.indexOf(i.toString()) == -1) {//如果未安排且已解锁，且不在未安排列表里，添加到未安排列表里
                    if (Global.GameData.USGame2.indexOf(i.toString()) == -1 && Global.GameData.LockedGames.indexOf(i.toString()) == -1) {
                        Global.GameData.USGame2.push(i.toString());
                    }
                }
                else {
                    if (Global.GameData.USGame2.indexOf(i.toString()) != -1) {//如果已安排，且在未安排列表里，从未安排列表里移除
                        Global.GameData.USGame2.splice(Global.GameData.USGame2.indexOf(i.toString()), 1);
                    }
                }
            }
            this.schedulerGameBG.getComponent(cc.Sprite).spriteFrame = this.schedulerGameBGSprites[Global.GameData.CurrentGameType - 1];
            Global.GameData.ScheduledGames = Global.GameData.SGame2;
            Global.GameData.UnScheduledGames = Global.GameData.USGame2;
            this.viewNotCop.active = true;
            this.viewCop.active = false;
        }
        else {
            for (var i = 22; i < Global.GameData.AllGames.length; i++) {
                if (Global.GameData.SGame3.indexOf(i.toString()) == -1 && Global.GameData.LockedGames.indexOf(i.toString()) == -1) {//如果未安排，且不在未安排列表里，添加到未安排列表里
                    if (Global.GameData.USGame3.indexOf(i.toString()) == -1) {
                        Global.GameData.USGame3.push(i.toString());
                    }
                }
                else {
                    if (Global.GameData.USGame3.indexOf(i.toString()) != -1) {//如果已安排，且在未安排列表里，从未安排列表里移除
                        Global.GameData.USGame3.splice(Global.GameData.USGame3.indexOf(i.toString()), 1);
                    }
                }
            }
            this.schedulerGameBG.getComponent(cc.Sprite).spriteFrame = this.schedulerGameBGSprites[Global.GameData.CurrentGameType - 1];
            Global.GameData.ScheduledGames = Global.GameData.SGame3;
            Global.GameData.UnScheduledGames = Global.GameData.USGame3;
            this.viewNotCop.active = false;
            this.viewCop.active = true;
        }

        this.MaxSchedulerLabel.string = Global.GameData.MaxSchedulerCount;
        //设置已选
        for (var i = 0; i < Global.GameData.ScheduledGames.length; i++) {
            //设置底部游戏列表

            //设置中部游戏日程表
            if (i < Global.GameData.MaxSchedulerCount) {
                cc.find(i.toString(), this.ScheduleGameParent).getComponent(cc.Button).enabled = true;
                cc.find(i.toString(), this.ScheduleGameParent).opacity = 255;
            }
            else {
                // cc.find(i.toString(), this.ScheduleGameParent).getComponent(cc.Button).enabled = false;
                cc.find(i.toString(), this.ScheduleGameParent).opacity = 120;
            }
            cc.find(i.toString() + "/Icon", this.ScheduleGameParent).getComponent(cc.Sprite).spriteFrame = this.GameIconSprites[Global.GameData.ScheduledGames[i]];
            cc.find(i.toString() + "/Name", this.ScheduleGameParent).getComponent(cc.Label).string = Global.GameData.AllGames[Global.GameData.ScheduledGames[i]].displayName;
            cc.find(i.toString() + "/Icon", this.ScheduleGameParent).active = true;
            cc.find(i.toString() + "/Name", this.ScheduleGameParent).active = true;
            cc.find(i.toString(), this.ScheduleGameParent).getComponent(cc.Sprite).spriteFrame = this.ScheduleSelectSprites[0];

        }
        //设置未选
        for (var i = Global.GameData.ScheduledGames.length; i < Global.GameData.MaxChooseCount; i++) {
            cc.find(i.toString() + "/Icon", this.ScheduleGameParent).active = false;
            cc.find(i.toString() + "/Name", this.ScheduleGameParent).active = false;
            cc.find(i.toString(), this.ScheduleGameParent).getComponent(cc.Sprite).spriteFrame = this.ScheduleSelectSprites[1];
        }

        for (var i = 0; i < Global.GameData.MaxSchedulerCount; i++) {
            cc.find(i.toString(), this.ScheduleGameParent).getComponent(cc.Button).enabled = true;

        }

        for (var i = Global.GameData.MaxSchedulerCount; i < Global.GameData.MaxChooseCount; i++) {
            cc.find(i.toString(), this.ScheduleGameParent).getComponent(cc.Button).enabled = false;

        }
        cc.log("locked:" + Global.GameData.LockedGames);
        //设置底部
        for (var i = 0; i < Global.GameData.MaxFinishedCount; i++) {
            var pIndex = Math.floor(i / 12);
            var tmpI = Global.GameData.ScheduledGames.indexOf(i.toString());
            if (tmpI == -1) {
                cc.log("Game" + i + "Not In");

                cc.find("Mark", this.GameIcons[i]).active = false;
                cc.find("Name", this.GameIcons[i]).color = new cc.Color(0, 89, 136, 255);
            }
            else {
                cc.log("Game" + i + "In");

                cc.find("Mark", this.GameIcons[i]).active = true;
                cc.find("Name", this.GameIcons[i]).color = cc.Color.WHITE;
            }

            var lockI = Global.GameData.LockedGames.indexOf(i.toString());
            if (lockI == -1)//unlocked
            {
                if (cc.find("Icon/Locked", this.GameIcons[i]) != null) {
                    cc.find("Icon/Locked", this.GameIcons[i]).active = false;
                }
            }
            else {
                if (cc.find("Icon/Locked", this.GameIcons[i]) != null) {
                    cc.find("Icon/Locked", this.GameIcons[i]).active = true;
                }
            }
        }
        this.SchedulerLabel.string = Global.GameData.ScheduledGames.length + "/" + Global.GameData.MaxChooseCount;
        //验证是否满足开始条件
        if (Global.GameData.ScheduledGames.length >= Global.GameData.MaxSchedulerCount) {
            this.StartSprite.color = new cc.Color(255, 100, 27, 255);
            this.StartSprite.getComponent(cc.Button).enabled = true;
            this.SelectGameWarn.active = false;
            this.scheduleOnce(function () {

                if (!this.StartGameWarn.active && Global.GameData.ScheduledGames.length >= Global.GameData.MaxSchedulerCount && !this.IsSelectPanelOn) {
                    this.ShowStartGameWarn();
                }
            }, 2);
        }
        else {
            this.StartSprite.color = cc.Color.GRAY;
            this.StartSprite.getComponent(cc.Button).enabled = false;
            this.StartGameWarn.active = false;
            this.scheduleOnce(function () {
                if (!this.SelectGameWarn.active && Global.GameData.ScheduledGames.length < Global.GameData.MaxSchedulerCount && !this.IsSelectPanelOn) {
                    this.ShowSelectGameWarn();
                }
            }, 2);
        }

        if (Global.GameData.ScheduledGames.length < Global.GameData.MaxChooseCount) {
            cc.find("Label", this.FillOrRandomBtn).getComponent(cc.Label).string = "填满";
        }
        else {
            cc.find("Label", this.FillOrRandomBtn).getComponent(cc.Label).string = "重排";
        }
    },

    OnPointBGClick(event, customEventData) {
        var date = new Date();
        var t = date.getTime();
        if (t - this.lastClickPointBGTime <= 600) {
            cc.log("Double Click");
            Global.GameData.RedPoint = 0;
            Global.GameData.BluePoint = 0;
            this.RedPoint.string = Global.GameData.RedPoint.toString();
            this.BluePoint.string = Global.GameData.BluePoint.toString();
            this.lastClickPointBGTime = 0;
        }
        else {
            this.lastClickPointBGTime = t;
        }
    },

    OnRemoveThisClick(event, customEventData) {
        if (Global.GameData.CurrentGameType == 1) {
            var tmpS = Global.GameData.SGame1.indexOf(this.currentSelectedIndex.toString());
            Global.GameData.SGame1.splice(tmpS, 1);
        }
        else if (Global.GameData.CurrentGameType == 2) {
            var tmpS = Global.GameData.SGame2.indexOf(this.currentSelectedIndex.toString());
            Global.GameData.SGame2.splice(tmpS, 1);
        }
        else {
            var tmpS = Global.GameData.SGame3.indexOf(this.currentSelectedIndex.toString());
            Global.GameData.SGame3.splice(tmpS, 1);
        }
        this.SetScheduler();
        this.SelectedGamePanel.active = false;
    },

    OnFillOrRandomClick(event, customEventData) {
        if (Global.GameData.CurrentGameType == 1) {
            if (Global.GameData.SGame1.length < Global.GameData.MaxChooseCount) {//填满操作，随机填满
                for (var i = Global.GameData.SGame1.length; i < Global.GameData.MaxChooseCount; i++) {
                    cc.log("Scheduler:" + Global.GameData.SGame1 + " UnS:" + Global.GameData.USGame1);
                    var tr = Math.floor(Math.random() * Global.GameData.USGame1.length);
                    var ti = Global.GameData.USGame1[tr];
                    Global.GameData.SGame1.push(ti.toString());
                    Global.GameData.USGame1.splice(tr, 1);
                }

            }
            else {//重排操作
                cc.log("rerange before:" + Global.GameData.SGame1);
                for (var i = 0; i < Global.GameData.SGame1.length; i++) {
                    var targetI = Math.floor(Math.random() * (Global.GameData.SGame1.length - 1));
                    var tmp = Global.GameData.SGame1[i];
                    cc.log("ti:" + targetI + " tmpV:" + tmp + " i:" + i + " targetV:" + Global.GameData.SGame1[targetI]);
                    Global.GameData.SGame1[i] = Global.GameData.SGame1[targetI];
                    Global.GameData.SGame1[targetI] = tmp;
                }
                cc.log("rerange after:" + Global.GameData.SGame1);
            }
        }
        else if (Global.GameData.CurrentGameType == 2) {
            if (Global.GameData.SGame2.length < Global.GameData.MaxChooseCount) {//填满操作，随机填满
                for (var i = Global.GameData.SGame2.length; i < Global.GameData.MaxChooseCount; i++) {
                    cc.log("Scheduler:" + Global.GameData.SGame2 + " UnS:" + Global.GameData.USGame2);
                    var tr = Math.floor(Math.random() * Global.GameData.USGame2.length);
                    var ti = Global.GameData.USGame2[tr];
                    Global.GameData.SGame2.push(ti.toString());
                    Global.GameData.USGame2.splice(tr, 1);
                }

            }
            else {//重排操作
                cc.log("rerange before:" + Global.GameData.SGame2);
                for (var i = 0; i < Global.GameData.SGame2.length; i++) {
                    var targetI = Math.floor(Math.random() * (Global.GameData.SGame2.length - 1));
                    var tmp = Global.GameData.SGame2[i];
                    cc.log("ti:" + targetI + " tmpV:" + tmp + " i:" + i + " targetV:" + Global.GameData.SGame2[targetI]);
                    Global.GameData.SGame2[i] = Global.GameData.SGame2[targetI];
                    Global.GameData.SGame2[targetI] = tmp;
                }
                cc.log("rerange after:" + Global.GameData.SGame2);
            }
        }
        else {
            if (Global.GameData.SGame3.length < 3) {//填满操作，随机填满
                for (var i = Global.GameData.SGame3.length; i < 3; i++) {
                    cc.log("Scheduler:" + Global.GameData.SGame3 + " UnS:" + Global.GameData.USGame3);
                    if (Global.GameData.USGame3.length > 0) {//未安排列表不够用时退出循环
                        var tr = Math.floor(Math.random() * Global.GameData.USGame3.length);
                        var ti = Global.GameData.USGame3[tr];
                        cc.log("tr:" + tr);
                        Global.GameData.SGame3.push(ti.toString());
                        Global.GameData.USGame3.splice(tr, 1);
                    }
                    else {
                        break;
                    }
                }

            }
            else {//重排操作
                cc.log("rerange before:" + Global.GameData.SGame3);
                for (var i = 0; i < Global.GameData.SGame3.length; i++) {
                    var targetI = Math.floor(Math.random() * (Global.GameData.SGame3.length - 1));
                    var tmp = Global.GameData.SGame3[i];
                    cc.log("ti:" + targetI + " tmpV:" + tmp + " i:" + i + " targetV:" + Global.GameData.SGame3[targetI]);
                    Global.GameData.SGame3[i] = Global.GameData.SGame3[targetI];
                    Global.GameData.SGame3[targetI] = tmp;
                }
                cc.log("rerange after:" + Global.GameData.SGame3);
            }
        }

        this.SetScheduler();
    },

    OnClearClick(event, customEventData) {
        if (Global.GameData.CurrentGameType == 1) {
            Global.GameData.SGame1 = [];
        }
        else if (Global.GameData.CurrentGameType == 2) {
            Global.GameData.SGame2 = [];
        }
        else {
            Global.GameData.SGame3 = [];
        }

        this.SetScheduler();
    },
    //下方游戏列表单元点击
    OnSelectGameClicked(event, customEventData) {
        if (this.IsSelectPanelOn) {
            var action = cc.moveBy(0.2, 0, -450);
            var aa = cc.fadeTo(0.2, 0);

            this.GameListPanel.getChildByName("Mask").runAction(aa);
            this.scheduleOnce(function () {
                this.GameListPanel.getChildByName("Mask").active = false;
                this.GameListPanel.getChildByName("BG").color = cc.Color.WHITE;
                this.GameListPanel.getChildByName("BG").opacity = 200;
            }, 0.25);

            this.GameListPanel.runAction(action);
            this.GameListPanel.getComponent(cc.PageView).enabled = false;
            this.IsSelectPanelOn = false;
            this.SelectGameSwitch.color = new cc.Color(252, 141, 55, 255);
            this.SelectGameSwitch.getChildByName("Label").getComponent(cc.Label).string = "选择游戏";
            this.SchedulerLabel.node.active = false;

            this.SetScheduler();
        }
        else {
            var action = cc.moveBy(0.2, 0, 450);
            this.GameListPanel.getChildByName("Mask").active = true;
            this.GameListPanel.getChildByName("Mask").opacity = 0;
            var aa = cc.fadeTo(0.2, 150);
            this.GameListPanel.getChildByName("BG").opacity = 255;
            this.GameListPanel.getChildByName("BG").color = new cc.Color(223, 241, 247, 255);
            this.GameListPanel.getChildByName("Mask").runAction(aa);

            this.GameListPanel.runAction(action);
            this.GameListPanel.getComponent(cc.PageView).enabled = true;
            this.IsSelectPanelOn = true;
            this.SelectGameSwitch.getChildByName("Label").getComponent(cc.Label).string = "我选好了";
            this.SelectGameSwitch.color = new cc.Color(255, 205, 77, 255);
            this.SchedulerLabel.node.active = true;
            this.StartGameWarn.active = false;
            this.SelectGameWarn.active = false;
        }
    },

    onTabChangeClick(event, customEventData) {
        if (customEventData == "1") {
            this.schedulerGameBG.getComponent(cc.Sprite).spriteFrame = this.schedulerGameBGSprites[0];
            Global.GameData.CurrentGameType = 1;
            this.SetScheduler();
        }
        else if (customEventData == "2") {
            this.schedulerGameBG.getComponent(cc.Sprite).spriteFrame = this.schedulerGameBGSprites[1];
            Global.GameData.CurrentGameType = 2;
            this.SetScheduler();
        }
        else {
            this.schedulerGameBG.getComponent(cc.Sprite).spriteFrame = this.schedulerGameBGSprites[2];
            Global.GameData.CurrentGameType = 3;
            this.SetScheduler();
        }
    },

    //已安排游戏点击
    OnScheduledGameClicked(event, customEventData) {
        this.currentSelectedIndex = Global.GameData.ScheduledGames[customEventData];
        this.SelectedGamePanel.active = true;
        cc.find("IconPanel/Icon", this.SelectedGamePanel).getComponent(cc.Sprite).spriteFrame = this.GameIconSprites[this.currentSelectedIndex];
        cc.find("SelectedGameName", this.SelectedGamePanel).getComponent(cc.Label).string = Global.GameData.AllGames[this.currentSelectedIndex].displayName;
    },

    OnGameIconClicked(event, customEventData) {
        cc.log(customEventData);
        if (this.IsSelectPanelOn) {
            if (Global.GameData.CurrentGameType == 1) {
                var tmpIndex = Global.GameData.SGame1.indexOf(customEventData);
                var lockIndex = Global.GameData.LockedGames.indexOf(customEventData);
                if (lockIndex == -1) {//game unlocked
                    if (customEventData <= Global.GameData.MaxFinishedCount - 1) //没完工的游戏先不往上放
                    {
                        if (Global.GameData.SGame1.length < Global.GameData.MaxChooseCount) {//还可以接着选
                            if (tmpIndex == -1) {
                                if (Global.GameData.SGame1.length < Global.GameData.MaxSchedulerCount) //原先没有就加并且还没达到开局要求
                                {
                                    Global.GameData.SGame1.push(customEventData);
                                }
                            }

                            this.SetScheduler();
                        }
                        if (tmpIndex != -1)//原先有就删
                        {
                            Global.GameData.SGame1.splice(tmpIndex, 1);
                            this.SetScheduler();
                        }
                    }
                }
                else {//game locked
                    this.lastAdIndex = customEventData;
                    this.CheckAds();

                }
            }
            else if (Global.GameData.CurrentGameType == 2) {
                var tmpIndex = Global.GameData.SGame2.indexOf(customEventData);
                var lockIndex = Global.GameData.LockedGames.indexOf(customEventData);
                if (lockIndex == -1) {// game unlocked
                    if (customEventData <= Global.GameData.MaxFinishedCount - 1) //没完工的游戏先不往上放
                    {
                        if (Global.GameData.SGame2.length < Global.GameData.MaxChooseCount) {//还可以接着选
                            if (tmpIndex == -1) {
                                if (Global.GameData.SGame2.length < Global.GameData.MaxSchedulerCount) //原先没有就加并且还没达到开局要求
                                {
                                    Global.GameData.SGame2.push(customEventData);
                                }
                            }

                            this.SetScheduler();
                        }
                        if (tmpIndex != -1)//原先有就删
                        {
                            Global.GameData.SGame2.splice(tmpIndex, 1);
                            this.SetScheduler();
                        }
                    }
                }
                else {
                    this.lastAdIndex = customEventData;
                    this.CheckAds();
                }
            }
            else {
                var tmpIndex = Global.GameData.SGame3.indexOf(customEventData);
                var lockIndex = Global.GameData.LockedGames.indexOf(customEventData);
                if (lockIndex == -1) {// game unlocked
                    if (customEventData <= Global.GameData.MaxFinishedCount - 1) //没完工的游戏先不往上放
                    {
                        if (Global.GameData.SGame3.length < Global.GameData.MaxChooseCount) {//还可以接着选
                            if (tmpIndex == -1) {
                                if (Global.GameData.SGame3.length < Global.GameData.MaxSchedulerCount) //原先没有就加并且还没达到开局要求
                                {
                                    Global.GameData.SGame3.push(customEventData);
                                }
                            }

                            this.SetScheduler();
                        }
                        if (tmpIndex != -1)//原先有就删
                        {
                            Global.GameData.SGame3.splice(tmpIndex, 1);
                            this.SetScheduler();
                        }
                    }
                }
                else {
                    this.lastAdIndex = customEventData;
                    this.CheckAds();
                }
            }

        }
        else {

        }
    },

    CheckAds() {

        if (CC_WECHATGAME) {
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-2a0ac3aec10cfe1c'
            })

            videoAd.load()
                .then(() => videoAd.show())
                .catch(err => console.log(err.errMsg))

            videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined

                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    var targetIndex = Global.GameData.LockedGames.indexOf(this.lastAdIndex.toString());
                    console.log("last AdIndex:" + this.lastAdIndex + "target Index:" + targetIndex + " locked:" + Global.GameData.LockedGames);
                    if (targetIndex != -1) {
                        Global.GameData.LockedGames.splice(targetIndex, 1);
                        console.log("new locked game list:" + Global.GameData.LockedGames);
                        Global.GameData.SaveCache();
                        if (Global.GameData.CurrentGameType == 1) {
                            Global.GameData.USGame1.push(Global.GameData.LockedGames[targetIndex]);
                        }
                        else if (Global.GameData.CurrentGameType == 2) {
                            Global.GameData.USGame2.push(Global.GameData.LockedGames[targetIndex]);
                        }
                        else {
                            Global.GameData.USGame3.push(Global.GameData.LockedGames[targetIndex]);
                        }

                        this.SetScheduler();
                    }
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                }

            })

        }
        else {
            this.scheduleOnce(function () {
                var targetIndex = Global.GameData.LockedGames.indexOf(this.lastAdIndex.toString());
                console.log("target Index:" + targetIndex + " locked:" + Global.GameData.LockedGames);
                if (targetIndex != -1) {
                    Global.GameData.LockedGames.splice(targetIndex, 1);
                    Global.GameData.SaveCache();
                    if (Global.GameData.CurrentGameType == 1) {
                        Global.GameData.USGame1.push(Global.GameData.LockedGames[targetIndex]);
                    }
                    else if (Global.GameData.CurrentGameType == 2) {
                        Global.GameData.USGame2.push(Global.GameData.LockedGames[targetIndex]);
                    }
                    else {
                        Global.GameData.USGame3.push(Global.GameData.LockedGames[targetIndex]);
                    }
                    this.SetScheduler();
                }
            }, 2);

        }
    },

    OnScheduleStart(event, customEventData) {
        //show loading
        this.loadingObj.active = true;
        var ra = cc.rotateBy(100, 36000);
        cc.find("LoadingCircle", this.loadingObj).runAction(ra);
        Global.GameData.TotalGameCount = Global.GameData.MaxSchedulerCount;
        Global.GameData.IsPlayForFun = false;
        Global.GameData.ResultArray = [];
        Global.GameData.PlayedGameCount = 0;
        Global.GameData.LastSceneName = "GameScene" + Global.GameData.ScheduledGames[0].toString();
        cc.director.loadScene("GameScene" + Global.GameData.ScheduledGames[0].toString());


    },
    OnPlayThisClick(event, customEventData) {
        //show loading
        this.loadingObj.active = true;
        var ra = cc.rotateBy(100, 36000);
        cc.find("LoadingCircle", this.loadingObj).runAction(ra);
        Global.GameData.TotalGameCount = 7;
        Global.GameData.IsPlayForFun = true;
        Global.GameData.ResultArray = [];
        Global.GameData.PlayedGameCount = 0;
        Global.GameData.LastSceneName = "GameScene" + this.currentSelectedIndex.toString();
        cc.director.loadScene("GameScene" + this.currentSelectedIndex.toString());
    },

    OnCloseSelectedPanelButton(event, customEventData) {
        this.SelectedGamePanel.active = false;

    },

    OnRoundSwitch(event, customEventData) {
        if (customEventData == 1) {
            if (Global.GameData.MaxSchedulerCount <= 5) {
                Global.GameData.MaxSchedulerCount += 2;
            }
        }
        else {
            if (Global.GameData.MaxSchedulerCount >= 5) {
                Global.GameData.MaxSchedulerCount -= 2;
            }
        }
        this.SetScheduler();
    },

    ShowStartGameWarn() {
        if (!this.StartGameWarn.active) {
            this.StartGameWarn.opacity = 0;
            this.StartGameWarn.active = true;
            var oa = cc.fadeTo(0.2, 255);
            this.StartGameWarn.runAction(oa);
            this.scheduleOnce(function () {
                this.StartGameWarn.getComponent(MoveRepeat).moveStart();
            }, 0.2);
        }
    },

    ShowSelectGameWarn() {
        if (!this.SelectGameWarn.active) {
            this.SelectGameWarn.opacity = 0;
            this.SelectGameWarn.active = true;
            var oa = cc.fadeTo(0.2, 255);
            this.SelectGameWarn.runAction(oa);
            this.scheduleOnce(function () {
                this.SelectGameWarn.getComponent(MoveRepeat).moveStart();
            }, 0.2);
        }
    },
    // update (dt) {},
});