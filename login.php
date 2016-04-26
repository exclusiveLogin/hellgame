<?php
$auth=array("auth"=>false);
if($_POST['login']=='admin'&&$_POST['password']=='drxt'){
    $auth['auth']=true;
    echo json_encode($auth);
}
else{
    $auth['auth']=false;
    echo json_encode($auth);
}
