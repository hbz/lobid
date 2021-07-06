import React from "react"
import { simpleId } from './helpers.js'

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
              <tr><th width="10%" /><th width="65%" /><th width="12%" /><th width="10%" /><th width="3%" /></tr>
            </thead>
            <tbody>
              {this.props.pubs.map(publication =>
                <tr key={publication.id}>
                  <td><small>{publication.datePublished}</small></td>
                  <td><a href={publication.id}>{publication.name.de || publication.name.en || publication.id}</a></td>
                  <td>{publication.about && publication.about.map(a =>
                    <p key={a.id}><small><span className="glyphicon glyphicon-tag" aria-hidden="true"></span></small>&nbsp;<a href={a.id}>{simpleId(a.id)}</a></p>
                  )}</td>
                  <td align="right"><small><a href={"https://schema.org/" + publication.type}>{publication.type}</a></small></td>
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