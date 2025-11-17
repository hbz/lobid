<?php

        $url = $_GET['url'] ?? '';

        if (!$url) {
            http_response_code(400);
            echo "No URL specified.";
            exit;
        }

        $allowedDomains = [
            'commons.wikimedia.org',
            'upload.wikimedia.org',
            'www.deutsche-digitale-bibliothek.de',
            'www.wikidata.org',
            'en.wikipedia.org',
            'de.wikipedia.org',
            'viaf.org',
            'www.loc.gov',
            'portal.dnb.de',
            'www.gf-franken.de',
            'www.deutsche-biographie.de',
            'www.archivportal-d.de',
            'kalliope-verbund.info',
            'www.portraitindex.de/',
            'lobid.org'
        ];

        $parsedUrl = parse_url($url);
        $host = $parsedUrl['host'] ?? '';

        if (!in_array($host, $allowedDomains)) {
            http_response_code(403);
            echo "Access to the specified domain is not allowed.";
            exit;
        }

        // encode the URL
        $url = implode("/", array_map("rawurlencode", explode("/", $url)));
        // restore the colon of the protocol
        $positionOfColon = strpos($url,"%");
        $url= substr_replace($url,":",$positionOfColon,3);
        // restore the query Parameter
	$positionOfQueryParameter = strrpos($url,"%3F");
	if ($positionOfQueryParameter !== false) {
        	$url= substr_replace($url,"?",$positionOfQueryParameter,3);
        	// restore the
        	$positionOfEqual = strrpos($url,"%3D", $positionOfQueryParameter);
        	$url= substr_replace($url,"=",$positionOfEqual,3);
	}

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

