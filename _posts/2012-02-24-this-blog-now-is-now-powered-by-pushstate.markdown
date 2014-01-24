---
layout: post
title: "This Blog Now Is Now Powered By pushState"
date: 2012-02-24 10:52
categories: [ajax, pushstate, html5]
---

> *__Update__: Since switchin to the Hyde theme, I've ditched the pushState stuff. It was fun to play around with, but it's not really meant for a blog.*

Click around some internal links on this blog. You'll notice that on [supported browsers](http://caniuse.com/#search=history) this blog no longer uses full page refreshes. Instead the content of the next page is grabbed with AJAX, parsed on the client-side*, and then inserted into the proper content node. While that is being done, instead of using [hashbangs](http://danwebb.net/2011/5/28/it-is-about-the-hashbangs) to save the state, I'm using the HTML5 history API.

Be on the lookout over at [the Tag Soup blog](http://tagsoup.github.com/) on Monday as I will be doing a full write-up on this for [Tag Soup's 30 Day Challenge](http://tagsoup.github.io/blog/2012/02/27/day-4-drunk-and-pushing-state/).

_*Note: I understand that this isn't the best way to do it since we are sending the full page content over the wire, but only using part of it. A better solution would be to have Jekyll generate separate html files for just the content of each page._
