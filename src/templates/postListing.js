import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ pageContext }) => {
  const { posts, currentPage, totalPages } = pageContext
  return (
    <Layout>
      <SEO title={currentPage === 1 ? "Home" : `Page ${currentPage}`} />
      <div className="posts">
        {posts.map(post => (
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

const Pagination = ({ currentPage, totalPages }) => {
  const toIndex = p => (p === "/page1" ? "/" : p)
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
