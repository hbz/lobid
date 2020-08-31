<?php
$url = $_GET['url'];

if(strpos($url,".ico") || strpos($url,".png")) {
    header("Content-Type: image/png");
} else {
        if(strpos($url,".jpg")) {
        header("Content-Type: image/jpg");
        } else  {
                if(strpos($url,".gif")) {
                        header("Content-Type: image/gif");
                }
         }
}
readfile(str_replace(" ", "%20", $url));
?>

