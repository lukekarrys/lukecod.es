---
layout: post
title: "Beep Boop: Ringing an R2D2 Telephone with Obihai, Asterisk, and Node"
date: 2014-03-28 15:34
categories: [r2d2, telephone, obihai, node, asterisk]
---

![the R2D2 phone](http://ecx.images-amazon.com/images/I/41YQ6Q2629L.jpg)

I got [this R2D2 telephone](http://www.amazon.com/gp/product/B00001U0IG) as a gift when I was in 6th grade(-ish). I used it in my room as a real telephone as a teenager, even though the handset was the most uncomfortable and least ergonomic handset imaginable. The ringer is the iconic R2D2 noise which will never stop being epic to me (maybe this is just because my name is Luke?). In short, I love this phone.

The problem is I haven't used a hard phone in years, so it's been sitting on my desk as art. I've always planned on finding a better use for it. And no, I don't count using it as a real working phone as "better".

Then I saw this [Twilio post](https://www.twilio.com/blog/2013/03/build-a-twilio-hard-phone-with-sip-from-twilio-raspberry-pi-asterisk-freepbx-and-the-obihai-obi100.html) about setting up a hard phone powered by their service. Even though I didn't want a hard phone, I loved the hack. And then it dawned on me, **I CAN JUST MAKE THIS PHONE RING**.

<!-- more -->

## The Parts

So I went to Amazon and bought the parts I would need, borrowing heavily from the Twilio tutorial. I also tried to reuse as much stuff as I had laying around, which meant trying to get Asterisk up and running on my [pink PogoPlug running Arch Linux](http://archlinuxarm.org/platforms/armv5/pogoplug-v2-pinkgray) instead of buying a Raspberry Pi and using RasPBX.

**Here is the parts list:**

1. **[OBi202 VoIP Phone Adapter](http://www.amazon.com/OBi202-Phone-Adapter-Router-2-Phone/dp/B007D930YO)**: I bought the 202 because it can be made to work wirelessly and it has an extra phone port if I ever wanted to ya know, actually use all this technology and hardware for something useful (like a real phone).
2. **[OBiWiFi Wireless Adapter](http://www.amazon.com/OBiWiFi-Wireless-Adapter-OBi200-OBi202/dp/B007R6F7PS)**: Works with the 202 and 201 to make them WiFi capable. You can get away with not buying this and getting the less expensive [OBi100](http://www.amazon.com/OBi100-Telephone-Adapter-Service-Bridge/dp/B004LO098O) if you want to plug everything in with Ethernet cables.
3. **A machine that will run [Asterisk](http://www.asterisk.org/)**: I am woefully unprepared to give advice in this area, but I got Asterisk up and running on my [PogoPlug E02](http://www.amazon.com/Pogoplug-POGO-B01-File-Sharing-Solution/dp/B004TDY924). I would also recommend going the [RasPBX/Raspberry Pi](http://www.raspberry-asterisk.org/) route as detailed in the [Twilio blog post](https://www.twilio.com/blog/2013/03/build-a-twilio-hard-phone-with-sip-from-twilio-raspberry-pi-asterisk-freepbx-and-the-obihai-obi100.html) since that seemed to have a pretty good community and setup instructions.
4. **[RJ11 Phone Cable](http://www.amazon.com/C2G-Cables-Modular-Telephone-Silver/dp/B00006HSK6)**: I forgot to buy this as I had lost the actual cord to the R2D2 phone a long time ago. Luckily I was able to rummage through a neighbor's attic and find one.
5. **[A Flash Drive](http://www.newark.com/samsung/raspberry-pi-prog-4gb-sdcard/debian-linux-preprogramed-4gb-sdcard/dp/96T7436)**: You'll need this to install Arch Linux on your PogoPlug. If you're going the Raspberry Pi way, an [SD Card](http://www.newark.com/samsung/raspberry-pi-prog-4gb-sdcard/debian-linux-preprogramed-4gb-sdcard/dp/96T7436) will work.

## Asterisk and The 1000 Line Conf Files (aka YMMV)

When I said "woefully unprepared" above, what I meant was that although I got this working in the end, I probably did 200+ Google searches while trying to get there. So I can share what I did to get it working, but I won't be a ton of help as to how my solution would transfer to other OSes/hardware/versions of Asterisk. But feel free to ask me any questions on [Twitter](https://twitter.com/lukekarrys)!


## The PogoPlug

![pink pogoplug](http://www.ohgizmo.com/wp-content/uploads/2009/11/pogoplug.jpg)

I bought this little machine on Amazon for ~$20 and it proved to be a fun toy for hacking on. There are simple tutorials for getting this particular model [up and running with Arch Linux](http://archlinuxarm.org/platforms/armv5/pogoplug-v2-pinkgray), so I won't get into that here. Again, if you're using a Raspberry Pi, you can skip this. The end goal is just to have a machine running Asterisk (or some flavor of Asterisk management software).

*Bonus: [this post](http://blog.qnology.com/2013/03/tutorial-pogoplug-e02-with-arch-linux.html) has tutorials for doing everything from making the PogoPlug an AirPlay device to doing wireless printing.*


## Installing Asterisk

*Note: for this step it is assumed that you have your machine that you'll run Asterisk on and SSH access to that machine.*

I had searched various forums and Google and found links to Asterisk v11 packages or builds that people had hosted on Dropbox, but none of them worked. It then came as a surpise when it was so easy to find a working package through a simple search on the package registry. I [did a search for Asterisk](https://aur.archlinux.org/packages.php?K=asterisk) and the first package looked to be the best...and it worked!

*Note: there is a newer version of the [package available now](https://aur.archlinux.org/packages/asterisk/).*

Here is the command to install Asterisk on Arch Linux:

`pacman -U http://downloads.asterisk.org/pub/telephony/asterisk/releases/asterisk-12.0.0.tar.gz`

And once that completed, I ran this to make sure Asterisk started on reboot.

`systemctl enable asterisk`

## The .conf files

This is pretty much copied straight from the [one blog post](http://www.beardy.se/an-introduction-to-asterisk-the-open-source-telephony-project) where I could find a simple example of how to ring an extension on an internal network. Obviously, real world scenarios are going to be more complicated than this, but there were far more tutorials on the Internet for that kind of thing.

*Note: these files are located in `/etc/asterisk`.*

**Double Important Note: Nothing about this is secure. This was meant to just live on an internal network where anyone who had the default username/password could make the phone ring.** 

There are three configuration files that need to be updated for this work. Below, I've pasted the full contents of what I have in each file. Again, I'm not any sort of expert on Asterisk, but here are the relevant bits from each file:

**extensions.conf and sip.conf**

- *1337* - That is the extension that I am using for the phone.
- *myphones* - The context I want to use for the extension.

**sip.conf**

- *secret=obihai* - The password I will use for the extension. This will be used by the Obihai device.
- *port=5060* - The port we will point the Obihai device at.

**manager.conf**

- *port=5038* - The port for the management interface.
- *[admin] and secret=admin* - The username/password for the management interface.
- *originate for read,write* - The management interface is where we will send our **originate** action so we need to make sure that it is one of the allowed actions.

#### extensions.conf
```
[general]
static=yes
writeprotect=no
clearglobalvars=no

[incoming]
exten => s,1,Hangup()

[myphones]
exten => 1337,1,Dial(SIP/1337,1)
exten => 1337,n,Hangup()
```

#### sip.conf
```
[general]
context=incoming
port=5060
bindaddr=0.0.0.0

allow=ulaw
allow=alaw
allow=gsm

[1337]
type=friend
secret=obihai
dtmfmode=rfc2833
callerid="R2D2" <1337>
host=dynamic
canreinvite=no
deny=0.0.0.0/0.0.0.0
permit=192.168.1.0/255.255.255.0
context=myphones
```

#### manager.conf
```
[general]
enabled = yes

port = 5038
bindaddr = 0.0.0.0

[admin]
secret=admin
read = system,call,log,verbose,command,agent,user,originate
write = system,call,log,verbose,command,agent,user,originate
```

After editing all these files, you'll want to reboot so that you can test that asterisk comes back up by itself. The easiest way to do that is to SSH back into the machine after it reboots and run `asterisk -r`.


## OBi202 Setup

Again, this is copied mostly from the [Twilio blog post](https://www.twilio.com/blog/2013/03/build-a-twilio-hard-phone-with-sip-from-twilio-raspberry-pi-asterisk-freepbx-and-the-obihai-obi100.html), but I'll repeat it here to keep all the instructions in one place. Also we're not going to go as far as hooking the phone up to Twilio, so our setup is a little simpler.


#### Device Setup

0. Setup your Obihai with the WiFi adapter (if necesary). This was pretty much plug-and-play as I followed the 3 steps on the packaging.
1. Find the IP address of your Obihai device. The easiest way to do this is probably through the admin interface of your router.
2. Login to the IP address of your Obihai device. The default username/password is **admin/admin**.

#### SIP Credentials

1. In the admin interface go to **Voice Service > SP1 Service > SIP Credentials**
2. For the **AuthUserName** we will use our extension: **1337**
3. For the **AuthPassword** we will use the secret from sip.conf: **obihai**

![sip credential](https://i.cloudup.com/kknkEFsZmT.png)


#### Point the Obihai at Asterisk

1. In the admin interface go to **Service Providers > ITSP Profile A > SIP**
2. For the **ProxyServer** to the IP address of the machine running Asterisk. **This depends on your network setup.**
3. For the **ProxyServerPort** we will use the port from sip.conf: **5060**

![proxy server](https://i.cloudup.com/4gxrxZJeuV.png)

#### Reboot the Obihai

That was easy! Just reboot the Obihai device with the **Reboot** button in the top right corner.

*Note: maybe cross your fingers here to make sure everything boots up properly and you did everything right.*


## Make it Ring!

There are a number of ways to make the phone ring, but they all center around sending an **originate** action to our asterisk server. One thing I tried was just via the command line:

```bash
asterisk -rx 'originate SIP/1337 extension 1337'
# or from my local computer over ssh
ssh pogoplug asterisk -rx 'originate SIP/1337 extension 1337'
```

This worked and it was the first time I heard R2D2 go beep-boop!

The problem with that was I couldn't figure out how to properly set the timeout paramter, so the phone would ring for about 45 seconds. That is just a *little* bit too long for my tastes. And a lot too annoying for people in the office next to mine.


## npm to the rescue!

Of course someone had made an Asterisk AMI module for node! In fact, there was [more than one](https://www.npmjs.org/browse/keyword/asterisk). I chose [yana](https://www.npmjs.org/package/yana) because it seemed pretty recent and had simple docs. I also had to patch it for the latest version of Asterisk and the maintainer was super quick to accept the pull request.

But what I really wanted was the ability to type `R2D2` on the command line and have it ring my beloved astromech droid. Luckily with node and npm this is very easy. The module I made is on GitHub if you want to see [the full source](https://github.com/lukekarrys/R2D2).

All the parameters are configurable, but the defaults are setup to work on my local network. You'll see that all the [default values](https://github.com/lukekarrys/R2D2/blob/master/index.js#L9-L16) are from our configuration files above. Here's the code with the defaults from **manager.conf** plugged in:

```js
var AMI = require('yana');
var ami = new AMI({
    port: '5060',
    host: '192.168.1.181',
    login: 'admin',
    password: 'admin'
});
```

And then the code that actually sends the **originate** action (aka the "make it ring" action) from **yana** uses the rest of our relevant conf variables:

```js
ami.on('FullyBooted', function (event) {
    ami.send({
        Action: 'Originate',
        Channel: 'SIP/1337',
        Exten: '1337',
        Context: 'myphones',
        Priority: 1,
        Timeout: 1000
    }, function () {
        console.log(ASCII_R2D2);
        console.log('WE CALLED R2D2!');
    });
});
```

You'll also notice I hardcoded the timeout at 1 second. This is because the R2D2 phone will ring for a minimum of 10 seconds. I think this is because it is somehow programmed to complete one full cycle of the R2D2 sound regardless of it is actually still ringing or not. Since I wanted it to never ring for longer than that, just to be safe I set the timeout to 1 second.

And of course I had to add colorized R2D2 ASCII art for when it sucessfully sends the action.

![R2D2](https://i.cloudup.com/H3R1OaYCMx.png)

### npm (link) to the rescue!

Once I had it working locally, I ran `npm link` and then `R2D2` was global command.

## What's Next?

I plan to make a few small modifications so that the module can be included from another node module as well. Then I plan to include it as a notification from other scripts. Some things I've thought about using to ring the phone so far:

- Events from [andbang.js](https://github.com/andyet/andbang.js)
- The Twitter streaming API using [twit](https://www.npmjs.org/package/twit)
- Setting up a [WebRTC room](http://simplewebrtc.com/) and [signaling server](https://github.com/andyet/signalmaster) so when anyone enters the room, R2D2 will ring and let me know that someone is "calling" me.

The last one is the most exciting, and is actually a viable use case for this (which I wasn't always sure would happen). I'll post again with whatever crazy adventures I get into with my R2 droid.