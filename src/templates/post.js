import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ShortPostsListing from "../components/ShortPostsListing"

const Post = ({ data: { post }, pageContext }) => {
  const { relatedPosts } = pageContext
  return (
    <Layout>
      <SEO title={post.frontmatter.title} />
      <div className="post">
        <h1 className="post-title">{post.frontmatter.title}</h1>
        <span className="post-date">{post.frontmatter.date}</span>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
      <div className="related">
        <p>
          <a href="https://github.com/lukekarrys">Drop me a line</a> if you have
          any questions, comments, or just want to say hi. Thanks for reading,
          you seem nice.
        </p>
        <h2>Filed Under</h2>
        <p className="categories">
          {post.frontmatter.tags.map((tag) => (
            <Link key={tag} className="category" to={`/tags/${tag}`}>
              {tag}
            </Link>
          ))}
        </p>
        {relatedPosts.length > 0 && (
          <>
            <h2>Related Posts</h2>
            <ShortPostsListing posts={relatedPosts} />
          </>
        )}
      </div>
    </Layout>
  )
}

export default Post

export const query = graphql`
  query($slug: String) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
