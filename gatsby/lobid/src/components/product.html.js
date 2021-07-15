import React from "react";
import md5 from "md5";
import { simpleId } from "./helpers.js";

import Header from "./header.html";
import Footer from "./footer.html";
import Publications from "./publications.html";

import "./css/lobid.css";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";

import jsonLdPng from "./images/json-ld.png";

export class Product extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  asLinks(field) {
    return this.props.product[field] && <tr><td>{this.props[field]}</td><td>{this.props.product[field].map((link) => {
      let linkId = link.id.replace(/https?:\/\/lobid.org\//, '/');
      return <div key={link.id}><a href={linkId}>{linkId}</a><br /></div>
    })}</td></tr>
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
              {this.props.product.name.label}
              <small>
                {this.props.product.slogan && [this.props.product.slogan].map(s => <span> &mdash; {s.label}</span>)}
                <a title="Beschreibung als JSON-LD anzeigen" href={'/product/' + simpleId(this.props.product.id) + '.json'}><img className='json-ld-icon' src={jsonLdPng} alt="JSON-LD" /></a></small>
            </h1>
          </div>

          <div className="row">
            <div className="col-md-9">
              <p className={this.props.product.description.label.length < 400 ? "lead" : "p"}>{this.props.product.description.label}</p>
              <table className="table table-striped table-condensed">
                <thead>
                  <tr><th width="20%" /><th width="80%" /></tr>
                </thead>
                <tbody>
                  <tr><td>Website</td><td><a href={this.props.product.url || this.props.product.id}>{this.props.product.url || this.props.product.id}</a></td></tr>
                  {this.asLinks("hasPart")}
                  {this.asLinks("isBasedOn")}
                  {this.asLinks("isRelatedTo")}
                </tbody>
                <tfoot />
              </table>
            </div>
            <div className="col-md-3">
              <img alt={this.props.product.name.label} id="index-image" src={this.props.product.image || `https://gravatar.com/avatar/${md5(this.props.product.id)}?s=300&d=identicon`} />
            </div>
          </div>
          <Publications pubs={this.props.pubs} publications={this.props.publications} />
          <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy} />
        </div>
      </div>
    );
  }
}
