<?php
        $url = $_GET['url'];
        $url=str_replace(" ", "%20", $url);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: text/xml","User-Agent: imagesproxy/0.2 (https://lobid.org/)"));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $filename = basename($url);

        if(stripos($filename,".ico") || stripos($filename,".png")) {
                $ctype="image/png";
        } else {
                if(stripos($filename,".jpg") || stripos($filename,".jpeg")) {
                        $ctype="image/jpg";
                } else  {
                        if(stripos($filename,".gif")) {
                                $ctype="image/gif";
                        }
                }
        }
        header('Content-type: ' . $ctype);
        echo $output = curl_exec($ch);
        curl_close($ch); 
?>

