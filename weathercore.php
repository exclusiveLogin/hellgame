<?php
include_once ("dbsetting.php");
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    die('{"errors":true,"errormsg":"error db":"'.$mysql->connect_error.'"}');
}
$mysql->query("SET NAMES 'UTF8';");
$query = "SELECT `status` FROM `weather`";
$res = $mysql->query($query);

$row = $res->fetch_assoc();
if(!$row){
    echo "DB Empty";
    //качаем json и если все ок пишем файл и true в DB
    $json = file_get_contents("http://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=69e74215c599f98adce65d87e9fdb41c&lang=ru");
    //echo $_SERVER['DOCUMENT_ROOT'];
    if($json){
        //echo "<p>all ok file received</p>";
        $path = $_SERVER['DOCUMENT_ROOT']."/temp";
        $file = $_SERVER['DOCUMENT_ROOT']."/temp/weather.json.";
        if(file_exists($file)){
            $result = file_put_contents($file, $json);
            //echo "<p>write to file ".$result."bytes</p>";
        }
        else{
            if(file_exists($path)){
                $result = file_put_contents($file, $json);
                
                //echo "<p>create file and write ".$result."bytes</p>";

            }
            else{
                if(mkdir($path)){
                    //echo "<p>folder created</p>";
                }else{
                    //echo "<p>folder error</p>";
                }
                if($result = file_put_contents($file, $json)){
                    //echo "<p>create file and folder and write ".$result."bytes</p>";
                }else{
                    //echo "<p>file not writed</p>";
                }

            }

        }
    }

    $query = "INSERT INTO `weather`(`status`) VALUES (0)";
    $res = $mysql->query($query);
}
else{
    echo "DB OK<br>";
    //проверяем дату и таймаут записи если все ок . читаем Файл и отдаем пользователю.

    //если нет скачиваем файл отдаем пользователю пишем в DB что все ок обновляем таймауты
    $query = "SELECT * FROM `weather`";
    $res = $mysql->query($query);
    $row = $res->fetch_assoc();
    if(row){
        echo "Данные из БД получены обновлены: ".$row['upd'].'<br>';
    }
}


