(function($) {

  var hasHistory = function() {
    return !!(window.history && history.pushState);
  };

  if (!hasHistory()) {
    return;
  }

  $(function() {
    var $contentArea = $('#content > div'),
      rootUrl = History.getRootUrl(),
      $body = $('body');

    $.expr[':'].internal = function(obj, index, meta, stack) {
      // Prepare
      var $link = $(obj),
          url = $link.attr('href') || '',
          isInternalLink;

      // Check link
      isInternalLink = ((url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1) && url.charAt(0) !== "#" && url.indexOf('atom.xml') === -1);

      // Ignore or Keep
      return isInternalLink;
    };

    // Ajaxify Helper
    $.fn.ajaxify = function() {
      // Prepare
      var $this = $(this);
      
      // Ajaxify
      $this.find('a:internal').click(function(event) {
        // Prepare
        var $link = $(this),
            url = $link.attr('href'),
            hash = url.split('#')[1],
            data = {};

        // Continue as normal for cmd clicks etc
        if (event.which == 2 || event.metaKey) {
          return true;
        }

        if (hash) {
          url = url.replace('#'+hash, '');
          data.hash = hash;
        }
        
        // Ajaxify this link
        History.pushState(data, null, url);
        event.preventDefault();
        return false;
      });

      // Chain
      return $this;
    };

    $body.ajaxify();

    $(window).bind('statechange', function() {
      
      var State = History.getState(),
          url = State.url,
          stateData = State.data,
          hash = stateData.hash,
          relativeUrl = url.replace(rootUrl, ''),
          isHome = (relativeUrl === '/' || relativeUrl === '/index.html' || relativeUrl === "") ? true : false,
          classMethod = (isHome) ? 'addClass' : 'removeClass',
          dsScript = (isHome || relativeUrl.indexOf("blog/archives") > -1) ? 'count.js' : 'embed.js',
          homeClass = 'blog-index';

      $.ajax({
        url: url,
        dataType: 'html',
        success: function(data) {
          var $data = $(data),
              $content = $data.find('#content > div'),
              title = $data.filter('title').text(),
              $gists = $content.find('.gist-holder'),
              gistEmbeds = [];

          $gists.each(function() {
            var $gistHolder = $(this),
                url = $gistHolder.data('gist-url'),
                id = url.replace(/.*\.com\/([0-9]+)\.js.*/, '$1'),
                file = url.split('?file=')[1];

            gistEmbeds.push($.get('/embed-gist.php?id=' + id + ((file) ? '&file=' + file : ''), function(data) {
              $gistHolder.html(data);
            }));
          });

          $.when.apply($, gistEmbeds).done(function() {
            $contentArea.fadeOut(400, function() {
              $(this).html($content.html())[classMethod](homeClass).ajaxify().fadeIn(400);
              addCodeLineNumbers();
              disqus_identifier = url;
              disqus_url = url;
              DISQUS.reset({
                reload: true,
                config: function () {
                  this.page.identifier = disqus_identifier;
                  this.page.url = disqus_url;
                }
              });
              twitter_sharing();
              $('title').text(title);
              _gaq.push(['_trackPageview', ((relativeUrl.charAt(0) === '/')?'':'/')+relativeUrl]);
            });
            
            var currentPos = $body.scrollTop(),
                $nav = $('nav[role="navigation"]'),
                $scrollTo = (hash) ? $('#' + hash) : $nav,
                scrollTo = $scrollTo.offset().top,
                distance = (currentPos > $nav.position().top || hash) ? Math.abs(currentPos - scrollTo) : 0;
            
            if (distance > 0) {
              $('html, body').animate({
                scrollTop: scrollTo
              }, distance, function() {
                if (hash) window.location.hash = hash;
              });
            }
            
          });

        }
      });

      return false;
    });

  });
})(jQuery);
