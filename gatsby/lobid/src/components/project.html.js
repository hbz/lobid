import React from "react";
import md5 from "md5";
import { simpleId, asLinks } from "./helpers.js";

import Header from "./header.html";
import Footer from "./footer.html";
import Publications from "./publications.html";

import "./css/lobid.css";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";

import jsonLdPng from "./images/json-ld.png";

export class Project extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="container">
        <p />
        <Header
          language={this.props.language}
          languageLink={this.props.languageLink}
          languageTooltip={this.props.languageTooltip}
          publications={this.props.publications}
          teamLink={this.props.teamLink}
          contactPointId={this.props.contactPointId}
        />
        <div>
          <div className="page-header">
            <h1>
              {this.props.project.name.label}
              <small>
                {this.props.project.alternateName && this.props.project.alternateName.map(s => <span key={s}> | {s}</span>)}
                <a title="Beschreibung als JSON-LD anzeigen" href={'/project/' + simpleId(this.props.project.id) + '.json'}><img className='json-ld-icon' src={jsonLdPng} alt="JSON-LD" /></a></small>
            </h1>
          </div>

          <div className="row">
            <div className="col-md-9">
              <p className={this.props.project.description.label.length < 400 ? "lead" : "p"}>{this.props.project.description.label}</p>
              <table className="table table-striped table-condensed">
                <thead>
                  <tr><th width="20%" /><th width="80%" /></tr>
                </thead>
                <tbody>
                  <tr><td>Website</td><td><a href={this.props.project.url || this.props.project.id}>{this.props.project.url || this.props.project.id}</a></td></tr>
                  {this.props.project.endDate && <tr><td>Abgeschlossen</td><td>{this.props.project.endDate}</td></tr>}
                  {asLinks("hasPart", this.props.project, this.props)}
                  {asLinks("isBasedOn", this.props.project, this.props)}
                  {asLinks("isRelatedTo", this.props.project, this.props)}
                  {asLinks("enhances", this.props.project, this.props)}
                  {asLinks("result", this.props.project, this.props)}
                </tbody>
                <tfoot />
              </table>
            </div>
            <div className="col-md-3">
              <img alt={this.props.project.name.label} id="index-image" src={this.props.project.image || `https://gravatar.com/avatar/${md5(this.props.project.id)}?s=300&d=identicon`} />
            </div>
          </div>
          <Publications pubs={this.props.pubs} publications={this.props.publications} />
          <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy} />
        </div>
      </div>
    );
  }
}
