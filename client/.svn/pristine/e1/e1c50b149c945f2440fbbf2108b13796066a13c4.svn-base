// TypeScript file
class DaTing extends eui.Component implements eui.UIComponent {
    public constructor() {
        super();
        this.skinName = "resource/assets/Scenes/DaTing.exml";

    }
    public btn0: eui.Image;//挤压大胖子
    public btn1: eui.Image;//试管排排压
    public LBTitle0: eui.Label;
    public LBTitle1: eui.Label;

    protected partAdded(partname: string, instance: any): void {
        super.partAdded(partname, instance);
        // 
    }

    protected childrenCreated(): void {
        super.childrenCreated();

        this.btn0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPushClick, this);
        this.btn1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPPYClick, this);
        this.LBTitle0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPushClick, this);
        this.LBTitle1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPPYClick, this);
        this.InitPhysic();
    }

    private InitPhysic(): void {
        let engine = Matter.Engine.create(null, null);
        let runner = Matter.Runner.create(null);
        let composites = Matter.Composites;
        let physicMouse = Matter.MouseConstraint;
        let Bodies = Matter.Bodies;
        let World = Matter.World;
        let world = engine.world;
        
        let m_staget = this.stage;
        let render = EgretRender.create({
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
                visible: true,          
                sprite:
                {
                    
                }
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



    }

    private onPushClick(e: egret.TouchEvent) {
        var newGamePlay: PushGameScene = new PushGameScene();
        this.addChild(newGamePlay);
    }

    private onPPYClick(e: egret.TouchEvent) {
        var newGamePlay: ShiguanGameScene = new ShiguanGameScene();
        this.addChild(newGamePlay);
    }
}