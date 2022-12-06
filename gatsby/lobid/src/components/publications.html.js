import React from "react"
import { simpleId, stripLobidOrg } from "./helpers.js";
import jsonLdPng from "./images/json-ld.png";

export default class Publications extends React.Component {
  render() {
    return (
      this.props.pubs.length > 0 &&
      <div className="row">
        <div className="col-md-12">
          <p className="lead">{this.props.publications}</p>
          <table className="table table-striped table-condensed">
            <thead>
              <tr><th width="10%" /><th width="57%" /><th width="20%" /><th width="10%" /><th width="3%" /></tr>
            </thead>
            <tbody>
              {this.props.pubs.map(publication =>
                <tr key={publication.id}>
                  <td><small>{publication.datePublished}</small></td>
                  <td><a target="_blank" rel="noopener noreferrer" href={publication.id}>{publication.name.de || publication.name.en || publication.id}</a></td>
                  <td>
                    {publication.about && <small><span className="glyphicon glyphicon-tag" aria-hidden="true"></span>&nbsp;</small>}
                    {publication.about && publication.about.map((a,i) =>
                      <small key={a.id}><span><a href={stripLobidOrg(a.id)}>{simpleId(a.id)}</a>{i < publication.about.length - 1 && ", "}</span></small>
                    )}
                  </td>
                  <td align="right"><small>{publication.type.map(t => t.match(/[A-Z][a-z]+/)[0])}</small></td>
                  <td><a title="Beschreibung als JSON-LD anzeigen" href={publication.fields.jsonFile}><img height="20px" src={jsonLdPng} alt="JSON-LD" /></a></td>
                </tr>
              )}
            </tbody>
            <tfoot />
          </table>
        </div>
      </div>
    )
  }
}