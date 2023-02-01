const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions
  const { createPage } = actions;

  createPage({
    path: "/team",
    component: path.resolve(`./src/templates/team.js`),
    context: { lang: "de" },
  });

  createPage({
    path: "/team-de",
    component: path.resolve(`./src/templates/team.js`),
    context: { lang: "de" },
  });

  createPage({
    path: "/team-en",
    component: path.resolve(`./src/templates/team.js`),
    context: { lang: "en" },
  });

  // Pages for individual members listed in `membership`

  const {
    data: { members },
  } = await graphql(`
      {
        members: dataJson {
          membership {
            member {
              id
            }
          }
      }
    }
  `);

  const shortMemberIds = members.membership.map(m => m.member.id)
    .filter(id => id.indexOf("lobid.org/team") != -1)
    .map(id => id.slice(id.lastIndexOf("/") + 1, id.lastIndexOf("!#") - 1));
  console.log("Creating member pages: ", shortMemberIds);  
  addPages(shortMemberIds, "team", "./src/templates/member.js", createPage);

  // Pages for individual products listed in `makesOffer`

  const {
    data: { products },
  } = await graphql(`
  {
    products: dataJson {
      makesOffer {
          id
      }
    }
  }
  `);

  const shortProductIds = products.makesOffer.map(p => p.id)
    .filter(id => id.indexOf("/") != -1)
    .map(id => id.slice(id.lastIndexOf("/") + 1));
  console.log("Creating product pages: ", shortProductIds);
  addPages(shortProductIds, "product", "./src/templates/product.js", createPage);

  // Pages for individual project files in /project

  const {
    data: { projects },
  } = await graphql(`
  {
    projects: allProjectJson {
      edges {
        node {
          jsonId
        }
      }
    }
  }
  `);
  const shortProjectIds = projects.edges.map(e => e.node.jsonId)
    .filter(id => id.indexOf("/") != -1)
    .map(id => id.slice(id.lastIndexOf("/") + 1));
  console.log("Creating project pages: ", shortProjectIds);
  addPages(shortProjectIds, "project", "./src/templates/project.js", createPage);

};

// Create `fields.jsonFile` fields to link to static publication JSON files
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === "PublicationJson") {

    const relativeFilePath = createFilePath({
      node,
      getNode,
      trailingSlash: false,
    })

    createNodeField({
      node,
      name: "jsonFile",
      value: `/publication${relativeFilePath}.json`,
    })
  }
}

function addPages(ids, prefix, template, createPage) {
  const unique = [...new Set(ids)];
  unique.forEach((entityId) => {
    createPage({
      path: `/${prefix}/${entityId}`,
      component: path.resolve(template),
      context: { id: entityId },
    });
  });
}
