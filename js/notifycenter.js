Global.SWversion = "0.3.5";
$(function () {
    Global.swready = $.Deferred();
    Global.usersListPromise = $.Deferred();
    if("serviceWorker" in navigator){
        Global.pr_readySW = navigator.serviceWorker.getRegistration();
        Global.pr_readySW.then(function (reg) {
            if(reg){
                con.addstr("Service Worker уже установлен на компьютере");
                con.work();
                reg.update();
                Global.SW = reg;
                Global.swready.resolve();
                Global.SW.active.postMessage({"data":{"ver":true}},[channel.port2]);
                Global.SW.pushManager.getSubscription().then(function (pmsub) {
                    if(pmsub){
                        console.log("старая регистрация PM",pmsub);
                        var username = Global.loggedAs || "guest";

                        var url = document.createElement('a');
                        url.href = pmsub.endpoint;

                        var tmpUrl = [];
                        tmpUrl = url.pathname.split("/");

                        var pmtokken = tmpUrl[tmpUrl.length-1];

                        var data = "pmtokken="+encodeURIComponent(pmtokken)+"&pmuser="+
                            encodeURIComponent(username)+"&pmadd=1";
                        fetch("/pmcollector.php",{
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                            },
                            method:"POST",
                            body:data
                        }).then(function (data) {
                            if(data.status==200){
                                //console.log("status 200 успешен");
                                return data.text();
                            }
                        }).then(function (dataResp) {
                            //console.log("response получен");
                            console.log(dataResp);
                        }).catch(function (e) {
                            console.log("fetch с ошибкой");
                            console.log(e);
                        });
                    }else {
                        PMregister();
                    }
                });
            }else {
                con.addstr("Service Worker еще не установлен на компьютере");
                con.work();
                SWRegister();
            }
        });
    }else {
        con.addstr("ServiceWorker НЕ установлен в системе");
        con.work();
    }
    if("Notification" in window){
        Notification.requestPermission(function (permission) {
            if(permission == "granted"){
                Global.notifyallow = true;
                //console.log("Разрешение на notification получено");
                con.addstr("Разрешение на notification получено");
                con.work();
                Global.pr_readySW.then(function () {
                    Global.swready.then(function () {
                        Global.SW.active.postMessage({"data":{"noty":true}});
                    });
                });
                //createNotify("Добро пожаловать на HellGame24","Игра начинается","ok");
            }else {
                Global.notifyallow = false;
                //console.log("Разрешение на notification НЕ получено");
                con.addstr("Разрешение на notification НЕ получено");
                con.work();
                Global.pr_readySW.then(function () {
                    Global.swready.then(function () {
                        Global.SW.active.postMessage({"data": {"noty": false}});
                    });
                });
            }
        });
    }
    else {
        con.addstr("Notification НЕ установлен в системе");
        con.work();
    }
});

function SWRegister(){
    navigator.serviceWorker.register('sw.js').then(function (seviceWorker) {
        console.log("Регистрация SW успешна");
        Global.SW = seviceWorker;
        Global.swready.resolve();
        seviceWorker.pushManager.getSubscription().then(function (pmsub) {
            if(pmsub){
                console.log("старая регистрация PM",pmsub);
            }else {
                PMregister();
            }
        });
    });
}
function PMregister() {
    if(Global.SW){
        Global.SW.pushManager.subscribe({userVisibleOnly: true}).then(function (pmsubscribe) {
            console.log("новая регистрация PM",pmsubscribe);
            //console.log(pmsubscribe);
            var url = document.createElement('a');
            url.href = pmsubscribe.endpoint;

            //console.log(url.pathname);
            var tmpUrl = [];
            tmpUrl = url.pathname.split("/");
            //console.log("tokken:"+tmpUrl[tmpUrl.length-1]);
            //console.log("user:"+Global.loggedAs);
            var pmtokken = tmpUrl[tmpUrl.length-1];
            if(pmtokken){
				var username = Global.loggedAs || "guest";
                var data = "pmtokken="+encodeURIComponent(pmtokken)+"&pmuser="+
                    encodeURIComponent(username)+"&pmadd=1";
                //console.log(data);
                fetch("/pmcollector.php",{
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    method:"POST",
                    body:data
                }).then(function (data) {
                    if(data.status==200){
                        //console.log("status 200 успешен");
                        return data.text();
                    }
                }).then(function (dataResp) {
                    console.log("response получен");
                    console.log(dataResp);
                }).catch(function (e) {
                    console.log("fetch с ошибкой");
                    console.log(e);
                });
            }
        });
    }
}

function sendUserName(user) {
    Global.swready.then(function () {
        Global.SW.active.postMessage({"data":{"login":user}});
        Global.usersListPromise.then(function () {
            createEvent("all","Оповещение Hellgame24","Пользователь "+user+" Online");
        });
    });
}

var channel = new MessageChannel();
channel.port1.onmessage = function (e) {
    console.log("сообщение получено port1:");
    //интерфейс с SW
    console.log(e);
    if(e.data.data){
        if(e.data.data.ver){
            if(e.data.data.ver == Global.SWversion){//Установлена актуальная версия SW
                con.addstr("ServiceWorker version:"+e.data.data.ver+" [Актуальна]");
                con.work();
                console.log("ServiceWorker version:"+e.data.data.ver+" [Актуальна]");
            }else{//Установленая версия SW не актуальна
                con.addstr("ServiceWorker version:"+e.data.data.ver+" [НЕ Актуальна]");
                con.addstr("ServiceWorker требует версию:"+Global.SWversion);
                con.work();
                console.log("ServiceWorker version:"+e.data.data.ver+" [НЕ Актуальна]");

                //Install new version of SW
                //SWRegisterLight();
                SWRegister();
            }
        }
    }

};

function createNotify(title,msg,status) {
    var options = {
        body:"Надеемся Вам понравится",
        icon:"style/logo.png"
    };
    if(Global.notifyallow){
        switch (status){
            case "ok":
                if(msg)options.body = msg;
                options.icon = "style/logo.png";
                break;
            case "danger":
                if(msg)options.body = msg;
                options.icon = "style/logo_dng.png";
                break;
            case "red":
                if(msg)options.body = msg;
                options.icon = "style/logo_rc.png";
                break;
            case "orange":
                if(msg)options.body = msg;
                options.icon = "style/logo_oc.png";
                break;
            default:
                break;
        }
        if(title){
            var ua = detect.parse(Global.private_data.user_agent);
            if(ua.device.type == "Mobile"){
                Global.SW.showNotification(title,options);
            }else {
                var noty = new Notification(title,options);
                noty.onclick = function () {
                    this.close();
                }
            }            
        }     
    }
    
}
function emitPushAll() {
    //получаем клиентов PM
    fetch("pmcollector.php",{
        method:"POST",
        body:"pmsel=1",
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    }).then(function (response) {
        if(response.status == 200){
            return response.json();
        }
    }).then(function (data) {
        console.log(data);
    });
}
function emitPushTo(user) {
    //получаем клиентов PM
    fetch("pmcollector.php",{
        method:"POST",
        body:"pmsel=1&pmuser="+encodeURIComponent(user),
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        }
    }).then(function (response) {
        if(response.status == 200){
            return response.json();
        }
    }).then(function (data) {
        console.log(data);
    });
}