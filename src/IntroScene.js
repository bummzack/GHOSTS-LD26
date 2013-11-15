var IntroScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		Scene.call(this);
		var game = Core.instance;
		var bg = new Sprite(game.width, game.height);
		ghosts.attempts = 1;
		ghosts.levelindex = 0;
		var slides = ["assets/intro-1.png", "assets/intro-2.png", "assets/intro-3.png"];
		var idx = 0;
		bg.image = game.assets[slides[idx]];
		this.addChild(bg);
		
		var t = 0;
		var self = this;
		self.addEventListener(enchant.Event.ENTER_FRAME, function(e){
			t += e.elapsed;
			if(t >= 4000){
				idx = (idx + 1) % slides.length;
				bg.image = game.assets[slides[idx]];
				t -= 4000;
			}
		});

		var handler = function(e){
			var core = enchant.Core.instance;
			core.removeEventListener(enchant.Event.INPUT_START, handler);
			core.removeEventListener(enchant.Event.A_BUTTON_DOWN, handler);
			self.clearEventListener(enchant.Event.ENTER_FRAME);
			core.replaceScene(new GameScene());
		};
		
		game.addEventListener(enchant.Event.A_BUTTON_DOWN, handler);
		game.addEventListener(enchant.Event.INPUT_START, handler);
	}
});