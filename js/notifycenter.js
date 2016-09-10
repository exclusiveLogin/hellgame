if("Notification" in window){
    if("serviceWorker" in navigator){
        Global.pr_readySW = navigator.serviceWorker.getRegistration();
        Global.pr_readySW.then(function (reg) {
            if(reg){
                //console.log("SW существует");
                con.addstr("Service Worker уже установлен на компьютере");
                con.work();
                Global.SW = reg;
                Global.swready = true;
            }else {
                //console.log("SW ЕЩЕ не зарегистрирован");
                con.addstr("Service Worker еще не установлен на компьютере");
                //console.log("Регистрация SW");
                con.addstr("Регистрируем Service Worker");
                con.work();
                navigator.serviceWorker.register('/sw.js').then(function (seviceWorker) {
                    Global.SW = seviceWorker;
                    seviceWorker.pushManager.getSubscription().then(function (pmsub) {
                        if(pmsub){
                            //console.log("старая регистрация PM");
                            //console.log(pmsub);
                            con.addstr("На компьютере найдена подписка на уведомления");
                            con.work();
                        }else {
                            seviceWorker.pushManager.subscribe({userVisibleOnly: true}).then(function (pmsubscribe) {
                                //console.log("новая регистрация PM");
                                con.addstr("Новая регистрация PushManager");
                                con.work();
                                //console.log(pmsubscribe);
                            });
                        }
                    });
                });
            }
        });
    }
    Notification.requestPermission(function (permission) {
        if(permission == "granted"){
            Global.notifyallow = true;
            //console.log("Разрешение на notification получено");
            con.addstr("Разрешение на notification получено");
            con.work();
            Global.pr_readySW.then(function () {
                if(Global.swready){
                    Global.SW.active.postMessage({"data":{"noty":true}},[channel.port2]);
                }
            });
            //createNotify("Добро пожаловать на HellGame24","Игра начинается","ok");
        }else {
            Global.notifyallow = false;
            //console.log("Разрешение на notification НЕ получено");
            con.addstr("Разрешение на notification НЕ получено");
            con.work();
            Global.pr_readySW.then(function () {
                if(Global.swready) {
                    Global.SW.active.postMessage({"data": {"noty": false}}, [channel.port2]);
                }
            });
        }
    });
}
else {
}
function sendUserName(user) {
    if(Global.swready){
        //Global.SW.active.postMessage({"data":{"login":user}},[channel.port2]);
    }
}
var channel = new MessageChannel();
channel.port1.onmessage = function (e) {
    console.log("сообщение получено:");
    console.log(e);
};


function createNotify(title,msg,status) {
    var options = {
        body:"Надеемся Вам понравится",
        icon:"/style/logo.png"
    };
    if(Global.notifyallow){
        switch (status){
            case "ok":
                if(msg)options.body = msg;
                options.icon = "/style/logo.png";
                break;
            case "danger":
                if(msg)options.body = msg;
                options.icon = "/style/logo_dng.png";
                break;
            case "red":
                if(msg)options.body = msg;
                options.icon = "/style/logo_rc.png";
                break;
            case "orange":
                if(msg)options.body = msg;
                options.icon = "/style/logo_oc.png";
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
