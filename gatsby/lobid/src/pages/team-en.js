import React from "react";
import { graphql } from "gatsby";
import { Team } from "../components/team.html";

export default ({ data }) => (
  <Team
    contactPointId={data.dataJson.contactPoint[0].id}
    contactPointContactType={data.dataJson.contactPoint[0].contactType.en}
    description={data.dataJson.description.en}
    makesOfferAlternateName0={data.dataJson.makesOffer[0].alternateName.en}
    makesOfferAlternateName1={data.dataJson.makesOffer[1].alternateName.en}
    makesOfferAlternateName2={data.dataJson.makesOffer[2].alternateName.en}
    makesOfferAlternateName3={data.dataJson.makesOffer[3].alternateName.en}
    publications="Publications"
    language="Deutsch"
    languageTooltip="Wechsel zur Deutschen Version"
    languageLink="/index-de.html"
    teamLink="/team-en"
    makesOfferName="Products"
    memberName="Member"
    member0MemberImage={data.dataJson.member[0].member.image}
    member0RoleName={data.dataJson.member[0].roleName.en}
    member1MemberImage={data.dataJson.member[1].member.image}
    member1RoleName={data.dataJson.member[1].roleName.en}
    member2MemberImage={data.dataJson.member[2].member.image}
    member2RoleName={data.dataJson.member[2].roleName.en}
    memberFormerName="Former member"
    member3RoleName={data.dataJson.member[3].roleName.en}
    member4RoleName={data.dataJson.member[4].roleName.en}
    member5RoleName={data.dataJson.member[5].roleName.en}
    companyDetails="Company details"
    privacy="privacy"
  />
);

export const query = graphql`
  query {
    dataJson {
      alternateName {
        en
      }
      contactPoint {
        contactType {
          en
        }
        id
      }
      description {
        en
      }
      makesOffer {
        alternateName {
          en
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
          en
        }
      }
      name {
        en
      }
    }
  }
`;
