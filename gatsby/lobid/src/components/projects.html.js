import React from "react";
import { getImage, simpleId } from './helpers.js'

export default class Projects extends React.Component {
  render() {
    return (
      <div>
        {this.props.projects
          .map((details) =>
            <div key={details.id}>
              {getImage(details.id, details.image)}
              <p className="details">
                <a href={"/project/" + simpleId(details.id)}>
                  {details.alternateName || simpleId(details.id)}
                </a>
                <br />
                {(details.name && details.name[this.props.lang]) || details.alternateName}
              </p>
            </div>
          )}
        <p />
      </div>
    );
  }
}
