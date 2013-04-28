if(ghosts.useOgg){
	ghosts.assets.push(
        "assets/music.ogg",
        "assets/scream.ogg"
    );
} else {
	ghosts.assets.push(
        "assets/music.mp3",
        "assets/scream.mp3"
    );
};

var MusicPlayer = enchant.Class.create({
    // currently playing sound
    _music: null,
    _repeatInterval: null,
    
    initialize: function(){
        this._music = null;
        return this;
    },
    
    /**
     * Asset name without the file-ending
     * @param asset the asset to play (no ending!)
     * @param loop whether or not to loop the music
     */
    play: function(asset, loop){
        this.stop();
        var file = asset + (ghosts.useOgg ? ".ogg" : ".mp3");
        if(file in Core.instance.assets){
            this._music = Core.instance.assets[file];
            this._music.play();
            var duration = this._music.duration;
            if(!duration && this._music.buffer){
                duration = this._music.buffer.duration;
            }
            if(loop && duration > 0){
                var music = this._music;
                this._repeatInterval = window.setInterval(function(){
                    music.stop();
                    music.play();
                }, Math.round(duration * 1000));
                
            }
        }
        return this;
    },
    
    /**
     * Stop the music
     */
    stop: function(){
        window.clearInterval(this._repeatInterval);
        if(this._music){
            this._music.stop();
        }
        return this;
    },
    
    /**
     * The asset that's currently playing. Use this to access
     * the sound asset and change things like volume
     */
    asset: {
        get: function(){
            return this._music || { volume: 0, play: function(){}, stop: function(){} };
        }
    }
});