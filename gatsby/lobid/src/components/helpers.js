import React from "react";

export function simpleId(url) {
    return url.slice(url.lastIndexOf("/") + 1).replace('#!', '');
}

export function stripLobidOrg(url) {
    return url.replace(/https?:\/\/lobid.org\//, '/');
}

export function asLinks(field, entity, props) {
    return entity[field] && <tr><td>{props[field]}</td><td>{entity[field].map((link) =>
        <div key={link.id}>
            <a href={stripLobidOrg(link.id)}>{simpleId(link.id)}</a><br />
        </div>)}
    </td></tr>
}
