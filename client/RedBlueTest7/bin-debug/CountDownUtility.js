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
var CountDownUtility = (function (_super) {
    __extends(CountDownUtility, _super);
    function CountDownUtility() {
        var _this = _super.call(this) || this;
        _this.CountNumber = 4;
        _this.skinName = "resource/eui_skins/CountDownUtility.exml";
        return _this;
    }
    CountDownUtility.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    CountDownUtility.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.CountDownAnimation();
    };
    CountDownUtility.prototype.CountDownAnimation = function () {
        this.CountNumber -= 1;
        if (this.CountNumber < 0) {
            this.BlueCountDown.visible = false;
            this.RedCountDown.visible = false;
            this.parent.removeChild(this);
            return;
        }
        else {
            this.BlueCountDown.source = "resource/Images/UI_ReadyNumber_1_" + this.CountNumber + ".png";
            this.RedCountDown.source = "resource/Images/UI_ReadyNumber_0_" + this.CountNumber + ".png";
            this.BlueCountDown.anchorOffsetX = this.BlueCountDown.width / 2;
            this.BlueCountDown.anchorOffsetY = this.BlueCountDown.height / 2;
            this.RedCountDown.anchorOffsetX = this.RedCountDown.width / 2;
            this.RedCountDown.anchorOffsetY = this.RedCountDown.height / 2;
            this.BlueCountDown.scaleX = 3;
            this.BlueCountDown.scaleY = 3;
            this.RedCountDown.scaleX = 3;
            this.RedCountDown.scaleY = 3;
            var rtw = egret.Tween.get(this.RedCountDown);
            var btw = egret.Tween.get(this.BlueCountDown);
            rtw.to({ "scaleX": 1, "scaleY": 1 }, 1000, egret.Ease.cubicOut);
            btw.to({ "scaleX": 1, "scaleY": 1 }, 1000, egret.Ease.cubicOut);
            egret.setTimeout(this.CountDownAnimation, this, 1000);
        }
    };
    return CountDownUtility;
}(eui.Component));
__reflect(CountDownUtility.prototype, "CountDownUtility", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=CountDownUtility.js.map