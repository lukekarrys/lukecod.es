---
layout: post
title: "Linode StackScripts"
date: 2017-02-24T15:24:06-07:00
categories: [linode, stackscripts, devops, tweetyourbracket, bracketclub]
---

My side project [bracket.club][bracketclub] is a mostly static, client heavy webapp, but still requires a few backend pieces to run during its production.

As a primarily frontend developer without a ton of spare time, I try to use as much hosted stuff as possible. I'm currently using a hosted Postgres database at [Heroku][heroku-postgres] and a hosted Node.js API at [now.sh][nowsh].

But it's always nice to be able to run a VPS for somethings. In the case of [bracket.club][bracketclub], there's a few watchers to check for entries on Twitter and to get the latest results and save them to the DB. This is something that only needs to happen for a few days at a time and even on those days, the watchers might only need to run for a few hours.

This makes these watchers a perfect candidate for [Linode's hourly pricing][linode-pricing]. One of the caveats of hourly pricing though is that you are still charged for the instance even if it's powered off or not in use. So it's essential to be able to easily and effortlessly spin up and teardown these watcher instances in order to take full advantage of hourly pricing.

<!-- more -->


## Linode StackScripts

Linode has a feature called StackScripts which allow for customizable distribution templates that will be run the first time an instance is booted. This means that in a single command I can create a brand new Linode instance and in the time it takes the script to run (usually a few minutes), I can have the instance provisioned exactly as I want it and one command away from starting the watchers.

The StackScript does the following:

- Writes all output to a file for debugging
- Provides a way to pass in env variables
- Runs `apt-get` update and upgrade
- Hardens the `sshd_config` (disables password/root login)
- Installs `node`/`npm`/`pm2`
- Adds a non-root user
- Downloads a GitHub project
- Installs dependencies for the project
- Adds a `.env` file with production variables

For reference here's [the source of the StackScript for these watchers][data-stackscript].

```sh
#!/bin/bash

# <UDF name="TWITTER_KEY" Label="Twitter key" />
# <UDF name="TWITTER_SECRET" Label="Twitter secret" />
# <UDF name="TWITTER_TOKEN" Label="Twitter token" />
# <UDF name="TWITTER_TOKEN_SECRET" Label="Twitter token secret" />
# <UDF name="POSTGRES_URL" Label="URL to postgresql db" />
# <UDF name="USER_PASSWORD" Label="Password for user account" />

set -e

# Save stdout and stderr
exec 6>&1
exec 5>&2

# Redirect stdout and stderr to a file
exec > /root/StackScript.out
exec 2>&1

# apt-get
sudo apt-get -y -o Acquire::ForceIPv4=true -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" update
sudo DEBIAN_FRONTEND=noninteractive apt-get -y -o Acquire::ForceIPv4=true -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade

# Project specific vars
GITHUB_USER="bracketclub"
GITHUB_REPO="data"

# SSH
echo 'AddressFamily inet' | sudo tee -a /etc/ssh/sshd_config
sed -re 's/^(\#)(PasswordAuthentication)([[:space:]]+)(.*)/\2\3\4/' -i.'' /etc/ssh/sshd_config
sed -re 's/^(PasswordAuthentication)([[:space:]]+)yes/\1\2no/' -i.'' /etc/ssh/sshd_config
sed -re 's/^(UsePAM)([[:space:]]+)yes/\1\2no/' -i.'' /etc/ssh/sshd_config
sed -re 's/^(PermitRootLogin)([[:space:]]+)yes/\1\2no/' -i.'' /etc/ssh/sshd_config
sudo systemctl restart sshd

# nvm/npm/pm2
GLOBAL_NVM_DIR="/usr/local/nvm"
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | NVM_DIR=$GLOBAL_NVM_DIR bash
export NVM_DIR=$GLOBAL_NVM_DIR
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 6
npm install -g pm2

# Add user
cp /root/.bashrc /etc/skel/.bashrc
adduser --disabled-password --gecos "" --shell /bin/bash $GITHUB_USER
usermod -aG sudo $GITHUB_USER
echo "$GITHUB_USER:$USER_PASSWORD" | sudo chpasswd
mkdir -p /home/$GITHUB_USER/.ssh
cat /root/.ssh/authorized_keys >> /home/$GITHUB_USER/.ssh/authorized_keys
chown -R "$GITHUB_USER":"$GITHUB_USER" /home/$GITHUB_USER/.ssh

# Install app
APP_DIR="/home/$GITHUB_USER/$GITHUB_REPO"
curl -L https://github.com/$GITHUB_USER/$GITHUB_REPO/tarball/master | tar zx
mkdir -p $APP_DIR
mv -T $GITHUB_USER-$GITHUB_REPO-* $APP_DIR
cd $APP_DIR
npm install

# App env
echo "TWITTER_KEY=$TWITTER_KEY" >> .env
echo "TWITTER_SECRET=$TWITTER_SECRET" >> .env
echo "TWITTER_TOKEN=$TWITTER_TOKEN" >> .env
echo "TWITTER_TOKEN_SECRET=$TWITTER_TOKEN_SECRET" >> .env
echo "POSTGRES_URL=$POSTGRES_URL" >> .env

# Make it user accessible
chown -R "$GITHUB_USER":"$GITHUB_USER" $APP_DIR/

# All done
echo "Success!"

# Restore stdout and stderr
exec 1>&6 6>&-
exec 2>&5 5>&-
```


## Quick Linode Creation via the CLI

I keep that StackScript checked in to my project's version control, but I still need a way to update it within my Linode account so that future instance creation and rebuilds can use it. That's where the [Linode CLI][linode-cli] comes in.

The Linode CLI makes it pretty easy to create and update a StackScript attached to a Linode account:

```sh
linode stackscript \
  --action [create|update] \
  --label "My StackScript" \
  --codefile ./path/to/StackScript \
  --distribution "Ubuntu 16.04 LTS"
```

Once the StackScript has been created (and probably updated a few (dozen) times as you debug it), you can create or rebuild any instance with it. The following script will create a new Linode instance or rebuild it if it already exists.

See the [CLI documentation][cli-docs] for all available location, plan, and distribution options. Also check out the [StackScript documentation][linode-stackscripts-guide] on enviroment variables. In my case, I specify some `UDF` tags in my StackScript and then pass those variables via the `--stackscriptjson` parameter in the CLI.

```sh
linode show --label "My Linode"
[[ $? = "0" ]] && COMMAND="rebuild" || COMMAND="create"
linode --action $COMMAND \
  --label "My Linode" \
  # See the documentation for all available location/plan/distribution options
  --location fremont \
  --plan linode1024 \
  # What distro to use (should be the same as the StackScript)
  --distribution "Ubuntu 16.04 LTS" \
  # Installs a public key to the instance
  --pubkey-file ./path/to/key.pub \
  # Name of the StackScript to use
  --stackscript "My StackScript" \
  # Env vars required to pass to the StackScript
  --stackscriptjson '{"USER_PASSWORD":"VALUE","POSTGRES_URL":"VALUE2"}' \
  # Random root password, I don't login as root so I don't usually need this
  --password `dd bs=32 count=1 if="/dev/urandom" | base64 | tr +/ _.`
```

Once this command completes, you'll be able to `ssh` into the Linode instance (use `linode show "My Linode"` to get the IP address).

One thing to watch out for is that the previous command will complete and the StackScript will probably still be running if you `ssh` in right away. Because of this, I would always run `sudo tail -f /root/StackScript.out` (which is where the StackScript is explicitly writing all output) when I first logged in to make sure it was done.

## Success!

With this combination of Linode's StackScripts and CLI, I was able to get my instances from creation to usable in a matter of minutes.

Did you like this article? If so and you want to get started, consider [signing up with my referral code][linode-referral] and I'll get a little kickback.


[bracketclub]: https://bracket.club
[heroku-postgres]: https://devcenter.heroku.com/articles/heroku-postgresql
[nowsh]: https://zeit.co/now
[linode-pricing]: https://www.linode.com/docs/platform/billing-and-payments
[linode-stackscripts]: https://www.linode.com/stackscripts
[linode-stackscripts-guide]: https://www.linode.com/docs/platform/stackscripts#variables-and-udfs
[data-stackscript]: https://github.com/bracketclub/data/blob/625b939250b95efec270c497daa9c6e620f52973/bin/StackScript
[linode-cli]: https://www.linode.com/docs/platform/linode-cli
[data-cli]: https://github.com/bracketclub/data/blob/625b939250b95efec270c497daa9c6e620f52973/bin/linode.sh
[linode-referral]: https://www.linode.com/?r=89a3d836a648e0ac4c96d18b1228f2357dd9743f