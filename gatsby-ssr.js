exports.onRenderBody = ({ setBodyAttributes }) => {
  setBodyAttributes({ class: "theme-base-0d" })
}

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  replaceHeadComponents(
    getHeadComponents().filter(
      ({ key }) =>
        key !== "gatsby-remark-autolink-headers-script" &&
        key !== "gatsby-remark-autolink-headers-style"
    )
  )
}
