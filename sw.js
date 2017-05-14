importScripts('localForage.js');

GlobalSW = {};
GlobalSW.user = '';
GlobalSW.allowNoty = false;
GlobalSW.version = "0.3.6";

//Clients.matchAll().then(function (clients) {
//    console.log(clients);
//});

self.addEventListener('push', function(event) {
    console.log("all ok push received");
    console.log("current login:",GlobalSW.user);
    if(!GlobalSW.user || !GlobalSW.allowNoty){
        QueryName();
    }else {
        pushEvents();
    }
});
function QueryName() {
    localforage.getItem("login",function (err, data) {
        if (!err){
            GlobalSW.user = data;
            localforage.getItem("noty",function (err, data) {
                if(!err) {
                    GlobalSW.allowNoty = data;
                    console.log("LF user login:",GlobalSW.user,"LF noty:",GlobalSW.allowNoty,"err:",err);
                    pushEvents();
                }
            });
        }
    });
}
function pushEvents() {
    if(GlobalSW.user){
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
            if(GlobalSW.allowNoty && data.data){
                let pm = JSON.parse(data.data);
                pm.forEach(function (elem) {
                    var options = {
                        body:elem.desc,
                        icon:"/style/logo.png"
                    };
                    if(elem.img){
                        //fetch("components/news/"+elem.img).then(function () {
                            options.icon = elem.img;
                            self.registration.showNotification(elem.title,options);
                        //});
                    }else {
                        self.registration.showNotification(elem.title,options);
                    }
                });
            }
        }).catch(function (e) {
            console.log("pmcore вернул ошибку");
            console.log(e);
        });
    }

}
self.addEventListener('activate', function(event) {
    console.log("SW activated");
});

self.addEventListener('install', function(event) {
    console.log("install:");
    GlobalSW.regtime = new Date().getTime();
    console.log(GlobalSW.regtime);
});
self.addEventListener('message', function(event) {
    //console.log("sw message received:");
    //channel.port2.postMessage("SW обратка");
    //console.log(event);
    if(event.ports[0]){
        GlobalSW.extPort = event.ports[0];
    }else {
        console.log("ports empty");
    }
    if(event.data.data.ver){
        GlobalSW.user = event.data.data.login;
        if(GlobalSW.extPort){
            GlobalSW.extPort.postMessage({data:{ver:GlobalSW.version}});
        }
    }

    if(event.data.data.login && GlobalSW.allowNoty){
        GlobalSW.user = event.data.data.login;
        localforage.setItem("login",GlobalSW.user,function (err, data) {
            if(err)console.log("err login set:",err);
        });
        if(GlobalSW.extPort) {
            GlobalSW.extPort.postMessage("пользователь успешно установлен SW");
        }
            var options = {
                body:"Вы подписаны как "+GlobalSW.user,
                icon:"/style/logo.png"
            };
        self.registration.showNotification("Связь с Вашим устройством установлена",options);
    }
    if(event.data.data.noty){
        GlobalSW.allowNoty = event.data.data.noty;
        localforage.setItem("noty",GlobalSW.allowNoty,function (err, data) {
            if(err)console.log("err noty set:",err);
        });
    }
});