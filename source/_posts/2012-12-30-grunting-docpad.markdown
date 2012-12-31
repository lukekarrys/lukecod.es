---
layout: post
title: "Grunting DocPad"
date: 2012-12-30 19:49
comments: true
categories: [grunt, docpad, minification, concatenatioin]
---

I've used [DocPad](http://docpad.org) for small personal projects and for larger sites at work. I enjoy it's API and it does what it advertises as a static site generator written in Node that allows for easy extending via plugins.

I also love [Grunt](http://gruntjs.com). It is another Node based tool that allows for easy task based builds. It has built-in support for linting, concatanation, minification and more.

I forked the [DocPad HTML5 Boilerplate repo](https://github.com/lukekarrys/html5-boilerplate.docpad) and added Grunt to it. The fork uses Grunt to take the default CSS and JS files included in the HTML5 Boilerplate and minifying and concatenate them and include them in the DocPad layout. Nothing groundbreaking I know, but I wanted to create a quick example repo of all these things in action since it was difficult to find all the bits and pieces of information required to make these two work together harmoniously.

I edited the [Readme](https://github.com/lukekarrys/html5-boilerplate.docpad#html5-boilerplate-skeleton-for-docpad) of the fork to explain what I changed and how it works, so check that out for all the details. Also leave an issue there or a comment here if you have any questions or anything is wrong.

### TL;DR

[DocPad + Grunt in action](https://github.com/lukekarrys/html5-boilerplate.docpad).

