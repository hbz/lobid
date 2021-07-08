export function simpleProductId(url) {
    return url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
}

export function simpleProjectId(url) {
    return url.slice(url.lastIndexOf('/')+1);
}
