import React, { Component, createRef } from "react";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import Header from "./header.html";
import Footer from "./footer.html";

import "./css/lobid.css";

import hbzLogoPng from "./images/hbz.png";

export class Visual extends Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      infoToggled: false
    };
    this.network = {};
    this.appRef = createRef();
  }

  componentDidMount() {
    console.log("Props", this.props)

    var ns = [
      { id: 'm', label: "Members","shape":"dot","size":"5"},
      { id: 'o', label: "Offers","shape":"dot","size":"5"}
    ];
    this.props.members.forEach((item,index) => { ns.push({ id: "m"+index, label: (item.member.name ? item.member.name.label : item.member.id), "shape":"box" }); });
    this.props.products.forEach((item,index) => { ns.push({ id: "o"+index, label: item.name, "shape":"box" }); });
    const nodes = new DataSet(ns);
  
    var es = [];
    this.props.members.forEach((item,index) => { es.push({ from: 'm', to: 'm'+index }); });
    this.props.products.forEach((item,index) => { es.push({ from: 'o', to: 'o'+index }); });
    const edges = new DataSet(es);
    
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {};
    this.network = new Network(this.appRef.current, data, options);
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
          <p>
            <i>
              Dies ist eine experimentelle Visualisierung der Daten aus <a href="/team.json">/team.json</a>,
              die auch zur Darstellung von <a href="/team">/team</a> verwendet werden.
            </i>
          </p>
          <div id="lobid-network" ref={this.appRef} />
        </div>
        <Footer companyDetails={this.props.companyDetails} privacy={this.props.privacy}/>
      </div>
    );
  }
}
