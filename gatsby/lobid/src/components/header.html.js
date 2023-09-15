import React from "react"

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import lobidLogoPng from "./images/lobid.png";

export default class Header extends React.Component {
  render() {
    return (
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
          <div className="navbar-collapse " id="lobid-nav">
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
            <div style={{ marginRight: "-6px" }}>
              <ul className="nav navbar-nav navbar-right ">
                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      style={{
                        padding: "9px",
                        background: "transparent",
                        marginTop: "0px",
                        lineHeight: "30px"
                      }}
                    >
                      {this.props.publications}
                      <b
                        className="caret"
                        style={{
                          marginLeft: "2px"
                        }}
                      ></b>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        tag="a"
                        href="http://blog.lobid.org/"
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

                {this.props.languageLink && this.props.languageTooltip &&
                  <li>
                    <a
                      href={this.props.languageLink}
                      title={this.props.languageTooltip}
                    >
                      <span className="glyphicon glyphicon-globe"></span>
                      &nbsp;
                      {this.props.language}
                    </a>
                  </li>
                }

                <li>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="glyphicon glyphicon-info-sign"
                      style={{
                        padding: "11px",
                        background: "transparent",
                        marginTop: "-3px",
                        lineHeight: "27px"
                      }}
                    >
                      <b
                        className="caret"
                        style={{
                          marginTop: "-4px",
                          marginLeft: "2px"
                        }}
                      ></b>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        tag="a"
                        href={this.props.teamLink}
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
                      >
                        Feedback
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem
                        as="a"
                        href={
                          "/usage-policy"
                        }
                      >
                        Richtlinien API-Nutzung
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>)
  }
}

