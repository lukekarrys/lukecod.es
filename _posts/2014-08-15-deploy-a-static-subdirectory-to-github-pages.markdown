---
layout: post
title: "Deploy a static subdirectory to GitHub pages"
date: 2014-08-15 09:57
categories: [node, gh-pages]
---

## Update 8 Feb 2015

I came back to some projects after many months where I had used this method, and I was running into errors complaining about `COMMIT_SHA is not an ancestor of commit` when running the `git subtree split` command. I did some more research and found what I think is a superior method in the form of [this shell script](https://github.com/X1011/git-directory-deploy). The new method also allows the build directory to not be checked in to the git repository which I think keeps things cleaner.

So I packaged the shell script as [an npm module](https://github.com/lukekarrys/git-directory-deploy) so it can be installed to `devDependencies` and used it the same way as the previous method.

### npm run-script

npm allows you to add [arbitray commands](https://www.npmjs.org/doc/cli/npm-run-script.html) to your package.json file and run them with `npm run [command]`.

Here is a set of scripts that can be used to easily deploy a subdirectory of any project to the `gh-pages` branch on GitHub. This is useful for when your `master` branch is used to build a static site, but you need the static files to end up in the `gh-pages` branch.

There is one assumption:

> a file `build.js` will output static to a directory `_built/`.

If that is true, then running `npm run deploy` will build your files, commit them and deploy them to the `gh-pages` branch. Simple!

#### package.json (new git-directory-deploy method)

*First make sure the module is installed by running `npm install git-directory-deploy --save-dev`*

{% highlight json %}
{
  "scripts": {
    "build": "node build",
    "deploy": "git-directory-deploy --directory _build --branch gh-pages"
  }
}
{% endhighlight %}

#### package.json (old git subtree method)

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
