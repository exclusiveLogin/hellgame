<?php
include_once "dbsetting.php";
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno)die("error db:".$mysql->connect_error);

$_GET[''];

$query="SELECT  `value` FROM  `msn_emo` WHERE id = (SELECT MAX( `id`) FROM `msn_emo` )";

$res = $mysql->query($query);
$row = $res->fetch_assoc();
echo '{"r_users":[';
while($row){
    $jsonout = json_encode($row);
    echo $jsonout;
    $row = $res->fetch_assoc();
    if($row)echo ",";
}
echo "]}";
$res->close();
$mysql->close();