import React from "react";
import { simpleId, getMemberDetails, getImage} from './helpers.js'

import Header from "./header.html";
import Footer from "./footer.html";
import Membership from "./membership.html";
import Publications from "./publications.html";
import Projects from "./projects.html";

import "./css/lobid.css";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";

import hbzLogoPng from "./images/hbz.png";
import jsonLdPng from "./images/json-ld.png";

export class Team extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      infoToggledMembers: false,
      infoToggledProjects: false
    };
  }

  toggleFormerMembers = () => {
    this.setState(prevState => ({
      ...prevState,
      infoToggledMembers: !prevState.infoToggledMembers
    }));
  };

  toggleFormerProjects = () => {
    this.setState(prevState => ({
      ...prevState,
      infoToggledProjects: !prevState.infoToggledProjects
    }));
  };

  getFormerMembers = () => {
    return (
      <div id="former-members">
        <Membership membership={this.props.team.membership.filter(member => member.endDate).map((member) => [member, getMemberDetails(this.props.members, member)])} lang={this.props.lang}/>
      </div>
    );
  };

  getFormerProjects = () => {
    return (
      <div id="former-projects">
        <Projects projects={this.props.projects.map(p=>p.node).filter(project => project.endDate)} lang={this.props.lang}/>
      </div>
    );
  };

  getOfferDetails = (offer) => {
    return this.props.products.filter(p => p.node.id === offer.id)[0];
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
              <img
                className="media-object nrw-logo pull-right"
                src={hbzLogoPng}
                alt="hbz logo"
              />
              {this.props.title} <small></small>
            </h1>
          </div>

          <h1>
            Team
            <small>
              <a title="Beschreibung als JSON-LD anzeigen" href="/team.json">
                <img
                  className="json-ld-icon"
                  src={jsonLdPng}
                  alt="json ld icon"
                />
              </a>
            </small>
          </h1>

          <p className="lead">{this.props.team.description[this.props.lang]}</p>
          <div className="row">
            <div className="col-md-5">
              <h2>{this.props.contactName}</h2>

              <p>
                {this.props.team.contactPoint.map((contactPoint) =>
                  <a
                    key={contactPoint.id}
                    target="_blank"
                    href={contactPoint.id}
                    rel="nofollow noopener noreferrer"
                  >
                    <img
                      src={contactPoint.image}
                      height="20"
                      style={{ marginRight: "12px" }}
                      title={contactPoint.contactType[this.props.lang]}
                      alt={contactPoint.contactType[this.props.lang]}
                    />
                  </a>

                )}
              </p>

              <h2>{this.props.memberName}</h2>
              <Membership membership={this.props.team.membership.filter((member) => !member.endDate).map((member) => [member, getMemberDetails(this.props.members, member)])} lang={this.props.lang}/>

              <h3>
                {this.props.memberFormerName} {this.props.memberName}
                {this.getToggle(this.state.infoToggledMembers, this.toggleFormerMembers)}
              </h3>
              {this.state.infoToggledMembers ? this.getFormerMembers() : ""}

              <h2>{this.props.makesOfferName}</h2>

              {this.props.team.makesOffer.filter(offer => !offer.id.includes("lobid-"))
              .map((offer) => [offer, this.getOfferDetails(offer)]).map(([offer, details]) =>
                <div key={offer.id}>
                  {getImage(offer.id, details.node.image)}
                  <p className="details">
                    <a href={"/product/" + simpleId(offer.id)}>
                      {offer.name}
                    </a>
                    <br />
                    {(details.node.slogan && details.node.slogan[this.props.lang]) || (details.node.name && details.node.name[this.props.lang]) || offer.name}
                  </p>
                </div>
              )}

              <h2>{this.props.projectsName}</h2>
              <Projects projects={this.props.projects.map(p=>p.node).filter(project => !project.endDate)} lang={this.props.lang}/>

              <h3>
                {this.props.memberFormerName} {this.props.projectsName}
                {this.getToggle(this.state.infoToggledProjects, this.toggleFormerProjects)}
              </h3>
              {this.state.infoToggledProjects ? this.getFormerProjects() : ""}

            </div>
            <div className="col-md-7">
              <h2>{this.props.publicationsCurrent}<small>
              <a title={"RSS-Feed: "+this.props.publicationsDetails} href="/team/feed.xml">
                <i className="json-ld-icon fa fa-rss" aria-hidden="true"></i>
              </a>
            </small></h2>
              <Publications pubs={this.props.pubs} publications={this.props.publicationsDetails} />
            </div>
          </div>
        </div>
        <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy} />
      </div>
    );
  }
}
