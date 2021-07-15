export function simpleId(url) {
    return url.slice(url.lastIndexOf("/") + 1);
}

export function stripLobidOrg(url) {
    return url.replace(/https?:\/\/lobid.org\//, '/');
}
