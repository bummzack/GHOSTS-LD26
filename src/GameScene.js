var GameScene = enchant.Class.create(enchant.Scene, {
	// current acceleration X
	accelX: 0,
	// current acceleration Y
	accelY: 0,
	// raw map data
	mapData: null,
	// map to game scale
	scale: 1,
	
	/**
	 * Initialization method
	 */
	initialize: function(){
		Scene.call(this);
		var game = Core.instance;
		
		this.backgroundColor = "#000000";
		this._bindInputListeners();
		
		var levelIndex = ghosts.levelindex;
		
		this._buildMapData(levelIndex);
		var metaData = ghosts.leveldata[levelIndex].data;
		
		var radius = 12;
		var t = 0;
		var light = new Sprite(game.width, game.height);
		var walls = new Sprite(game.width, game.height);
		var lightSurface = new Surface(game.width, game.height);
		var wallsSurface = new Surface(game.width, game.height);
		
		light.image = lightSurface;
		walls.image = wallsSurface;
		
		this.addChild(walls);
		this.addChild(light);
		
		var exit = new Sprite(3,3);
		exit.image = game.assets["assets/exit.png"];
		exit.originX = 1;
		exit.originY = 1;
		exit.x = Math.floor(metaData.exit[0] / this.scale);
		exit.y = Math.floor(metaData.exit[1] / this.scale);
		exit.visible = false;
		this.addChild(exit);
		
		var player = new Sprite(1,1);
		player.x = Math.floor(metaData.start[0] / this.scale);
		player.y = Math.floor(metaData.start[1] / this.scale);
		player.backgroundColor = "#ffff66";
		this.addChild(player);
		
		for(var i = 0, len = metaData.ghosts.length; i < len; i++){
			var enemy = new Enemy(3, 3, lightSurface, player);
			enemy.image = game.assets["assets/ghost.png"];
			enemy.x = Math.floor(metaData.ghosts[i][0] / this.scale);
			enemy.y = Math.floor(metaData.ghosts[i][1] / this.scale);
			this.addChild(enemy);
		}
		
		var music = new MusicPlayer();
		music.play("assets/music", true);
		
		this.addEventListener(Event.ENTER_FRAME, function(evt){
			t += evt.elapsed;
			if(t > 2000){
				radius = Math.min(42, radius + 1);
				t -= 2000;
			}
			
			var ctx = wallsSurface.context;
			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillStyle = "rgba(0, 0, 0, .05)";
			ctx.fillRect(0, 0, game.width, game.height);
			ctx.restore();
			
			var newX = player.x;
			var newY = player.y;
			if(this.accelX != 0){
				newX = Math.min(game.width, Math.max(0, newX + this.accelX));
			}
			
			if(this.accelY != 0){
				newY = Math.min(game.height, Math.max(0, newY + this.accelY));
				//newY += this.accelY;
			}
			var c = this.mapData[newX * this.scale][newY * this.scale];
			if(c > 0){
				player.x = newX;
				player.y = newY;
			}
			lightSurface.clear();
			this._calcLight(player.x, player.y, radius, lightSurface, wallsSurface);
			
			var c = lightSurface.getPixel(exit.x, exit.y);
			if(c[0] > 0){
				exit.visible = true;
				if(Math.abs(player.x - exit.x - 1) <= 1 && Math.abs(player.y - exit.y - 1) <= 1){
					this.clearEventListener(Event.ENTER_FRAME);
					if(ghosts.levelindex + 1 == ghosts.leveldata.length){
						game.replaceScene(new EndScene());
					} else {
						game.replaceScene(new WellDoneScene());
					}
				}
			} else {
				exit.visible = false;
			}
		});
		
		this.addEventListener(Event.EXIT, function(){
			music.stop();
			this.clearEventListener(Event.UP_BUTTON_DOWN);
			this.clearEventListener(Event.DOWN_BUTTON_DOWN);
			this.clearEventListener(Event.LEFT_BUTTON_DOWN);
			this.clearEventListener(Event.RIGHT_BUTTON_DOWN);
			this.clearEventListener(Event.UP_BUTTON_UP);
			this.clearEventListener(Event.DOWN_BUTTON_UP);
			this.clearEventListener(Event.LEFT_BUTTON_UP);
			this.clearEventListener(Event.RIGHT_BUTTON_UP);
			
			for(var child in this.childNodes){
				this.removeChild(this.childNodes[child]);
			}
		});
	},
	
	_buildMapData: function(index){
		this.mapData = [];
		var bitmap = Core.instance.assets[ghosts.leveldata[index].name];
		var factor = 1 / ghosts.leveldata[index].data.scale;
		var map = new Surface(bitmap.width, bitmap.height);
		map.draw(bitmap);
		var img = map.context.getImageData(0, 0, map.width, map.height);
		
		for(var x = 0; x < img.width; x++){
			this.mapData.push([]);
			for(var y = 0; y < img.height; y++){
				var i = (y * img.width + x) * 4;
				var c = ((img.data[i] << 16) | (img.data[i + 1] << 8) | (img.data[i + 2])) * factor; 
				this.mapData[x][y] = c;
			}
		}
		
		this.scale = img.width / Core.instance.width;
	},
	
	// bind input listeners
	_bindInputListeners: function(){
		this.addEventListener(Event.UP_BUTTON_DOWN, function(){
			this.accelY = -1;
		});
		this.addEventListener(Event.DOWN_BUTTON_DOWN, function(){
			this.accelY = 1;
		});
		this.addEventListener(Event.LEFT_BUTTON_DOWN, function(){
			this.accelX = -1;
		});
		this.addEventListener(Event.RIGHT_BUTTON_DOWN, function(){
			this.accelX = 1;
		});
		this.addEventListener(Event.UP_BUTTON_UP, function(){
			this.accelY = 0;
		});
		this.addEventListener(Event.DOWN_BUTTON_UP, function(){
			this.accelY = 0;
		});
		this.addEventListener(Event.LEFT_BUTTON_UP, function(){
			this.accelX = 0;
		});
		this.addEventListener(Event.RIGHT_BUTTON_UP, function(){
			this.accelX = 0;
		});
	},
	
	_calcLight : function(x, y, r, dst, walls){
		var x0 = Math.max(0, x - r);
		var y0 = Math.max(0, y - r);
		var x1 = Math.min(dst.width, x + r);
		var y1 = Math.min(dst.height, y + r);
		
		// the map data
		var map = this.mapData;
		
		// light radius
		var rsquared = r * r;
		
		// output buffer
		var out = dst.context.getImageData(0, 0, dst.width, dst.height);
		
		// light map to actual game scale
		var s = this.scale;
		
		
		var pixel = 0;
		
		for(var yp = y0; yp < y1; ++yp){
			for(var xp = x0; xp < x1; ++xp){
				var ox = xp - x;
				var oy = yp - y;
				if(ox * ox + oy * oy > rsquared){
					continue;
				}
				
				var c = map[xp * s][yp * s];
				
				if((xp == x && yp == y)){
					pixel = (yp * out.width + xp) * 4;
					out.data[pixel] = 255;
					out.data[pixel + 1] = 255;
					out.data[pixel + 2] = 255;
					out.data[pixel + 3] = 255;
					continue;
				}
				
				var rx = (x - xp) * s;
				var ry = (y - yp) * s;
				// distance to the light
				var dist = rx * rx + ry * ry;
				var ln = Math.sqrt(dist);
				rx /= ln;
				ry /= ln;
				
				var offset = 0;
				var cp = c == 0 ? 3 * s : c;
				var tx = xp * s;
				var ty = yp * s;
				
				do {
					if(cp == 0){
						break;
					}
					
					offset = cp;
					tx += offset * rx;
					ty += offset * ry;
					
					var dx = tx - xp * s;
					var dy = ty - yp * s;
					if(dx * dx + dy * dy > dist){
						pixel = (yp * out.width + xp) * 4;
						var a =  1 - (1 / r * (ln / s));
						if(c == 0){
							//walls.setPixel(xp, yp,a* 255,a* 255,a* 255, 255);
							walls.setPixel(xp, yp, 127, 127, 127, 255);//Math.round(a * 255));
						} 
						out.data[pixel] =  255;
						out.data[pixel + 1] = 255;
						out.data[pixel + 2] = 255;
						out.data[pixel + 3] = a * 255;
						break;
					}
					
					cp = map[Math.round(tx)][Math.round(ty)];
				} while(offset > 0);
			}
		}
		
		dst.context.putImageData(out, 0, 0);
	}
});