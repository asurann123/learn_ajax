<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/xml");
header("Content-Disposition: inline");
$result_xml = file_get_contents('https://www.nikkansports.com/baseball/professional/atom.xml');

echo $result_xml;
