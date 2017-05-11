<?php
$logindb="host1490316";
$passdb="ea8160c0";
$dbhost="localhost";
$dbname="host1490316";

$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    die('{"errors":true,"errormsg":"error db":"'.$mysql->connect_error.'"}');
}
$mysql->query("SET NAMES 'UTF8';");