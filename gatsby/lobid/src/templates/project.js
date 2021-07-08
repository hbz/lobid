import React from "react";
import { graphql } from "gatsby";
import { Project } from "../components/project.html";

export default function ProjectPage({ data, location, pageContext }) {
  const project = data.allFile.edges.slice(-1).pop().node.childProjectJson
  return (<Project
    project={project}
    pubs={data.allPublicationJson.edges
      .map(edge => edge.node)
      .filter(p => p.about && p.about.find(a => a.id.includes(pageContext.id)))
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
            alternateName
            endDate
            result {
              id
            }
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
