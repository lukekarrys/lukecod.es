---
layout: post
title: Playing Around with Unique Random Keys"
date: 2019-12-07T10:32:07-07:00
categories: [js]
---

I had a project recently where I was trying to decide the optimal length for a nice human readable key, while making it unlikely to have collisions while keeping it semi-unguessable.

I wrote the code below so I could play around with different character sets, key lengths, and number of keys while seeing how those affected the timing and likelihood of collisions. The project allowed for retrying in the case of a collision, so this code below allows for those with a random delay to lookup whether a key has been taken already.

<!-- more -->

{% gist 29862f1162560f6b53263884b238bbba index.js % }
