<?php
include_once "dbsetting.php";


$target_user = $_GET['t_user'];
if ($target_user){
    $mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
    if($mysql->connect_errno){
        die('{"errors":true,"errormsg":"error db":"'.$mysql->connect_error.'"}');
    }

    //проверка юзера есть ли в базе такой
    $query='SELECT  `id` FROM  `users` WHERE `login` = "'.$target_user.'"';
    $res = $mysql->query($query);
    $row = $res->fetch_assoc();
    if(!$row["id"])die('{"errors":true,"errormsg":"user from query not exists from DB"}');
    $res->free();
    $row = null;
    //----------------------------------------
    //-----определяем последнее настроение----
    $query="SELECT  `value` FROM  `".$target_user."_emo` WHERE id = (SELECT MAX( `id`) FROM `".$target_user."_emo` )";
    $res = $mysql->query($query);
    $row = $res->fetch_assoc();

    if($row){
        $last_emo = $row['value'];
    }
    else{
        die('{"errors":true,"errormsg":"data lastEMO from DB is null"}');
    }
    $res->free();
    $row = null;
    //-----определяем предпоследнее настроение----

    $query="SELECT  `value` FROM  `".$target_user."_emo` WHERE id = (SELECT MAX( `id`)-1 FROM `".$target_user."_emo` )";
    $res = $mysql->query($query);

    $row = $res->fetch_assoc();
    if($row){
        $prev_emo = $row['value'];
    }
    else{
        die('{"errors":true,"errormsg":"data prevEMO from DB is null"}');
    }
    $res->free();
    $mysql->close();

    echo '{"last_emo":'.$last_emo.',"prev_emo":'.$prev_emo.'}';
}
else{
    die('{"errors":true,"errormsg":"target user is null"}');
}



