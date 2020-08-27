const fs = require(`fs`)
const LZString = require(`lz-string`)
const { join } = require(`path`)
const map = require(`unist-util-map`)
const normalizePath = require(`normalize-path`)
const npa = require(`npm-package-arg`)
const { walkSync } = require("@nodelib/fs.walk")

const {
  OPTION_DEFAULT_LINK_TEXT,
  PROTOCOL_CODE_SANDBOX,
  OPTION_DEFAULT_CODESANDBOX,
} = require(`./constants`)

// Matches compression used in Babel and CodeSandbox REPLs
// https://github.com/babel/website/blob/master/js/repl/UriUtils.js
const compress = (string) =>
  LZString.compressToBase64(string)
    .replace(/\+/g, `-`) // Convert '+' to '-'
    .replace(/\//g, `_`) // Convert '/' to '_'
    .replace(/=+$/, ``) // Remove ending '='

function convertNodeToLink(node, text, href, target) {
  target = target ? `target="${target}" rel="noreferrer"` : ``

  delete node.children
  delete node.position
  delete node.title
  delete node.url

  node.type = `html`
  node.value = `<a href="${href}" ${target}>${text}</a>`
}

module.exports = (
  { markdownAST },
  {
    directory,
    target,
    defaultText = OPTION_DEFAULT_LINK_TEXT,
    codesandbox = OPTION_DEFAULT_CODESANDBOX,
  } = {}
) => {
  codesandbox = { ...OPTION_DEFAULT_CODESANDBOX, ...codesandbox }

  if (!directory) {
    throw Error(`Required REPL option "directory" not specified`)
  } else if (!fs.existsSync(directory)) {
    throw Error(`Invalid REPL directory specified "${directory}"`)
  } else if (!directory.endsWith(`/`)) {
    directory += `/`
  }

  const getMultipleFilesPaths = (urls, protocol, directory) => {
    const parsedUrls = urls
      .replace(protocol, ``)
      .split(`,`)
      .map((url) => {
        const urlParts = url.split("/")
        return {
          // All examples are top level directories in the main examples directory
          // so when moving them to codepen we can make that them all top level files
          // by removing the local example directory
          url: urlParts.length > 1 ? urlParts.slice(1).join("/") : url,
          filePath: normalizePath(join(directory, url)), // absolute path
        }
      })

    // If there is only a directory specified then walk it and include all the files
    // in the codesandbox
    if (
      parsedUrls.length === 1 &&
      fs.lstatSync(parsedUrls[0].filePath).isDirectory()
    ) {
      return walkSync(parsedUrls[0].filePath)
        .filter((item) => !item.name.startsWith("."))
        .map((item) => ({
          url: item.name,
          filePath: item.path,
        }))
    }

    return parsedUrls
  }

  const verifyFile = (path) => {
    if (!fs.existsSync(path)) {
      throw Error(`Invalid REPL link specified; no such file "${path}"`)
    }
  }

  const verifyMultipleFiles = (paths, protocol) =>
    paths.forEach((path) => verifyFile(path.filePath, protocol))

  map(markdownAST, (node) => {
    if (node.type === `link` && node.url.startsWith(PROTOCOL_CODE_SANDBOX)) {
      const filesPaths = getMultipleFilesPaths(
        node.url,
        PROTOCOL_CODE_SANDBOX,
        directory
      )

      verifyMultipleFiles(filesPaths, PROTOCOL_CODE_SANDBOX)

      // CodeSandbox GET API requires a list of "files" keyed by name
      // We always need a package.jsona and html file but we can overwrite
      // either of these by specifying them in the example directory
      let parameters = {
        files: {
          "package.json": {
            content: {
              dependencies: codesandbox.dependencies.reduce(
                (map, dependency) => {
                  const { name, fetchSpec } = npa(dependency)
                  map[name] = fetchSpec
                  return map
                },
                {}
              ),
              main: filesPaths[0].url,
            },
          },
          "index.html": {
            content: codesandbox.html,
          },
        },
      }

      filesPaths.forEach((path) => {
        const code = fs.readFileSync(path.filePath, `utf8`)
        parameters.files[path.url] = {
          content: code,
        }
      })

      // This config JSON must then be lz-string compressed
      parameters = compress(JSON.stringify(parameters))

      const href = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`
      const text =
        node.children.length === 0 ? defaultText : node.children[0].value

      convertNodeToLink(node, text, href, target)
    }

    // No change
    return node
  })

  return markdownAST
}
