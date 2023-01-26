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
                return Object.assign({}, edge.node.jsonId, {
                  description: edge.node.description.de || edge.node.description.en,
                  title: edge.node.name.de || edge.node.name.en,
                  date: edge.node.datePublished,
                  url: edge.node.id,
                  categories: (edge.node.keywords || []).concat(edge.node.about.map(about => about.id)),
                  author: edge.node.creator.map(creator => creator.name).join(", "),
                  enclosure: {url: 'https://lobid.org/images/lobid.png'},
                },
              )})
            },
            query: `{
  allPublicationJson(sort: {datePublished: DESC}) {
    edges {
      node {
        jsonId
        name {
          de
          en
        }
        description {
          de
          en
        }
        datePublished
        creator {
          name
        }
        keywords
        about {
          id
        }
      }
    }
  }
}`,
            output: "/team/feed.xml",
            title: "Lobid team RSS feed",
            description: "Publications and presentation by the Lobid team",
            feed_url: 'https://lobid.org/team/feed.xml',
            site_url: 'https://lobid.org/team/',
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
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sharp`
  ],
};
