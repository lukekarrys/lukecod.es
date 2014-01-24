---
layout: post
title: "Random Problem of the Night"
date: 2012-11-18 01:21
categories: [problem, node, crawler]
---

Writing this to save for posterity on the blog since it is only in a gist currently.

## The Problem

There is a pretty big site that we have at work (1000+ pages probably) and I needed to find all the links in the site to a certain page and see what the query string parameters were for those links.

Each query string could have multiple keys and values, and all I needed was a unique array for all the values for each key.

<!-- more -->

## The Solution

Here is the code:

{% gist 4102152 app.js %}

I used [crawl](https://github.com/mmoulton/crawl) which returns a JSON object for every page on the site containing an array of links on that page. Then using [underscore](http://underscorejs.org/) I plucked, flattened, compacted, uniqued, and mapped those arrays so they only contained internal links for the domain in question. Then using [ent](https://github.com/substack/node-ent) and [qs](https://github.com/visionmedia/node-querystring) I parsed all the query string values into unique arrays. See the comments in the code above for more specific details.

Leave any comments/questions/bugs below or hit me up on [Twitter](http://twitter.com/lukekarrys).
