---
title: "Building a Day One Journal as a Static Site"
date: 2016-12-06T12:36:14-07:00
tags: [static site, day one, metalsmith]
---

> #### TL;DR
>
> I built [`metalsmith-dayone`](https://github.com/lukekarrys/metalsmith-dayone) to add Day One data to a metalsmith blog.

Over the past year I've found that [Day One](http://dayoneapp.com/) is a great app to keep me "journaling". It's easy to use and has a lot of great features that I use to write. It keeps everything private which is what I want most of the time, but I do use it to flesh out ideas for things I might blog or for memories that I might want to share.

This left me wanting to ability easily publish a subset of entries.

Day One does have an export feature, but I found that the publishability of the exports left a lot to be desired. It can do text or HTML, but both of these end up with just one page, even if you export hundreds of entries.

But there's also a JSON export option! Which meant all I had to do was spend a few nights writing (and rewriting and rewriting) some code, and I'd soon be able to publish a site about all the cute things my daughter does.

<!-- more -->

## Enter, Metalsmith

[Metalsmith](http://www.metalsmith.io/) is a static site generator for Node. It works on a directory of files, which it then runs through a series of user defined plugins, and finally writes the output to a directory.

The Metalsmith site has a [whole section about how it works](http://www.metalsmith.io/#how-does-it-work-in-more-detail-) that I recommend you read for more detail about this process.

Overall, this seemed like a good fit for Day One data, since I could write a plugin to mimic the first step and instead of needing a directory of files, it would work on a Day One export file.

## The plugin

The plugin I built, [`metalsmith-dayone`](https://github.com/lukekarrys/metalsmith-dayone), does a few things, but its main goal is to take your Day One export and parse the data into a format that Metalsmith can understand.

It goes through all your entries (optionally filtering them based on journal and tags) and adds them to Metalsmith's files object. It also looks for referenced photos and adds them as well. It will parse Day One's markdown and store any other data (such as activity type, weather, and location) as file metadata.

The plugin can operate directly on your `.zip` file too!

```js
// This will take a default Metalsmith site and add all the entries
// and photos from dayone.zip to it
require("metalsmith")(__dirname)
  .source("./src")
  .destination("./build")
  .use(
    require("metalsmith-dayone")({
      data: "./path/to/dayone.zip"
    })
  )
  .build()
```

## Example

The best part about the plugin is that you can use it in conjunction with the rest of [the community's plugins](http://www.metalsmith.io/#the-community-plugins) to manipulate the parsed data however you want.

I created [an example repo](https://github.com/lukekarrys/metalsmith-dayone-example) and [deployed the result](http://metalsmith-dayone.lukecod.es/) as well. The example takes care of:

- Paginating entries
- Creating a list of all tags
- Paginating entries by tag
- Using [`pug`](https://pugjs.org) for templating
- Deploying to GitHub pages
- Bring your own `.zip` file

So if you wanted to see how your Day One data would look as a blog:

```bash
# Export your own Day One data as JSON and save it as ~/Desktop/dayone-data.zip
git clone git@github.com:lukekarrys/metalsmith-dayone-example.git
cd metalsmith-dayone-example
npm install
npm run build -- --data ~/Desktop/your-dayone.zip
npm run preview
```

Feel free to fork the example repo and you'll be able to change the theme or layout, and add other functionality with plugins.

If you do find any missing functionality that would be better served by the plugin, please [open an issue](https://github.com/lukekarrys/metalsmith-dayone/issues/new)!
