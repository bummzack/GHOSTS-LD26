#!/usr/bin/php
<?php 
define('DS', DIRECTORY_SEPARATOR);
define('ASSET_FOLDER', realpath(__DIR__ . DS . '..' . DS . 'assets'));
define('SRC_FOLDER', ASSET_FOLDER . DS . 'levelsrc');
define('OUT_FOLDER', ASSET_FOLDER . DS . 'levelmap');
define('GHOST_COLOR', 0xff0000);
define('HERO_COLOR', 0x006600);
define('EXIT_COLOR', 0x00ff00);

$fileList = array();
if (is_dir(SRC_FOLDER)) {
	if ($handle = opendir(SRC_FOLDER)) {
		while (($file = readdir($handle)) !== false) {
			if(preg_match('/\.png$/', $file)){
				$fileList[] = $file;
			}
		}
		closedir($handle);
	} else {
		die('UNABLE TO CREATE LEVEL FOLDER HANDLE');
	}
} else {
	die('LEVEL FOLDER DOES NOT EXIST');
}

if(count($fileList) == 0){
	die('NO FILES TO PROCESS');
}

function processImage($img, $outname){
	$wi = imagesx($img);
	$he = imagesy($img);
	$out = imagecreatetruecolor($wi, $he);
	$scale = 0xffffff / (ceil(sqrt($wi * $wi + $he * $he) * 0.5) + 1);
	$data = array(
		'start' => null,
		'ghosts' => array(),
		'exit' => null,
		'scale' => $scale
	);
	for($y = 0; $y < $he; $y++){
		for($x = 0; $x < $wi; $x++){
			$c = imagecolorat($img, $x, $y);
			
			if($c == GHOST_COLOR){
				$data['ghosts'][] = array($x, $y);
			} else if($c == HERO_COLOR){
				$data['start'] = array($x, $y);
			} else if ($c == EXIT_COLOR){
				$data['exit'] = array($x, $y);
			}
			
			$b = $c & 0xff;
			if($b == 255){
				imagesetpixel($out, $x, $y, 0);
				continue;
			}
			$bwi = 3;
			$found = $wi * $wi + $he * $he;
			while(true){
				$off = floor($bwi * 0.5);
				$c1 = $c2 = $c3 = $c4 = 0;
				for($i = 0; $i < $bwi; $i++){
					$v = -$off + $i;
					$c1 = imagecolorat($img, $x + $v, $y + $off) & 0xff;
					$c2 = imagecolorat($img, $x + $v, $y - $off) & 0xff;
					if($i > 0 && $i + 1 < $bwi){
						$c3 = imagecolorat($img, $x + $off, $y + $v) & 0xff;
						$c4 = imagecolorat($img, $x - $off, $y + $v) & 0xff;
					}
					if($c1 >= 255 || $c2 >= 255 || $c3 >= 255 || $c4 >= 255){
						$found = min($off * $off + $v * $v, $found);
					}
				}
				if($off * $off >= $found){
					break;
				}
				$bwi += 2;
			}
			imagesetpixel($out, $x, $y, floor(sqrt($found) * $scale));
		}
	}
	$outfile = OUT_FOLDER . DS . $outname;
	$js = '{ var ldata = ghosts.leveldata || []; ldata.push({ "name": "assets/levelmap/'. $outname . '", "data" : '. json_encode($data) .'}); };';
	file_put_contents(str_replace('.png', '.js', $outfile), $js);
	imagepng($out, $outfile);
}

foreach($fileList as $file){
	$gd = imagecreatefrompng(SRC_FOLDER . DS . $file);
	if($gd === false){
		continue;
	}
	$outfile = OUT_FOLDER . DS . $file;
	if(!file_exists($outfile)){
		processImage($gd, $file);
	}
}