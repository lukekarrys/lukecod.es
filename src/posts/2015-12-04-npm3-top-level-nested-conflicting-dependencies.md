---
title: "npm@3: What Ends Up at the Top of node_modules with Conflicting Dependencies?"
date: 2015-12-04 19:37:45
tags: [npm]
---

`npm@3` has been stable for a few months now and one the big changes was the new flat(ter) directory structure inside `node_modules`. [This blog post](http://www.felixrieseberg.com/npm-v3-is-out-and-its-a-really-big-deal-for-windows/#flatmoduleinstallation) has a good writeup of why that's a good thing.

You'll notice that I said "flat(ter)" above. If two modules in your project have conflicting dependencies, then one of those will end up on the top level of `node_modules` and the other will be nested inside its parent's `node_modules` directory. This got me to wondering, which ones ends up on the top level?

I was wondering this because of a discussion on the [eslint issue tracker](https://github.com/eslint/eslint/issues/3458#issuecomment-132922673) about if the new directory structure will allow you to `require` a nested dependency now that it is at the top level of `node_modules`. As the linked comment pointed out, it will let you, but that doesn't mean you should do it. If you did depend on this functionality, you would be requiring a module without any guarantee of what version you would be getting back.

<!-- more -->

## So what version will you get?

In `npm@3` conflicting versions of nested dependencies will end up at the top level based on **which is installed first**. If they are installed together (using the `npm install package1 package2` syntax) the order didn't matter, since it looks like modules might be alphabetized first before actually installing. I created [a gist](https://gist.github.com/lukekarrys/14ad8946abb208f89e11) that you can clone to try out for yourself.

What the gist does is `npm install` two different tarballs, `inherits-1.tgz` and `inherits-2.tgz`, which depend on `^1.0.0` and `^2.0.0` of `inherits` respectively. So when installing both of them, there will be a conflict between the versions.

The `run-scripts` install them in different orders and then display the version from the top level in `node_modules/inherits/package.json`. Here's the output of those scripts:

```sh
# npm i inherits-1.tgz && npm i inherits-2.tgz
> npm run order1
"version": "1.0.2"

# npm i inherits-2.tgz && npm i inherits-1.tgz
> npm run order2
"version": "2.0.1"

# npm i inherits-1.tgz inherits-2.tgz
> npm run order3
"version": "1.0.2"

# npm i inherits-2.tgz inherits-1.tgz
> npm run order4
"version": "1.0.2"
```
