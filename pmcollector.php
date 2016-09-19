<?php

require_once "GCM/Sender.php";
require_once "GCM/Exception.php";
require_once "GCM/Message.php";
require_once "GCM/Response.php";
require_once "dbsetting_n_connect.php";
print_r($_GET);
print_r($_POST);
if($_POST['pmadd'] || $_GET['pmadd']){
    if(isset($_POST['pmtokken']))$pmtokken = $_POST['pmtokken'];
    if(isset($_GET['pmtokken']))$pmtokken = $_GET['pmtokken'];

    if(isset($_POST['pmuser']))$pmuser = $_POST['pmuser'];
    if(isset($_GET['pmuser']))$pmuser = $_GET['pmuser'];

    $query = "INSERT INTO `push_subscribes` (`pm`,`user`) VALUES (\"$pmtokken\",\"$pmuser\")";
    $mysql->query($query);
    echo "Данные добавлены:".$pmtokken." user:".$pmuser."<br>";
}
if($_POST['pmsel'] || $_GET['pmsel']){//выбираем
    $query = "SELECT * FROM `push_subscribes`";
    $pmarr = array();
    $resultsql = $mysql->query($query);
    $row = $resultsql->fetch_assoc();
    while ($row){
        array_push($pmarr,$row['pm']);
        $row = $resultsql->fetch_assoc();
    }
    echo "<br>pmarray:";
    var_dump($pmarr);
    $sender = new Sender("AIzaSyCDV_cGYt4mHY0kGg6_4vvsvMc41Fw5g3c");
    try {
        $response = $sender->sendMessage(
            $pmarr,
            array(),
            "collapse_key"
        );

        if ($response->getNewRegistrationIdsCount() > 0) {
            $newRegistrationIds = $response->getNewRegistrationIds();
            foreach ($newRegistrationIds as $oldRegistrationId => $newRegistrationId){
                //Update $oldRegistrationId to $newRegistrationId in DB
                echo "old:".$oldRegistrationId." new:".$newRegistrationId."<br>";
            }
        }

        if ($response->getFailureCount() > 0) {
            $invalidRegistrationIds = $response->getInvalidRegistrationIds();
            foreach($invalidRegistrationIds as $invalidRegistrationId) {
                //Remove $invalidRegistrationId from DB
                echo "invalidRegistrationId:".$invalidRegistrationId."<br>";
                $query = "DELETE FROM `push_subscribes` WHERE `pm`=\"$invalidRegistrationId\"";
                $mysql->query($query);
            }

            //Schedule to resend messages to unavailable devices

            /*$unavailableIds = $response->getUnavailableRegistrationIds();
            if($unavailableIds){
                echo "Имеются неактивные токены <br>";
                var_dump($unavailableIds);
            }*/
        }
    } catch (myException $e) {

        switch ($e->getCode()) {
            case myException::ILLEGAL_API_KEY:
            case myException::AUTHENTICATION_ERROR:
            case myException::MALFORMED_REQUEST:
            case myException::UNKNOWN_ERROR:
            case myException::MALFORMED_RESPONSE:
                //Deal with it
                break;
        }
    }
}