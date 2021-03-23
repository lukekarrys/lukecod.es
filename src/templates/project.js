import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Project = ({ data: { project } }) => {
  const { frontmatter: meta, html } = project

  const links = [
    ...(meta.gh || []).map((l) => ({
      href: `https://github.com/${l}`,
      children: "GitHub",
    })),
    ...(meta.npm || []).map((l) => ({
      href: `https://npmjs.com/package/${l}`,
      children: "npm",
    })),
    meta.link && { href: meta.link, children: "Link" },
    meta.blog && { href: meta.blog, children: "Blog" },
    meta.tw && { href: `https://twitter.com/${meta.tw}`, children: "Twitter" },
  ].filter(Boolean)

  return (
    <Layout>
      <SEO title={meta.title} />
      <div className="post">
        <h1 className="post-title">{meta.title}</h1>
        {links.length && (
          <p className="categories">
            {links.map((l) => (
              <a className="category" key={l.href} href={l.href}>
                {l.children}
              </a>
            ))}
          </p>
        )}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Layout>
  )
}

export default Project

export const query = graphql`
  query($slug: String) {
    project: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        gh
        npm
        link
        blog
        tw
      }
    }
  }
`
