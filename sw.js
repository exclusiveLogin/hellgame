/**
 * Created by SavinSV on 29.06.16.
 */
GlobalSW = {};
GlobalSW.user = 'once';
GlobalSW.allowNoty = false;

/*Clients.matchAll().then(function (clients) {
    console.log(clients);
});*/
//console.log(Clients);

self.addEventListener('push', function(event) {
    //console.log("all ok push received");
    //console.log(Global.loggedAs);
});
self.addEventListener('activate', function(event) {
    console.log("SW activated");
    //console.log(Global.loggedAs);

});

self.addEventListener('install', function(event) {
    /*var pr_test = fetch("/test.json");
    pr_test.then(function (data) {
        console.log("status:"+data.status);
        return data.json();
    }).then(function (data) {
        console.log("data:"+data.test);
        */
    console.log("install:");
    GlobalSW.regtime = new Date().getTime();
    console.log(GlobalSW.regtime);
});
self.addEventListener('message', function(event) {
    console.log("sw message received:");
    //console.log(event);
    if(event.data.data.login){
        GlobalSW.user = event.data.data.login;
        event.ports[0].postMessage("пользователь "+event.data.data.login+" успешно установлен SW");
    }
    if(event.data.data.noty){
        GlobalSW.allowNoty = event.data.data.noty;
        var options = {
            body:"Вы подписаны как "+GlobalSW.user,
            icon:"/style/logo.png"
        };
        self.registration.showNotification("Связь с Вашим устройством установлена",options);
    }
    //GlobalSW.MC.port1.postMessage("test");
    //event.ports[0].postMessage("djdjdjdjdff");
    //console.log(event);
    //console.log(GlobalSW);
    //clients.matchAll().then(function (cl) {
    //    console.log(cl);
    //});
});