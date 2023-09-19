import React from "react";
import { graphql } from "gatsby";
import Header from "../components/header.html";
import Footer from "../components/footer.html";
import "../components/css/lobid.css";
import "../components/css/bootstrap.min.css";
import "../components/css/font-awesome.min.css";

export default function Template({ data, pageContext }) {

  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark
  return (
    <div className="container">
      <Header 
        publications={pageContext.lang==="de"?"Publikationen":"Publications"}
        language={pageContext.lang==="de"?"English":"Deutsch"}
        languageTooltip={pageContext.lang==="de"?"Switch language to English":"Wechsel zur deutschen Version"}
        teamLink={pageContext.lang==="de"?"/team-de":"/team-en"}
      />
      <div>
        <div className="page-header">
          <h1>{frontmatter.title}</h1>
        </div>
        <div className="toc" dangerouslySetInnerHTML={{ __html: data.markdownRemark.tableOfContents }} />
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <Footer 
        companyDetails={pageContext.lang==="de"?"Impressum":"Imprint"}
        privacy={pageContext.lang==="de"?"Datenschutz":"Privacy"}
        contactPointId="mailto:lobid-admin@hbz-nrw.de"
        warranty={pageContext.lang==="de"?"Gewährleistung":"Warranty"}
      />
    </div>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      tableOfContents
      frontmatter {
        slug
        title
      }
    }
  }
`