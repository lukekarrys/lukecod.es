import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ShortPostsListing from "../components/ShortPostsListing"

const ShortPostListing = ({ data, pageContext }) => {
  const posts = data.posts.edges.map(({ node }) => node)
  const { title } = pageContext
  return (
    <Layout>
      <SEO title={title} />
      <h1 className="post-title">{title}</h1>
      <ShortPostsListing posts={posts} />
    </Layout>
  )
}

export default ShortPostListing

export const query = graphql`
  query($limit: Int, $skip: Int, $filter: MarkdownRemarkFilterInput) {
    posts: allMarkdownRemark(
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
