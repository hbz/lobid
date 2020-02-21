const path = require("path");

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: "/team",
    component: path.resolve(`./src/pages/team-de.js`)
  });
};