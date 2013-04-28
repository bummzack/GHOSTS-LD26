var ghosts = {
	assets: [
 		"assets/died.png",
		"assets/end.png",
		"assets/end-2.png",
		"assets/exit.png", 
		"assets/ghost.png", 
		"assets/intro-1.png",
		"assets/intro-2.png",
		"assets/intro-3.png",
		"assets/numbers.png",
		"assets/welldone.png"
	],
	leveldata : [],
	levelindex: 0,
	attempts: 1,
	musicReady: false,
	useOgg: navigator.userAgent.toLowerCase().match(/(firefox|opera)/) != null,
	loadJS : function(filename) {
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename);
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
};