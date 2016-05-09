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

    //Если есть сеттер
    if($_GET["setemo"]){
        $newval = (int)$_GET["setemo"];
        $emo_title = $_GET["emo_title"];
        $emo_desc = $_GET["emo_desc"];
        
        $query='INSERT INTO `'.$target_user.'_emo` (`value`,`emo_title`,`emo_desc`) VALUES ('.$newval.',"'.$emo_title.'","'.$emo_desc.'")';

        $msg = "Новое настроение ".$newval." для пользователя ".$target_user." установлено ";
        
        $mysql->query($query);
    }



    $mysql->query("SET time_zone = '+04:00'");

    $query="SELECT DATE_FORMAT(`datetime`,'%Y,%m,%d,%H,%i,%S') AS `datetime`,`value`,`emo_title`,`emo_desc` FROM `".$target_user."_emo` ORDER BY `datetime` ASC";
    $res = $mysql->query($query);

    $row = $res->fetch_assoc();
    $arr = array();
    while ($row){
        $num_arr = array_push($arr,[$row['datetime'],$row['value'],$row['emo_title'],$row['emo_desc']]);
        //echo "var dump DT:".$row['datetime']."  -VAL: ".$row['value']."--new_num:".$num_arr."<br>";
        $row = $res->fetch_assoc();
    }
    //echo var_dump($arr);
    $res->free();
    $mysql->close();
    //echo "<br>";
    echo '{"last_emo":'.$last_emo.',"prev_emo":'.$prev_emo.',"trend":'.json_encode($arr).',"msg":"'.$msg.'"}';
}
else{
    die('{"errors":true,"errormsg":"target user is null"}');
}



