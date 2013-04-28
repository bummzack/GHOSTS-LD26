var Enemy = enchant.Class.create(enchant.Sprite, {
	lightMap : null,
	sound: null,
	initialize: function(wi, he, light, target){
		Sprite.call(this, wi, he);
		this.lightMap = light;
		this.visible = false;
		this.sound = Core.instance.assets["assets/scream" + (ghosts.useOgg ? ".ogg" : ".mp3")];
		var soundPlayed = false;
		this.addEventListener(Event.ENTER_FRAME, function(e){
			var px = this.lightMap.getPixel(this.x, this.y);
			if(px[0] > 0){
				this.visible = true;
				
				if(!soundPlayed){
					this.sound.play();
					soundPlayed = true;
				}
				
				var dx = this.x - target.x + 1;
				var dy = this.y - target.y + 1;
				
				if(Math.abs(dx) > Math.abs(dy) || dy == 0){
					if(dx > 0){
						this.x -= 1;
					} else if (dx < 0){
						this.x += 1;
					}
				} else {
					if(dy > 0){
						this.y -= 1;
					} else if(dy < 0){
						this.y += 1;
					}
				}
				
				if(Math.abs(this.x - target.x + 1) <= 1 && Math.abs(this.y - target.y + 1) <= 1){
					window.console.log("ARGH");
					Core.instance.replaceScene(new FailScene());
				}
			} else {
				this.visible = false;
				soundPlayed = false;
			}
		});
		
		this.addEventListener(Event.REMOVED, function(){
			this.clearEventListener(Event.REMOVED);
			this.clearEventListener(Event.ENTER_FRAME);
		});
	}
});