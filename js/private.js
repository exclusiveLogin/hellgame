$(document).ready(function () {
    if(navigator.geolocation){
        var tmp_str = 'Пытаемся получить ваше местоположение';
        showSysMsg(tmp_str,true);
        
        if("getCurrentPosition" in navigator.geolocation.__proto__){
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    tmp_str = 'Данные получены';
                    showSysMsg(tmp_str,true);
                    //alert('Последний раз вас засекали здесь: <a href="https://www.google.ru/maps/place/'+position.coords.latitude+'"N+'+position.coords.longitude+'"E">'+position.coords.latitude + ", " + position.coords.longitude+'</a>');
                    tmp_str = 'Ваше местоположение было определено<a href="http://google.ru/maps/place/'+position.coords.latitude+','+position.coords.longitude+'" target="_blank"> тут</a>';
                    showSysMsg(tmp_str,true);
                    //console.log(tmp_str);
                    if(position.coords.longitude)Global.private_data.geo.lon = position.coords.longitude;
                    if(position.coords.latitude)Global.private_data.geo.lat = position.coords.latitude;
                    if(position.coords.accuracy)Global.private_data.geo.accuracy = position.coords.accuracy;
                    if(position.coords.altitude)Global.private_data.geo.alt = position.coords.altitude;
                    Global.private_data.geo.status = true;
                    Global.private_data.geo.nav = true;
                },function (errordata) {
                    var tmp_str = 'Ваше местоположение не было определено';
                    showSysMsg(tmp_str,false);
                    //console.log(tmp_str);
                    Global.private_data.geo.nav = true;
                });
        }else{
            var tmp_str = 'Ваш браузер не поддерживает Geolocation.getCurrentPosition';
            showSysMsg(tmp_str);
        }

        
    }
    else {
        var tmp_str = 'Ваш браузер не поддерживает Geolocation';
        showSysMsg(tmp_str);

    }
    check_nav();
});

Global.private_data.user_agent = navigator.userAgent;
Global.private_data.user = "Guest";
var i=0;
var random = 0;
random = randomInteger(0,9999999);
Global.private_data.token = random;



//IP и id_user вычисляются на стороне сервера

function forming_request() {
    var request = {};
    request.user = Global.private_data.user;
    request.user_agent = Global.private_data.user_agent;
    request.token = Global.private_data.token;
    if(Global.private_data.geo.status){
        if(Global.private_data.geo.lat != undefined)request.geo_lat = Global.private_data.geo.lat;
        if(Global.private_data.geo.lon != undefined)request.geo_lon = Global.private_data.geo.lon;
        if(Global.private_data.geo.alt != undefined)request.geo_alt = Global.private_data.geo.alt;
        if(Global.private_data.geo.accuracy != undefined)request.geo_accuracy = Global.private_data.geo.accuracy;
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
        url:"/ip2c.php",
        dataType:"json",
        success:function (data) {
            //console.log(data);
            if(data.status == "success"){
                Global.private_data.ipinfo = data;
                Global.private_data.ipinfo.status = true;
                if (!Global.private_data.geo.status){
                    Global.private_data.geo.lat = data.lat;
                    Global.private_data.geo.lon = data.lon;
                    Global.private_data.geo.alt = "0"; 
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
                //console.log("data:"+data_res);
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
                //console.log("data:"+data_res);
            },
            error:function () {
                console.log("private ajax error");
            }
        }
    );
    $("#header").off("click",".btn-privatelog");
    $("#header").off("click",".btn_clspriv");
    $("#header").on("click",".btn-privatelog",function () {
        $("#privatelog").show(500).empty();
        $.ajax({
            url:"/components/privatelog.html",
            dataType:"html",
            success:function (data) {
                $("#privatelog").html(data);
                $.ajax({
                    url:"privatelog.php",
                    dataType:"json",
                    success:function (data) {
                        var i;
                        for (i=0;i<data.length;i++){
                            var dua = detect.parse(data[i].user_agent);
                            var obj = $('<tr>');
                            obj.append("<td>"+data[i].name_user+"</td>");
                            //http://www.openstreetmap.org/?mlat=53.14953&mlon=48.45610#map=17/53.14953/48.45610
                            obj.append("<td><a href='http://www.openstreetmap.org/?mlat="+data[i].lat+"&mlon="+data[i].lon+"#map=15/"+data[i].lat+"/"+data[i].lon+"' target='_blank'>"+data[i].lat+"</a></td>");
                            obj.append("<td><a href='http://www.openstreetmap.org/?mlat="+data[i].lat+"&mlon="+data[i].lon+"#map=15/"+data[i].lat+"/"+data[i].lon+"' target='_blank'>"+data[i].lon+"</a></td>");
                            obj.append("<td>"+data[i].accuracy+"</td>");
                            obj.append("<td>"+dua.os.name+"</td>");
                            obj.append("<td>"+dua.browser.name+"</td>");
                            obj.append("<td>"+dua.device.name+"</td>");
                            obj.append("<td>"+data[i].datetime+"</td>");
                            obj.append("<td>"+data[i].region+"</td>");
                            obj.append("<td>"+data[i].city+"</td>");
                            obj.append("<td>"+data[i].provider+"</td>");
                            obj.append("<td>"+data[i].ip+"</td>");
                            $("#log_private_list").append(obj);
                        }
                    },
                    error:function () {
                        console.log("error receive private log data");
                    }
                });
            },
            error:function () {
                console.log("error receive private log blank");
            }
        });

    });
    $("#header").on("click",".btn_clspriv",function () {
        $("#privatelog").hide(500).empty();
    });
}
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
