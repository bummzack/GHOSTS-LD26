var FailScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		Scene.call(this);
		var game = Core.instance;
		var bg = new Sprite(game.width, game.height);
		bg.image = game.assets["assets/died.png"];
		this.addChild(bg);
		ghosts.attempts++;

		var handler = function(e){
			var core = enchant.Core.instance;
			core.removeEventListener(enchant.Event.INPUT_START, handler);
			core.removeEventListener(enchant.Event.A_BUTTON_DOWN, handler);
			core.replaceScene(new GameScene());
		};

		game.addEventListener(enchant.Event.A_BUTTON_DOWN, handler);
		game.addEventListener(enchant.Event.INPUT_START, handler);
	}
});