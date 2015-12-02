---
layout: post
title: "Secret Santa over SMS with Twilio"
date: 2015-12-02 11:07:56
categories: [twilio, sms]
---

> #### TL;DR
Use [this code](https://github.com/lukekarrys/secret-santa-twilio) to pick Secret Santas over SMS with [Twilio](https://www.twilio.com/).

My family does a sibling Secret Santa (plus spouses) every year. We live in a few different cities, and we forgot to do it on Thanksgiving so we were out of luck as far as picking in person. My sisters know what I do for a living so they joked over text that I should "write a code". *(Software is truly eating the world.)*

I knew there were services out there to do remote Secret Santa, but they were all over email. I knew everyone's phone number and I knew that they would check their texts far more often than their email, so I really wanted something to deliver the recipients over SMS.

I found a Ruby script out there to do the same thing, but I wanted some additional logic and its been a few years since I wrote Ruby, plus I've always wanted to play around with [Twilio](https://www.twilio.com/). Sounds like a recipe for a nice Saturday project.

<!-- more -->

## "Hey, I want to use this!"

Go for it! You'll need some coding knowledge since it needs to be run from the command line and the configuration needs to be created in JSON. I tried to write up some good usage instructions [over on the GitHub repo](https://github.com/lukekarrys/secret-santa-twilio#usage), but let me know if anything doesn't work for you.

The biggest downside I found is that Twilio forces you to put a minimum of $20 in your account, so even though my script (including some test messages) only cost ~$1.50 to run, I still had to spend $20. I figured it will last the next 20 Christmases though :)

## The spouse rule

My siblings also added an extra wrinkle. There are 8 people total (including spouses) but we wanted to avoid a person getting their own spouse as their Secret Santa. *(As one person put it, "I don't wanna be cheated out of a present!")* This was the additional logic I mentioned above. The config for the project allows you to specify people that a person can't get as their recipient.

## "Hey, I got myself!"

[The code](https://github.com/lukekarrys/secret-santa-twilio) is over on GitHub if you want to check it out in full, but I wanted to outline one interesting part. There is always the possibility that the last person to select their recipient will get themself. Then the whole process has to start over (or you could just [get yourself a footbath](https://www.youtube.com/watch?v=bXe11h0OlsU)).

I banged my head against why my tests passed sometimes, and failed other times (I eventually fixed the false positive by [making the tests run 2500 times](https://github.com/lukekarrys/secret-santa-twilio/blob/318dc317dd6b714e9dfb26b74bba5631fdd39218/test/picker.js#L8)).

## Recursion to the rescue!

I'm using Lodash's `reject` method to remove any people from the participants that is themself, a person they should skip, or a person already used. Then if there is no valid recipient, the function gets called again. And then again, and again (if it keeps failing). Good thing computers excel at doing stuff over and over again.

```js
import {contains, reject, sample, clone, shuffle} from 'lodash';

const isMe = (me) => (p) => me.name === p.name;
const isSkip = (me) => (p) => Array.isArray(me.skip) ? contains(me.skip, p.name) : false;
const isUsed = (used) => (p) => contains(used, p.name);
const rejector = ({used, participant}) => (p) => isMe(participant)(p) || isSkip(participant)(p) || isUsed(used)(p);

const pickRecipients = (participants) => {
  const results = [];
  const used = [];
  const shuffled = shuffle(participants);

  for (let i = 0, m = shuffled.length; i < m; i++) {
    const participant = clone(shuffled[i]);
    const recipient = sample(reject(shuffled, rejector({used, participant})));

    // If we reached a state where a participant will not get a valid
    // recipient then try again
    if (!recipient) return pickRecipients(shuffled);

    participant.recipient = recipient.name;
    results.push(participant);
    used.push(recipient.name);
  }

  return results;
};

export default pickRecipients;
```

This took me a little bit to figure out, partly because I forgot about the scenario where you are forced to pick yourself. I took a break and suddenly "RECURSION!" popped into my head, and I shook my head that I didn't think of it sooner.

