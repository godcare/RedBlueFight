class PushGameScene extends eui.Component implements eui.UIComponent {
	public PowerOffset: number = 0;//双方力量差距
	public OriginalY: number = 115;//默认中间Y点坐标
	public ForceDownRate: number = 10;//力量衰减参数
	public RedForce: number = 0;//红色力量
	public BlueForce: number = 0;//蓝色力量
	public RedBall: eui.Image;
	public BlueBall: eui.Image;
	public RedRetry: eui.Image;
	public RedMenu: eui.Image;
	public BlueRetry: eui.Image;
	public BlueMenu: eui.Image;
	public AddForceRate: number = 3;
	public BlueLoseY: number = -150;
	public RedLoseY: number = 1466;
	public IsOver: boolean = false;
	public Winner: string = "None";
	public RedOver: eui.Group;
	public BlueOver: eui.Group;
	private LastFrameTimer: number = 0;//一开始的帧时间
	private DeltaTimer: number = 0;//距离上一帧的时间
	private CountDown = 4;
	public constructor() {
		super();
		this.skinName = "resource/assets/Scenes/PushGameScene.exml";
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();
		this.InitScene();
		egret.setTimeout(this.CountDownAnimation, this, 2000);

	}

	private InitScene(): void {
		var rtw = egret.Tween.get(this.RedBall);
		var btw = egret.Tween.get(this.BlueBall);
		rtw.to({ "scaleX": 1, "scaleY": 1 }, 500).wait(500).to({ "y": 1179 }, 500);
		btw.to({ "scaleX": 1, "scaleY": 1 }, 500).wait(500).to({ "y": 155 }, 500);
	}
	private CountDownAnimation(): void {
		var countDownObj: CountDownUtility = new CountDownUtility();
		this.addChild(countDownObj);
		egret.setTimeout(this.GamePrepare, this, 4000);
	}
	private GamePrepare(): void {
		this.RedBall.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedTouch, this);
		this.BlueBall.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueTouch, this);
		this.BlueBall.addEventListener(egret.TouchEvent.TOUCH_END, this.onBlueRelease, this);
		this.RedBall.addEventListener(egret.TouchEvent.TOUCH_END, this.onRedRelease, this);
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
		this.LastFrameTimer = egret.getTimer();
		this.RedOver.visible = false;
		this.BlueOver.visible = false;
	}

	private onEnterFrame(e: egret.Event) {
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
	}


	protected onGameOver(): void {
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

	}
	private onRedResetClick(e: egret.TouchEvent) {
		this.RedRetry.source = "resource/Images/UI_StartOverButton_1.png";
		this.onResetClick();
	}

	private onBlueResetClick(e: egret.TouchEvent) {
		this.BlueRetry.source = "resource/Images/UI_StartOverButton_1.png";
		this.onResetClick();
	}

	private onRedMenuClick(e: egret.TouchEvent) {
		this.RedMenu.source = "resource/Images/UI_MainButton_1.png";
		this.onMenuClick();
	}

	private onBlueMenuClick(e: egret.TouchEvent) {
		this.BlueMenu.source = "resource/Images/UI_MainButton_1.png";
		this.onMenuClick();
	}
	private onResetClick() {
		//把按钮移动回去
		var rtw = egret.Tween.get(this.RedOver);
		rtw.to({ y: 1450 }, 800);
		var btw = egret.Tween.get(this.BlueOver);
		btw.to({ y: -150 }, 800);
		egret.setTimeout(function () {
			this.parent.addChild(new PushGameScene);
			this.parent.removeChild(this);
		}, this, 800);
	}

	private onMenuClick() {
		var rtw = egret.Tween.get(this.RedOver);
		rtw.to({ y: 1450 }, 800);
		var btw = egret.Tween.get(this.BlueOver);
		btw.to({ y: -150 }, 800);
		egret.setTimeout(function () { this.parent.removeChild(this); }, this, 800);

	}

	private onRedTouch(e: egret.TouchEvent) {
		this.RedForce += this.AddForceRate;
		this.RedBall.source = "resource/Images/PushOut_Ball_1_1.png";
		console.log("red push" + this.RedForce);

	}

	private onBlueTouch(e: egret.TouchEvent) {

		this.BlueForce += this.AddForceRate;
		this.BlueBall.source = "resource/Images/PushOut_Ball_2_1.png";
		console.log("blue push" + this.BlueForce);
	}

	private onRedRelease(e: egret.TouchEvent) {
		this.RedBall.source = "resource/Images/PushOut_Ball_1_0.png";
	}
	private onBlueRelease(e: egret.TouchEvent) {
		this.BlueBall.source = "resource/Images/PushOut_Ball_2_0.png";
	}

}