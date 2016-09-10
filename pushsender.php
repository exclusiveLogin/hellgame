<?php
require_once "GCM/Sender.php";
require_once "GCM/Exception.php";
require_once "GCM/Message.php";
require_once "GCM/Response.php";


$sender = new Sender("AIzaSyCDV_cGYt4mHY0kGg6_4vvsvMc41Fw5g3c");



try {
    $response = $sender->sendMessage(
        array("favwEL6MrXI:APA91bFZIDa2-_KpBMbW5kP3UBTJoxk40G3dXRnxP4kUABA6soUOiSGnDQA5Ajdik7OAGpOqyJ3dk4uH0_kTIUP1DHjdGedsm306cwo9zfYbRmzeMIXW4cCwsAtMuoQZwodHOM0Qhkud"),
        array("data" => "123"),
        "collapse_key"
    );

    if ($response->getNewRegistrationIdsCount() > 0) {
        $newRegistrationIds = $response->getNewRegistrationIds();
        foreach ($newRegistrationIds as $oldRegistrationId => $newRegistrationId){
            //Update $oldRegistrationId to $newRegistrationId in DB
            //TODO
            echo $oldRegistrationId.":".$newRegistrationId."<br>";
        }
    }

    if ($response->getFailureCount() > 0) {
        $invalidRegistrationIds = $response->getInvalidRegistrationIds();
        foreach($invalidRegistrationIds as $invalidRegistrationId) {
            //Remove $invalidRegistrationId from DB
            echo "invalidRegistrationId:".$invalidRegistrationId."<br>";
        }

        //Schedule to resend messages to unavailable devices
        $unavailableIds = $response->getUnavailableRegistrationIds();
        if($unavailableIds){
            //echo "Имеются недействительные токены<br>";
        }
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