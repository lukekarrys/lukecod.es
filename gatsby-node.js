const path = require("path")
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

const sourceFilesystemFilters = {
  posts: {
    fileAbsolutePath: { regex: `/${path.join(__dirname, "src", "posts")}/` },
    fields: { draft: { eq: false } },
  },
  projects: {
    fileAbsolutePath: { regex: `/${path.join(__dirname, "src", "projects")}/` },
  },
}

const findRelatedPosts = ({ post, posts }) => {
  const otherPosts = _.reject(posts, (p) => p.fields.slug === post.fields.slug)

  const relatedPosts = _.chain(otherPosts)
    .map((p) => ({
      ...p,
      // Related posts are included based on the number of shared tags
      relatedPosts: _.intersection(p.frontmatter.tags, post.frontmatter.tags),
    }))
    // Filter out posts with no shared tags
    .filter((p) => p.relatedPosts.length)
    // And order by the ones with the most shared tags
    // The original order of posts is by descending date so that will be the fallback
    .orderBy((p) => p.relatedPosts.length, "desc")
    // Get the top 3
    .slice(0, 3)
    // Fill out the rest of the array with first 3 posts (which are by date desc)
    .thru((arr) => [...arr, ...otherPosts.slice(0, 3 - arr.length)])
    .value()

  return relatedPosts
}

const fixDeepLinksInExcerpts = (post) => {
  // In excerpts, replace in-post links with a link to the post+the link
  // so thats links from listing pages work
  post.excerpt = post.excerpt.replace(
    /href="#([\w\-]+)"/gi,
    `href="${post.fields.slug}#$1"`
  )
}

const createPostPages = ({ actions, posts }) => {
  posts.forEach((post) => {
    fixDeepLinksInExcerpts(post)
    actions.createPage({
      path: post.fields.slug,
      component: path.resolve(`src/templates/post.js`),
      context: {
        slug: post.fields.slug,
        relatedPosts: findRelatedPosts({ post, posts }),
      },
    })
  })
}

const createPostTagPages = ({ actions, posts }) => {
  posts
    .reduce(
      (acc, post) =>
        post.frontmatter.tags.reduce((acc, tag) => acc.add(tag), acc),
      new Set()
    )
    .forEach((tag) => {
      actions.createPage({
        path: `/tags/${tag}`,
        component: path.resolve(`src/templates/shortPostListing.js`),
        context: {
          title: `Tag: ${tag}`,
          filter: {
            frontmatter: { tags: { in: [tag] } },
            ...sourceFilesystemFilters.posts,
          },
        },
      })
    })
}

const createPostListingPages = ({ actions, posts, limit = 5 }) => {
  const totalPages = Math.ceil(posts.length / limit)
  Array.from({ length: totalPages }).forEach((_, i) => {
    const currentPage = i + 1
    actions.createPage({
      path: currentPage === 1 ? "/" : `/page${currentPage}`,
      component: path.resolve(`src/templates/postListing.js`),
      context: {
        title: currentPage === 1 ? "Home" : `Page ${currentPage}`,
        limit,
        skip: i * limit,
        totalPages,
        currentPage,
        filter: {
          ...sourceFilesystemFilters.posts,
        },
      },
    })
  })

  actions.createPage({
    path: `/full`,
    component: path.resolve(`src/templates/shortPostListing.js`),
    context: {
      title: `All Posts`,
      filter: {
        ...sourceFilesystemFilters.posts,
      },
    },
  })
}

const createPostFields = ({ actions, node, getNode }) => {
  const { createNodeField } = actions

  const filename = createFilePath({ node, getNode })

  // get the date and title from the file name
  const [, date, title] = filename.match(
    /^\/([\d]{4}-[\d]{2}-[\d]{2})-{1}(.+)\/$/
  )

  const dateSlug = date.replace(/-/g, "/")

  node.frontmatter.tags = Array.isArray(node.frontmatter.tags)
    ? node.frontmatter.tags.map((t) => t.replace(/\s/g, "-"))
    : []

  createNodeField({ node, name: `slug`, value: `/${dateSlug}/${title}` })
}

const createProjectPages = ({ actions, projects }) => {
  projects.forEach((project) => {
    actions.createPage({
      path: project.fields.slug,
      component: path.resolve(`src/templates/project.js`),
      context: {
        slug: project.fields.slug,
      },
    })
  })
}

const createProjectListingPages = ({ actions, projects }) => {
  actions.createPage({
    path: `/projects`,
    component: path.resolve(`src/templates/projectListing.js`),
    context: {
      title: `Projects`,
      filter: {
        ...sourceFilesystemFilters.projects,
      },
    },
  })
}

const createProjectFields = ({ actions, node, getNode }) => {
  const { createNodeField } = actions

  const filename = createFilePath({ node, getNode })
  const title = path.basename(filename, ".md")

  createNodeField({ node, name: `slug`, value: `/projects/${title}` })
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const stringify = (obj) => JSON.stringify(obj).replace(/"([^"]+)":/g, "$1:")

  const results = await graphql(`
    query {
      Posts: allMarkdownRemark(
        filter: ${stringify(sourceFilesystemFilters.posts)}
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            html
            excerpt(format: HTML)
            fields {
              slug
            }
            frontmatter {
              tags
              title
              date
            }
          }
        }
      }

      Projects: allMarkdownRemark(
        filter: ${stringify(sourceFilesystemFilters.projects)}
        sort: { order: DESC, fields: [frontmatter___title] }
      ) {
        edges {
          node {
            html
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  if (results.errors) {
    reporter.panicOnBuild(`Error while running allMarkdownRemark query`)
    return
  }

  const posts = results.data.Posts.edges.map((n) => n.node)
  createPostListingPages({ actions, posts })
  createPostTagPages({ actions, posts })
  createPostPages({ actions, posts })

  const projects = results.data.Projects.edges.map((n) => n.node)
  createProjectListingPages({ actions, projects })
  createProjectPages({ actions, projects })
}

exports.onCreateNode = ({ node, ...rest }) => {
  if (node.internal.type === `MarkdownRemark`) {
    if (node.frontmatter.date) {
      createPostFields({ node, ...rest })
    } else {
      createProjectFields({ node, ...rest })
    }
  }
}
