enchant();

window.onload = function() {
	var game = new Core(98, 64);
	game.fps = 12;
	game.scale = 4;
	//game.loadingScene = new LoadScene();
	//game.preload(joesheart.assets);
	game.preload(["assets/levelmap/test.png"]);
	game.addEventListener(enchant.Event.LOAD, function() {
		/*
		// determine whether or not to use autoload
		var useAutoLoad = (
		    joesheart.autoLoadScene && 
		    joesheart.debug && 
		    typeof window[joesheart.autoLoadScene] == "function");
		
		// create the scene to load
		var scene = useAutoLoad ? 
		        eval("new " + joesheart.autoLoadScene + "()") : new StartScene();
		
		 */
		var scene = new TestScene();
		game.pushScene(scene);
	});

	game.start();
	window.scrollTo(0, 0);
};