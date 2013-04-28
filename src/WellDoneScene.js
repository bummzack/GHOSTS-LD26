var WellDoneScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		Scene.call(this);
		var game = Core.instance;
		var bg = new Sprite(game.width, game.height);
		bg.image = game.assets["assets/welldone.png"];
		this.addChild(bg);
		
		ghosts.levelindex++;
		
		this.addEventListener(Event.INPUT_START, function(e){
			this.clearEventListener(Event.INPUT_START);
			game.replaceScene(new GameScene());
		});
	}
});