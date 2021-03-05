const path = require("path");

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

  const nodeArray = members.membership
    .map(membership => membership.member.id)
    .filter(id => id.indexOf("lobid.org/team") != -1)
    .map(id => id.slice(id.lastIndexOf("/") + 1, id.lastIndexOf("!#") - 1));
  const unique = [...new Set(nodeArray)];
  unique.forEach((member) => {
    createPage({
      path: `/team/${member}`,
      component: path.resolve(`./src/templates/member.js`),
      context: { id: member },
    });
  });
};