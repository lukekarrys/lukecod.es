---
layout: post
title: "Instagram API: Comments and Captions"
date: 2013-01-05 20:52
comments: true
categories: [Instagram, API]
published: false
---

In working on [jekyll-instagram](), I noticed something that I thought was a little strange in the Instagram API. It has to do with how it deals with comments and the caption.

## The Caption

When using the Instagram API, all calls the return media information contain a property called caption. The caption can be created in two ways.
