import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const PostListing = ({ data, pageContext }) => {
  const posts = data.posts.edges.map(({ node }) => node)
  const { title, currentPage, totalPages } = pageContext
  return (
    <Layout>
      <SEO title={title} />
      <div className="posts">
        {posts.map((post) => (
          <div key={post.fields.slug} className="post">
            <h1 className="post-title">
              <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
            </h1>
            <span className="post-date">{post.frontmatter.date}</span>
            <div className="post-content-truncate">
              {post.excerpt !== post.html ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  <Link className="block" to={post.fields.slug}>
                    Read more
                  </Link>
                </>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination {...{ currentPage, totalPages }} />
    </Layout>
  )
}

export default PostListing

const Pagination = ({ currentPage, totalPages }) => {
  const toIndex = (p) => (p === "/page1" ? "/" : p)
  const hasOlder = currentPage < totalPages
  const hasNewer = currentPage > 1

  return (
    <div className="pagination">
      {hasNewer ? (
        <Link
          className="pagination-item newer"
          to={toIndex(`/page${currentPage - 1}`)}
        >
          Prev
        </Link>
      ) : (
        <span className="pagination-item newer">Prev</span>
      )}
      {hasOlder ? (
        <Link
          className="pagination-item older"
          to={toIndex(`/page${currentPage + 1}`)}
        >
          Next
        </Link>
      ) : (
        <span className="pagination-item older">Next</span>
      )}
    </div>
  )
}

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
          html
          excerpt(format: HTML)
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
