var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PushGameScene = (function (_super) {
    __extends(PushGameScene, _super);
    function PushGameScene() {
        var _this = _super.call(this) || this;
        _this.PowerOffset = 0; //双方力量差距
        _this.OriginalY = 115; //默认中间Y点坐标
        _this.ForceDownRate = 10; //力量衰减参数
        _this.RedForce = 0; //红色力量
        _this.BlueForce = 0; //蓝色力量
        _this.AddForceRate = 3;
        _this.BlueLoseY = -150;
        _this.RedLoseY = 1466;
        _this.IsOver = false;
        _this.Winner = "None";
        _this.LastFrameTimer = 0; //一开始的帧时间
        _this.DeltaTimer = 0; //距离上一帧的时间
        _this.CountDown = 4;
        _this.skinName = "resource/assets/Scenes/PushGameScene.exml";
        return _this;
    }
    PushGameScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    PushGameScene.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.InitScene();
        egret.setTimeout(this.CountDownAnimation, this, 2000);
    };
    PushGameScene.prototype.InitScene = function () {
        var rtw = egret.Tween.get(this.RedBall);
        var btw = egret.Tween.get(this.BlueBall);
        rtw.to({ "scaleX": 1, "scaleY": 1 }, 500).wait(500).to({ "y": 1179 }, 500);
        btw.to({ "scaleX": 1, "scaleY": 1 }, 500).wait(500).to({ "y": 155 }, 500);
    };
    PushGameScene.prototype.CountDownAnimation = function () {
        var countDownObj = new CountDownUtility();
        this.addChild(countDownObj);
        egret.setTimeout(this.GamePrepare, this, 4000);
    };
    PushGameScene.prototype.GamePrepare = function () {
        this.RedBall.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedTouch, this);
        this.BlueBall.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueTouch, this);
        this.BlueBall.addEventListener(egret.TouchEvent.TOUCH_END, this.onBlueRelease, this);
        this.RedBall.addEventListener(egret.TouchEvent.TOUCH_END, this.onRedRelease, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.LastFrameTimer = egret.getTimer();
        this.RedOver.visible = false;
        this.BlueOver.visible = false;
    };
    PushGameScene.prototype.onEnterFrame = function (e) {
        this.DeltaTimer = (egret.getTimer() - this.LastFrameTimer) / 1000;
        this.LastFrameTimer = egret.getTimer();
        this.BlueForce -= this.DeltaTimer * this.ForceDownRate;
        this.RedForce -= this.DeltaTimer * this.ForceDownRate;
        if (this.BlueForce < 0) {
            this.BlueForce = 0;
        }
        if (this.RedForce < 0) {
            this.RedForce = 0;
        }
        this.PowerOffset = this.BlueForce - this.RedForce;
        this.RedBall.y += this.PowerOffset;
        this.BlueBall.y += this.PowerOffset;
        if (this.RedBall.y >= this.RedLoseY) {
            this.IsOver = true;
            this.Winner = "Blue";
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.BlueBall.source = "resource/Images/PushOut_Ball_2_2.png";
            var tw = egret.Tween.get(this.RedBall);
            tw.to({ y: 2000 }, 800);
        }
        else if (this.BlueBall.y <= this.BlueLoseY) {
            this.IsOver = true;
            this.Winner = "Red";
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.RedBall.source = "resource/Images/PushOut_Ball_1_2.png";
            var tw = egret.Tween.get(this.BlueBall);
            tw.to({ y: -600 }, 800);
        }
        if (this.IsOver) {
            this.RedBall.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedTouch, this);
            this.BlueBall.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueTouch, this);
            this.BlueBall.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBlueRelease, this);
            this.RedBall.removeEventListener(egret.TouchEvent.TOUCH_END, this.onRedRelease, this);
            egret.setTimeout(this.onGameOver, this, 1500);
        }
    };
    PushGameScene.prototype.onGameOver = function () {
        this.RedOver.visible = true;
        this.BlueOver.visible = true;
        this.RedBall.y = 1179;
        this.BlueBall.y = 155;
        var rtw = egret.Tween.get(this.RedOver);
        rtw.to({ y: 1100 }, 800);
        this.RedRetry.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedResetClick, this);
        this.RedMenu.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedMenuClick, this);
        var btw = egret.Tween.get(this.BlueOver);
        btw.to({ y: 200 }, 800);
        this.BlueRetry.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueResetClick, this);
        this.BlueMenu.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueMenuClick, this);
    };
    PushGameScene.prototype.onRedResetClick = function (e) {
        this.RedRetry.source = "resource/Images/UI_StartOverButton_1.png";
        this.onResetClick();
    };
    PushGameScene.prototype.onBlueResetClick = function (e) {
        this.BlueRetry.source = "resource/Images/UI_StartOverButton_1.png";
        this.onResetClick();
    };
    PushGameScene.prototype.onRedMenuClick = function (e) {
        this.RedMenu.source = "resource/Images/UI_MainButton_1.png";
        this.onMenuClick();
    };
    PushGameScene.prototype.onBlueMenuClick = function (e) {
        this.BlueMenu.source = "resource/Images/UI_MainButton_1.png";
        this.onMenuClick();
    };
    PushGameScene.prototype.onResetClick = function () {
        //把按钮移动回去
        var rtw = egret.Tween.get(this.RedOver);
        rtw.to({ y: 1450 }, 800);
        var btw = egret.Tween.get(this.BlueOver);
        btw.to({ y: -150 }, 800);
        egret.setTimeout(function () {
            this.parent.addChild(new PushGameScene);
            this.parent.removeChild(this);
        }, this, 800);
    };
    PushGameScene.prototype.onMenuClick = function () {
        var rtw = egret.Tween.get(this.RedOver);
        rtw.to({ y: 1450 }, 800);
        var btw = egret.Tween.get(this.BlueOver);
        btw.to({ y: -150 }, 800);
        egret.setTimeout(function () { this.parent.removeChild(this); }, this, 800);
    };
    PushGameScene.prototype.onRedTouch = function (e) {
        this.RedForce += this.AddForceRate;
        this.RedBall.source = "resource/Images/PushOut_Ball_1_1.png";
        console.log("red push" + this.RedForce);
    };
    PushGameScene.prototype.onBlueTouch = function (e) {
        this.BlueForce += this.AddForceRate;
        this.BlueBall.source = "resource/Images/PushOut_Ball_2_1.png";
        console.log("blue push" + this.BlueForce);
    };
    PushGameScene.prototype.onRedRelease = function (e) {
        this.RedBall.source = "resource/Images/PushOut_Ball_1_0.png";
    };
    PushGameScene.prototype.onBlueRelease = function (e) {
        this.BlueBall.source = "resource/Images/PushOut_Ball_2_0.png";
    };
    return PushGameScene;
}(eui.Component));
__reflect(PushGameScene.prototype, "PushGameScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=PushGameScene.js.map