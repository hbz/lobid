import React from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import "./css/lobid.css";
import "./css/bootstrap.min.css";
import "./css/main.css"; //TODO weg?
import "./css/font-awesome.min.css";

import hbzLogoPng from "./images/hbz.png";
import lobidLogoPng from "./images/lobid.png";
import twitterLogoBluePng from "./images/Twitter_logo_blue.png";
import mailPng from "./images/mail.png";
import jsonLdPng from "./images/json-ld.png";
import feedPng from "./images/feed.png";
import gitHubMark32pxPng from "./images/GitHub-Mark-32px.png";
import mailmanJpg from "./images/mailman.jpg";
import freenodePng from "./images/freenode.png";
import wappenPng from "./images/wappen.png";

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
    return (
      <div className="container">
        <p />
        <div className="navbar navbar-default" role="navigation">
          <div className="container-fluid" id="header">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#lobid-nav"
              >
                <span className="sr-only">Navigation ein/ausblenden</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">
                <span>
                  <img id="butterfly" src={lobidLogoPng} alt="lobid-logo" />
                </span>
              </a>
            </div>
            <div className="navbar-collapse collapse" id="lobid-nav">
              <ul className="nav navbar-nav">
                <li>
                  <a href="/resources">resources</a>
                </li>
                <li>
                  <a href="/organisations">organisations</a>
                </li>
                <li>
                  <a href="/gnd">gnd</a>
                </li>
              </ul>
              <div className="nav navbar-nav navbar-right">
              <ul className="nav navbar-nav ">
                <li>
               <UncontrolledDropdown>
                  <DropdownToggle
                    style={{
                      padding: "12px",
                      background: "transparent",
                      width: "100%",
                      marginTop: "4px"
                    }}
                  > {this.props.publications}
                    <b className="caret"></b>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag="a" href="http://blog.lobid.org/"
                       style={{
                        paddingLeft: "6px",
                        color: "black",
                        textDecoration: "none",
                        lineHeight: "30px"
                       }}
                    >
                      Blog
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      as="a"
                      href="http://slides.lobid.org/"
                      style={{
                        paddingLeft: "6px",
                        color: "black",
                        textDecoration: "none"
                       }}
                    >
                      Slides
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </li>
                <li><a href={this.props.languageLink} title={this.props.languageTooltip}><span
                  className='glyphicon glyphicon-globe'></span>&nbsp;{this.props.language}</a></li>
                <li>
                <UncontrolledDropdown>
                  <DropdownToggle
                    className="glyphicon glyphicon-info-sign"
                    style={{
                      padding: "12px",
                      background: "transparent",
                      width: "100%",
                      marginTop: "4px"
                    }}
                  >
                    <b className="caret"></b>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag="a" href={this.props.teamLink}
                       style={{
                        paddingLeft: "6px",
                        color: "black",
                        textDecoration: "none",
                        lineHeight: "30px"
                       }}
                    >
                      Team
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      as="a"
                      href={
                        this.props.contactPointId +
                        "?subject=Feedback%20zu%20lobid.org"
                      }
                      style={{
                        paddingLeft: "6px",
                        color: "black",
                        textDecoration: "none"
                       }}
                    >
                      Feedback
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </li>
              </ul>
              </div>
            </div>
          </div>
        </div>
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
            Das lobid-Team
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
              <img src={feedPng} height="20" style={{ marginRight: "12px" }} title="Blog" alt="blog" />
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
              <img src={freenodePng} height="20" style={{ marginRight: "12px" }} title="IRC" alt="irc" />
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
              {this.props.member1RoleName} <br />
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
        <div className="panel panel-default footer">
          <div className="panel-body">
            <span className="pull-left">
              <img src={wappenPng} alt="NRW-Wappen" /> &nbsp; lobid |
              LOD-Dienste des{" "}
              <a href="https://www.hbz-nrw.de/produkte/linked-open-data">
                hbz — Hochschulbibliothekszentrum des Landes NRW
              </a>
            </span>
            <span className="pull-right">
              <a href="https://www.hbz-nrw.de/impressum">
                {this.props.companyDetails}
              </a>{" "}
              <a href="https://github.com/hbz/lobid/blob/master/conf/Datenschutzerklaerung_lobid.textile">
                {this.props.privacy}
              </a>{" "}
              <a href="https://twitter.com/lobidorg">
                <i className="fa fa-twitter" aria-hidden="true"></i> Twitter
              </a>
              <a href="https://github.com/hbz/lobid">
                <i className="fa fa-github" aria-hidden="true"></i> GitHub
              </a>
              <a href="http://blog.lobid.org">
                <i className="fa fa-pencil" aria-hidden="true"></i> Blog
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
