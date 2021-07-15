import React from "react";
import { graphql } from "gatsby";
import { Team } from "../components/team.html";

export default ({ data, location, pageContext }) => {
  return (
  <Team
    team={data.dataJson}
    members={data.allTeamJson.edges}
    products={data.allProductJson.edges}
    projects={data.allProjectJson.edges}
    lang={pageContext.lang}
    contactName={pageContext.lang==="de"?"Kontakt":"Contact"}
    subtitle={pageContext.lang==="de"?"Dateninfrastruktur für Bibliotheken":"Data infrastructure for libraries"}
    publications={pageContext.lang==="de"?"Publikationen":"Publications"}
    language={pageContext.lang==="de"?"English":"Deutsch"}
    languageTooltip={pageContext.lang==="de"?"Switch language to English":"Wechsel zur deutschen Version"}
    languageLink={pageContext.lang==="de"?"/team-en":"/team-de"}
    teamLink={pageContext.lang==="de"?"/team-de":"/team-en"}
    makesOfferName={pageContext.lang==="de"?"Produkte":"Products"}
    projectsName={pageContext.lang==="de"?"Projekte":"Projects"}
    memberName={pageContext.lang==="de"?"Mitglieder":"Members"}
    memberFormerName={pageContext.lang==="de"?"Ehemalige":"Former members"}
    companyDetails={pageContext.lang==="de"?"Impressum":"Imprint"}
    privacy={pageContext.lang==="de"?"Datenschutz":"Privacy"}
    contactPointId="mailto:lobid-admin@hbz-nrw.de"
  />
)};

export const query = graphql`
  query {
    dataJson {
      alternateName {
        de
        en
      }
      contactPoint {
        contactType {
          de
          en
        }
        id
        image
      }
      description {
        de
        en
      }
      makesOffer {
        id
        name
      }
      membership {
        member {
          id
          name {
            de
            en
          }
        }
        roleName {
          de
          en
        }
        startDate
        endDate
      }
      name {
        de
        en
      }
    }
    allTeamJson {
      edges {
        node {
          id
          image
          email
          name {
            de
            en
          }
        }
      }
    }
    allProductJson {
      edges {
        node {
          id
          slogan {
            de
            en
          }
          
        }
      }
    }
    allProjectJson {
      edges {
        node {
          id
          name {
            de
            en
          }
          alternateName
        }
      }
    }
  }
`;
