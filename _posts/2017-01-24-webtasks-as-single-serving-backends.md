---
layout: post
title: "Webtasks as Single Serving Backends"
date: 2017-01-24T16:09:36-07:00
categories: [webtasks, repeatone, the national, devops]
---

**(so you can listen to the same song over and over)**

> #### TL;DR
I built the [repeatone.club][repeatoneclub] using a [webtask][webtask] as the single serving backend.

[webtask.io][webtask] gives you the ability to run some arbitray code with any HTTP call. One of the features of this that I love is the ability to [pass secret parameters][webtask-params] to your code, such as auth tokens. In the end this gives you the ability to call authenticated APIs that you couldn't from your browser without shipping your API client/secret. Think of them as partially applied functions that can be accessed via a simple GET request.

This perfectly fits the bill for any small single page application that has only a few API calls. This is where one of my favorite bands, The National, comes into play.

<!-- more -->

## Sorrow

On May 5, 2013 The National played a concert at MoMA PS1 in New York, and created one of [the greatest setlists of all time][setlist]. It even got a [7.2 from Pitchfork][pitchfork], and the review kinda captures why something like this appeals to me:

> No naysayer will be converted by this completely absurd artifact, but it’s a moving manifestation of the relationship that fans have with any band that means anything to them, playing their songs over and over to tempt the point where the magic fades away.

I've always been that person who could listen to a song on repeat for hours. So I wanted to build a site that could at least capture how many times I did listen to something in a row.


## Last.fm API and Webtasks

This functionality was pretty easy to get using the [Last.fm API][lastfm-api]. But without shipping my [API Key][lastfm-auth] along with my website, I couldn't make the site without spinning up a server somewhere. This is getting easier and easier to do, but it still wasn't something I wanted to do just to show you how many times I can listen to Sorrow in a row.

Then I found [webtask.io][webtask] built by [Auth0][auth0]. With the ability to [easily obscure secrets][webtask-params] when creating the webtask, it fit well with the goal of the project.

Creating one is pretty straightforward. As a prerequisite, you need to [install the CLI][webtask-install]. Once that is done, it's a simple command to deploy any file as a webtask with a secret parameter:

```js
// repeatone.js
'use latest' // Allows ES6 stuff
module.exports = (ctx, cb) => {
  const { data } = ctx
  // API_KEY comes from the CLI and user comes from the request
  const { API_KEY, user } = data
  makeSomeRequest({ key: API_KEY, user }, cb)
}
```

```sh
# This will output the url to your webtask
wt create repeatone.js --secret API_KEY=$YOUR_LAST_FM_API_KEY
# Call your webtask with a user parameter
curl -s https://webtask.it.auth0.com/api/run/{CONTAINER_NAME}/repeatone?user=$USER
```

In this simple case, when the webtask is created it has an API_KEY and then each request supplies the user to look up on Last.fm. You can see [the full source][github-source] of my webtask on [GitHub][github].

Check out the [getting started guide][webtask-101] and [documentation on the webtask programming model][webtask-model] for more information on what webtasks can do.


## Repeat One Club

Using this [single function backend][github], I was able to deploy the website completely statically to [Surge][surge]. If you're interested in how that's done, you can also see that [project on GitHub][github-club]

If you have a Last.fm account, you can go to [repeatone.club][repeatoneclub] and type in your username (it might help if you listen to Sorrow by The National a bunch of times first).

If you're lucky, [I might even be listening to something on repeat right now][formatfanatic]! If I'm not, you can take solace in this screenshot of when I listened to Open Book 100 times:

[![open book](https://cldup.com/5bKmuzmIf7.png)](https://cldup.com/5bKmuzmIf7.png)

[github]: https://github.com/lukekarrys/repeatone-webtask
[github-club]: https://github.com/lukekarrys/repeatone.club
[github-source]: https://github.com/lukekarrys/repeatone-webtask/blob/88f8f6696619da8775f90482c2a46cefed79def8/repeatone.js
[surge]: https://surge.sh
[repeatoneclub]: https://repeatoneclub.surge.sh
[webtask]: https://webtask.io/
[webtask-params]: https://webtask.io/docs/issue_parameters
[webtask-install]: https://webtask.io/cli
[webtask-model]: https://webtask.io/docs/model
[webtask-101]: https://webtask.io/docs/101
[setlist]: http://www.setlist.fm/setlist/the-national/2013/moma-ps1-long-island-city-ny-63d8029f.html
[pitchfork]: http://pitchfork.com/reviews/albums/20511-a-lot-of-sorrow/
[lastfm-api]: http://www.last.fm/api/show/user.getRecentTracks
[lastfm-auth]: http://www.last.fm/api/authentication
[auth0]: https://auth0.com/
[formatfanatic]: http://repeatone.club/formatfanatic