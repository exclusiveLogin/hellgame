if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        function (position) {
            //alert('Последний раз вас засекали здесь: <a href="https://www.google.ru/maps/place/'+position.coords.latitude+'"N+'+position.coords.longitude+'"E">'+position.coords.latitude + ", " + position.coords.longitude+'</a>');
            var tmp_str = 'Ваше местоположение было определено<a href="http://google.ru/maps/place/'+position.coords.latitude+','+position.coords.longitude+'" target="_blank"> тут</a>';
            showSysMsg(tmp_str,true);
            console.log(tmp_str);
            Global.private_data.geo.lon = position.coords.longitude;
            Global.private_data.geo.lat = position.coords.latitude;
            Global.private_data.geo.accuracy = position.coords.accuracy;
            Global.private_data.geo.alt = position.coords.altitude;
            Global.private_data.geo.status = true;
            Global.private_data.geo.nav = true;
        },function (errordata) {
            var tmp_str = 'Ваше местоположение не было определено';
            showSysMsg(tmp_str,false);
            console.log(tmp_str);
            Global.private_data.geo.nav = true;
        });    
}
else {
    var tmp_str = 'Ваш браузер не поддерживает Geolocation';
    showSysMsg(tmp_str);

}
Global.private_data.user_agent = navigator.userAgent;
Global.private_data.user = "Guest";
var i=0;
var random = 0;
random = randomInteger(0,9999999);
Global.private_data.token = random;



//IP и id_user вычисляются на стороне сервера


$(document).ready(function () {
    check_nav();
});
function forming_request() {
    var request = {};
    request.user = Global.private_data.user;
    request.user_agent = Global.private_data.user_agent;
    request.token = Global.private_data.token;
    if(Global.private_data.geo.status){
        request.geo_lat = Global.private_data.geo.lat;
        request.geo_lon = Global.private_data.geo.lon;
        request.geo_alt = Global.private_data.geo.alt;
        request.geo_accuracy = Global.private_data.geo.accuracy;
        request.geo_status = Global.private_data.geo.status;
    }else {
        request.geo_status = Global.private_data.geo.status;
    }
    request.city = Global.private_data.ipinfo.city;
    request.region = Global.private_data.ipinfo.region;
    request.provider = Global.private_data.ipinfo.org;

    return request;
}
function check_private() {
    if(Global.private_complete){
        privateSend();
    }else {
        setTimeout(function () {
            check_private();
        },5000);
    }
}
function check_nav() {
    if(Global.private_data.geo.nav){
        ip2c();
    }else {
        setTimeout(function () {
            check_nav();
        },5000);
    }
}
function ip2c() {
    $.ajax({
        url:"http://ipinfo.io",
        dataType:"json",
        success:function (data) {
            console.log(data);
            if(data.city){
                Global.private_data.ipinfo = data;
                Global.private_data.ipinfo.status = true;
                if (!Global.private_data.geo.status){
                    var tmp_arr = [];
                    tmp_arr = data.loc.split(",");
                    Global.private_data.geo.lat = tmp_arr[0];
                    Global.private_data.geo.lon = tmp_arr[1];
                    Global.private_data.geo.status = true;
                }
            }
        },
        error:function () {
            console.log("error ipinfo");
        },
        complete:function () {
            Global.private_complete = true;
            check_private();
        }
    });
}
function privateSend(){
    request = forming_request();
    $.ajax(
        {
            url:"/privatecore.php",
            data:request,
            success:function (data_res) {
                console.log("data:"+data_res);
            },
            error:function () {
                console.log("private ajax error");
            }
        }
    );
}
function privateDetail() {
    request = {
        "loged":true,
        "token":Global.private_data.token,
        "user":Global.loggedAs
    };
    $.ajax(
        {
            url:"/privatecore.php",
            data:request,
            success:function (data_res) {
                console.log("data:"+data_res);
            },
            error:function () {
                console.log("private ajax error");
            }
        }
    );
}
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
