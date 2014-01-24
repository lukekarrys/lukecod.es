---
layout: post
title: "Instagram Liquid Tag Plugin for Jekyll and Octopress"
date: 2011-11-27 01:50
categories: [instagram, ruby, jekyll, octopress]
---

Being new to the world of Ruby (and obviously Jekyll), I thought a good initial learning experience
would be to write a liquid tag for Jekyll to display an [Instagram](http://instagram.com) photo. I finished up a decent enough
version of the code, and it's actually in use over at [lukelov.es](http://lukelov.es) to display all my Instagrams. Check out [this page](http://lukelov.es/blog/2011/11/18/wait-for-me/)
for a complete example of what the finished product looks like.

It is a simple liquid tag which takes one parameter, the ID of a media item from Instagram. The code
then fetches the media item using [Instagram's ruby gem](https://github.com/Instagram/instagram-ruby-gem),
and writes a bunch of relevant HTML to the page.

<!-- more -->

I currently have it displaying:

- the 612x612 version of the image (which links to the photo on Instagram)
- the filter used to create the image
- a static map of where the image was taken using the [Google Static Map API](http://code.google.com/apis/maps/documentation/staticmaps/)
- the name of the location where the image was taken
- a link to comment on the Instagram using [webstagram](http://web.stagram.com)

*Obviously, the location information is only displayed if the Instagram has that data associated with it.*

The [embedded gist](https://gist.github.com/1397276) below should be the same as the code being used in the
[lukelov.es repository](https://github.com/lukekarrys/lukelov.es/blob/master/plugins/instagram.rb).

If you have questions, comments, bugs, etc, please leave a comment on this post or the gist, and if you'd like to contribute fixes or features directly, you can submit a pull request for [this file](https://github.com/lukekarrys/lukelov.es/blob/master/plugins/instagram.rb).

{% gist 1429551 %}

On a side note, I also came up with a solution for how to batch create Instagram posts (as you might've noticed
by the hundreds of Instagram posts on [lukelov.es](http://lukelov.es/blog/archives/)). The solution was to create
a few Rake tasks similar to the ones that are already being used by Octopress to create new posts and pages. I will be writing another blog post
soon detailing those and how they work, but if you would like a sneak peak, checkout
[the Rakefile for lukelov.es](https://github.com/lukekarrys/lukelov.es/blob/master/Rakefile#L360).
