<?php
include_once ("dbsetting.php");
$mysql= new mysqli($dbhost,$logindb,$passdb,$dbname);
if($mysql->connect_errno){
    die('{"errors":true,"errormsg":"error db":"'.$mysql->connect_error.'"}');
}
$mysql->query("SET NAMES 'UTF8';");
$query = "SELECT `status` FROM `weather`";
$res = $mysql->query($query);
$path = $_SERVER['DOCUMENT_ROOT']."/temp";
$file = $_SERVER['DOCUMENT_ROOT']."/temp/weather.json";
$owm = "http://api.openweathermap.org/data/2.5/weather?q=syzran&appid=69e74215c599f98adce65d87e9fdb41c&lang=ru&units=metric";
$row = $res->fetch_assoc();
echo "{";
if(!$row){
    echo '"debug":"db empty",';
    //качаем json и если все ок пишем файл и true в DB
    $json = file_get_contents($owm);
    //echo "текущий каталог: ".$_SERVER['DOCUMENT_ROOT']."<br>";
    if($json){
        //echo "<p>all ok file received</p>";        
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
                    echo '"error":true';
                }
                if($result = file_put_contents($file, $json)){
                    //echo "<p>create file and folder and write ".$result."bytes</p>";
                }else{
                    //echo "<p>file not writed</p>";
                    echo '"error":true';
                }
            }
        }
        $query = "INSERT INTO `weather`(`status`) VALUES (1)";
        $res = $mysql->query($query);
        echo '"weather":'.$json;
    }
    else{//если не удалось получить данные с OWM
        $query = "INSERT INTO `weather`(`status`) VALUES (0)";
        $res = $mysql->query($query);
        echo '"error":true';
    }
}
else{
    echo '"debug":"db ok",';
    //проверяем дату и таймаут записи если все ок . читаем Файл и отдаем пользователю.

    //если нет скачиваем файл отдаем пользователю пишем в DB что все ок обновляем таймауты
    $query = "SELECT *,NOW() AS cur_time FROM `weather`";
    $res = $mysql->query($query);
    $row = $res->fetch_assoc();
    if(row){
        $compare = strtotime($row['cur_time']) - strtotime($row['upd']);
        echo '"compare":'.$compare.",";
        //echo "Данные из БД получены обновлены: ".$row['upd'].'<br> Cur:'.$row['cur_time'].'<br> прошло '.$compare."секунд";
        if($compare>300){//качаем файл заново            
            $json = file_get_contents($owm);
            //echo "refresh";
            //echo "текущий каталог: ".$_SERVER['DOCUMENT_ROOT']."<br>";
            if($json){
                //echo "<p>all ok file received</p>";
                $path = $_SERVER['DOCUMENT_ROOT']."/temp";
                $file = $_SERVER['DOCUMENT_ROOT']."/temp/weather.json";
                if(file_exists($file)){
                    $result = file_put_contents($file, $json);
                    //echo "<p>write to file ".$result."bytes</p>";
                    //echo '"weather":'.$json;
                }
                else{
                    if(file_exists($path)){
                        $result = file_put_contents($file, $json);
                        //echo "<p>create file and write ".$result."bytes</p>";
                        //echo '"weather":'.$json;
                    }
                    else{
                        if(mkdir($path)){
                            //echo "<p>folder created</p>";
                        }else{
                            //echo "<p>folder error</p>";
                            echo '"error":true';
                        }
                        if($result = file_put_contents($file, $json)){
                            //echo "<p>create file and folder and write ".$result."bytes</p>";
                        }else{
                            //echo "<p>file not writed</p>";
                            echo '"error":true';
                        }
                    }
                }
                $query = "UPDATE `weather` SET `status`=1";
                $res = $mysql->query($query);
                $query = "UPDATE `weather` SET `upd`=NOW()";
                $res = $mysql->query($query);
                echo '"weather":'.$json;
            }
            else{//если не удалось получить данные с OWM
                //echo "Данные с OWM не получены";
                $query = "UPDATE `weather` SET `status`=0";
                $res = $mysql->query($query);
                $query = "UPDATE `weather` SET `upd`=NOW()";
                $res = $mysql->query($query);
                echo '"error":true';
            }
        }
        else{//отдаем старый
            if(file_exists($file)){
                $json = file_get_contents($file);
                if($json){
                    echo '"weather":'.$json;
                }
                else{
                    echo 'error":true';
                }
            }else {//если нет файла но запись есть
                $json = file_get_contents($owm);
                if($json){
                    if(file_exists($path)){
                        $result = file_put_contents($file, $json);
                        //echo "<p>create file and write ".$result."bytes</p>";
                        echo '"weather":'.$json;
                    }
                    else{
                        if(mkdir($path)){
                            //echo "<p>folder created</p>";
                        }else{
                            //echo "<p>folder error</p>";
                            echo '"error":true';
                        }
                        if($result = file_put_contents($file, $json)){
                            //echo "<p>create file and folder and write ".$result."bytes</p>";
                            echo '"weather":'.$json;
                        }else{
                            //echo "<p>file not writed</p>";
                            echo '"error":true';
                        }
                    }
                }
                else{
                    echo '"error":true';
                }
                
            }
        }
    }
}
echo "}";
$mysql->close();


