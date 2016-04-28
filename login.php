<?php
include_once "dbsetting.php";
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno)die("error db:".$mysql->connect_error);

$auth=array("auth"=>false,"login"=>"");
//echo 'getlogin: '.$_POST['login'].' getpass: '.$_POST['password'];
$login = null;
if($_POST["login"]=="ssv"){
    $query = "SELECT `password` FROM `users` WHERE `login`='ssv'";
    $login = 'ssv';

}else if ($_POST["login"]=="msn"){
    $query = "SELECT `password` FROM `users` WHERE `login`='msn'";
    $login = 'msn';
}else{
    die("Script access denied");
}
$res = $mysql->query($query);
$row = $res->fetch_assoc();
$pass = null;
while($row){
    $pass = $row['password'];
    //echo 'password of user '.$login.': '.$pass;
    $row = $res->fetch_assoc();
}
$res->close();
$mysql->close();
if($_POST['password']==$pass){
    $auth['auth']=true;
    $auth["login"]=$login;
    echo json_encode($auth);
}
else{
    $auth['auth']=false;
    $auth["login"]="";
    echo json_encode($auth);
}
