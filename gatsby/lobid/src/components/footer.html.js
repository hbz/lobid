import React from "react"

import wappenPng from "./images/wappen.png";

export default class Footer extends React.Component {
  render() {
    return (
      <div className="panel panel-default footer">
        <div className="panel-body">
          <span className="pull-left">
            <img src={wappenPng} alt="NRW-Wappen" /> &nbsp; lobid |
            ein Dienst des{" "}
            <a href="https://www.hbz-nrw.de/produkte/linked-open-data">
              hbz
            </a>
          </span>
          <span className="pull-right">
            <a href="/warranty">
              {this.props.warranty}
            </a>
            {" | "}
            <a href="https://www.hbz-nrw.de/impressum">
              {this.props.companyDetails}
            </a>
            {" | "}
            <a href="https://github.com/hbz/lobid/blob/master/conf/Datenschutzerklaerung_lobid.textile">
              {this.props.privacy}
            </a>
            {" | "}
            <a
              href="https://metadaten.community/c/software-und-tools/lobid/10"
              style={{ marginRight: "12px" }}
            >
              <img style={{ height: "1em" }} src="/logos/discourse.svg" className="fa" aria-hidden="true"></img> Discourse
            </a>
            <a
              href="https://github.com/hbz/lobid"
              style={{ marginRight: "12px" }}
            >
              <i className="fa fa-github" aria-hidden="true"></i> GitHub
            </a>
            <a href="http://blog.lobid.org" style={{ marginRight: "12px" }}>
              <i className="fa fa-pencil" aria-hidden="true"></i> Blog
            </a>
          </span>
        </div>
      </div >
    )
  }
}
