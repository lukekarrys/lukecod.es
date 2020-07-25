---
title: "Announcing: Live From Quarantine Club"
date: 2020-07-24T18:38:57-07:00
tags: [project, javascript, statemachine]
---

> #### TL;DR
>
> Check out [livefromquarantine.club](https://livefromquarantine.club)!

A project that started as a way to keep up with a daily live show during quarantine, and then morphed into a YouTube player that excels at playlists full of multi-song videos. It lets you shuffle, repeat, set up next songs, and share your currently queue order with friends.

Technically, I had fun building it with `@xstate/fsm` and `TypeScript` and trying to keep the size as small as possible. I think the CSS is around 3kb and the JS is 22kb. I originally put it together as some [spaghetti-code-script-tag-in-html proof-of-concept](https://github.com/lukekarrys/livefromquarantine.club/blob/2b63fb3f695e7a270adac15f183ba717360e0047/public/app.js) in a few hours. And then once I started hitting fun race condition bugs and couldn't easily implement the features I wanted, I had to rewrite it.

<!-- more -->

You can check it out on [GitHub](https://github.com/lukekarrys/livefromquarantine.club) too. The next major thing I need to tackle is OAuth in case it starts hitting the 10k/day YouTube quoata limit. In case that does happen, there are some prebuilt playlists that get refreshed every couple days with a separate API key.
