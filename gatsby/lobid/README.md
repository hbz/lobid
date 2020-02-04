<p align="center">
  <a href="https://www.lobid.org/">
    <img alt="lobid" src="https://lobid.org/images/lobid.png" width="60" />
  </a>
</p>
<h1 align="center">
  Lobid's gatsby starter
</h1>
Linking Open Bibliographic Data. </br></br>

This is only the repo of the landing page of https://lobid.org/.

For the repos with the software implementations, see:

https://github.com/hbz/lobid-resources implements https://lobid.org/resources.</br>
https://github.com/hbz/lobid-organisations implements https://lobid.org/organisations.</br>
https://github.com/hbz/lobid-gnd implements https://lobid.org/gnd.</br>

For information about the Lobid architecture and development process, see [hbz.github.io/#lobid](https://hbz.github.io/#lobid).

<h2> Static and generated sites </h2>
Some sites are just static plain html. These must reside in the `static` folder. They will be deployed to the proper place when doing `gatsby build` or `gatsby develop`.
Some other pages, like lobid's "team" page, is generated using gatsby. The [team.json](https://github.com/hbz/lobid/tree/master/gatsby/lobid/static/team.json) is used as the _model_, the two files [team.js and team_en.js](https:/github.com/hbz/lobid/tree/master/gatsby/lobid/src/pages/) work as the _controller_ (basically using _graphql_ to get the data from the _team.json_ ) which use the
[team.html.js](https:/github.com/hbz/lobid/tree/master/gatsby/lobid/src/components/team.html.js) to generate views.

## Prerequisites

Make sure `node --version` is at least `v10.18.1` and `npm --version` is at least `6.13.4`. Then install gatsby:
```shell
npm install
```

1. **Start developing.**

   Start it up.

   ```shell
   gatsby develop
   ```

1. **Open the source code and start editing!**

   Your site is now running at `http://localhost:8000`!

   _Note: As the port 8000 is closed on emphytos use the proxy http://gatsbydev.lobid.org/. You'll also see a second link: _`http://localhost:8000/___graphql`_, adjust this to the proxy. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._
   Also, only the dynamically generated pages (this defined in _src/pages_) are served properly.
   Open the `lobid` directory in your code editor of choice and edit `src/pages/team.js`. Save your changes and the browser will update in real time!

1. **Deploy**

   ```shell
   gatsby build
   ```
This generates the `public` folder which is the `document root` of apache.

Other pages, like `/download`, `/labs` etc. are configured to another document root, see the `vhost.conf` on emphytos for that.

## 🧐 What's inside

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── gatsby-config.js
    ├── package-lock.json
    ├── package.json
    └── README.md

1. **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages). If it doesn't exist, you haven't installed _gatsby_ yet.

2. **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3. **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, configure the _prefix-paths_ etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

4. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

5. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

6. **`README.md`**: A text file containing useful reference information about your project.

<h2> Example: changing data on the `team` page </h2>
  
  Open the file `static/team.json` and update the data there (this is our *Model*).
  If you only had to change the data, do `gatsby build` in the `gatsby/lobid/` directory and the `/team/` and `team_en` pages are updated. You are done!
  
  If you want to add or remove data, you have to graphql your *Model* (your `static/team.json`) via the *Controller** (`src/pages/team.js` and `src/pages/team_en.js`) and pass the data to `src/components/team.html.js`, aka *View*). The latter is the template for generating both language pages. Here you work on html and JSX Javascript. At the end, don't forget to `gatsby build`!


<h2>  License </h2>

Eclipse Public License: http://www.eclipse.org/legal/epl-v10.html
 
