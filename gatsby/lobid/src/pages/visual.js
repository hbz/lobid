import React from "react";
import { graphql } from "gatsby";
import { Visual } from "../components/visual.html";

export default ({ data }) => (
  <Visual
    members = {data.dataJson.member}
    products = {data.dataJson.makesOffer}
    language="English"
    languageTooltip="Switch language to English"
    languageLink="/visual"
    teamLink="/team-de"
    publications="Publikationen"
    contactPointId={data.dataJson.contactPoint[0].id}
    companyDetails="Impressum"
    privacy="Datenschutz"
    subtitle={data.dataJson.makesOffer[0].alternateName.de}
  />
);

export const query = graphql`
  query {
    dataJson {
      makesOffer {
        alternateName {
          de
        }
        id
        name
      }
      member {
        member {
          id
          image
          name
        }
        roleName {
          de
        }
      }
      contactPoint {
        contactType {
          de
        }
        id
      }
    }
  }
`;
