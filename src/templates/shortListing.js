import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ShortPostsListing from "../components/ShortPostsListing"

export default ({ pageContext }) => {
  const { posts, title } = pageContext
  return (
    <Layout>
      <SEO title={title} />
      <h1 className="post-title">{title}</h1>
      <ShortPostsListing posts={posts} />
    </Layout>
  )
}
