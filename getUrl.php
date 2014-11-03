<?php
/*
 * Main Program
 */
if(isset($_GET["url"]) && isset($_GET["translator"])){
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $_GET["url"]);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
	//echo curl_exec($ch);
	$result = curl_exec($ch);
	curl_close ($ch);
	if(!is_null($result)){
		switch($_GET["translator"]){
			case "yoraikun":
				echo parseYoraikun($result.'');
				break;
			case "epithetic":
				echo parseEpithetic($result.'');
				break;
			case "bakahou":
				echo parseBakahou($result.'');
				break;
			case "anontranslator":
				echo parseAnonTranslator($result.'');
				break;
			case "baka-tsuki":
				echo parseBakaTsuki($result.'');
				break;
			case "anonpastebin":
				echo parseAnonPasteBin($result.'');
				break;
		}
		//echo $result;
	}
	else{
		echo "<center><h3 style=\"color:red;\">Url is not avaialbe or there is no content or you have no connection</h3></center>";
	}
}
else{
	echo "<center><h3 style=\"color:red;\">No url was specified or translator</h3></center>";
}


/*
 * Translator Parsers
 */
function parseYoraikun($html){
	$string = explode('<div class="entry-content">',$html);
	$string = explode('<div id="jp-post-flair" class="sharedaddy sd-like-enabled sd-sharing-enabled">',$string[1]);
	return $string[0];
}

function parseBakaTsuki($html){
	$string = explode('	<div id="mw-content-text" lang="en" dir="ltr" class="mw-content-ltr">',$html);
	$string = explode('<h2><span class="mw-headline" id="Translator',$string[1]);
	return $string[0];
}

function parseEpithetic($html){
	$string = explode('<div class="entry-content">',$html);
	$string = explode('<div id="jp-post-flair" class="sharedaddy sd-like-enabled sd-sharing-enabled">',$string[1]);
	return $string[0];
}

function parseBakahou($html){
	$string = explode('<div class="entry-content clear">',$html);
	$string = explode('<div id="jp-post-flair" class="sharedaddy sd-like-enabled sd-sharing-enabled">',$string[1]);	
	return $string[0]; 
}

function parseAnonTranslator($html){
	$string = explode('<div class="entry-content">',$html);
	$string = explode('<div id="jp-post-flair" class="sharedaddy sd-like-enabled sd-sharing-enabled">',$string[1]);
	return $string[0];
}

function parseAnonPasteBin($html){
	$string = explode('<ol>',$html);
	$string = explode('</ol>',$string[1]);
	return $string[0];
}