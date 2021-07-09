import React from "react";
import md5 from 'md5';
import { simpleId } from './helpers.js'

import Header from "./header.html";
import Footer from "./footer.html";

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
      infoToggled: false
    };
  }

  toggleEhemalige = () => {
    this.setState(prevState => ({ infoToggled: !prevState.infoToggled }));
  };

  getEhemalige = () => {
    return (
      <div id="former">
        {this.props.team.membership.filter(member => member.endDate)
          .map((member) => [member, this.getMemberDetails(member)]).map(([member, details]) =>
            <div key={member.member.id}>
              {this.getImage(
                (details && details.node.email) || member.member.id,
                details && details.node.image)}
              <p className="details">
                {this.getName(
                  member.member.id,
                  (details && details.node.name[this.props.lang]) || (member.member.name && member.member.name[this.props.lang]) || member.member.id)}
                <br />
                {member.roleName[this.props.lang]}<br />
              </p>
            </div>
          )}
      </div>
    );
  };

  getName = (id, label) => {
    return (
      <a href={id.replace('http://lobid.org/', '/')}>
        {label}
      </a>
    );
  }

  getImage = (id, src) => {
    return (
      <img src={src || `https://gravatar.com/avatar/${md5(id)}?s=100&d=identicon`}
        alt={id} className="photo"></img>
    );
  }

  getMemberDetails = (member) => {
    return this.props.members.filter(m => m.node.id === member.member.id)[0];
  }

  getOfferDetails = (offer) => {
    return this.props.products.filter(p => p.node.id === offer.id)[0];
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
              lobid <small>&mdash; {this.props.subtitle}</small>
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

          {this.props.team.membership.filter((member) => !member.endDate)
            .map((member) => [member, this.getMemberDetails(member)]).map(([member, details]) =>
              <div key={member.member.id}>
                {this.getImage(details.node.email, details.node.image)}
                <p className="details">
                  {this.getName(details.node.id, details.node.name[this.props.lang])}{" "}<br />
                  {member.roleName[this.props.lang]}<br />
                </p>
              </div>
            )}

          <h3>
            {this.props.memberFormerName}
            <small>
              <button
                className={
                  this.state.infoToggled
                    ? "glyphicon glyphicon-minus-sign"
                    : "glyphicon glyphicon-plus-sign"
                }
                style={{
                  color: "#004678",
                  backgroundColor: "transparent",
                  border: "none"
                }}
                onClick={this.toggleEhemalige}
              />
            </small>
          </h3>
          {this.state.infoToggled ? this.getEhemalige() : ""}

          <h2>{this.props.makesOfferName}</h2>

          {this.props.team.makesOffer
           .map((offer) => [offer, this.getOfferDetails(offer)]).map(([offer, details]) =>
            <div key={offer.id}>
              {this.getImage(offer.id, details.node.image)}
              <p className="details">
                <a href={"/product/" + simpleId(offer.id)}>
                  {offer.name}
                </a>
                <br />
                {(details.node.slogan && details.node.slogan[this.props.lang]) || offer.name}
              </p>
            </div>
          )}

          <h2>{this.props.projectsName}</h2>

          {this.props.projects
          .map((details) =>
            <div key={details.node.id}>
              {this.getImage(details.node.id, details.node.image)}
              <p className="details">
                <a href={"/project/" + simpleId(details.node.id)}>
                  {details.node.alternateName || simpleId(details.node.id)}
                </a>
                <br />
                {(details.node.name && details.node.name[this.props.lang]) || details.node.alternateName}
              </p>
            </div>
          )}
        </div>
        <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy} />
      </div>
    );
  }
}
