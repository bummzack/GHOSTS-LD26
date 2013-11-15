var EndScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		Scene.call(this);
		var game = Core.instance;
		var bg = new Sprite(game.width, game.height);
		bg.image = game.assets["assets/end.png"];
		this.addChild(bg);
		
		var lx = 69;
		var ly = 29;
		var str = ghosts.attempts.toString();
		for(var i = 0, len = str.length; i < len; i++){
			var chr = str.charAt(i);
			var letter = new Sprite(5,5);
			letter.image = game.assets["assets/numbers.png"];
			letter.frame = parseInt(chr);
			letter.x = lx;
			letter.y = ly;
			lx += 6;
			this.addChild(letter);
		}
		
		var slides = ["assets/end.png", "assets/end-2.png"];
		var idx = 0;
		
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
			core.removeEventListener(enchant.Event.A_BUTTON_DOWN, handler);
			core.removeEventListener(enchant.Event.INPUT_START, handler);
			self.clearEventListener(enchant.Event.ENTER_FRAME);
			core.replaceScene(new IntroScene());
		};
		
		game.addEventListener(enchant.Event.A_BUTTON_DOWN, handler);
		game.addEventListener(enchant.Event.INPUT_START, handler);
	}
});