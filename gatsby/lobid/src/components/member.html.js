import React from "react";
import md5 from 'md5';

import Header from "./header.html";
import Footer from "./footer.html";
import Publications from "./publications.html";
import Products from "./products.html";

import "./css/lobid.css";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";

import hbzLogoPng from "./images/hbz.png";
import jsonLdPng from "./images/json-ld.png";

export class Member extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    console.log('Header', Header);
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
              <img
                className="media-object nrw-logo pull-right"
                src={hbzLogoPng}
                alt="hbz logo"
              />
              lobid <small>&mdash; {this.props.subtitle}</small>
            </h1>
          </div>

          <div className="row">
            <div className="col-md-9">
              <p className="lead">{this.props.member.name.label}<small><a title="Beschreibung als JSON-LD anzeigen" href={'/team/' + this.props.member.id.slice(this.props.member.id.lastIndexOf("/") + 1, this.props.member.id.lastIndexOf("!#") - 1) + '.json'}><img className='json-ld-icon' src={jsonLdPng} alt="JSON-LD" /></a></small></p>
              <table className="table table-striped table-condensed">
                <thead>
                  <tr><th width="20%" /><th width="80%" /></tr>
                </thead>
                <tbody>
                  {this.props.member.alternateName && this.props.member.alternateName.map(alt => <tr><td>Alternate Name</td><td>{alt}</td></tr>)}
                  <tr><td>Mail</td><td><a href='mailto:pohl@hbz-nrw.de'>{this.props.member.email}</a></td></tr>
                  <tr><td>Telephone</td><td>{this.props.member.telephone}</td></tr>
                  <tr><td>Same As</td><td>{this.props.member.sameAs.map((link) =>
                    <div><a href={link}>{link.replace('https://', '').replace('http://', '')}</a><br /></div>
                  )}</td></tr>
                </tbody>
                <tfoot />
              </table>
            </div>
            <div className="col-md-3">
              <img alt={this.props.member.name.label} id="index-image" src={this.props.member.image || `https://gravatar.com/avatar/${md5(this.props.member.email)}?s=300&d=identicon`} />
            </div>
          </div>
          <p className="lead">{this.props.makesOfferName}</p>
          <Products products={this.props.products} lang={this.props.lang}/>
          <Publications pubs={this.props.pubs} publications={this.props.publications} />
          <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy} />
        </div>
      </div>
    );
  }
}
