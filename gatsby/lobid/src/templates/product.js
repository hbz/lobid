import React from "react";
import { graphql } from "gatsby";
import { Product } from "../components/product.html";
import { simpleId } from '../components/helpers.js'

export default function ProductPage({ data, location, pageContext }) {
  const product = data.allFile.edges.slice(-1).pop().node.childProductJson
  return (<Product
    product={product}
    pubs={data.allPublicationJson.edges
      .map(edge => edge.node)
      .filter(p => p.about && p.about.find(a => simpleId(a.id) === pageContext.id))
      .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    }
    contactName="Kontakt"
    publications="Publikationen"
    language="English"
    teamLink="/team-de"
    hasPart="Besteht aus"
    isBasedOn="Basiert auf"
    isRelatedTo="Bezug"
    companyDetails="Impressum"
    privacy="Datenschutz"
    contactPointId="mailto:semweb@hbz-nrw.de"
  />);
}

export const query = graphql`
  query ProductQuery($id: String!) {
    allFile (filter: { name: { eq : $id }}) {
      edges {
        node {
          childProductJson {
            url
            image
            name {
              label: de
            }
            slogan {
              label: de
            }
            description {
              label: de
            }
            id,
            hasPart {
              id
            },
            isBasedOn {
              id
            },
            isRelatedTo {
              id
            }
          }
        }
      }
    }
    allPublicationJson {
      edges {
        node {
          id
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
  }
`;
