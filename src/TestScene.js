var TestScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
		Scene.call(this);
		this.backgroundColor = "#000000";
		var game = Core.instance;
		var spriteLight = new Sprite(game.width, game.height);
		var wallSprite = new Sprite(game.width, game.height);
		var light = new Surface(game.width, game.height);
		var walls = new Surface(game.width, game.height);
		light.clear();
		walls.clear();
		spriteLight.image = light;
		wallSprite.image = walls;
		
		var asset = game.assets["assets/levelmap/test.png"];
		var map = new Surface(asset.width, asset.height);
		map.draw(asset);
		
		
		var posX = 10;
		var posY = 10;
		var radius = 24;
		var data = map.context.getImageData(0, 0, map.width, map.height);
		var accelX = 0;
		var accelY = 0;
		var t = 0;
		var vx = 0;
		var vy = 0;
		var maxSpeed = 10;
		var accel = 8;
		
		this.addEventListener(Event.UP_BUTTON_DOWN, function(){
			accelY = -1;
		});
		this.addEventListener(Event.DOWN_BUTTON_DOWN, function(){
			accelY = 1;
		});
		this.addEventListener(Event.LEFT_BUTTON_DOWN, function(){
			accelX = -1;
		});
		this.addEventListener(Event.RIGHT_BUTTON_DOWN, function(){
			accelX = 1;
		});
		this.addEventListener(Event.UP_BUTTON_UP, function(){
			accelY = 0;
		});
		this.addEventListener(Event.DOWN_BUTTON_UP, function(){
			accelY = 0;
		});
		this.addEventListener(Event.LEFT_BUTTON_UP, function(){
			accelX = 0;
		});
		this.addEventListener(Event.RIGHT_BUTTON_UP, function(){
			accelX = 0;
		});
		
		var t = 0;
		this.addEventListener(Event.ENTER_FRAME, function(evt){
			/*
			var dt = evt.elapsed * 0.001;
			t += dt;
			if(t >= 0.1){
				var ctx = walls.context;
				ctx.save();
				ctx.globalCompositeOperation = 'destination-out';
				ctx.fillStyle = "rgba(0, 0, 0, .1)";
				ctx.fillRect(0, 0, game.width, game.height);
				ctx.restore();
				//window.console.log("FILL");
				t -= 0.1;
			}
			
			var damp = Math.pow(0.01, dt);
			
			if(accelX != 0){
				vx += accelX * accel * dt;
			} else {
				vx *= damp;
			}
			
			if(accelY != 0){
				vy += accelY * accel * dt;
			} else {
				vy *= damp;
			}
			
			if(vx * vx + vy * vy >= maxSpeed * maxSpeed){
				var len = Math.sqrt(vx * vx + vy * vy);
				vx = vx / len * maxSpeed;
				vy = vy / len * maxSpeed;
			}
			
			var newX = posX + vx * dt;
			var newY = posY + vy * dt;
			
			var c = map.getPixel(Math.floor(newX * 4), Math.floor(newY * 4))[2];
			if(c < 255){
				posX = newX;
				posY = newY;
			}
			
			light.clear();
			radius = Math.min(64, radius + dt * 0.5);
			*/
			
			var ctx = walls.context;
			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillStyle = "rgba(0, 0, 0, .05)";
			ctx.fillRect(0, 0, game.width, game.height);
			ctx.restore();
			
			var newX = posX;
			var newY = posY;
			if(accelX != 0){
				newX += accelX;
			}
			
			if(accelY != 0){
				newY += accelY;
			}
			var px = map.getPixel(Math.round(newX * 2), Math.round(newY * 2));
			var c = (px[0] << 16) | (px[1] << 8) | px[2];
			if(c > 0){
				posX = newX;
				posY = newY;
			}
			light.clear();
			calcLight(posX, posY, Math.round(radius), data, light, walls);
		});
		
		this.addChild(wallSprite);
		this.addChild(spriteLight);
		calcLight(posX, posY, radius, data, light, walls);
	}
});

var calcLight = function(x, y, r, src, dst, walls){
	var x0 = Math.max(0, x - r);
	var y0 = Math.max(0, y - r);
	var x1 = Math.min(dst.width, x + r);
	var y1 = Math.min(dst.height, y + r);
	
	var rsquared = r * r;
	var out = dst.context.getImageData(0, 0, dst.width, dst.height);
	var scale = src.width / dst.width;
	var pixel = 0;
	
	for(var yp = y0; yp < y1; ++yp){
		for(var xp = x0; xp < x1; ++xp){
			var ox = xp - x;
			var oy = yp - y;
			if(ox * ox + oy * oy > rsquared){
				continue;
			}
			
			pixel = (yp * scale * src.width + xp * scale) * 4;
			var c = ((src.data[pixel] << 16) | (src.data[pixel + 1] << 8) | (src.data[pixel + 2])) / 140985;
			//var c = src.data[(yp * scale * src.width + xp * scale) * 4 + 2];
			
			if((xp == x && yp == y)){
				pixel = (yp * out.width + xp) * 4;
				out.data[pixel] = 255;
				out.data[pixel + 1] = 255;
				out.data[pixel + 2] = 255;
				out.data[pixel + 3] = 255;
				continue;
			}
			
			var rx = (x - xp) * scale;
			var ry = (y - yp) * scale;
			// distance to the light
			var dist = rx * rx + ry * ry;
			var ln = Math.sqrt(dist);
			rx /= ln;
			ry /= ln;
			
			var offset = 0;
			var cp = c == 0 ? 3 * scale : c;
			var tx = xp * scale;
			var ty = yp * scale;
			
			do {
				if(cp == 0){
					break;
				}
				
				offset = cp;
				tx += offset * rx;
				ty += offset * ry;
				
				var dx = tx - xp * scale;
				var dy = ty - yp * scale;
				if(dx * dx + dy * dy > dist){
					pixel = (yp * out.width + xp) * 4;
					var a =  1 - (1 / r * (ln / scale));
					if(c == 0){
						walls.setPixel(xp, yp,a* 255,a* 255,a* 255, 255);
					} 
					out.data[pixel] =  255;
					out.data[pixel + 1] = 255;
					out.data[pixel + 2] = 255;
					out.data[pixel + 3] = a * 255;
					break;
				}
				
				pixel = (Math.round(ty) * src.width + Math.round(tx)) * 4;
				cp = ((src.data[pixel] << 16) | (src.data[pixel + 1] << 8) | (src.data[pixel + 2])) / 140985;
				//cp = src.data[(Math.round(ty) * src.width + Math.round(tx)) * 4 + 2];
				
			} while(offset > 0);
		}
	}
	
	dst.context.putImageData(out, 0, 0);
};