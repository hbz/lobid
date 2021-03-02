import React from "react";
import { graphql } from "gatsby";
import { Team } from "../components/team.html";

export default ({ data }) => (
  <Team
    team={data.dataJson}
    members={data.allTeamJson.edges}
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
  />
);

// TODO: extract to fragment, pass 'de' or 'en' as $lang variable
export const query = graphql`
  query {
    dataJson {
      alternateName {
        label: de
      }
      contactPoint {
        contactType {
          label: de
        }
        id
        image
      }
      description {
        label: de
      }
      makesOffer {
        id
        name
      }
      membership {
        member {
          id
          name {
            label: de
          }
        }
        roleName {
          label: de
        }
        startDate
        endDate
      }
      name {
        label: de
      }
    }
    allTeamJson {
      edges {
        node {
          id
          image
          email
          name {
            label: de
          }
        }
      }
    }
  }
`;
