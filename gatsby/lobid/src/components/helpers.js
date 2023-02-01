import React from "react";
import md5 from 'md5';

export function simpleId(url) {
    return url.slice(url.lastIndexOf("/") + 1).replace('#!', '');
}

export function stripLobidOrg(url) {
    return url.replace(/https?:\/\/lobid.org\//, '/');
}

export function asLinks(field, entity, props) {
    return entity[field] && <tr><td>{props[field]}</td><td>{entity[field].map((link) =>
        <div key={link.id}>
            <a href={stripLobidOrg(link.id)}>{simpleId(link.id, link)}</a><br />
        </div>)}
    </td></tr>
}

export function getImage(id, src) {
    return (
        <img src={src || `https://gravatar.com/avatar/${md5(id)}?s=100&d=identicon`}
            alt={id} className="photo"></img>
    );
}

export function getMemberDetails(all, member) {
    // favour jsonId over id if present; jsonId is the replacement for id in gatsby-transformer-json
    return all.filter(m => (m.node.jsonId ? m.node.jsonId : m.node.id) === member.member.id)[0];
}
