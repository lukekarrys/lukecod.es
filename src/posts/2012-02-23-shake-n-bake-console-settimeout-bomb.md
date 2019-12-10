---
title: "Shake 'n' Bake Console setTimeout Bomb"
date: 2012-02-23 18:55
tags: [settimeout bomb, pranks]
---

Apparently, everyone knows that setTimeout console bombs are the best. I didn't until my friend [Tony Camp showed me](https://twitter.com/tonyjcamp/status/132632362268897282) but now I can see the light and I'm never going back. This is something that I whipped up so you can throw it in the console of your best friend (or enemy) and try to give them a seizure. Everyone wins.

<!-- more -->

```js
;(function(d, w, t) {
  word = w
  time = t
  s = d.createElement("script")
  s.src = "http://git.io/;)"
  d.getElementsByTagName("head")[0].appendChild(s)
})(document, "LUKE", 2000)
```

<a href="#" id="execute_code" onclick="(function(d,w,t){__word=w;__time=t;s=d.createElement('script');s.src='https://gist.github.com/lukekarrys/1718831/raw/81b84f32e7a847352bf3dbccbe093f9cfc247b11/replace-and-shake.js';d.getElementsByTagName('head')[0].appendChild(s);})(document,'LUKE',2000);return false;">Run this code!</a> The code will be executed on a 2 second delay, and you will have to refresh your browser after it executes :).

The customizable parts are the last two parameters of the [IIFE](http://benalman.com/news/2010/11/immediately-invoked-function-expression/). The second one is the string (which automatically gets a space appended to it) that will replace every character inside of a text node on the page. The last parameter is the amount of time in milliseconds until the "bomb" goes off.

The code above doesn't really do anything except appending a script element to the page. Notice the line where `s.src` is set. In this line we are setting the src attribute of that script element. I used [GitHub's URL shortener](https://github.com/blog/985-git-io-github-url-shortener) to shorten the raw JS output from the Gist below, which does all of the heavy lifting (you'll be able to confirm the heavy lifting when your laptop fans spin up to 6000 RPMs).

_Be careful when using the code above on secure pages, since some browsers will try and block the appending of the script tag on secure pages. Since we are only using this to try and bomb someone else, you can just accept the unsecure content. But in production you will want to use a [protocol relative URL](http://paulirish.com/2010/the-protocol-relative-url/) (which the git.io domain does not support)._

`gist:1718831#replace-and-shake.js`

You can even substitute a different script `src` in bomb.js to make your own bomb. And it may take a few times to get the "feel" right. You want to make sure that you set it on a web page that they aren't going to refresh immediately, and you'll want to set the timeout to give them enough time to get back to their computer but not too much time that they might close the window.

So enjoy this and use wisely (or not!).
