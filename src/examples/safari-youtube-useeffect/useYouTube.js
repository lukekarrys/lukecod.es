import React from "react"

const addScript = (src) => {
  const s = document.createElement("script")
  s.setAttribute("src", src)
  document.body.appendChild(s)
}

const useYouTube = (playerElement, videoId) => {
  const [iframeReady, setIframeReady] = React.useState(false)
  const playerRef = React.useRef(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => setIframeReady(true)
      addScript("https://www.youtube.com/iframe_api")
    } else {
      setIframeReady(true)
    }
  }, [])

  React.useEffect(() => {
    if (iframeReady) {
      playerRef.current = new window.YT.Player(playerElement, {
        height: "390",
        width: "640",
        videoId,
        events: {
          onReady: () => setReady(true),
          onError: (e) => console.error(e),
        },
      })
    }
  }, [iframeReady, playerElement, videoId])

  return [ready, playerRef.current]
}

export default useYouTube
