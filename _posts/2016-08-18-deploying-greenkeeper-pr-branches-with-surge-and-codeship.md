---
layout: post
title: "Deploying Greenkeeper PR Branches with Surge and Codeship"
date: 2016-08-18T14:02:21-07:00
categories: [surge, greenkeeper, ci, codeship, devops]
---

As I've mentioned before, [Greenkeeper is pretty great](/2016/03/07/greenkeeper). Another tool I love is [Surge](https://surge.sh), which allows you to quickly and easily publish any static content to the web. These two tools can be combined in a pretty cool way to allow you to see a built version of your site anytime Greenkeeper finds a release that doesn't match your versioning strategy.

<!-- more -->

**Note: I'm using Codeship as my CI service here, but any should be able to do this in a similar fashion.**

### Prerequistes

You'll want to have your project setup to run on Codeship first. The [Getting Started docs](https://codeship.com/documentation/tags/getting-started/) are a great place to start, or Surge has their own [documentation on how to integrate with Codeship](https://surge.sh/help/integrating-with-codeship).

### Configure a new deploy pipeline

The first step is to configure Codeship to run a custom command whenever a new branch starting with `greenkeeper` is pushed to. Note that this could be `feature` instead if you wanted to deploy every time you created a feature branch as well.

![Branch starts with greenkeeper](https://cldup.com/WcNs4nXZTO.png)

Then you want that deploy pipeline to run the command `npm run deploy-branch`. I like to use an [`npm run-script`](https://docs.npmjs.com/cli/run-script) as that allows me to keep all the logic for deploying this in my project.

![npm run deploy-branch](https://cldup.com/4ItKfxJLq5.png)

### Configure your run scripts

You probably already have some sort of command to deploy your project when the `master` branch gets pushed. Now you need to add a `deploy-branch` script that will get run by the deploy pipeline you added above. The only difference between this and your normal deploy command is that the `domain` is specified and will use the `$CI_BRANCH` environment variable from Codeship. You'll need to replace `<PROJECT_NAME` with your actual project name too.

```json
{
  "scripts": {
    "deploy-branch": "surge --project public/ --domain $CI_BRANCH-<PROJECT_NAME>.surge.sh"
  }
}
```

### Teardown old projects

One issue with this approach is that this will create a new Surge project with every branch you create (that matches the deploy pipeline). This is fine, because your branch names will be unique, but eventually you'll want to cleanup these old projects.

Thankfully, I [wrote a script called `surge-teardown-branches`](https://github.com/lukekarrys/surge-teardown-branches) that does just that!

To use it, you'll first want to install it with `npm install surge-teardown-branches --save-dev`. And then amend your current deploy script to use it:

```json
{
  "scripts": {
    "deploy": "surge --project public/ && surge-teardown-branches <PROJECT_NAME>.surge.sh"
  }
}
```

What this will do is look for Surge projects matching `<BRANCH_NAME>-<PROJECT_NAME>.surge.sh` and teardown any where `<BRANCH_NAME>` is not a remote branch.

See the [`project README`](https://github.com/lukekarrys/surge-teardown-branches#assumptions) for more info about how it works.

### Greenkeeper

The last step is to make sure [Greenkeeper is enabled on your project](https://greenkeeper.io/#getting-started). Now whenever a new version of a library is published, Greenkeepr will do it's magic and create a branch like `greenkeeper-react-16.0.0` on your project. Codeship will deploy that to a Surge project at the domain `greenkeeper-react-16.0.0-myproject.surge.sh`, and you can check it out to make sure everything looks good! Once your merge and delete the Greenkeeper branch, the no longer needed Surge project will be torn down.

### Feature branches (Optional)

If you want to do with feature branches, the only thing you need to change is the branch name prefix when configuring your deploy pipeline.

This enables the following workflow (let's say your project is called `awesomesauce` and you prefix branches with `feature`):

1. Create new branch `feature-new-stuff` on your `awesomesauce` git repo
2. Push to that branch a whole bunch. Each push will deploy the project to `feature-new-stuff-awesomesauce.surge.sh`
3. Once you're done with that branch, merge `feature-new-stuff` to `master` and delete the branch
4. The subsequent push to `master` will run the `deploy` script which will and `feature-new-stuff-awesomesauce.surge.sh` will be torn down
