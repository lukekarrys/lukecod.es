---
layout: post
title: "Bulk Edit Strava Activities Plugin"
date: 2016-09-20T10:43:21-07:00
categories: [strava, plugin, javascript]
---

> #### TL;DR
Check out the [GitHub repo](https://github.com/lukekarrys/strava-bulk-edit) or [demo gif](https://cldup.com/7pZH0ZPSnR.gif).

At some point earlier this year, I wanted to change all my [https://strava.com](Strava) activities from private to public (gotta get on those segment leaderboards!). This looked like a hassle to do by hand, and I'm always looking for a good excuse to prove the XKCD Theory of Automation. So I started coding.

<!-- more -->

[![](http://imgs.xkcd.com/comics/automation.png)](https://xkcd.com/1319/)


### Installation and UI

Currently the only way to use this is to load it in the console of Strava.com on the [activities page](https://www.strava.com/athlete/training). This must be done after any page changing navigation since a browser reload will clear any external scripts.

[GitHub has the most up to date installation instructions.](https://github.com/lukekarrys/strava-bulk-edit#installation).

Once loadeed, this will add a dropdown to the UI that will allow to set all activites to `Public` or `Private` (as well as a `Cancel` button while the editing occurs).

The editing will happen across pages, for all activities you have, and you'll see a green highlight go across each row as it is edited.


### Advanced Usage

The plugin also gives the ability to edit any info on an activity, but for that you'll have to use the console to write some JavaScript. You'll also probably need to inspect the DOM a little bit to see what kind of selectors are available for the inputs you want to edit.

The plugin exposes a method called `editAll` on a global object `StravaBulkEdit`. This method takes two options:

- `action` (required) This determines what action will be run on the row before it is saved. It is passed the `row` as a jQuery object.
- `condition` (optional, default to all rows) This determines which rows will have the action run on them. Return false to determine if the action is run. It is also passed the `row` as a jQuery object.

Here's an example that edits the description based on the elevation gain of the activity:

```js
StravaBulkEdit.editAll({
  action: function ($row) {
    // Set the description of each row to "Big climb!"
    $row.find('[name=description]').val('Big climb!');
  },
  condition: function ($row) {
    // Only set the description if the elevation is more than 1000
    var elevation = $row.find('li:contains(Elevation)').text();
    return parseInt(elevation.replace(/\D/g, ''), 10) > 1000;
  }
})
```


### Demo

![](https://cldup.com/7pZH0ZPSnR.gif)
&nbsp;
