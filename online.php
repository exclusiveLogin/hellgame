<?php
include_once "dbsetting.php";

$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    die('{"errors":true,"errormsg":"error db":"'.$mysql->connect_error.'"}');
}

$target_user = $_GET['t_user'];

//апдейт пользователя t_user
if($target_user){
    $query = 'INSERT IGNORE INTO `users_session`(`id_user`) SELECT `id` FROM `users` WHERE `login`="'.$target_user.'"';
    $mysql->query($query);
    $query = 'UPDATE `users_session` SET `datetime` = NOW() WHERE `id_user` = (SELECT `id` FROM `users` WHERE `login`="'.$target_user.'")';
    $mysql->query($query);



}
//делетим пользователей с таймаутом больше 10 минут
//$query = 'DELETE FROM `users_session` WHERE `datetime` < ADDDATE(NOW(),INTERVAL -3 MINUTE)';

$query = 'UPDATE `users_session` SET `demp` = `demp` + 1 WHERE `datetime` < ADDDATE(NOW(),INTERVAL -3 MINUTE)';
$mysql->query($query);

$query = 'DELETE FROM `users_session` WHERE `demp` > 1';
$mysql->query($query);

$query = 'UPDATE  `users_act` SET online =0 WHERE `id_user` NOT IN ( SELECT  `id_user` 
FROM  `users_session` 
WHERE  `users_session`.`id_user` =  `users_act`.`id_user` )';
$mysql->query($query);

//устанавливаем актуальный статус
$query = 'UPDATE  `users_act` SET online =1 WHERE  `id_user` = ( SELECT  `id_user` 
FROM  `users_session` 
WHERE  `users_session`.`id_user` =  `users_act`.`id_user` )';
$mysql->query($query);
$response = '{
    msg:"сработал онлайн скрипт"
}';








$mysql->close();