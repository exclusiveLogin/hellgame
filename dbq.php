<?php
echo "{";
$logindb="b33_11934654";
$passdb="request";
$dbhost="sql107.byethost33.com";
$dbname="b33_11934654_hell";

$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);

echo '"errors":';
if($mysql->connect_errno){
    echo '1,';
    echo '"error":"'.$mysql->connect_error.'"}';
    die();
}else echo '0,';


echo '"units":[';
$res = $mysql->query("SELECT * FROM `units`");
$row = $res->fetch_assoc();
while($row){
    $answer_json=json_encode($row);
    echo $answer_json;
    $row = $res->fetch_assoc();
    if($row) echo ",";
}

echo ']}';
$res->close();
$mysql->close();

