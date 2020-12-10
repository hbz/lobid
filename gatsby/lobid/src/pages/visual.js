import React from "react";
import { graphql } from "gatsby";
import { Visual } from "../components/visual.html";

export default ({ data }) => (
  <Visual
    members = {data.dataJson.member}
    products = {data.dataJson.makesOffer}
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
    }
  }
`;
