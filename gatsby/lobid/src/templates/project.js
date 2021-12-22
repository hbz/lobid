import React from "react";
import { graphql } from "gatsby";
import { Project } from "../components/project.html";
import { simpleId } from '../components/helpers.js'

export default function ProjectPage({ data, location, pageContext }) {
  const project = data.allFile.edges.slice(-1).pop().node.childProjectJson
  return (<Project
    project={project}
    members={data.allTeamJson.edges} // TODO: filter here for project members?
    pubs={data.allPublicationJson.edges
      .map(edge => edge.node)
      .filter(p => p.about && p.about.find(a => simpleId(a.id) === pageContext.id))
      .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    }
    contactName="Kontakt"
    publications="Publikationen"
    language="English"
    teamLink="/team-de"
    hasPart="Besteht aus"
    isBasedOn="Basiert auf"
    isRelatedTo="Bezug"
    enhances="Erweitert"
    result="Ergebnis"
    companyDetails="Impressum"
    privacy="Datenschutz"
    contactPointId="mailto:semweb@hbz-nrw.de"
    memberName="Team"
    lang="de"
  />);
}

export const query = graphql`
  query ProjectQuery($id: String!) {
    allFile (filter: { name: { eq : $id }}) {
      edges {
        node {
          childProjectJson {
            name {
              label: de
            }
            description {
              label: de
            }
            id
            enhances {
              id
            }
            isBasedOn {
              id
            }
            url
            image
            alternateName
            endDate
            result {
              id
            }
            membership {
              member {
                id
              }
              roleName {
                de
                en
              }
            }
          }
        }
      }
    }
    allTeamJson {
      edges {
        node {
          id
          image
          email
          name {
            de
            en
          }
        }
      }
    }
    allPublicationJson {
      edges {
        node {
          id
          type
          creator {
            id
          }
          name {
            de
            en
          }
          about {
            id
          }
          datePublished
          fields {
            jsonFile
          }
        }
      }
    }
  }
`;
