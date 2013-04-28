enchant();

window.onload = function() {
	var game = new Core(98, 64);
	game.fps = 12;
	game.scale = 1;

	for(var i = 0, len = ghosts.leveldata.length; i < len; i++){
		ghosts.assets.push(ghosts.leveldata[i].name);
	}
	
	game.preload(ghosts.assets);
	game.addEventListener(enchant.Event.LOAD, function() {
		var scene = new IntroScene();
		game.pushScene(scene);
	});
	
	game.start();
	window.scrollTo(0, 0);
};