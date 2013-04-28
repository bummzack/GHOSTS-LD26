var IntroScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		Scene.call(this);
		var game = Core.instance;
		var bg = new Sprite(game.width, game.height);
		ghosts.attempts = 1;
		var slides = ["assets/intro-1.png", "assets/intro-2.png", "assets/intro-3.png"];
		var idx = 0;
		bg.image = game.assets[slides[idx]];
		this.addChild(bg);
		
		var t = 0;
		this.addEventListener(Event.ENTER_FRAME, function(e){
			t += e.elapsed;
			if(t >= 4000){
				idx = (idx + 1) % slides.length;
				bg.image = game.assets[slides[idx]];
				t -= 4000;
			}
		});
		
		
		this.addEventListener(Event.INPUT_START, function(e){
			this.clearEventListener(Event.INPUT_START);
			this.clearEventListener(Event.ENTER_FRAME);
			game.replaceScene(new GameScene());
		});
	}
});