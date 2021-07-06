export function simpleId(url) {
    return url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
}
