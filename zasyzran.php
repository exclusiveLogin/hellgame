<?php

$path = $_SERVER['PATH_TRANSLATED']."temp";
$file = $_SERVER['PATH_TRANSLATED']."temp/z_plane.json";
$remote = "http://zasyzran.ru/termo/script/database.php";



echo $path."<br>";
echo $file."<br>";

echo "{";
    //$json = file_get_contents($remote);
    $json = fopen($remote,"r");
    if($json){
        echo "<p>all ok file received</p>";
        if(file_exists($file)){
            $result = file_put_contents($file, $json);
            echo "<p>write to file ".$result."bytes</p>";
        }
        else{
            if(file_exists($path)){
                $result = file_put_contents($file, $json);
                echo "<p>create file and write ".$result."bytes</p>";
            }
            else{
                if(mkdir($path)){
                    echo "<p>folder created</p>";
                }else{
                    echo "<p>folder error</p>";
                    echo '"error":true';
                }
                if($result = file_put_contents($file, $json)){
                    echo "<p>create file and folder and write ".$result."bytes</p>";
                }else{
                    echo "<p>file not writed</p>";
                    echo '"error":true';
                }
            }
        }
        echo '"error":false, "plane":'.$json;
    }
    else{//если не удалось получить данные с OWM
        echo "<p>не удалось получить данные с zasyzran</p>";
        echo '"error":true';
    }
echo "}";
