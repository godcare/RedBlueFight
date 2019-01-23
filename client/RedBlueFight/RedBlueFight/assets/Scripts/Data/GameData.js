// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameType = require("GameType")
cc.Class({
    properties: {
        AllGames:
        {
            default: [],
            type: [GameType]
        },
        AllGameNames:
        {
            default: [],
        },
        UnScheduledGames://所有未选游戏
        {
            default: [],
        },
        ScheduledGames:
        {
            default: [],
        },
        ResultArray://当轮战果,0为红色胜利，1为蓝色胜利
        {
            default: [],
        },
        CurrentIndex: 0,
        RedPoint: 0,//红色得分
        BluePoint: 0,//蓝色得分
        TotalGameCount: 3,//总共需要玩的局数
        PlayedGameCount: 0,//已经玩了的局数
        MaxChooseCount: 7,//最多可以选多少个游戏
        MaxSchedulerCount: 3,//最多安排多少个游戏
        MaxFinishedCount: 8,//程序员最多实现了多少款
        SoundOn: true,//音乐开关
        SoundFxOn: true,//音效开关
        SoundVolunm: 1,//音乐音量
        SoundFxVolunm: 1,//音效音量
        CurrentWinner: -1,//当前赢家，0为红色，1为蓝色，-1为无
        IsPlayForFun: false,//是不是随便玩
        LastSceneName: "",//最近一次玩的场景
    },
    name: "GameData",
    ctor: function () {
        this.AllGameNames = ["顶翻小胖子", "软蛋曲棍球", "细菌求生存", "试管排排压", "拳王攻防战", "巧夺培养皿", "烧瓶投分王", "超级冰壶赛"];
        this.AllGames = new Array(this.MaxFinishedCount);
        for (var i = 0; i < this.MaxFinishedCount; i++) {

            this.AllGames[i] = new GameType();
            this.AllGames[i].iconName = "game_icon_" + i;
            this.AllGames[i].displayName = this.AllGameNames[i];
            this.AllGames[i].sceneName = "GameScene" + i;
            this.UnScheduledGames.push(i.toString());
        }
    },

});