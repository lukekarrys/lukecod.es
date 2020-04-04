---
type: module
title: spa-crawler
gh:
  - lukekarrys/spa-crawler
npm:
  - spa-crawler
---

Single page apps (or native web apps as I like to call them now), don't lend themselves to crawlers very well since the markup is generated clientside. [spa-crawler](https://github.com/lukekarrys/spa-crawler) is built on [rndr.me](https://github.com/jed/rndr.me) to crawl any site for internal links. The result is a list of all urls and content in the whole site. I've used this to archive old single page apps into a set of html files that could be hosted without any sort of server-side routing.
