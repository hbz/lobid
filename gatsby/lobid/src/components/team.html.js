import React from "react";
import Header from "./header.html";
import Footer from "./footer.html";

import "./css/lobid.css";
import "./css/bootstrap.min.css";
import "./css/font-awesome.min.css";

import hbzLogoPng from "./images/hbz.png";
import twitterLogoBluePng from "./images/Twitter_logo_blue.png";
import mailPng from "./images/mail.png";
import jsonLdPng from "./images/json-ld.png";
import feedPng from "./images/feed.png";
import gitHubMark32pxPng from "./images/GitHub-Mark-32px.png";
import mailmanJpg from "./images/mailman.jpg";
import freenodePng from "./images/freenode.png";

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
        <div>
          <p>
            Felix Ostrowski <br />
            {this.props.member3RoleName} <br />
          </p>
        </div>
        <div>
          <p>
            Simon Ritter <br />
            {this.props.member4RoleName} <br />
          </p>
        </div>
        <div>
          <p>
            Christoph Ewertowski <br />
            {this.props.member5RoleName} <br />
          </p>
        </div>
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
              lobid <small>&mdash; {this.props.makesOfferAlternateName0}</small>
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

          <p className="lead">{this.props.description}</p>

          <p>
            <a
              target="_blank"
              href={this.props.contactPointId}
              rel="nofollow noopener noreferrer"
            >
              <img
                src={mailPng}
                height="20"
                style={{ marginRight: "12px" }}
                title={this.props.contactPointContactType}
                alt="email"
              />
            </a>
            <a
              target="_blank"
              href="https://listen.hbz-nrw.de/mailman/listinfo/lobid"
              rel="nofollow noopener noreferrer"
            >
              <img
                src={mailmanJpg}
                height="20"
                style={{ marginRight: "12px" }}
                title="Mailingliste"
                alt="mailinglist"
              />
            </a>
            <a
              target="_blank"
              href="https://twitter.com/lobidorg"
              rel="nofollow noopener noreferrer"
            >
              <img
                src={twitterLogoBluePng}
                height="20"
                style={{ marginRight: "12px" }}
                title="Twitter"
                alt="twitter logo"
              />
            </a>
            <a
              target="_blank"
              href="http://blog.lobid.org"
              rel="nofollow noopener noreferrer"
            >
              <img
                src={feedPng}
                height="20"
                style={{ marginRight: "12px" }}
                title="Blog"
                alt="blog"
              />
            </a>
            <a
              target="_blank"
              href="https://github.com/hbz/lobid/issues"
              rel="nofollow noopener noreferrer"
            >
              <img
                src={gitHubMark32pxPng}
                height="20"
                style={{ marginRight: "12px" }}
                title="Issue-Tracker auf GitHub"
                alt="github"
              />
            </a>
            <a
              target="_blank"
              href="irc://irc.freenode.net/lobid"
              rel="nofollow noopener noreferrer"
            >
              <img
                src={freenodePng}
                height="20"
                style={{ marginRight: "12px" }}
                title="IRC"
                alt="irc"
              />
            </a>
            &nbsp;
          </p>

          <h2>{this.props.memberName}</h2>
          <img
            src={this.props.member0MemberImage}
            width="50"
            style={{ float: "left", padding: "5px" }}
            alt="adrian depiction"
          />

          <div>
            <p>
              <a
                target="_blank"
                href="/team/ap#!"
                rel="nofollow noopener noreferrer"
              >
                Adrian Pohl
              </a>{" "}
              <br />
              {this.props.member0RoleName} <br />
            </p>
          </div>
          <img
            src={this.props.member1MemberImage}
            width="50"
            style={{ float: "left", padding: "5px" }}
            alt="dr0ide depiction"
          />

          <div>
            <p>
              <a
                target="_blank"
                href="/team/pc#!"
                rel="nofollow noopener noreferrer"
              >
                Pascal Christoph
              </a>{" "}
              <br />
              {this.props.member1RoleName} <br />
            </p>
          </div>
          <img
            src={this.props.member2MemberImage}
            width="50"
            style={{ float: "left", padding: "5px" }}
            alt="fabian depiction"
          />

          <div>
            <p>
              <a
                target="_blank"
                href="/team/fs#!"
                rel="nofollow noopener noreferrer"
              >
                Fabian Steeg
              </a>
              <br />
              {this.props.member2RoleName} <br />
            </p>
          </div>
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
          <p>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://lobid.org"
            >
              lobid
            </a>
            <br />
            {this.props.makesOfferAlternateName0}
          </p>
          <p>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://nwbib.de"
            >
              NWBib
            </a>
            <br />
            {this.props.makesOfferAlternateName1}
          </p>
          <p>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="http://digitalisiertedrucke.de/"
            >
              Digitalisierte Drucke
            </a>
            <br />
            {this.props.makesOfferAlternateName2}
          </p>

          <p>
            <a
              target="_blank"
              rel="nofollow noopener noreferrer"
              href="https://github.com/culturegraph/metafacture-ide"
            >
              Metafacture IDE
            </a>
            <br />
            {this.props.makesOfferAlternateName3}
          </p>
        </div>
        <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy}/>
      </div>
    );
  }
}
