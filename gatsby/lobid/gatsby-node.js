const path = require("path");

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: "/team",
    component: path.resolve(`./src/pages/team-de.js`)
  });

  createPage({
    path: "/visual",
    component: path.resolve(`./src/pages/visual.js`)
  });
};