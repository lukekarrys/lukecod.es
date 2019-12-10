const path = require("path")
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

const findRelatedPosts = ({ post, posts }) => {
  const otherPosts = _.reject(posts, p => p.fields.slug === post.fields.slug)

  const relatedPosts = _.chain(otherPosts)
    .map(p => ({
      ...p,
      // Related posts are included based on the number of shared tags
      relatedPosts: _.intersection(p.frontmatter.tags, post.frontmatter.tags)
    }))
    // Filter out posts with no shared tags
    .filter(p => p.relatedPosts.length)
    // And order by the ones with the most shared tags
    // The original order of posts is by descending date so that will be the fallback
    .orderBy(p => p.relatedPosts.length, "desc")
    // Get the top 3
    .slice(0, 3)
    // Fill out the rest of the array with first 3 posts (which are by date desc)
    .thru(arr => [...arr, ...otherPosts.slice(0, 3 - arr.length)])
    .value()

  return relatedPosts
}

const createPostPages = ({ actions, posts }) => {
  posts.forEach(post => {
    actions.createPage({
      path: post.fields.slug,
      component: path.resolve(`src/templates/post.js`),
      context: { post, relatedPosts: findRelatedPosts({ post, posts }) }
    })
  })
}

const createTagPages = ({ actions, posts }) => {
  const tagPages = posts.reduce((acc, post) => {
    post.frontmatter.tags.forEach(tag => {
      if (!acc[tag]) acc[tag] = []
      acc[tag].push(post)
    })
    return acc
  }, {})

  Object.keys(tagPages).forEach(tag => {
    actions.createPage({
      path: `/tags/${tag}`,
      component: path.resolve(`src/templates/shortListing.js`),
      context: { title: `Tag: ${tag}`, posts: tagPages[tag] }
    })
  })
}

const createListingPages = ({ actions, posts, perPage = 5 }) => {
  let start = 0

  const pageGroups = Array.from(Array(Math.ceil(posts.length / perPage))).map(
    () => {
      const group = posts.slice(start, start + perPage)
      start += perPage
      return group
    }
  )

  pageGroups.forEach((posts, index) => {
    const currentPage = index + 1
    actions.createPage({
      path: currentPage === 1 ? "/" : `/page${currentPage}`,
      component: path.resolve(`src/templates/postListing.js`),
      context: { posts, totalPages: pageGroups.length, currentPage }
    })
  })

  actions.createPage({
    path: `/full`,
    component: path.resolve(`src/templates/shortListing.js`),
    context: { title: `All Posts`, posts }
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

  node.frontmatter.tags = node.frontmatter.tags.map(t => t.replace(/\s/g, "-"))

  createNodeField({ node, name: `slug`, value: `/${dateSlug}/${title}` })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const results = await graphql(`
    query {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
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
              tags
            }
          }
        }
      }
    }
  `)

  if (results.errors) {
    throw results.errors
  }

  const posts = results.data.allMarkdownRemark.edges.map(({ node }) => node)
  createListingPages({ actions, posts })
  createTagPages({ actions, posts })
  createPostPages({ actions, posts })
}

exports.onCreateNode = ({ node, ...rest }) => {
  if (node.internal.type === `MarkdownRemark`) {
    createPostFields({ node, ...rest })
  }
}
