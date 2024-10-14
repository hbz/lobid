<?php

        $url = $_GET['url'];
        // encode the URL
        $url = implode("/", array_map("rawurlencode", explode("/", $url)));
        // restore the colon of the protocol
        $positionOfColon = strpos($url,"%");
        $url= substr_replace($url,":",$positionOfColon,3);
        // restore the query Parameter
        $positionOfQueryParameter = strrpos($url,"%3F");
        $url= substr_replace($url,"?",$positionOfQueryParameter,3);
        // restore the
        $positionOfEqual = strrpos($url,"%3D", $positionOfQueryParameter);
        $url= substr_replace($url,"=",$positionOfEqual,3);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: text/xml","User-Agent: imagesproxy/0.2 (https://lobid.org/)"));

        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $filename = basename($url);

        switch (true) {
                case (stripos($filename,".ico") || stripos($filename,".png") || stripos($filename,".svg?width=")):
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
        echo curl_exec($ch);
        curl_close($ch);
?>

