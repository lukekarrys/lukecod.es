import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ShortPostsListing from "../components/ShortPostsListing"

export default ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => node)
  const { title } = pageContext
  return (
    <Layout>
      <SEO title={title} />
      <h1 className="post-title">{title}</h1>
      <ShortPostsListing posts={posts} />
    </Layout>
  )
}

export const query = graphql`
  query($limit: Int, $skip: Int, $filter: MarkdownRemarkFilterInput) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: $filter
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
