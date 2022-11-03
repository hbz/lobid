import React from "react";
import { graphql } from "gatsby";
import { Visual } from "../components/visual.html";

export default ({ data }) => (
  <Visual
    membership = {data.dataJson.membership.filter((member) => !member.endDate)}
    members={data.allTeamJson.edges}
    products={data.allProductJson.edges}
    projects={data.allProjectJson.edges.filter((project) => !project.node.endDate)}
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
        endDate
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
    allTeamJson {
      edges {
        node {
          id
          name {
            de
          }
        }
      }
    }
    allProjectJson {
      edges {
        node {
          id
          endDate
          membership {
            member {
              id
            }
          }
          name {
            de
          }
          alternateName
        }
      }
    }
    allProductJson {
      edges {
        node {
          id
          membership {
            member {
              id
            }
          }
          name {
            de
          }
          alternateName
        }
      }
    }
  }
`;
