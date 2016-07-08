if("Notification" in window){
    if("serviceWorker" in navigator){
        navigator.serviceWorker.register('/sw.js').then(function (seviceWorker) {
            Global.SW = seviceWorker;
            navigator.serviceWorker.ready.then(function (swreg) {
                console.log("SW ready");
                //navigator.serviceWorker.controller.postMessage({"data":{"login":"test"}})
                swreg.active.postMessage({"data":{"login":"test"}})
            });
            seviceWorker.pushManager.getSubscription().then(function (pmsub) {
                console.log(pmsub);
                if(pmsub){

                }else {
                    seviceWorker.pushManager.subscribe({userVisibleOnly: true}).then(function (pmsubscribe) {
                        console.log(pmsubscribe);
                    });
                }
            });
        }); 
    }
    Notification.requestPermission(function (permission) {
        if(permission == "granted"){
            Global.notifyallow = true;
            //createNotify("Добро пожаловать на HellGame24","Игра начинается","ok");
        }else {
        }
    });
}
else {
}
function sendUserName(user) {
    
}

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
