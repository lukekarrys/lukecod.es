---
layout: post
title: "Finding All Your npm v0 Packages"
date: 2014-08-15 09:05
categories: [npm, pacakges, semver]
---

> #### TL;DR
[Find all your v0 npm packages](http://lukekarrys.github.io/npm-v0-finder/).

Lately, there has been some Twitter conversations about [semver](http://semver.org/) and `v1`. Here are some tweets from [@izs](https://twitter.com/izs) whose opinion I trust when it comes to matters of packages and versioning.

<blockquote class="twitter-tweet" lang="en"><p><a href="https://twitter.com/izs">@izs</a> The &quot;0.x escape clause&quot; in the SemVer effectively means that 0.x versions *aren&#39;t* semantically relevant in any way. Ie, aren&#39;t SemVer.</p>&mdash; all izs full of love (@izs) <a href="https://twitter.com/izs/statuses/494980349944819713">July 31, 2014</a></blockquote>

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<!-- more -->

## My Modules

I had 20 or so `0.x.y` versioned modules on [npm](https://www.npmjs.org/~lukekarrys). And all of them had been published using the "0.x escape clause" mentioned above. That was something that I really wanted to change.

The more I thought about it, I wasn't being a good module citizen. If I publish something to npm, I want it to be as useful as possible to the community, and I want people to be able to use it confidently.


## npm 0.x.y Package Finder

But I wanted a way to easily see all my modules that were v0. So I [built this](http://lukekarrys.github.io/npm-v0-finder/).

You should be able to enter your npm username and see a list of all modules that are v0. I recommend taking a look at the project on GitHub (or wherever the issues are) and seeing if there are open issues. If there are, you can make a **v1 milestone** issue and list the things that you would like to have finished before publishing v1.

## Updating to v1

If all you want is a simple one-liner that you can run in any package repo to update it to v1, here you go:

`git pull && npm version major && git push && git push --tags && npm publish`

I just did that for many of my modules, where I still liked the API and didn't feel anything needed to be changed. And if I do need to change APIs in the future, well that's what v2 if for.