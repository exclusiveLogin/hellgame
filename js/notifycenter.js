if("Notification" in window){
    Notification.requestPermission(function (permission) {
        if(permission == "granted" || permission == "default"){
            Global.notifyallow = true;
            createNotify("Добро пожаловать на HellGame24","Игра начинается","ok");
        }else {
        }
    });
}
else {
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
            var noty = new Notification(title,options);
        }     
    }
    
}
