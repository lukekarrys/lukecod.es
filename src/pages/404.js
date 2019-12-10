import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="Not found" />
    <div className="page">
      <h1 className="page-title">Page not found</h1>
      <p className="lead">
        Sorry, we've misplaced that URL or it's pointing to something that
        doesn't exist. <Link to="/">Head back home</Link> to try finding it
        again.
      </p>
    </div>
  </Layout>
)

export default NotFoundPage
