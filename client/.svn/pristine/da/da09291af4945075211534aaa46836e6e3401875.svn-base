class CountDownUtility extends eui.Component implements  eui.UIComponent {
	public constructor() {
		super();
		this.skinName = "resource/eui_skins/CountDownUtility.exml";
	}

	public CountNumber:number=4;
	public BlueCountDown:eui.Image;
	public RedCountDown:eui.Image;
	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.CountDownAnimation();
	}
	 
	private CountDownAnimation():void
	{
		this.CountNumber -= 1;
		if(this.CountNumber < 0)
		{
			this.BlueCountDown.visible = false;
			this.RedCountDown.visible = false;
			this.parent.removeChild(this);
			return;
		}
		else
		{
			this.BlueCountDown.source = "resource/Images/UI_ReadyNumber_1_"+this.CountNumber+".png";
			this.RedCountDown.source = "resource/Images/UI_ReadyNumber_0_"+this.CountNumber+".png";
			this.BlueCountDown.anchorOffsetX = this.BlueCountDown.width/2;
			this.BlueCountDown.anchorOffsetY = this.BlueCountDown.height/2;
			this.RedCountDown.anchorOffsetX = this.RedCountDown.width/2;
			this.RedCountDown.anchorOffsetY = this.RedCountDown.height/2;
			this.BlueCountDown.scaleX = 3;
			this.BlueCountDown.scaleY = 3;
			this.RedCountDown.scaleX = 3;
			this.RedCountDown.scaleY = 3;			
			var rtw = egret.Tween.get(this.RedCountDown);
			var btw = egret.Tween.get(this.BlueCountDown);
			rtw.to({"scaleX":1,"scaleY":1},1000,egret.Ease.cubicOut);
			btw.to({"scaleX":1,"scaleY":1},1000,egret.Ease.cubicOut);
			egret.setTimeout(this.CountDownAnimation,this,1000);
		}
	}
}