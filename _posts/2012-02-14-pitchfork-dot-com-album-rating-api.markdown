---
layout: post
title: "Pitchfork.com Album Rating 'API'"
date: 2012-02-14 20:27
categories: [yql, yahoopipes, pitchfork, jsonp]
---

A [friend of mine](https://twitter.com/mcsheffrey) told me a few weeks ago that he wanted to make a Chrome plugin to display [Pitchfork](http://pitchfork.com) album scores on [Rdio](http://rdio.com) album pages. This seemed like an interesting idea to me, and I wanted to take a stab at the JavaScript for it. The following is a rundown of my thought process while researching the problem and the end result.

<!-- more -->

Skip straight to a [JSFiddle demo](#p4k_demo) if words bore you.

## Steps

My initial process went as follows:

1. Use album and artist from Rdio URL to get URL of Pitchfork review page
2. Scrape review page for score

## Getting the Pitchfork Album Review URL

Upon first review of the Pitchfork site, it seemed like trying to generate URLs based on album name was out of the question. All Pitchfork album review pages contain an ID in the URL, such as `http://pitchfork.com/reviews/albums/15551-bon-iver/`. The next best thing I could think of was to try and generate a search URL since the syntax was simple (`http://pitchfork.com/search/?query=bon+iver`) and then scrape that page. However, when investigating a little further I saw that Pitchfork has an autocomplete 'API' which returns JSON.

Since it returned JSON, I was able to use a [Yahoo Pipe](http://run.pipes.yahoo.com/pipes/pipe.info?_id=332d9216d8910ba39e6c2577fd321a6a) to convert the JSON to JSONP. I wanted to keep this demo on the client-side as much as I could, so anything I could do to not have to setup a server-side proxy was a win. With the Yahoo Pipe returning JSONP I had a list of URLs for review pages when entering a search term.

## Getting the Album Score

Staying the client-side spirit, I decided to use YQL and based my code off [James Padolsey's 2009 blog post on the subject](http://james.padolsey.com/javascript/using-yql-with-jsonp/). YQL made it relatively simple to take the review URL, parse the review score from the HTML with XPath, and return JSONP. I'm not an expert in these things so I feel like my XPath query is pretty fragile. If you have any suggestions to make it better, I'd to hear them. Fragile or not, my response data was JSON that contained the album's score. Success!

## Code

{% gist 1728142 fiddle.js %}

<a id="p4k_demo"></a>
## Demo

The demo currently pulls the artist and album search terms from the `#artist` and `#album` spans. Click the + button to edit the fiddle and try some of your own search terms. 

<p><iframe width="100%" height="350" src="http://jsfiddle.net/lukekarrys/vC4MN/embedded/result,js,html" allowfullscreen="allowfullscreen" frameborder="0"></iframe></p>
