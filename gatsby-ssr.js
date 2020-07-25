const React = require("react")

const IS_PROD = process.env.NODE_ENV === "production"
const TURBOLINKS = process.env.TURBOLINKS === "true"

exports.onRenderBody = ({ setBodyAttributes, setHeadComponents }) => {
  setBodyAttributes({ class: "theme-base-0d" })
  setHeadComponents(
    [
      TURBOLINKS && IS_PROD && (
        <script defer src="/turbolinks.js" key="turbolinks"></script>
      ),
    ].filter(Boolean)
  )
}

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  replaceHeadComponents(
    getHeadComponents().filter(
      ({ key } = {}) =>
        key !== "gatsby-remark-autolink-headers-script" &&
        key !== "gatsby-remark-autolink-headers-style"
    )
  )
}
