---
layout: post
title: "Symbolset and Bootstrap 3 Buttons"
date: 2014-01-27 17:13
categories: [bootstrap, symbolset, css, less]
---

I've been using both [Bootstrap 3](http://getbootstrap.com/) and [Symbolset icons](http://symbolset.com/) on a project, and I noticed the when using the icons inside there are two issues:

1. The icons look too big
2. They are not aligned vertically

I wrote some very simple [LESS](http://www.lesscss.org/) code which I think makes them look much better.

### Screenshot
![Before and after: Symbolset icons inside Bootstrap buttons](//i.cloudup.com/xcRuZJZFFD.png)

### Code
{% highlight css %}
.btn {
    .ss-icon {font-size:  @font-size-base - 2; vertical-align: middle;}
    &.btn-xs .ss-icon {font-size:  @font-size-small - 3;}
    &.btn-sm .ss-icon {font-size:  @font-size-small - 2;}
    &.btn-lg .ss-icon {font-size:  @font-size-large - 2;}
}
{% endhighlight %}

