<?php

/**
 * Replaces Gist javascript instances with their actual content,
 * avoiding the use of document.write().
 *
 * @param string $source (X)HTML source
 *
 * @return string (X)HTML with embedded Gists
 */

$id = $_GET['id'];
$file = (isset($_GET['file'])) ? '?file='.$_GET['file'] : '';

        $embed = file_get_contents('https://gist.github.com/'.$id.'.js'.$file);


 if ($embed != false) {

            // remove document.writes
            $embed = preg_replace('/document.write\(\'/i', '', $embed);
            $embed = preg_replace('/(*ANYCRLF)\'\)$/m', '', $embed);

            // remove javascript newlines
            $embed = preg_replace('%(?<!/)\\\\n%', '', $embed);

            // reverse javascript escaping
            $embed = stripslashes($embed);

            // remove line breaks
            $embed = preg_replace("/[\n\r]/", '',$embed);

            // replace the script tag

        }

echo $embed;


?>