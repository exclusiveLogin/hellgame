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
//запрос пользователей с таймаутом больше 10 минут

//удаление их



$mysql->close();