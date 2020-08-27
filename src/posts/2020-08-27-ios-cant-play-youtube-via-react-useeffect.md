---
title: "Safari Won't Play Videos via React useEffect"
date: 2020-08-27T08:27:23-07:00
tags: [react, video, youtube, safari, hooks]
---

> #### TL;DR
>
> View [this example](codesandbox://safari-video-useeffect) in Safari to see how playing a video via `useEffect` won't work. If you're attempting to make a video play inside a React effect, use `useLayoutEffect`.

## useEffect vs useLayoutEffect

The React docs have [the following tip](https://reactjs.org/docs/hooks-effect.html#detailed-explanation) that calls out when you should use `useLayoutEffect` vs `useEffect`:

> Unlike `componentDidMount` or `componentDidUpdate`, effects scheduled with `useEffect` don’t block the browser from updating the screen. This makes your app feel more responsive. The majority of effects don’t need to happen synchronously. In the uncommon cases where they do (such as measuring the layout), there is a separate `useLayoutEffect` Hook with an API identical to `useEffect`.

In my experience, it's pretty obvious when running an effect that should be a layout effect, such as the measuring example called out in the React docs. And the even though the behavior of `useEffect` is slightly different in timing from the previous `componentDidMount` and `componentDidUpdate` APIs, this advice makes a lot of sense and it is engrained in me now. When using hooks and writing effects, I always reach for `useEffect` first.

However, when developing [livefromquarantine.club](/2020/07/24/announcing-live-from-quarantine) I found a case where it wasn't obvious that I had to use `useLayoutEffect` instead of `useEffect`. I think my brain was holding on to "`useLayoutEffect` is for measuring stuff!" and not realizing there are other events that need to be synchronous.

<!-- more -->

## Safari WebKit Video Policies

[Safari requires a user gesture to play video on both iOS and macOS](https://developer.apple.com/documentation/webkit/safari_tools_and_features/delivering_video_content_for_safari). Here's the specific policy from that link:

> A `<video>` element can use the `play()` method to automatically play without user gestures only when it contains no audio tracks or has its `muted` property set to `true`.

I also found [this WebKit blog post](https://webkit.org/blog/6784/new-video-policies-for-ios/) interesting for this section (emphasis mine):

> A note about the user gesture requirement: when we say that an action must have happened “as a result of a user gesture”, we mean that the JavaScript which resulted in the call to `video.play()`, for example, must have **directly resulted** from a handler for a `touchend`, `click`, `doubleclick`, or `keydown` event. So, `button.addEventListener('click', () => { video.play(); })` would satisfy the user gesture requirement. `video.addEventListener('canplaythrough', () => { video.play(); })` would not.

## Example

So what if you try to call `video.play()` using React's effects?

[View this example on Codesandbox.](codesandbox://safari-video-useeffect)

```jsx
const PlayVideo = () => {
  const video = useRef()
  const [playVideo, setPlayVideo] = useState(false)
  const onClick = () => setPlayVideo(true)

  // This will NOT work in Safari
  useEffect(() => {
    if (playVideo) video.current.play()
  }, [playVideo])

  // This will work in Safari
  useLayoutEffect(() => {
    if (playVideo) video.current.play()
  }, [playVideo])

  return (
    <div>
      <video ref={video} />
      <button onClick={onClick}>Play</button>
    </div>
  )
}
```

In other browsers like Chrome, both effects will work to play the video. But in Safari, only the `useLayoutEffect` will work. Even though `play()` is called via the `onClick` handler, Safari doesn't see the `play()` call as the direct result of the click handler.

In order to get the video to play, **you need to call `play()` from `useLayoutEffect` or directly in the `onClick` handler**.

## YouTube

This also partially applies to the YouTube Player API. If you try to call `ytPlayer.playVideo()` inside `useEffect` a similar thing will happen. On iOS, the player will not start, but on macOS both the `useEffect` and `useLayoutEffect` handlers will behave the same.

[Here's another example using the YouTube Player API.](codesandbox://safari-youtube-useeffect)

## Conclusion

In hindsight, this seems obvious but it wasn't when I first ran into the issue in an application. It stumped me and wasn't something I realized until walking around the house the next day.

A few lessons that I learned from this:

- The example called out in the React docs is the most likely reason to use `useLayoutEffect` but it makes sense to learn what is happening under the hood so that cases like this are more immediately clear what's happening. This probably applies to all APIs.
- As always, reducing error cases as much as possible is very helpful. I first encountered the behavior when using the YouTube player but if I had reduced the case to using a plain `<video>` element I would've gotten this much nicer error from Safari: `The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.` Good error messages are very important.
