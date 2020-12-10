import React, { Component, createRef } from "react";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';

import "./css/lobid.css";

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
    this.props.members.forEach((item,index) => { ns.push({ id: "m"+index, label: item.member.name, "shape":"box" }); });
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
      <div id="lobid-network" ref={this.appRef} />
    );
  }
}
