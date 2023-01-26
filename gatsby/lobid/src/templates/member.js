import React from "react";
import { graphql } from "gatsby";
import { Member } from "../components/member.html";

export default function MemberPage({ data, location, pageContext }) {
  const member = data.allFile.edges[0].node.childTeamJson
  return (<Member
    member={member}
    products={data.allProductJson.edges
      .map(edge => edge.node)
      .filter(p => p.membership.find(m => m.member.id === member.id))
    }
    projects={data.allProjectJson.edges
      .map(edge => edge.node)
      .filter(p => !p.endDate && p.membership.find(m => m.member.id === member.id))
    }
    pubs={data.allPublicationJson.edges
      .map(edge => edge.node)
      .filter(p => p.creator.find(c => c.id === member.id))
      .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    }
    contactName="Kontakt"
    title="Offene Infrastruktur"
    publications="Publikationen"
    language="English"
    teamLink="/team-de"
    makesOfferName="Produkte"
    projectsName="Projekte"
    memberName="Mitglieder"
    memberFormerName="Ehemalige"
    companyDetails="Impressum"
    privacy="Datenschutz"
    contactPointId="mailto:lobid-admin@hbz-nrw.de"
    lang="de"
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
    allPublicationJson {
      edges {
        node {
          jsonId
          type
          creator {
            id
          }
          name {
            de
            en
          }
          about {
            id
          }
          datePublished
          fields {
            jsonFile
          }
        }
      }
    }
    allProductJson {
      edges {
        node {
          jsonId
          image
          name {
            de
            en
          }
          alternateName
          slogan {
            de
            en
          }
          membership {
            member {
              id
            }
          }
        }
      }
    }
    allProjectJson {
      edges {
        node {
          jsonId
          image
          name {
            de
            en
          }
          alternateName
          endDate
          membership {
            member {
              id
            }
          }
        }
      }
    }
  }
`;
