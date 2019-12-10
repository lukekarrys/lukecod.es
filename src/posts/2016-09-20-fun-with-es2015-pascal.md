---
title: "Fun with ES2015: Pascal"
date: 2016-09-20T12:10:44-07:00
tags: [es6, es2015, pascal, js]
---

Just some fun code to determine [Pascal's triangle](https://en.wikipedia.org/wiki/Pascal%27s_triangle) for a certain number using some (borderline unreadable 😄) ES2015 patterns.

```js
// Utils
const last = arr => arr[arr.length - 1]
const withoutLast = arr => arr.slice(0, -1)
const sumWithNext = arr => (val, index) => val + arr[index + 1]

// Sum the values from a row
const createRowValues = arr => withoutLast(arr).map(sumWithNext(arr))

// Create row padded by the start values
const createRow = (previous, start) => [
  start,
  ...createRowValues(previous),
  start
]

// Appends a new row based on the last row
const appendRow = start => rows => [...rows, createRow(last(rows), start)]

// Takes a starting value and the number of rows and returns a nested array
const pascal = (rows, start = 1) =>
  [...Array(rows)].reduce(appendRow(start), [[start]])

pascal(10)

// [ [ 1 ],
//   [ 1, 1 ],
//   [ 1, 2, 1 ],
//   [ 1, 3, 3, 1 ],
//   [ 1, 4, 6, 4, 1 ],
//   [ 1, 5, 10, 10, 5, 1 ],
//   [ 1, 6, 15, 20, 15, 6, 1 ],
//   [ 1, 7, 21, 35, 35, 21, 7, 1 ],
//   [ 1, 8, 28, 56, 70, 56, 28, 8, 1 ],
//   [ 1, 9, 36, 84, 126, 126, 84, 36, 9, 1 ],
//   [ 1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1 ] ]
```
