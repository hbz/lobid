import React from "react";
import md5 from 'md5';

import Header from "./header.html";
import Footer from "./footer.html";
import Publications from "./publications.html";
import Products from "./products.html";
import Projects from "./projects.html";

import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";
import "./css/lobid.css";

import hbzLogoPng from "./images/hbz.png";
import jsonLdPng from "./images/json-ld.png";

export class Member extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      infoToggledProjects: false
    };
  }

  getToggle = (state, event) => {
    return (
      <small>
        <button
          className={
            state
              ? "glyphicon glyphicon-minus-sign"
              : "glyphicon glyphicon-plus-sign"
          }
          style={{
            color: "#004678",
            backgroundColor: "transparent",
            border: "none"
          }}
          onClick={event}
        />
      </small>
    );
  }

  toggleFormerProjects = () => {
    this.setState(prevState => ({
      ...prevState,
      infoToggledProjects: !prevState.infoToggledProjects
    }));
  };

  getFormerProjects = () => {
    return (
      <div id="former-projects">
        <Projects projects={this.props.projects.filter(project => project.endDate)} lang={this.props.lang}/>
      </div>
    );
  };

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
              {this.props.title}
            </h1>
          </div>

          <div className="row">
            <div className="col-md-9">
              <p className="lead">{this.props.member.name.label}<small><a title="Beschreibung als JSON-LD anzeigen" href={'/team/' + this.props.member.jsonId.slice(this.props.member.jsonId.lastIndexOf("/") + 1, this.props.member.jsonId.lastIndexOf("!#") - 1) + '.json'}><img className='json-ld-icon' src={jsonLdPng} alt="JSON-LD" /></a></small></p>
              <table className="table table-striped table-condensed">
                <thead>
                  <tr><th width="20%" /><th width="80%" /></tr>
                </thead>
                <tbody>
                  {this.props.member.alternateName && this.props.member.alternateName.map(alt => <tr key={alt}><td>Alternate Name</td><td>{alt}</td></tr>)}
                  <tr><td>Mail</td><td><a href={"mailto:" + this.props.member.email}>{this.props.member.email}</a></td></tr>
                  <tr><td>Telephone</td><td>{this.props.member.telephone}</td></tr>
                  <tr><td>Same As</td><td>{this.props.member.sameAs.map((link) =>
                    <div key={link}><a href={link}>{link.replace('https://', '').replace('http://', '')}</a><br /></div>
                  )}</td></tr>
                </tbody>
                <tfoot />
              </table>
            </div>
            <div className="col-md-3">
              <img alt={this.props.member.name.label} id="index-image" src={this.props.member.image || `https://gravatar.com/avatar/${md5(this.props.member.email)}?s=300&d=identicon`} />
            </div>
          </div>
          {this.props.products.length > 0 && <p className="lead">{this.props.makesOfferName}</p>}
          <Products products={this.props.products} lang={this.props.lang}/>
          {this.props.projects.length > 0 && <p className="lead">{this.props.projectsName}</p>}
          <Projects projects={this.props.projects.filter(project => !project.endDate)} lang={this.props.lang}/>
          <p className="lead">
            {this.props.memberFormerName} {this.props.projectsName}
            {this.getToggle(this.state.infoToggledProjects, this.toggleFormerProjects)}
          </p>
          {this.state.infoToggledProjects ? this.getFormerProjects() : ""}
          <Publications pubs={this.props.pubs} publications={this.props.publications} />
          <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy} accessibility={this.props.accessibility} />
        </div>
      </div>
    );
  }
}
