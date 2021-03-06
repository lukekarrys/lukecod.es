import React from "react"
import { Link } from "gatsby"

export default ({ posts }) => (
  <ul className="related-posts">
    {posts.map((post) => (
      <li key={post.fields.slug}>
        <h3>
          <Link to={post.fields.slug}>
            {post.frontmatter.title}
            {(post.frontmatter.prettyDate || post.frontmatter.date) && (
              <>
                <br />
                <small>
                  {post.frontmatter.prettyDate || post.frontmatter.date}
                </small>
              </>
            )}
          </Link>
        </h3>
      </li>
    ))}
  </ul>
)
