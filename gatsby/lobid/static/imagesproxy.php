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

        // set up cache directory and TTL
        $cacheDir = __DIR__ . '/cache';
        $cacheTTL = 86400; // 24 h
        $cacheMaxSize = 10 * 1024 * 1024 * 1024; // 10 GB

        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }

        // extract and sanitize original filename from URL
        $originalName = basename(parse_url($url, PHP_URL_PATH));
        $originalName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);

        // file name for cached image: original name + md5 hash of URL
        $cacheFile = $cacheDir . '/' . $originalName . '_' . md5($url);

        // delete old cache files older than TTL
        foreach (glob($cacheDir . '/*') as $file) {
            if (filemtime($file) < time() - $cacheTTL) {
                @unlink($file);
            }
        }

        // check total cache size once every 60 seconds
        $checkFile = $cacheDir . '/cache_check.timestamp';
        $doCheck = true;

        // if timestamp exists and is newer than 60 seconds → skip check
        if (file_exists($checkFile)) {
            if (time() - filemtime($checkFile) < 60) {
                $doCheck = false;
            }
        }

        if ($doCheck) {
            // update timestamp *before* the expensive work
            @touch($checkFile);
        
            // enforce maximum cache size (10 GB)
            $cacheFiles = glob($cacheDir . '/*');
            $totalSize = 0;
        
            // calculate total size
            foreach ($cacheFiles as $f) {
                if (is_file($f)) {
                    $totalSize += filesize($f);
                }
            }
        
            // if above limit → delete oldest files first
            if ($totalSize > $cacheMaxSize) {
                usort($cacheFiles, function($a, $b) {
                    return filemtime($a) - filemtime($b);
                });
            
                foreach ($cacheFiles as $f) {
                    if ($totalSize <= $cacheMaxSize) break;
                    if (!is_file($f)) continue;
                
                    $size = filesize($f);
                    @unlink($f);
                    $totalSize -= $size;
                }
            }
        }

        // check if cached file exists and is still valid
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTTL)) {
            $imageData = file_get_contents($cacheFile);
        } else {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: text/xml","User-Agent: imagesproxy/0.2 (https://lobid.org/)"]);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

            $imageData = curl_exec($ch);
            curl_close($ch);
            
            if ($imageData !== false) {
                file_put_contents($cacheFile, $imageData);
            } else {
                http_response_code(404);
                echo "Image not found";
                exit;
            }
        }

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
        echo $imageData;
?>
