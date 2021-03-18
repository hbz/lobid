import React from "react";
import { graphql } from "gatsby";
import { Member } from "../components/member.html";

export default function MemberPage({ data, location, pageContext }) {
  return (<Member
    member={data.allFile.edges[0].node.childTeamJson}
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
    contactPointId="mailto:lobid-admin@hbz-nrw.de"
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
  }
`;
