/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allPublicationJson } }) => {
              return allPublicationJson.edges.map(edge => {
                return Object.assign({}, edge.node.id, {
                  description: edge.node.description.de || edge.node.description.en,
                  title: edge.node.name.de || edge.node.name.en,
                  date: edge.node.datePublished,
                  url: edge.node.id,
                  guid: edge.node.id,
                })
              })
            },
            query: `
              {
                allPublicationJson(
                  sort: { order: DESC, fields: [datePublished] },
                ) {
                  edges {
                    node {
                      id
                      name {
                        de
                        en
                      }
                      description {
                        de
                        en
                      }
                      datePublished
                    }
                  }
                }
              }
            `,
            output: "/team/rss.xml",
            title: "Lobid team RSS feed",
            description: "Publications and presentation by the Lobid team",
          },
        ],
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/team/`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/publication/`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/product/`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/project/`,
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`
  ],
};
