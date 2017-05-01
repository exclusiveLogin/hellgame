$(document).ready(function () {
    if(navigator){
        Global.private_data.user_agent = navigator.userAgent;
    }
    Global.private_data.user = "Guest";
    Global.private_data.token = randomInteger(0,9999999);

    let promiseIP2C = ip2c();
    let promiseGeoNative = new Promise(function (resolve,reject) {
        if(navigator.geolocation){
            if("getCurrentPosition" in navigator.geolocation.__proto__){
                var options = {
                    enableHighAccuracy : true,
                    timeout : 300000
                };
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        //console.log("geo:",position);
                        tmp_str = 'Ваше местоположение было определено<a href="http://google.ru/maps/place/'+
                            position.coords.latitude+','+position.coords.longitude+'" target="_blank"> тут</a>';

                        showSysMsg(tmp_str,true);

                        if(position.coords.longitude)Global.private_data.geo.lon = position.coords.longitude;
                        if(position.coords.latitude)Global.private_data.geo.lat = position.coords.latitude;
                        if(position.coords.accuracy)Global.private_data.geo.accuracy = position.coords.accuracy;
                        if(position.coords.altitude)Global.private_data.geo.alt = position.coords.altitude;
                        Global.private_data.geo.status = true;
                        resolve();
                    },function (errordata) {
                        var tmp_str = 'Ваше местоположение не было определено';
                        showSysMsg(tmp_str,false);
                        console.log("Ваше местоположение не было определено");
                        resolve();
                    },options);
            }else{
                var tmp_str = 'Ваш браузер не поддерживает Geolocation.getCurrentPosition';
                showSysMsg(tmp_str);
                console.log("Ваш браузер не поддерживает Geolocation");
                resolve();
            }
        }
        else {
            var tmp_str = 'Ваш браузер не поддерживает Geolocation';
            showSysMsg(tmp_str);
            resolve();
        }
    });

    Promise.all([promiseIP2C,promiseGeoNative]).then(
        function () {
            //console.log("Private all:",Global.private_data.geo);
            //console.log("ipinfo all:",Global.private_data.ipinfo);
            var request = {};
            request.user = Global.private_data.user;
            request.user_agent = Global.private_data.user_agent;
            request.token = Global.private_data.token;

            if(Global.private_data.geo.status && Global.private_data.geo.accuracy < 300){
                if(Global.private_data.geo.lat){
                    request.geo_lat = Global.private_data.geo.lat;
                }else {
                    request.geo_lat = 0;
                }
                if(Global.private_data.geo.lon){
                    request.geo_lon = Global.private_data.geo.lon;
                }else {
                    request.geo_lon = 0;
                }
                if(Global.private_data.geo.alt){
                    request.geo_alt = Global.private_data.geo.alt;
                }else {
                    request.geo_alt = 0;
                }
                if(Global.private_data.geo.accuracy){
                    request.geo_accuracy = Global.private_data.geo.accuracy;
                }else {
                    request.geo_accuracy = 90000;
                }
                request.geo_status = Global.private_data.geo.status;
            }else {
                if(Global.private_data.ipinfo.lat){
                    request.geo_lat = Global.private_data.ipinfo.lat;
                }else{
                    request.geo_lat = 0;
                }
                if(Global.private_data.ipinfo.lon){
                    request.geo_lon = Global.private_data.ipinfo.lon;
                }else {
                    request.geo_lon = 0;
                }
                if(Global.private_data.ipinfo.alt){
                    request.geo_alt = Global.private_data.ipinfo.alt;
                }else {
                    request.geo_alt = 0;
                }
                if(Global.private_data.ipinfo.accuracy){
                    request.geo_accuracy = Global.private_data.ipinfo.accuracy;
                }else {
                    request.geo_accuracy = 0;
                }
                request.geo_status = Global.private_data.geo.status;
            }
            request.city = Global.private_data.ipinfo.city;
            request.region = Global.private_data.ipinfo.region;
            request.provider = Global.private_data.ipinfo.org;

            //console.log("request:",request);
            privateSend(request);
        }
    );
});

function ip2c() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url:"/ip2c.php",
            dataType:"json",
            success:function (data) {
                if(data.status == "success"){
                    Global.private_data.ipinfo = data;
                    resolve();
                }else {
                    reject();
                }
            },
            error:function () {
                console.log("error ipinfo");
                reject()
            }
        });
    });
}//<<<<<<<Global.private_data.ipinfo
function privateSend(request){
    $.ajax(
        {
            url:"/privatecore.php",
            data:request,
            success:function (data_res) {
                Global.private_data.sended = true;
                //console.log(data_res);
            },
            error:function () {
                console.log("private ajax error");
            }
        }
    );
}
function privateDetail() {
    if(Global.private_data.sended){
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
                                //console.log("DUA:",dua);
                                let deviceTpl = dua.device.type;
                                if(dua.device.name)deviceTpl = dua.device.name;
                                var obj = $('<tr>');
                                obj.append("<td>"+data[i].name_user+"</td>");
                                //http://www.openstreetmap.org/?mlat=53.14953&mlon=48.45610#map=17/53.14953/48.45610
                                obj.append("<td><a href='http://www.openstreetmap.org/?mlat="+data[i].lat+"&mlon="+data[i].lon+"#map=15/"+data[i].lat+"/"+data[i].lon+"' target='_blank'>"+data[i].lat+"</a></td>");
                                obj.append("<td><a href='http://www.openstreetmap.org/?mlat="+data[i].lat+"&mlon="+data[i].lon+"#map=15/"+data[i].lat+"/"+data[i].lon+"' target='_blank'>"+data[i].lon+"</a></td>");
                                obj.append("<td>"+data[i].accuracy+"</td>");
                                obj.append("<td>"+dua.os.name+"</td>");
                                obj.append("<td>"+dua.browser.name+"</td>");
                                obj.append("<td>"+deviceTpl+"</td>");
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
        $(".btn-privatelog").removeClass("disabled");
        $("#header").on("click",".btn_clspriv",function () {
            $("#privatelog").hide(500).empty();
        });
    }else {
        setTimeout(privateDetail,10000);
    }

}
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}