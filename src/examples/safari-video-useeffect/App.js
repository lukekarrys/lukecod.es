import React from "react"
import ReactDOM from "react-dom"

const App = () => {
  const playerRef = React.useRef()
  const [play, setPlay] = React.useState(false)
  const [playLayout, setPlayLayout] = React.useState(false)
  const [playClick, setPlayClick] = React.useState(false)
  const hasPlayed = play || playLayout || playClick

  React.useEffect(() => {
    if (play) playerRef.current.play()
  }, [play])

  React.useLayoutEffect(() => {
    if (playLayout) playerRef.current.play()
  }, [playLayout])

  return (
    <div>
      <h1>iOS - Video play via effect / layoutEffect / onClick</h1>
      <p>
        The "play effect" button will not start the video in Safari. use the
        "useLayoutEffect" hook or an event handler
      </p>
      <video
        ref={playerRef}
        id="video"
        src="https://vjs.zencdn.net/v/oceans.mp4"
      />
      <div>
        {hasPlayed ? (
          <button onClick={() => window.location.reload()}>Reset</button>
        ) : (
          <React.Fragment>
            <button onClick={() => setPlay(true)}>play - useEffect</button>
            <button onClick={() => setPlayLayout(true)}>
              play - useLayoutEffect
            </button>
            <button
              onClick={() => {
                setPlayClick(true)
                playerRef.current.play()
              }}
            >
              play - onclick
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
