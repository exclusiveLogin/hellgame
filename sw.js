/**
 * Created by SavinSV on 29.06.16.
 */
GlobalSW = {};
GlobalSW.user = 'once';

self.addEventListener('push', function(event) {
    //console.log("all ok push received");
    //console.log(Global.loggedAs);
});
self.addEventListener('install', function(event) {
    //console.log("sw installed");
    //console.log(GlobalSW);
});
self.addEventListener('message', function(event) {
    //console.log("sw message received");
    if(event.data.data.login){
        GlobalSW.user = event.data.data.login;
    }
    //console.log(event);
    //console.log(GlobalSW);
});