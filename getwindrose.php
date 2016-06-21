<?php
require_once "dbsetting_n_connect.php";

$windrose_summary = array("N"=>0,"NNE"=>0,"NE"=>0,"ENE"=>0,"E"=>0,"ESE"=>0,"SE"=>0,"SSE"=>0,"S"=>0,"SSW"=>0,"SW"=>0,"WSW"=>0,
    "W"=>0,"WWN"=>0,"NW"=>0,"NNW"=>0);

foreach ($windrose_summary as $key=>$elem){
    //echo $key.":".$elem."<br>";
    $query = "SELECT COUNT(*) AS `cnt` FROM `windrose` WHERE `dir_str_en`=\"$key\"";
    //echo $query;
    $result = $mysql->query($query);
    $row = $result->fetch_assoc();
    if($row){
        //echo "Result ".$key.":".$row["cnt"]."<br>";
        $windrose_summary[$key] = (int)$row["cnt"];
    }
}

//var_dump($windrose_summary);
echo '{"summary":';
echo json_encode($windrose_summary);
echo '}';