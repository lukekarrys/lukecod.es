---
layout: post
title: "Greenkeeper"
date: 2016-03-07T12:40:35-0700
categories: [tools, greenkeeper, ci]
---

Over the course of ~36 hours last weekend [greenkeeper](http://greenkeeper.io/) notified me of two of my projects where the build was broken by minor updates to tools that I was using.

Here are the nice PRs, from what is quickly becoming one of my favorite services:

* [Universal Static Instagram](https://github.com/lukekarrys/universal-static-instagram/pull/76)
* [Tweet Your Bracket](https://github.com/tweetyourbracket/tweetyourbracket.com/pull/118)

One was [a bug in a babel plugin](https://github.com/lodash/babel-plugin-lodash/issues/37) that I use to treeshake my lodash methods to decrease the overall bundle size, and the other was [a change to eslint](https://github.com/eslint/eslint/issues/5476) that broke [babel-eslint](https://github.com/babel/babel-eslint/issues/267).

While it's kind of a bummer to get emails that your projects can't build right now due to changes you didn't make it, that is more than offset by knowing about it almost so quickly and being able to easily pin the dep to the previous working version.

In the case of `babel-plugin-lodash` greenkeeper notified my in less than 8 minutes (!!), and I was able to fix my project, go to the module's repo, find out that the issue wasn't reported yet, come up with test case to reproduce the bug only in the latest version, and hopefully save other developers time in tracking down the issue.

But my favorite part is now that I have a few projects with pinned dependencies, greenkeeper will then notify me of the next update to the package and see if my software is working again. If it is working, all I have to do is merge the pull request and I'm back on the latest version knowing that my software is working as it did before.

I now have greenkeeper enabled on 6 of my bigger open source projects, and it would be a no brainer to pay for to use on private projects.

**Update {{ "2016-03-08T10:35:00-0700" | date_to_string }}**

Greenkeeper [opened a PR](https://github.com/lukekarrys/universal-static-instagram/pull/81) 4 minutes and 27 seconds after `babel-plugin-lodash` was published and then a little bit later my CI tests on Travis notified me that the build from the PR was passing. I had to make [one small change](https://github.com/lukekarrys/universal-static-instagram/commit/5095dbbb86b774054f52d0657be9d7d6b6d41e04) to set the version back to a range, since greenkeeper assumes you always want to keep the same type of version declaration (which is the desired behavior in most other cases).

Thanks again Greenkeeper!