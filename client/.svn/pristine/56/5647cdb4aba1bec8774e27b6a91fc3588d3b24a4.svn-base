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
        blueSprite:
        {
            default: null,
            type: cc.SpriteFrame,
        },
        redSprite:
        {
            default: null,
            type: cc.SpriteFrame,
        },
        number: 0,
        sprite0:
        {
            default: null,
            type: cc.Node,
        },
        sprite1:
        {
            default: null,
            type: cc.Node,
        },
        sprite2:
        {
            default: null,
            type: cc.Node,
        },
        isRed: true,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.sprite2 = cc.find("n2", this.node);
        if (this.isRed) {
            this.sprite0.getComponent(cc.Sprite).spriteFrame = this.redSprite;
            this.sprite1.getComponent(cc.Sprite).spriteFrame = this.redSprite;
            if (this.sprite2 != null) {
                this.sprite2.getComponent(cc.Sprite).spriteFrame = this.redSprite;
            }
        }
        else {
            this.sprite0.getComponent(cc.Sprite).spriteFrame = this.blueSprite;
            this.sprite1.getComponent(cc.Sprite).spriteFrame = this.blueSprite;
            if (this.sprite2 != null) {
                this.sprite2.getComponent(cc.Sprite).spriteFrame = this.blueSprite;
            }
        }
        this.setNumber(this.number);
    },

    setNumber(newNumber) {
        var n0 = 0;
        var n1 = 0;
        var n2 = 0;
        cc.log("new number:" + newNumber);
        if (newNumber > 9 && newNumber < 100) {
            n0 = Math.floor(newNumber / 10);
            n1 = newNumber - (n0 * 10);
            if (this.sprite2 != null) {
                this.sprite2.active = false;
            }
        }
        else if (newNumber > 99) {
            n2 = Math.floor(newNumber / 100);
            n0 = Math.floor((newNumber - n2 * 100) / 10);
            n1 = newNumber - n2 * 100 - n0 * 10;
            if (this.sprite2 != null) {
                this.sprite2.active = true;
            }
            cc.log("n0:" + n0 + " n1:" + n1 + " n2:" + n2);
        }
        else {
            n0 = 0;
            n1 = newNumber;
            if (this.sprite2 != null) {
                this.sprite2.active = false;
            }
        }
        this.sprite0.getComponent(cc.Sprite).fillRange = 0.1;
        this.sprite0.getComponent(cc.Sprite).fillStart = n0 * 0.1;
        this.sprite1.getComponent(cc.Sprite).fillRange = 0.1;
        this.sprite1.getComponent(cc.Sprite).fillStart = n1 * 0.1;
        if (this.sprite2 != null) {
            // this.sprite2.active = true;
            this.sprite2.getComponent(cc.Sprite).fillRange = 0.1;
            this.sprite2.getComponent(cc.Sprite).fillStart = n2 * 0.1;
            this.sprite2.x = -100 * n2 - 1100;
        }
        this.sprite0.x = -100 * n0;
        this.sprite1.x = -100 * n1 - 900;

        this.node.opacity = 0;
        var sa = cc.fadeTo(0.3, 255);
        this.node.runAction(sa);
    },
    // update (dt) {},
});
