<?php
include_once "dbsetting.php";
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno)die("error db:".$mysql->connect_error);

$auth=array("auth"=>false,"login"=>"");
//echo 'getlogin: '.$_POST['login'].' getpass: '.$_POST['password'];
$login = null;
if($_GET["login"]=="ssv"){
    $query = "SELECT `password` FROM `users` WHERE `login`='ssv'";
    $login = 'ssv';

}else if ($_GET["login"]=="msn"){
    $query = "SELECT * FROM `users` WHERE `login`='msn'";
    $login = 'msn';
}else{
    $auth['auth']=false;
    $auth["login"]=$login;
    $auth["msg"]="Пользователь ".$login." не найден";
    echo json_encode($auth);
    die();
}
$res = $mysql->query($query);
$row = $res->fetch_assoc();
$pass = null;
while($row){
    $pass = $row['password'];
    $email = $row['email'];
    $user_id = $row['user_id'];
    $user_title = $row['title'];
    //echo 'password of user '.$login.': '.$pass;
    $row = $res->fetch_assoc();
}
$res->close();
$mysql->close();
if($_GET['password']==$pass){
    $auth['auth']=true;
    $auth["login"]=$login;
    $auth["user_id"] = $user_id;
    $auth["user_title"] = $user_title;
    $auth["msg"]="Авторизация для Пользователя ".$login." прошла успешно";
    echo json_encode($auth);
}
else{
    $auth['auth']=false;
    $auth["login"]=$login;
    $auth["msg"]="Неверный пароль для Пользователя ".$login;
    echo json_encode($auth);
}
