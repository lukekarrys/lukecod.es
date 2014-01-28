---
layout: post
title: "Tweet Your Bracket: What the Heck?"
date: 2014-01-25 18:00
categories: [tweet your bracket, ncaa, node]
---

For the past two years, I've run a small project called [Tweet Your Bracket](http://tweetyourbracket.com). It started out as (and still is) just a crazy idea that I was passion about, so I did what I usually do in that scenario: quickly write some (messy) code.

The original (semi-)techincal write-up is over on the [TagSoup blog](http://tagsoup.github.io/blog/2012/03/12/hacking-on-the-ncaa-tournament-for-fun-not-for-profit/) and all of the original code was committed to [this gist](https://gist.github.com/lukekarrys/2028007).

<!-- more -->

## So How Does it Work?

I'll (hopefully) be writing more about the technical details in the future, but as a quick overview:

1. People go to [tweetyourbracket.com](http://tweetyourbracket.com) (once the brackets are announced on Selection Sunday).
2. They fill out their bracket on the site.
3. They tweet the URL of the page which has a location hash of their stringified bracket.
4. A Twitter listener finds their tweet and saves their stringified bracket to the DB.
5. Once the games start, a game listener updates the master bracket after each game completion.
6. The results page and each individual bracket page are updated to reflect the latest master bracket.

## But Why?

It's a pretty crazy thing to want to do as a side project for a few reasons. There are two facts about the project:

1. Entries are only allowed for ~90 hours
2. The project will run for 22 days this year

This leaves quite a bit of development time for a very small window for users to actually enter. In fact, the project has attracted 43 total entries in two years. I have definitely spent more hours on this project than it has had entries (and probably unique visitors too). And I'm not even going to go into how there are competing services from huge companies that offer five figure prizes to the winner.

So I was thinking the other day about the reason why I continue to work on the project. I've pulled some extremely late nights just so I could have it done for that ~90 hour window. It has to be more than just "because it is fun", and I think it comes down to a few things:

1. **It is a nice break from other code I write.** That code has deadlines, stakeholders, and people relying on it. I find this both exhilarating and relaxing. There is not very much pressure, and I get to spend as much time as I want on it to make it right.

2. **I get to pick whatever technologies I want (again, without pressure).** One year I deployed on Heroku, the next on Nodejitsu. Last year I used Express, this year I want to learn a new Node framework. This year I want to play with Bootstrap3. I also want to make it a JS MVC app, where the first year used server-side HTML rendering. It's exciting and I don't have to justify what I'm using or worry about The Right Thing To Use&trade;.

3. **I really enjoy using the end result.** Most "feature requests" are things that I thought "Hey wouldn't it be cool if [X]". Where X has been the ability to create a random bracket, multiple scoring systems, browser playback of a user's bracket selection, and more.

4. **It is just the right amount of ridiculous.** For most people, this project will fall somewhere between "OK..." and "Worst. App. Ever.", but I like doing something that caters to a very small niche.

Overall, I think those four things make for the perfect mix for a side-project.

## If You're Still Reading...

You might want to enter! Go to [Tweet Your Bracket](http://tweetyourbracket.com) and fill out your bracket. Or enter your email so I can let you know what happens with it in the future.

