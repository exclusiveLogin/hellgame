GlobalSW = {};
GlobalSW.user = 'once';
GlobalSW.allowNoty = false;
GlobalSW.version = "0.3.2";


//Clients.matchAll().then(function (clients) {
//    console.log(clients);
//});

self.addEventListener('push', function(event) {
    console.log("all ok push received");
    console.log(GlobalSW.user);

});
function pushEvents() {
    fetch("pmcore.php",{
        method:"POST",
        body:"getlast=1&getfor="+encodeURIComponent(GlobalSW.user),
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    }).then(function (response) {
        if(response.status == 200){
            return response.json();
        }
    }).then(function (data) {
        console.log(data);
    }).catch(function (e) {
        console.log("pmcore вернул ошибку");
        console.log(e);
    });
}
self.addEventListener('activate', function(event) {
    console.log("SW activated");
});

self.addEventListener('install', function(event) {
    console.log("install:");
    GlobalSW.regtime = new Date().getTime();
    console.log(GlobalSW.regtime);
});
channel = new MessageChannel();
channel.port1.onmessage = function (e) {
    console.log("SW port 1 msg");
};
channel.port2.onmessage = function (e) {
    console.log("SW port 2 msg");
};
self.addEventListener('message', function(event) {
    console.log("sw message received:");
    //channel.port2.postMessage("SW обратка");
    console.log(event);
    if(event.ports[0]){
        GlobalSW.extPort = event.ports[0];
    }else {
        console.log("ports empty");
    }
    if(event.data.data.ver){
        GlobalSW.user = event.data.data.login;
        if(GlobalSW.extPort){
            console.log("версия отправлена FE ver:"+GlobalSW.version);
            GlobalSW.extPort.postMessage({data:{ver:GlobalSW.version}});
        }
    }

    if(event.data.data.login){
        if(GlobalSW.extPort){
            GlobalSW.user = event.data.data.login;
            GlobalSW.extPort.postMessage("пользователь успешно установлен SW");
        }
    }
    if(event.data.data.noty){
        GlobalSW.allowNoty = event.data.data.noty;
        var options = {
            body:"Вы подписаны как "+GlobalSW.user,
            icon:"/style/logo.png"
        };
        self.registration.showNotification("Связь с Вашим устройством установлена",options);
    }
});