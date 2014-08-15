---
layout: post
title: "Deploy a static subdirectory to GitHub pages"
date: 2014-08-15 09:57
categories: [node, gh-pages]
---

npm allows you to add [arbitray commands](https://www.npmjs.org/doc/cli/npm-run-script.html) to your package.json file and run them with `npm run [command]`.

Here is a set of scripts that can be used to easily deploy a subdirectory of any project to the `gh-pages` branch on GitHub. This is useful for when your `master` branch is used to build a static site, but you need the static files to end up in the `gh-pages` branch.

There is one assumption:

> a file `build.js` will output static to a directory `_built/`.

If that is true, then running `npm run deploy` will build your files, commit them and deploy them to the `gh-pages` branch. Simple!

#### package.json

{% highlight json %}
{
  "scripts": {
    "build": "node build",
    "commit-built": "git add _built -A && git commit -m \"_built files at `date`\" -n > /dev/null 2>&1; exit 0",
    "ghpages": "git subtree split --prefix _built/ -b gh-pages && git push -f origin gh-pages:gh-pages && git branch -D gh-pages",
    "deploy": "npm run build && npm run commit-built && npm run ghpages"
  }
}
{% endhighlight %}