---
layout: post
title: "Beep Boop: Notifications from a R2D2 Telephone"
date: 2014-03-28 15:34
categories: [r2d2, telephone, asterisk]
---

![the R2D2 phone](http://ecx.images-amazon.com/images/I/41YQ6Q2629L.jpg)

I got [this R2D2 telephone](http://www.amazon.com/gp/product/B00001U0IG) as a gift when I was 6th grade (or around there). It acted as my real telephone in my room as a teenager even though the handset was the most uncomfortable and least ergonomic handset imaginable. But the ringer is the iconic R2D2 noise which will never stop being epic to me (maybe this is just because my name is Luke?). So it's been sitting on my desk as art (well, at least I think it's art) for the past many years, but I've always wanted to find a better use for it. Note: I don't count using it as a real working phone and buying a landline "better".

Then I saw this [Twilio post](https://www.twilio.com/blog/2013/03/build-a-twilio-hard-phone-with-sip-from-twilio-raspberry-pi-asterisk-freepbx-and-the-obihai-obi100.html) about setting up a hard phone powered by their service. Well, I still wasn't crazy about having a hard phone, but I loved the hack. And then it dawned on me, **I CAN JUST MAKE THIS PHONE RING**.


## The Parts

So I hopped on Amazon and bought the parts I would need, borrowing heavily from the Twilio tutorial. I also tried to reuse as much stuff as I had laying around, which meant trying to get Asterisk up and running on my [pink PogoPlug running Arch Linux](http://archlinuxarm.org/platforms/armv5/pogoplug-v2-pinkgray) instead of buying a Raspberry Pi and using RasPBX.

1. **[OBi202 VoIP Phone Adapter](http://www.amazon.com/OBi202-Phone-Adapter-Router-2-Phone/dp/B007D930YO)**: I bought the 202 because it can be made to work wirelessly and it has an extra phone port if I ever wanted to ya know, actually use all this technology and hardware for something useful (like a real phone).
2. **[OBiWiFi Wireless Adapter](http://www.amazon.com/OBiWiFi-Wireless-Adapter-OBi200-OBi202/dp/B007R6F7PS)**: Works with the 202 and 201 to make them WiFi capable. You can get away with not buying this and getting the less expensive [OBi100](http://www.amazon.com/OBi100-Telephone-Adapter-Service-Bridge/dp/B004LO098O) if you want to plug everything in with Ethernet cables.
3. **A machine that will run [Asterisk](http://www.asterisk.org/)**: I am woefully unprepared to give advice in this area, but I got Asterisk up and running on my [PogoPlug E02](http://www.amazon.com/Pogoplug-POGO-B01-File-Sharing-Solution/dp/B004TDY924). I would also recommend going the [RasPBX/Raspberry Pi](http://www.raspberry-asterisk.org/) route as detailed in the [Twilio blog post](https://www.twilio.com/blog/2013/03/build-a-twilio-hard-phone-with-sip-from-twilio-raspberry-pi-asterisk-freepbx-and-the-obihai-obi100.html) since that seemed to have a pretty good community and setup instructions.


## Asterisk and The 1000 Line Conf Files (aka YMMV)

When I said "woefully unprepared" above, what I meant was that although I got this working in the end, I probably did 200+ Google searches while trying to get there. So I can share what I did to get it working, but I won't be a ton of help as to how my solution would work on other OSes/hardware/versions of asterisk. But feel free to ask any questions on [Twitter](https://twitter.com/lukekarrys)!


## The PogoPlug

![pink pogoplug](http://www.ohgizmo.com/wp-content/uploads/2009/11/pogoplug.jpg)

I bought this little machine on Amazon for ~$20 and it proved to be a fun toy for hacking on. There are better tutorials for getting this particular model [up and running with Arch Linux](http://archlinuxarm.org/platforms/armv5/pogoplug-v2-pinkgray), so I won't get into that.

*Bonus: [this post](http://blog.qnology.com/2013/03/tutorial-pogoplug-e02-with-arch-linux.html) has tutorials for doing everything from making it an AirPlay device to wireless printing.*


## Installing Asterisk

I was able to browse the [Arch Linux package registry](https://aur.archlinux.org/packages.php?K=asterisk) and find an Asterisk package...and it worked!

I had searched various forums and Google before this, and found links to Asterisk v11 packages or builds that people had hosted on Dropbox, but none of them worked. It came as a surpise when it was so easy to find a working package through a simple search on the package registry.

So this command took awhiile, but gave me a working Asterisk v12. 
`pacman -U http://downloads.asterisk.org/pub/telephony/asterisk/releases/asterisk-12.0.0.tar.gz`

And once that completed, I ran this to make sure Asterisk started on each restart. 
`systemctl enable asterisk`

## The .conf files

This is pretty much copied straight from the [one blog post](http://www.beardy.se/an-introduction-to-asterisk-the-open-source-telephony-project) where I could find a simple example of how to ring an extension on an internal network. Obviously, real world scenarios are going to be more complicated than this, but there were far more tutorials on the Internet for that kind of thing.

*Note: these files are located in `/etc/asterisk`.*

**Double Important Note: Nothing about this is secure. This was meant to just live on an internal network where anyone who had the default username/password could make the phone ring.** 

The important bits below are:

**extensions.conf and sip.conf**

- *1337* - That is the extension that I am using for the phone.
- *myphones* - The context I want to use for the extension.

**sip.conf**

- *secret=obihai* - The password I will use for the extension.
- *port=5060* - The port we will point the OBi202 at.

**manager.conf**

- *port=5038* - The port we will send our originate command to later.
- *[admin] and secret=admin* - The username/password to send the originate command.
- *originate for read,write* - This is off by default, but the originate command is what makes the phone ring.

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

After editing all these files, you'll want to reboot so that you can test that asterisk comes back up by itself.


## OBi202 Setup

Again, this is copied mostly from the [Twilio blog post](https://www.twilio.com/blog/2013/03/build-a-twilio-hard-phone-with-sip-from-twilio-raspberry-pi-asterisk-freepbx-and-the-obihai-obi100.html), but I'll repeat it here for a few reasons. One is that I want all this in one place, and also their setup goes into further detail to get their Twilio number to ring their phone.

#### Device Setup

0. Setup your Obihai with the WiFi adapter (if necesary). This was pretty much plug-and-play as I followed the 3 steps on the packaging.
1. Find the IP address of your Obihai device. The easiest way to do this is probably through the admin interface of your router.
2. Login to the IP address of your Obihai device. The default username/password is **admin/admin**.

#### SIP Credentials

1. In the admin interface go to **Voice Service > SP1 Service > SIP Credentials**
2. For the **AuthUserName** we will use our extension **1337**
3. For the **AuthPassword** we will use the secret from sip.conf **obihai**

![sip credential](https://i.cloudup.com/kknkEFsZmT.png)


#### Point the Obihai at Asterisk

1. In the admin interface go to **Service Providers > ITSP Profile A > SIP**
2. For the **ProxyServer** to the IP address of the machine running Asterisk
3. For the **ProxyServerPort** we will use the port from sip.conf **5060**

![proxy server](https://i.cloudup.com/4gxrxZJeuV.png)

#### Reboot the Obihai

That was easy! Just reboot the Obihai device with the **Reboot** button in the top right corner.


## Make it Ring!

There are a number of ways to make the phone ring, but they all center around sending an **originate** command to our asterisk server. One thing I tried was just via the command line:

```bash
asterisk -rx 'originate SIP/1337 extension 1337'
# or from my local computer over ssh
ssh pogoplug asterisk -rx 'originate SIP/1337 extension 1337'
```

The problem with that was I couldn't figure out how to properly set the timeout paramter, so the phone would ring for about 45 seconds. That is just a *little* bit too long for my tastes.


## npm to the rescue!

Of course someone had made an Asterisk AMI module for node. In fact, there was [more than one](https://www.npmjs.org/browse/keyword/asterisk). I chose [yana](https://www.npmjs.org/package/yana) because it worked (after I patched it for the latest version of Asterisk).

But what I really wanted was the ability to type `R2D2` on the command line and have it ring my beloved astromech droid. Luckily with node and npm this is very easy. The module I made is on GitHub if you want to see [the full source](https://github.com/lukekarrys/R2D2)!

All the parameters are configurable, but the defaults are setup to work on my local network. You'll see that all the [default values](https://github.com/lukekarrys/R2D2/blob/master/index.js#L9-L16) are from our configuration files above. Here's the code with the defaults from **manager.conf** plugged in:

```js
var AMI = require('yana');
var ami = new AMI({
    'port': '5060',
    'host': '192.168.1.181',
    'login': 'admin',
    'password': 'admin'
});
```

And then the code that actually sends the **originate** command from **yana** uses the rest of our relevant conf variables:

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
        console.log('WE CALLED R2D2!');
    });
});
```

You'll also notice I hardcoded the timeout at 1 second. This is because the R2D2 phone will ring for a minimum of 10 seconds. I think this is because it is somehow programmed to complete one full cycle of the R2D2 sound regardless of it is actually ringing. Since I wanted it to never ring for longer than that, just to be safe I set the timeout to 1 second.

And of course I had to add colorized R2D2 ASCII art for when it sucessfully connects.

![R2D2](https://i.cloudup.com/H3R1OaYCMx.png)

### npm (link) to the rescue!

Once I had it working locally, I ran `npm link` and then R2D2 was global command.

It can also be (with a few easy modications) a module that I can include anywhere and use as a notifcation. Some things I've thought about using to ring the phone so far:

- Events from [andbang.js](https://github.com/andyet/andbang.js)
- The Twitter streaming API using [twit](https://www.npmjs.org/package/twit)
- Setting up a [WebRTC room](http://simplewebrtc.com/) and [signaling server](https://github.com/andyet/signalmaster) so when anyone enters the room, R2D2 will ring and let me know that someone is "calling" me

## Next?

There will be another post in the future with whatever crazy thing I end up using this for.