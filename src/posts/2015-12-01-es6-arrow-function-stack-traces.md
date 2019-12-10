---
title: "ES6 Arrow Function Stack Traces"
date: 2015-12-01 17:21:06
tags: [es6, js, arrow functions, debugging]
---

Since I started writing ES6, I've adopted the [functions without function approach](https://medium.com/@ryanflorence/functions-without-function-bc356ed34a2f) and have quite liked it.

I'm not going to get into every reason why, but that post does a good job of echoing my thoughts on it. I'm not going so far as to say "never", but I don't think I've found the need to type the word `function` even once since I started writing ES6.

I have always wondered about stack traces when using arrow functions though.

<!-- more -->

## What about stack traces? (Hint: they're fine)

This is one major question that I've seen whenever this discussion has come up, and frankly I didn't know the answer to it. Did using arrow functions equate to use anonymous functions which can make stack traces (and debugging) impossible to navigate?

The answer that I found is: no.

Here is the code I used and some screenshots of running it in Chrome, Node 5, and Chrome after transpiling it with Babel.

```js
const x = arr => arr.map(Boolean)
const y = arr => x(arr)
const z = arr => y(arr)

console.log(z([1, 1, 0]))
console.log(z(5))
```

#### Chrome

![Arrow function stack trace in Chrome](https://cldup.com/vfAatPFYxp.png)

#### Node 5

![Arrow function stack trace in Node 5](https://cldup.com/ye8BxR-4eS.png)

#### Chrome with Babel

![Arrow function stack trace with Chrome+Babel](https://cldup.com/RigPf5hlmg.png)

Those all look pretty good to me! I'm going to keep writing arrow functions for most everything since I haven't seen any significant downsides, and I really, really don't like typing the word `function` :)
