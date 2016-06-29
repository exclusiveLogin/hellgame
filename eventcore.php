<?php
/**
 * Created by PhpStorm.
 * User: SavinSV
 * Date: 28.06.16
 * Time: 8:50
 */

require_once "dbsetting_n_connect.php";
//-----------Deleter---------------------------
/*
 * Получаем все записи с for=once и интервалом более 1 минуты
 * далее формируем цикл где перебираем ID и удаляем из БД
 * */
//-----------Setter---------------------------
if($_GET["add"] && $_GET["add_title"] && $_GET["add_desc"]){
    $title = $_GET["add_title"];
    $description = $_GET["add_desc"];
    if($_GET["add_status"]){
        $status = $_GET["add_status"];
    }
    else{
        $status = "ok";
    }

    if($_GET["add_notify"]){
        $notify = 1;
    }
    else{
        $notify = 0;
    }

    if($_GET["for"] && gettype($_GET["for"])=="array"){
        foreach($_GET["for"] as $key => $user){
            $query = "INSERT INTO `events` (`for`,`title`,`desc`,`status`,`notify`) VALUES (\"$user\",\"$title\",\"$description\",\"$status\",$notify)";
            echo $query."<br>";
            $mysql->query($query);
        }
    }else{
        $query = "INSERT INTO `events` (`for`,`title`,`desc`,`status`,`notify`) VALUES (\"once\",\"$title\",\"$description\",\"$status\",$notify)";
        echo $query."<br>";
        $mysql->query($query);
    }
}
//-----------Getter---------------------------
if($_GET["getlast"]){
    if($_GET["getfor"]){
        $tmp_user = $_GET["getfor"];
        $query = "SELECT * FROM `events` WHERE `for`=\"$tmp_user\"";
        echo $query."<br>";
        $result = $mysql->query($query);
        $row = $result->fetch_assoc();
        $tmp_last_ev = array();
        while ($row){
            array_push($tmp_last_ev,$row);
            $row = $result->fetch_assoc();
        }
        echo json_encode($tmp_last_ev);
    }else{
        echo "[]";
    }
}
