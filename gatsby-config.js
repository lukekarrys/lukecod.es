const TURBOLINKS = process.env.TURBOLINKS === "true"
const NOJS = process.env.NOJS === "true"

module.exports = {
  siteMetadata: {
    title: `Luke Codes`,
    description: `The code blog of Luke Karrys.`,
    author: `@lukekarrys`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `projects`,
        path: `${__dirname}/src/projects`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#6a9fb5`,
        theme_color: `#6a9fb5`,
        display: `minimal-ui`,
        icon: `src/images/logo.png`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- more -->`,
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 820,
              withWebp: true,
            },
          },
          {
            resolve: "gatsby-remark-embed-gist",
            options: {
              username: "lukekarrys",
              includeDefaultCss: true,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon: false,
              maintainCase: false,
              removeAccents: true,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: true,
            },
          },
          {
            resolve: "gatsby-remark-codesandbox-repl",
            options: {
              target: "_blank",
              directory: `${__dirname}/src/examples/`,
            },
          },
          `gatsby-remark-smartypants`,
          `gatsby-remark-static-images`,
        ],
      },
    },
    "gatsby-plugin-draft",
    {
      resolve: `gatsby-plugin-catch-links`,
    },
    (TURBOLINKS || NOJS) && "gatsby-plugin-no-javascript",
  ].filter(Boolean),
}
