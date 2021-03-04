import React from "react";
import { graphql } from "gatsby";
import { Member } from "../components/member.html";

export default function MemberPage({ data, location, pageContext }) {
  const member = data.allFile.edges[0].node.childTeamJson
  return (<Member
    member={member}
    pubs={data.allPublicationJson.edges
      .map(edge => edge.node)
      .filter(p => p.creator.find(c => c.id === member.id))
      .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    }
    contactName="Kontakt"
    subtitle="Dateninfrastruktur für Bibliotheken"
    publications="Publikationen"
    language="English"
    teamLink="/team-de"
    makesOfferName="Produkte"
    memberName="Mitglieder"
    memberFormerName="Ehemalige"
    companyDetails="Impressum"
    privacy="Datenschutz"
    contactPointId="mailto:semweb@hbz-nrw.de"
  />);
}

export const query = graphql`
  query MemberQuery($id: String!) {
    allFile (filter: { name: { eq : $id }}) {
      edges {
        node {
          childTeamJson {
            name {
              label: de
            }
            id
            alternateName
            email
            telephone
            image
            sameAs
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
            label: de
          }
          description {
            label: de
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
