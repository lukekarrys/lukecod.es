---
layout: post
title: "React Invariant Violation / Minified Exception on iOS 8 with Webpack + Babel"
date: 2016-03-14T10:36:33-0700
categories: [bugs, ios, babel, core-js, webpack, react]
---

> #### TL;DR
[Check out this gist to see the bug](https://gist.github.com/lukekarrys/87bfaf9db949a3cfa628#file-readme-md).

I ran into a head-scratcher over the weekend that I needed document, because I spent a few more hours than I wanted to trying to see why a deployed project wasn't working at all on iOS 8.4.

My project is using `react`, `webpack`, and `babel`. One of the `babel` plugins I'm using is [`babel-plugin-transform-react-inline-elements`](https://babeljs.io/docs/plugins/transform-react-inline-elements/) which transforms `react` elements to increase performance in production.

I'm also using the [`babel-polyfill`](https://babeljs.io/docs/usage/polyfill/) (which includes the [`core-js`](https://github.com/zloirock/core-js) shim) to polyfill some features like Symbols.

The project was working fine locally on iOS 8, but when deployed I was getting an error from `react`:

```
Error: Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.
```

If I removed the `babel-polyfill`, the error went away. The problem was I needed the `babel-polyfill` especially on iOS 8 where there is no `Symbol`. I also tried just loading `core-js/shim` or just `core-js/es6/symbol` but the error was still happening. Here's a way stripped down version of my main JS file which was causing the error:

```js
// The error goes way with no polyfill, but I need the polyfill
import 'babel-polyfill';

import React from 'react';
import DOM from 'react-dom';

DOM.render(
  <div>hey everybody</div>,
  document.getElementById('root')
);
````

Next, I removed the `webpack` define plugin so it was no longer replacing `process.env.NODE_ENV` so I could see what the unminified error was:

```
Invariant Violation: ReactDOM.render(): Invalid component element. This may be caused by unintentionally loading two independent copies of React.
```

I had a feeling that I wasn't actually loading two different copies of `react`, so I kept digging. It was then that I remembered I had some `babel` plugins turned on in production only. My `.babelrc` looked like this:

```js
{
  "presets": [
    "react",
    "es2015"
  ],
  "env": {
    "production": {
      // Yay! Removing this plugin fixes it!
      "plugins": [
        "transform-react-inline-elements"
      ]
    }
  }
}
```

Once I disabled the `transform-react-inline-elements` plugin the error went away. Since this plugin is only used for performance improvements, I decided that working on iOS 8 was more important.

I put together [a full gist](https://gist.github.com/lukekarrys/87bfaf9db949a3cfa628#file-readme-md) of the bug to make it easier to reproduce. I still don't know exactly why this error is happening, but I plan on trying to report it to the relevant projects to see if it can be tracked down and fixed. The main lessons I learned though:

* Remove `process.env.NODE_ENV` overwriting from your webpack bundle so you can see the error messages from `react`. See the [`DefinePlugin` docs](https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin) for more info
* Babel environment specific plugins can lead to environment specific bugs. Always turn these off as a first step to debugging a production only bug.
