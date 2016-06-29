<?php
/**
 * Created by PhpStorm.
 * User: alter
 * Date: 23.06.2016
 * Time: 21:46
 */
$arr = array();
for ($i=0;$i<10;$i++){
    array_push($arr,$i);
}
$test;
array_push($arr,$test);
for ($i=0;$i<10;$i++){
    array_push($arr,$i);
}

var_dump($arr);
echo "<br>";
echo json_encode($arr);