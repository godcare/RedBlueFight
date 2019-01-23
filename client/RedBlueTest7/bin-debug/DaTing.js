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
// TypeScript file
var DaTing = (function (_super) {
    __extends(DaTing, _super);
    function DaTing() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/assets/Scenes/DaTing.exml";
        return _this;
    }
    DaTing.prototype.partAdded = function (partname, instance) {
        _super.prototype.partAdded.call(this, partname, instance);
        // 
    };
    DaTing.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this.btn0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPushClick, this);
        this.btn1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPPYClick, this);
        this.LBTitle0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPushClick, this);
        this.LBTitle1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPPYClick, this);
        this.InitPhysic();
    };
    DaTing.prototype.InitPhysic = function () {
        var engine = Matter.Engine.create(null, null);
        var runner = Matter.Runner.create(null);
        var composites = Matter.Composites;
        var physicMouse = Matter.MouseConstraint;
        var Bodies = Matter.Bodies;
        var World = Matter.World;
        var world = engine.world;
        var m_staget = this.stage;
        var render = EgretRender.create({
            element: document.body,
            engine: engine,
            // canvas:egret.CanvasRenderer,
            options: {
                width: this.stage.width,
                height: this.stage.height,
                container: this,
                wireframes: true
            }
        });
        runner.isFixed = true;
        Matter.Runner.run(runner, engine);
        EgretRender.run(render);
        physicMouse.create(engine, {});
        var cloth = composites.softBody(0, 0, 10, 10, 2, 2, false, 20, {
            render: {
                visible: true
            },
            collisionFilter: {
                group: 1,
            }
        }, {});
        //将最上方的球固定。
        for (var i = 0; i < 10; i++) {
            cloth.bodies[i].isStatic = true;
        }
        var box = Bodies.rectangle(0, 300, 300, 100, {
            isStatic: true,
            visible: true
        });
        var ground = Bodies.rectangle(600, 700, 1800, 100, {
            isStatic: true,
            visible: true
        });
        World.add(world, [ground, box, cloth, physicMouse]);
    };
    DaTing.prototype.onPushClick = function (e) {
        var newGamePlay = new PushGameScene();
        this.addChild(newGamePlay);
    };
    DaTing.prototype.onPPYClick = function (e) {
        var newGamePlay = new ShiguanGameScene();
        this.addChild(newGamePlay);
    };
    return DaTing;
}(eui.Component));
__reflect(DaTing.prototype, "DaTing", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=DaTing.js.map