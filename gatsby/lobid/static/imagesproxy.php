<?php
        $url = $_GET['url'];
        $url=str_replace(" ", "%20", $url);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: text/xml","User-Agent: imagesproxy/0.2 (https://lobid.org/)"));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $filename = basename($url);

        switch (true) {
                case (stripos($filename,".ico") || stripos($filename,".png")):
                        $ctype="image/png";
                        break;
                case (stripos($filename,".jpg") || stripos($filename,".jpeg")):
                        $ctype="image/jpg";
                        break;
                case (stripos($filename,".gif")):
                        $ctype="image/gif";
                        break;
                case (stripos($filename,".svg")):
                        $ctype="image/svg+xml";
                        break;
                default:
                        $ctype="";
        }

        header('Content-type: ' . $ctype);
        echo $output = curl_exec($ch);
        curl_close($ch); 
?>

