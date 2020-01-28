<p align="center">
  <a href="https://www.lobid.org/">
    <img alt="lobid" src="https://lobid.org/images/lobid.png" width="60" />
  </a>
</p>
<h1 align="center">
  Lobid's gatsby starter
</h1>
This generates lobid's "team" site using gatsby. The [team.json](https://github.com/hbz/lobid/blob/master/team.json) is used as the _model_, the two files [team.js and team_en.js](https:/github.com/hbz/lobid/blob/master/gatsby/src/pages/) work as the _controller_ (basically using _graphql_ to get the data from the _team.json_ ) which use the
[team.html.js](https:/github.com/hbz/lobid/blob/master/gatsby/src/components/team.html.js) to generate views.

## Prerequisites

As this gatsby installation runs in paralell with the [old static html files](https://github.com/hbz/lobid/) and some assets shall be shared, do create some symbolic links:

```shell
cd src/components/
ln -s ../../../assets/stylesheets css
ln -s ../../../assets/images images
ln -s ../../../assets/javascripts javascripts
cd ../data
ls -s ../../static/team.json team.json

```

1. **Start developing.**

   Start it up.

   ```shell
   gatsby develop
   ```

1. **Open the source code and start editing!**

   Your site is now running at `http://localhost:8000`!

   _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

   Open the `my-hello-world-starter` directory in your code editor of choice and edit `src/pages/team.js`. Save your changes and the browser will update in real time!

1. Deploy

   ```shell
   gatsby build ; gatsby serve
   ```

It may be necessary to use the prefix-paths to go will with root directory of the old htmls:

```shell
gatsby build --prefix-paths ; gatsby serve
```

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

4. **`LICENSE`**: lobid is licensed under the MIT license.

5. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

6. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

7. **`README.md`**: A text file containing useful reference information about your project.
