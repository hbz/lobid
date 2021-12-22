import React from "react"
import { getImage } from './helpers.js'

export default class Membership extends React.Component {
  render() {
    return (
      this.props.membership.length > 0 &&
      <div>
        {this.props.membership.map(([member, details]) =>
          <div key={member.member.id}>
            {getImage((details && details.node.email) || member.member.id,
              details && details.node.image)}
            <p className="details">
              {this.getName(member.member.id,
                (details && details.node.name[this.props.lang]) || (member.member.name && member.member.name[this.props.lang]) || member.member.id)}{" "}<br />
              {member.roleName[this.props.lang]}<br />
            </p>
          </div>
        )}
        <p />
      </div>
    )
  }
  getName = (id, label) => {
    return (
      <a href={id.replace('http://lobid.org/', '/')}>
        {label}
      </a>
    );
  }
}
