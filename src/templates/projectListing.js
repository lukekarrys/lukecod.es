import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ShortPostsListing from "../components/ShortPostsListing"

export default ({ data, pageContext }) => {
  const projects = data.projects.edges.map(({ node }) => node)
  const { title, type } = pageContext
  return (
    <Layout>
      <SEO title={title} />
      <h1 className="post-title">{title}</h1>
      {type === "projects" ? (
        <>
          <h1>I make projects</h1>
          <p>
            My philosophy around personal projects tries to walk the
            intersection of fun, useless, and interesting. For all of these,
            I've put far more work into them than people who have used them, and
            I'm really proud of that.
          </p>
        </>
      ) : type === "modules" ? (
        <>
          <h1>I write modules</h1>
          <p>
            I love open source. I've created and contribute to a bunch of other
            modules outside of ones for the projects above. I try to publish
            everything to <a href="https://www.npmjs.com/~lukekarrys">npm</a>{" "}
            with good docs and put the source on{" "}
            <a href="https://github.com/lukekarrys?tab=repositories">GitHub</a>.
          </p>
        </>
      ) : null}
      <ShortPostsListing posts={projects} />
    </Layout>
  )
}

export const query = graphql`
  query($filter: MarkdownRemarkFilterInput) {
    projects: allMarkdownRemark(
      sort: { fields: [frontmatter___title], order: DESC }
      filter: $filter
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
