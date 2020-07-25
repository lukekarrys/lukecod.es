import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, Link } from "gatsby"

import "../styles/google-fonts.css"
import "../styles/poole.css"
import "../styles/hyde.css"
import "../styles/custom.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  return (
    <>
      <div className="sidebar">
        <div className="container sidebar-sticky">
          <div className="sidebar-about">
            <h1>
              <Link to="/">{data.site.siteMetadata.title}</Link>
            </h1>
            <p className="lead">{data.site.siteMetadata.description}</p>
          </div>
          <nav className="sidebar-nav">
            <Link className="sidebar-nav-item" to="/">
              Home
            </Link>
            <Link className="sidebar-nav-item" to="/full">
              All Posts
            </Link>
            <Link className="sidebar-nav-item" to="/projects">
              Projects
            </Link>
            <a
              className="sidebar-nav-item"
              href="https://lukekarrys.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              About Me
            </a>
            <a
              className="sidebar-nav-item"
              href="https://github.com/lukekarrys"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
      <div className="content container">{children}</div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
