<?php
include_once "dbsetting.php";
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno)die("error db:".$mysql->connect_error);

$query="SELECT `id_user`,`name`,`email`,`title`,`login`,`o_code`,`r_code`,`played`,`online`,`emotion`,`old_emotion`,`status_code`,`upd`,`code_msg` FROM `users`,`users_act` WHERE `users`.`id`=`users_act`.`id_user`";

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