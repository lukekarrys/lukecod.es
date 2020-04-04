import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data: { project }, pageContext }) => {
  return (
    <Layout>
      <SEO title={project.frontmatter.title} />
      <div className="post">
        <h1 className="post-title">{project.frontmatter.title}</h1>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: project.html }}
        />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String) {
    project: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`
