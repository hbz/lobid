import React from "react";
import { graphql } from "gatsby";
import { Team } from "../components/team.html";

export default ({ data }) => (
  <Team
    team={data.dataJson}
    contactName="Contact"
    subtitle="data infrastructure for libraries"
    publications="Publications"
    language="Deutsch"
    languageTooltip="Wechsel zur Deutschen Version"
    languageLink="/team-de"
    teamLink="/team-en"
    makesOfferName="Products"
    memberName="Members"
    memberFormerName="Former members"
    companyDetails="Company details"
    privacy="privacy"
    contactPointId="mailto:semweb@hbz-nrw.de"
  />
);

// TODO: extract to fragment, pass 'de' or 'en' as $lang variable
export const query = graphql`
  query {
    dataJson {
      alternateName {
        label: en
      }
      contactPoint {
        contactType {
          label: en
        }
        id
        image
      }
      description {
        label: en
      }
      makesOffer {
        id
        name
      }
      membership {
        member {
          id
          name {
            label: en
          }
        }
        roleName {
          label: en
        }
        startDate
        endDate
      }
      name {
        label: en
      }
    }
  }
`;
