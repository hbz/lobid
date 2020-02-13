import React from "react";
import { graphql } from "gatsby";
import { Team } from "../components/team.html";

import "../components/css/lobid.css";
import "../components/css/bootstrap.min.css";
import "../components/css/main.css";
import "../components/css/font-awesome.min.css";

export default ({ data }) => (
  <Team
    contactPointId={data.dataJson.contactPoint[0].id}
    contactPointContactType={data.dataJson.contactPoint[0].contactType.de}
    description={data.dataJson.description.de}
    makesOfferAlternateName0={data.dataJson.makesOffer[0].alternateName.de}
    makesOfferAlternateName1={data.dataJson.makesOffer[1].alternateName.de}
    makesOfferAlternateName2={data.dataJson.makesOffer[2].alternateName.de}
    makesOfferAlternateName3={data.dataJson.makesOffer[3].alternateName.de}
    publications="Publikationen"
    language="English"
    languageTooltip="Switch language to English"
    languageLink="/index-en.html"
    teamLink="/team"
    makesOfferName="Produkte"
    memberName="Mitglieder"
    member0MemberImage={data.dataJson.member[0].member.image}
    member0RoleName={data.dataJson.member[0].roleName.de}
    member1MemberImage={data.dataJson.member[1].member.image}
    member1RoleName={data.dataJson.member[1].roleName.de}
    member2MemberImage={data.dataJson.member[2].member.image}
    member2RoleName={data.dataJson.member[2].roleName.de}
    memberFormerName="Ehemalige"
    member3RoleName={data.dataJson.member[3].roleName.de}
    member4RoleName={data.dataJson.member[4].roleName.de}
    member5RoleName={data.dataJson.member[5].roleName.de}
    companyDetails="Impressum"
    privacy="Datenschutz"
  />
);

export const query = graphql`
  query {
    dataJson {
      alternateName {
        de
      }
      contactPoint {
        contactType {
          de
        }
        id
      }
      description {
        de
      }
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
      name {
        de
      }
    }
  }
`;
