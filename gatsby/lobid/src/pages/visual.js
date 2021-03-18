import React from "react";
import { graphql } from "gatsby";
import { Visual } from "../components/visual.html";

export default ({ data }) => (
  <Visual
    members = {data.dataJson.membership}
    products = {data.dataJson.makesOffer}
    subtitle="Dateninfrastruktur für Bibliotheken"
    language="English"
    languageTooltip="Switch language to English"
    languageLink="/visual"
    teamLink="/team-de"
    publications="Publikationen"
    contactPointId="mailto:lobid-admin@hbz-nrw.de"
    companyDetails="Impressum"
    privacy="Datenschutz"
  />
);

export const query = graphql`
  query {
    dataJson {
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
      }
      contactPoint {
        contactType {
          label: de
        }
        id
        image
      }
    }
  }
`;
