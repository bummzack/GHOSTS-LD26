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
			game.replaceScene(new IntroScene());
		});
	}
});