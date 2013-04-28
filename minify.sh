#!/bin/bash

YUI="$YUIPATH/yuicompressor-2.4.jar"
DIR=$(dirname $0)

cat $DIR/assets/levelmap/*.js > "$DIR/metadata.js"

cd $DIR
cat "$DIR/src/globals.js" \
	"$DIR/src/Enemy.js" \
	"$DIR/src/FailScene.js" \
	"$DIR/src/GameScene.js" \
	"$DIR/src/IntroScene.js" \
	"$DIR/src/WellDoneScene.js" \
	"$DIR/src/EndScene.js" \
	"$DIR/src/MusicPlayer.js" \
	"$DIR/metadata.js" \
	"$DIR/src/main.js" > "$DIR/combined.js"

java -jar $YUI --type js --charset utf-8 -o "$DIR/game.min.js" "$DIR/combined.js"
rm "$DIR/combined.js"
rm "$DIR/metadata.js"