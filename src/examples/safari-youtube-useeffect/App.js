import React from "react"
import ReactDOM from "react-dom"
import useYouTube from "./useYouTube"

const App = () => {
  const playerRef = React.useRef()
  const [ready, player] = useYouTube(playerRef.current, "Z4j5rJQMdOU")
  const [play, setPlay] = React.useState(false)
  const [playLayout, setPlayLayout] = React.useState(false)
  const [playClick, setPlayClick] = React.useState(false)
  const hasPlayed = play || playLayout || playClick

  React.useEffect(() => {
    if (play) player.playVideo()
  }, [play, player])

  React.useLayoutEffect(() => {
    if (playLayout) player.playVideo()
  }, [playLayout, player])

  return (
    <div>
      <h1>iOS - YouTube iFrame API play via effect / layoutEffect / onClick</h1>
      <p>
        The "play effect" button will not start the video on iOS. use the
        "useLayoutEffect" hook or an event handler
      </p>
      <div ref={playerRef} />
      <div>
        {ready ? (
          hasPlayed ? (
            <button onClick={() => window.location.reload()}>Reset</button>
          ) : (
            <React.Fragment>
              <button onClick={() => setPlay(true)}>play - effect</button>
              <button onClick={() => setPlayLayout(true)}>
                play - layout effect
              </button>
              <button
                onClick={() => {
                  setPlayClick(true)
                  player.playVideo()
                }}
              >
                play - onclick
              </button>
            </React.Fragment>
          )
        ) : null}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
