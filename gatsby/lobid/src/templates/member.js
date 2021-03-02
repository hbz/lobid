import React from "react";
import { graphql } from "gatsby";
import { Member } from "../components/member.html";

export default function MemberPage({ data }) {
  return (<Member
    member={data.allFile.edges[0].node.childTeamJson}
    contactName="Kontakt"
    subtitle="Dateninfrastruktur für Bibliotheken"
    publications="Publikationen"
    language="English"
    languageTooltip="Switch language to English"
    languageLink="/team-en"
    teamLink="/team-de"
    makesOfferName="Produkte"
    memberName="Mitglieder"
    memberFormerName="Ehemalige"
    companyDetails="Impressum"
    privacy="Datenschutz"
    contactPointId="mailto:semweb@hbz-nrw.de"
  />);
}

// TODO: use query($lang: String!) {, passed from gatsby-node.js
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
