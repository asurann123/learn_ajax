<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/xml");
header("Content-Disposition: inline");

if ($_GET['mode'] == 1) {
  $result_xml = file_get_contents('https://news.yahoo.co.jp/rss/media/hbnippon/all.xml');
  echo $result_xml;
}else {
  $result_xml = file_get_contents('https://www.nikkansports.com/baseball/professional/atom.xml');
  echo $result_xml;
}
