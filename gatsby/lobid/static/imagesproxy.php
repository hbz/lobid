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
        'www.portraitindex.de',
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
    $cacheDir = '/srv/www/cache/imagesproxy'; // make sure this directory is writable by the web server and outside web root
    $faviconsCacheDir = $cacheDir . '/favicons';
    $imagesCacheDir = $cacheDir . '/images';
    $logsCacheDir = $cacheDir . '/logs';
    $cacheTTL = 86400; // 24 h
    // logging
    $logFile = $logsCacheDir . '/imagesproxy_access.log';
    function logResult($msg) {
        global $logFile;
        @file_put_contents($logFile, date('Y-m-d H:i:s') . " - $msg\n", FILE_APPEND);
    }
    // extract and sanitize original filename from URL
    $originalName = basename(parse_url($url, PHP_URL_PATH));
    $originalName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
    // favicon detection
    $path = parse_url($url, PHP_URL_PATH);
    $base = strtolower(basename($path));
    $isFavicon = (
        preg_match('/\.ico$/', $base) ||
        preg_match('/^favicon\.(png|svg|ico)$/', $base)
    );
    // choose correct cache path
    $cacheBaseDir = $isFavicon ? $faviconsCacheDir : $imagesCacheDir;
    // file name for cached image: original name + md5 hash of URL
    $cacheFile = $cacheBaseDir . '/' . $originalName . '_' . md5($url);
    // for favicons: no TTL at all
    if ($isFavicon && file_exists($cacheFile)) {
        logResult("CACHE-HIT favicon $cacheFile");
        $imageData = file_get_contents($cacheFile);
    }
    // normal cache flow for non-favicons
    else if (!$isFavicon && file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTTL)) {
        logResult("CACHE-HIT image $cacheFile");
        $imageData = file_get_contents($cacheFile);
    }
    else {
        logResult("CACHE-MISS fetch $url");
        // fetch from remote
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: text/xml","User-Agent: imagesproxy/0.2 (https://lobid.org/)"]);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        // set timeouts, prevent worker being blocked see https://github.com/hbz/lobid-gnd/issues/405
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
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
