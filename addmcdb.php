<?php
$logindb="b33_11934654";
$passdb="request";
$dbhost="sql107.byethost33.com";
$dbname="b33_11934654_hell";

$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    echo 'error:'.$mysql->connect_error;
    die();
}

if($_POST['addmc']){
    $namemc=mysqli_real_escape_string($mysql,$_POST["namemc"]);
    $descriptionmc=mysqli_real_escape_string($mysql,$_POST["descriptionmc"]);
    $addmcflag=$_POST["addmc"];
    $sql = "INSERT INTO `units` (`name`,`description`) VALUES ('$namemc','$descriptionmc')";
    //echo "Before:".$sql;

    $res = $mysql->query($sql);
    if($mysql->errno){echo "errors:".$mysql->error;}
    //echo "namemc:$namemc, descriptiionmc:$descriptionmc, addmcflag:$addmcflag, res: $res";
}
elseif($_POST['deletemc']){
    $deletemcid=$_POST["mcid"];
    $sql = "DELETE FROM `units` WHERE id=$deletemcid";
    echo $sql;
    $res = $mysql->query($sql);
    if($mysql->errno){echo "errors:".$mysql->error;}
}
$mysql->close();