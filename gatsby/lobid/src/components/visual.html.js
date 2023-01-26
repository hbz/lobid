import React, { Component, createRef } from "react";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import Header from "./header.html";
import Footer from "./footer.html";
import { getMemberDetails } from './helpers.js'

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

    var nodes = [];
    
    this.props.membership.forEach((person) => {
      console.log(person)
      nodes.push({
        id: person.member.id,
        label: (person.member.name ? person.member.name.label : getMemberDetails(this.props.members, person).node.name.de),
        shape: "box",
        group: "persons"});
    });
    this.props.products.forEach((product) => { 
      nodes.push({
        id: product.node.jsonId,
        label: (product.node.alternateName ? product.node.alternateName[0] : product.node.name.de),
        shape: "box",
        group: "products" });
    });
    this.props.projects.forEach((project) => {
      nodes.push({
        id: project.node.jsonId,
        label: (project.node.alternateName ? project.node.alternateName[0] : project.node.name.de),
        shape: "box",
        group: "projects" });
    });
  
    var edges = [];

    this.props.products.forEach((product) => { 
      product.node.membership.forEach((person) => {
        edges.push({ from: product.node.jsonId, to: person.member.id, selectionWidth: 4 });
      });
    });
    this.props.projects.forEach((project) => { 
      project.node.membership.forEach((person) => {
        edges.push({ from: person.member.id, to: project.node.jsonId, selectionWidth: 4 });
      });
    });

    const data = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges)
    };
    const options = {
      layout: {
        hierarchical: {
          direction: "UD",
          sortMethod: "directed"
        }
      },
      physics: {
        hierarchicalRepulsion: {
          avoidOverlap: 1
        }
      },
      interaction: {
        zoomView: false,
        dragView: false,
        dragNodes: false
      }
    };
    this.network = new Network(this.appRef.current, data, options)
      .on("doubleClick", function (params) {
        params.nodes[0] && (window.location.href = params.nodes[0]);
      }
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
