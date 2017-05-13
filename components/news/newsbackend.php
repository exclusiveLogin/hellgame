<?php
require_once "../../dbsetting_n_connect.php";
//echo "<p>Server working...</p>";

//var_dump($_GET);
//var_dump($_POST);
//var_dump($_FILES);

if(isset($_POST["newsadd"])||isset($_GET["newsadd"])){
    if((isset($_POST["newstitle"])||isset($_GET["newstitle"])) && (isset($_POST["newstext"])||isset($_GET["newstext"])) &&
        (isset($_POST["newsprivate"])||isset($_GET["newsprivate"])) && (isset($_POST["newsauthor"])||isset($_GET["newsauthor"]))){
        echo "<p>Validation complete success...</p>";
        $newstitle = $_POST["newstitle"] OR $_GET["newstitle"];
        $newstext = $_POST["newstext"] OR $_GET["newstext"];
        $newsprivate = $_POST["newsprivate"] OR $_GET["newsprivate"];
        $newsauthor = $_POST["newsauthor"] OR $_GET["newsauthor"];
        $imgValid = false;
        if(isset($_FILES["myFile"])){
            echo "<p>Файл найден</p>";
            $linkonfile = $_FILES["myFile"];
            var_dump(getimagesize($linkonfile["tmp_name"]));
            if(preg_match('/^image\/*/',$linkonfile["type"])){
                $tmp_name = explode("/",$linkonfile["tmp_name"]);
                $tmp_ext = explode(".",$linkonfile["name"]);
                $newImgPath = dirname(__FILE__)."/images/".$tmp_name[count($tmp_name)-1].".".$tmp_ext[count($tmp_ext)-1];
                $resolvePath = "/images/".$tmp_name[count($tmp_name)-1].".".$tmp_ext[count($tmp_ext)-1];
                $result = move_uploaded_file($linkonfile["tmp_name"], $newImgPath);
                if($result){
                    echo "файл успешно перенесен:".$newImgPath;
                    $imgValid = true;
                }else {
                    echo "файл не сохранен";
                }
            }
        }
        if($imgValid){
            $query = "INSERT INTO  `news` (`title`,`text`,`private`,`author`,`img`) VALUES (\"$newstitle\",\"$newstext\",\"$newsprivate\",\"$newsauthor\",\"$resolvePath\")";
        }else{
            $query = "INSERT INTO  `news` (`title`,`text`,`private`,`author`) VALUES (\"$newstitle\",\"$newstext\",\"$newsprivate\",\"$newsauthor\")";
        }

        echo "query:".$query;
        $success = $mysql->query($query);
        if($success){
            echo "Данные добавлены в БД";
        }else{
            echo "Лоханулся где то... :`-(";
        }

    }else{
        echo "<p>Validation ERROR</p>";
    }
}
if(isset($_POST["newslist"]) OR isset($_GET["newslist"])){
    //echo "<p>news list</p>";
    $newsprivate = false;
    if(isset($_POST["newsprivate"]))$newsprivate = $_POST["newsprivate"];
    if(isset($_GET["newsprivate"]))$newsprivate = $_GET["newsprivate"];

    $newslastid = false;
    if(isset($_POST["newslastid"]))$newslastid = $_POST["newslastid"];
    if(isset($_GET["newslastid"]))$newslastid = $_GET["newslastid"];

    if($newsprivate){
        if(!$newslastid){
            $query = "SELECT * FROM  `news` WHERE `private`= \"$newsprivate\" ORDER BY `id` DESC LIMIT 3";
        }else{
            $query = "SELECT * FROM  `news` WHERE `private`= \"$newsprivate\" AND `id` < $newslastid ORDER BY `id` DESC LIMIT 3";
        }
    }else{
        if(!$newslastid){
            $query = "SELECT * FROM  `news` ORDER BY `id` DESC LIMIT 3";
        }else{
            $query = "SELECT * FROM  `news` WHERE `id` < $newslastid ORDER BY `id` DESC LIMIT 3";
        }
    }
    //echo $query;
    $result = $mysql->query($query);
    $json = array();
    $row = $result->fetch_assoc();
    while($row){
        array_push($json,$row);
        $row = $result->fetch_assoc();
    }
    echo json_encode($json);
}
