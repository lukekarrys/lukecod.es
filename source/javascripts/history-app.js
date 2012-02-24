(function($) {

  var hasHistory = function() {
    return !! (window.history && history.pushState);
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
      isInternalLink = ((url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1) && url.charAt(0) !== "#");

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
            url = $link.attr('href');

        // Continue as normal for cmd clicks etc
        if (event.which == 2 || event.metaKey) {
          return true;
        }

        // Ajaxify this link
        History.pushState(null, null, url);
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
            $contentArea.html($content.html())[classMethod](homeClass).ajaxify();
            addCodeLineNumbers();
            disqus_function(dsScript);
            twitter_sharing();
            $('title').text(title);
            _gaq.push(['_trackPageview', ((relativeUrl.charAt(0) === '/')?'':'/')+relativeUrl]);
            
            var currentPos = $body.scrollTop(),
                scrollTo = $('nav[role="navigation"]').offset().top,
                distance = (currentPos > scrollTo) ? Math.abs(currentPos - scrollTo) : 0;
            
            if (distance > 0) {
              $('html, body').delay(200).animate({
                scrollTop: scrollTo
              }, distance);
            }
            
          });

        }
      });

      return false;
    });

  });
})(jQuery);
