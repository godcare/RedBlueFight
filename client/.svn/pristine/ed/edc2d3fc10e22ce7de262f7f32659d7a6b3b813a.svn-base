class ShiguanGameScene extends eui.Component implements eui.UIComponent {
	public constructor() {
		super();
		this.skinName = "resource/assets/Scenes/ShiguanGameScene.exml";
	}
	public Top0: eui.Image;
	public Top1: eui.Image;
	public Top2: eui.Image;
	public Top3: eui.Image;
	public Top4: eui.Image;
	public Top5: eui.Image;
	public Top6: eui.Image;
	public Top7: eui.Image;
	public Top8: eui.Image;
	public Top9: eui.Image;
	public Bottom0: eui.Image;
	public Bottom1: eui.Image;
	public Bottom2: eui.Image;
	public Bottom3: eui.Image;
	public Bottom4: eui.Image;
	public Bottom5: eui.Image;
	public Bottom6: eui.Image;
	public Bottom7: eui.Image;
	public Bottom8: eui.Image;
	public Bottom9: eui.Image;

	public BlueLeft: eui.Image;
	public BlueRight: eui.Image;
	public RedLeft: eui.Image;
	public RedRight: eui.Image;

	public RedBall: eui.Image;
	public RedShadow: eui.Image;
	public BlueBall: eui.Image;
	public BlueShadow: eui.Image;
	public RedOver: eui.Group;
	public BlueOver: eui.Group;
	public RedRetry: eui.Image;
	public RedMenu: eui.Image;
	public BlueRetry: eui.Image;
	public BlueMenu: eui.Image;

	public CloseY: number = 665;//关闭时Y坐标
	public TopOriginalY: number = 600;//默认顶部Y坐标
	public BottomOriginalY: number = 730;//默认底部Y坐标
	public SafeTopCloseY: number = 635;//关闭时安全的顶部Y坐标
	public SafeBottomCloseY: number = 695;//关闭时安全的底部Y坐标
	public TopSafeY: number = 570;//安全的顶部Y坐标
	public BottomSafeY: number = 760;//安全的底部Y坐标
	public RedScore: number = 0;
	public BlueScore: number = 0;
	public MaxShakeTimes = 40;//摇晃次数
	public ShakeTimes = 0;//已经摇晃次数
	public ShakeIndex = -1;
	public BlueX: number = 6;
	public RedX: number = 3;
	public isGameOn: boolean = false;
	public isGameOver: boolean = false;
	public TopPipes: Array<eui.Image> = new Array<eui.Image>();
	public BottomPipes: Array<eui.Image> = new Array<eui.Image>();
	public SafeXArray: Array<number> = [-1, -1];
	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}


	protected childrenCreated(): void {
		super.childrenCreated();

		this.Init();
	}

	private Init(): void {
		this.TopPipes = [this.Top0, this.Top1, this.Top2, this.Top3, this.Top4, this.Top5, this.Top6, this.Top7, this.Top8, this.Top9];
		this.BottomPipes = [this.Bottom0, this.Bottom1, this.Bottom2, this.Bottom3, this.Bottom4, this.Bottom5, this.Bottom6, this.Bottom7, this.Bottom8, this.Bottom9];
		this.RedLeft.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedLeft, this);
		this.RedRight.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRedRight, this);
		this.BlueLeft.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueLeft, this);
		this.BlueRight.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBlueRight, this);
		this.RedLeft.addEventListener(egret.TouchEvent.TOUCH_END, this.onRedLeftRelease, this);
		this.RedRight.addEventListener(egret.TouchEvent.TOUCH_END, this.onRedRightRelease, this);
		this.BlueLeft.addEventListener(egret.TouchEvent.TOUCH_END, this.onBlueLeftRelease, this);
		this.BlueRight.addEventListener(egret.TouchEvent.TOUCH_END, this.onBlueRightRelease, this);
		this.RedBall.visible = false;
		this.RedShadow.visible = false;
		this.BlueBall.visible = false;
		this.BlueShadow.visible = false;
		this.RedLeft.visible = false;
		this.RedRight.visible = false;
		this.BlueLeft.visible = false;
		this.BlueRight.visible = false;
		var i = 0;
		for (i = 0; i < 10; i++) {
			this.TopPipes[i].y = this.CloseY;
			this.BottomPipes[i].y = this.CloseY;
		}
		egret.setTimeout(this.GamePrepareAnimation, this, 1000);
	}


	private GamePrepareAnimation() {
		if (!this.isGameOver) {
			this.SafeXArray[0] = this.GetSafetX();
			this.SafeXArray[1] = this.GetSafetX();
			this.RedBall.visible = false;
			this.RedShadow.visible = false;
			this.BlueBall.visible = false;
			this.BlueShadow.visible = false;
			var i: number = 0;
			for (i = 0; i < 10; i++) {
				var ttw = egret.Tween.get(this.TopPipes[i]);
				var btw = egret.Tween.get(this.BottomPipes[i]);
				if (i == this.SafeXArray[0] || i == this.SafeXArray[1]) {
					ttw.to({ "y": this.TopSafeY }, 500);
					btw.to({ "y": this.BottomSafeY }, 500);
				}
				else {
					ttw.to({ "y": this.TopOriginalY }, 500);
					btw.to({ "y": this.BottomOriginalY }, 500);
				}
			}
			if (!this.isGameOn) {
				this.isGameOn = true;
				egret.setTimeout(this.ShowGameCountDown, this, 500);
				egret.setTimeout(this.onRoundStart, this, 4500);
			}
			else {
				egret.setTimeout(this.onRoundStart, this, 500);
			}
		}
		else {
			this.onGameOver();
		}
	}

	protected onRoundStart() {
		this.RedBall.scaleX = 1;
		this.RedBall.scaleY = 1;
		this.RedShadow.scaleX = 1;
		this.RedShadow.scaleY = 1;
		this.SetBallPosition(this.RedBall, this.RedShadow, this.RedX, false);
		this.BlueBall.scaleX = 1;
		this.BlueBall.scaleY = 1;
		this.BlueShadow.scaleX = 1;
		this.BlueShadow.scaleY = 1;
		this.SetBallPosition(this.BlueBall, this.BlueShadow, this.BlueX, true);
		this.BlueBall.visible = true;
		this.BlueShadow.visible = true;
		this.RedBall.visible = true;
		this.RedShadow.visible = true;
		this.RedLeft.visible = true;
		this.RedRight.visible = true;
		this.BlueLeft.visible = true;
		this.BlueRight.visible = true;
		egret.setTimeout(this.StartShake, this, 500);
	}

	private SetBallPosition(Ball: eui.Image, Shadow: eui.Image, xIndex: number, IsBallOnTop: boolean): void {
		if (IsBallOnTop) {
			Ball.x = this.TopPipes[xIndex].x;
			Ball.y = this.TopPipes[xIndex].y;
			Shadow.x = this.BottomPipes[xIndex].x;
			Shadow.y = this.BottomPipes[xIndex].y;
		}
		else {
			Shadow.x = this.TopPipes[xIndex].x;
			Shadow.y = this.TopPipes[xIndex].y;
			Ball.x = this.BottomPipes[xIndex].x;
			Ball.y = this.BottomPipes[xIndex].y;
		}
	}

	private StartShake(): void {
		this.ShakeTimes += 1;
		if (this.ShakeTimes <= this.MaxShakeTimes) {
			var offset = (Math.random() * 2 + 2) * this.ShakeIndex;
			this.ShakeIndex *= -1;
			var i = 0;

			for (i = 0; i < 10; i++) {
				var ttw = egret.Tween.get(this.TopPipes[i]);
				ttw.to({ "y": this.TopPipes[i].y + offset }, 50);
				var btw = egret.Tween.get(this.BottomPipes[i]);
				btw.to({ "y": this.BottomPipes[i].y + offset }, 50);
				var rbtw = egret.Tween.get(this.RedBall);
				rbtw.to({ "y": this.BottomPipes[this.RedX].y + offset }, 50);
				var rstw = egret.Tween.get(this.RedShadow);
				rstw.to({ "y": this.TopPipes[this.RedX].y + offset }, 50);
				var bbtw = egret.Tween.get(this.BlueBall);
				bbtw.to({ "y": this.TopPipes[this.BlueX].y + offset }, 50);
				var bstw = egret.Tween.get(this.BlueShadow);
				bstw.to({ "y": this.BottomPipes[this.BlueX].y + offset }, 50);
			}
			egret.setTimeout(this.StartShake, this, 50);
		}
		else {
			this.ShakeTimes = 0;
			this.StartClose();
		}
	}
	private StartClose(): void {
		this.RedShadow.visible = false;
		this.BlueShadow.visible = false;
		this.RedLeft.visible = false;
		this.RedRight.visible = false;
		this.BlueLeft.visible = false;
		this.BlueRight.visible = false;
		var i = 0;

		for (i = 0; i < 10; i++) {
			var ttw = egret.Tween.get(this.TopPipes[i]);
			var btw = egret.Tween.get(this.BottomPipes[i]);

			if (this.SafeXArray[0] == i || this.SafeXArray[1] == i) {
				ttw.to({ "y": this.SafeTopCloseY }, 100);
				btw.to({ "y": this.SafeBottomCloseY }, 100);
			}
			else {
				ttw.to({ "y": this.CloseY }, 100);
				btw.to({ "y": this.CloseY }, 100);
			}
		}
		var rbtw = egret.Tween.get(this.RedBall);
		var bbtw = egret.Tween.get(this.BlueBall);
		if (this.RedX == this.SafeXArray[0] || this.RedX == this.SafeXArray[1]) {
			rbtw.to({ "y": this.SafeBottomCloseY }, 100)
			this.RedScore += 1;
		}
		else {
			rbtw.to({ "y": this.CloseY, "scaleY": 0.1 }, 100)
		}
		if (this.BlueX == this.SafeXArray[0] || this.BlueX == this.SafeXArray[1]) {
			bbtw.to({ "y": this.SafeTopCloseY }, 100)
			this.BlueScore += 1;
		}
		else {
			bbtw.to({ "y": this.CloseY, "scaleY": 0.1 }, 100)
		}
		if (this.RedScore != this.BlueScore) {
			this.isGameOver = true;
		}
		else {
			this.isGameOver = false;
		}
		egret.setTimeout(this.GamePrepareAnimation, this, 1500);



	}
	protected onGameOver(): void {
		this.RedOver.visible = true;
		this.BlueOver.visible = true;

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
			this.parent.addChild(new ShiguanGameScene);
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
	private ShowGameCountDown() {
		var countDownObj: CountDownUtility = new CountDownUtility();
		this.addChild(countDownObj);

	}

	private GetSafetX(): number {
		var result = -1;

		while (result = -1) {
			var random = Math.random();
			random = (0 + Math.floor(random * 10));
			if (random == this.RedX || random == this.BlueX || random == this.SafeXArray[0]) {
				result = -1;
			}
			else {
				result = random;
				break;
			}
		}
		return result;
	}


	private getRandomInt(min: number, max: number): number {
		var Range = max - min;
		var Rand = Math.random();
		return (min + Math.round(Rand * Range));
	}

	private onRedRightRelease(e: egret.TouchEvent) {
		this.RedRight.source = "resource/Images/Space_Button_1_0.png";
	}
	private onRedLeftRelease(e: egret.TouchEvent) {
		this.RedLeft.source = "resource/Images/Space_Button_1_0.png";
	}
	private onBlueRightRelease(e: egret.TouchEvent) {
		this.BlueRight.source = "resource/Images/Space_Button_2_0.png";
	}
	private onBlueLeftRelease(e: egret.TouchEvent) {
		this.BlueLeft.source = "resource/Images/Space_Button_2_0.png";
	}

	private onRedRight(e: egret.TouchEvent) {
		this.RedRight.source = "resource/Images/Space_Button_1_1.png";

		if ((this.RedX + 1) == this.BlueX) {
			if (this.BlueX < 9) {
				this.RedX += 2;
			}

		}
		else {
			this.RedX += 1;
		}
		if (this.RedX > 9) {
			this.RedX = 9;
		}
		this.SetBallPosition(this.RedBall, this.RedShadow, this.RedX, false);
	}

	private onRedLeft(e: egret.TouchEvent) {
		this.RedLeft.source = "resource/Images/Space_Button_1_1.png";
		if ((this.RedX - 1) == this.BlueX) {
			if (this.BlueX > 0) {
				this.RedX -= 2;
			}

		}
		else {
			this.RedX -= 1;
		}
		if (this.RedX < 0) {
			this.RedX = 0;
		}
		this.SetBallPosition(this.RedBall, this.RedShadow, this.RedX, false);
	}

	private onBlueRight(e: egret.TouchEvent) {
		this.BlueRight.source = "resource/Images/Space_Button_1_1.png";
		if ((this.BlueX + 1) == this.RedX) {
			if (this.RedX < 9) {
				this.BlueX += 2;
			}

		}
		else {
			this.BlueX += 1;
		}
		if (this.BlueX > 9) {
			this.BlueX = 9;
		}
		this.SetBallPosition(this.BlueBall, this.BlueShadow, this.BlueX, true);
	}

	private onBlueLeft(e: egret.TouchEvent) {
		this.BlueLeft.source = "resource/Images/Space_Button_1_1.png";
		if ((this.BlueX - 1) == this.RedX) {
			if (this.RedX > 0) {
				this.BlueX -= 2;
			}

		}
		else {
			this.BlueX -= 1;
		}
		if (this.BlueX < 0) {
			this.BlueX = 0;
		}
		this.SetBallPosition(this.BlueBall, this.BlueShadow, this.BlueX, true);
	}
}