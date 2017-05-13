$(document).ready(function () {
    startUpdater();
    //setTimeout(startUpdater, 2000);
    setInterval(startUpdater,20000);

});
//con.addstr("updater.js подключен");
//con.work();
function startUpdater() {
    Global.emer = {
        state:false,
        color:"green",
        msg:"",
        users:[]
    };
    $.ajax({
        url:"refresher.php",
        dataType:"json",
        method:'GET',
        success:function(data){
            var uc;
            Global.users = [];
            for(uc in data.r_users){
                globalUpdate(data.r_users[uc],false,true);
            }
            refreshLogged();
            Global.usersListPromise.resolve();
        },
        error:function(){
            console.log("error to load refresher ajax");
        }
    });
    var dataQueryLogin = {};
    dataQueryLogin['t_user'] = Global.loggedAs;
    $.ajax({
        url:"online.php",
        method:'GET',
        data:dataQueryLogin,
        success:function(data){
            if(data.msg){
                showSysMsg(data.msg);
            }
        },
        error:function(){
            console.log("error to load refresher ajax");
        }
    });
}

function globalUpdate(obj,newemo,refresh) {//сначала proto потом вне условия все остальное
    if(!Global[obj.login]){
        Global[obj.login] = {};
        /*for(var key in Global.blank){
            if(typeof(Global.blank[key]) == 'object'){
                for(var key2 in Global.blank[key]){
                    Global[obj.login][key]={};
                    Global[obj.login][key][key2] = Global.blank[key][key2];
                }
            }else {
                Global[obj.login][key] = Global.blank[key];
            }
        }*/
        Object.assign(Global[obj.login],Global.blank);
    }
    if(refresh){
        Global.users.push(obj.login);
        Global[obj.login].id = obj.id_user;
        Global[obj.login].name = obj.name;
        Global[obj.login].email = obj.email;
        Global[obj.login].title = obj.title;
        Global[obj.login].o_code = obj.o_code;
        Global[obj.login].r_code = obj.r_code;

        if(Number(Global[obj.login].o_code) && Global.emer.color!="red"){
            Global.emer.state = true;
            Global.emer.color = "orange";
            Global.emer.msg = " введен ОРАНЖЕВЫЙ КОД";
        }
        if(Number(Global[obj.login].r_code)){
            Global.emer.state = true;
            Global.emer.color = "red";
            Global.emer.msg = " введен КРАСНЫЙ КОД";
        }
        if(Number(Global[obj.login].o_code)||Number(Global[obj.login].r_code)){
            Global.emer.users.push(obj.login);
        }
        
        Global[obj.login].played = obj.played;
        Global[obj.login].online = obj.online;
        if(obj.status_code){
            Global[obj.login].status_code = obj.status_code;
        }
        if(obj.danger){
            Global[obj.login].danger = obj.danger;
        }
        if(obj.status_msg){
            Global[obj.login].status_msg = obj.status_msg;
        }
        Global[obj.login].upd = obj.upd;
        Global[obj.login].upd_status = obj.upd_status;
        // old data analizer
        var xtime = new Date(Date.parse(Global[obj.login].upd_status));
        var t_year = xtime.getFullYear();
        var t_month = xtime.getMonth();
        var t_day = xtime.getDate();
        var t_hour = xtime.getHours();
        var t_minute = xtime.getMinutes();
        var t_second = xtime.getSeconds();
        var offset = new Date().getTimezoneOffset()*60000;
        var utctime = Date.UTC(t_year,t_month,t_day,t_hour,t_minute,t_second);
        var nowt = Date.now();
        var now = nowt - offset;
        var compare_t = now-utctime;
        //console.log("now:"+now+" utc:"+utctime+" compare:"+compare_t);
        if ((compare_t/60000)>180){
            Global[obj.login].dataold = true;
        }
        else {
            Global[obj.login].dataold = false;
        }
        
        
        //-------
        Global[obj.login].code_msg = obj.code_msg;
        Global[obj.login].login = obj.login;
        Global[obj.login].img_big = obj.img_big;
        Global[obj.login].img_min = obj.img_min;

        var getLastPrivateResponse = {
            "last_private_user":obj.login
        };
        $.ajax({
            url:"getlastprivate.php",
            dataType:"text",
            method:'GET',
            data:getLastPrivateResponse,
            success:function(privatedata){
                if(privatedata){
                    var privatejson = JSON.parse(privatedata);
                    if(privatejson.errors){
                        console.log("есть ошибка:"+data.errormsg);
                    }
                    else {
                        Global[obj.login].privatedata.oldLat = Global[obj.login].privatedata.lat;
                        Global[obj.login].privatedata.oldLon = Global[obj.login].privatedata.lon;

                        if(privatejson.lat)Global[obj.login].privatedata.lat = Number(privatejson.lat);
                        if(privatejson.lon)Global[obj.login].privatedata.lon = Number(privatejson.lon);
                        if(privatejson.ip)Global[obj.login].privatedata.ip = privatejson.ip;
                        if(privatejson.user_agent)Global[obj.login].privatedata.user_agent = privatejson.user_agent;
                        if(privatejson.accuracy)Global[obj.login].privatedata.accuracy = Number(privatejson.accuracy);
                        if(privatejson.alt)Global[obj.login].privatedata.alt = Number(privatejson.alt);
                        if(privatejson.datetime)Global[obj.login].privatedata.datetime = privatejson.datetime;
                        if(privatejson.region)Global[obj.login].privatedata.region = privatejson.region;
                        if(privatejson.city)Global[obj.login].privatedata.city = privatejson.city;
                        if(privatejson.provider)Global[obj.login].privatedata.provider = privatejson.provider;

                        if(Global[obj.login].privatedata.oldLat == Global[obj.login].privatedata.lat){

                        }else{
                            Global.georefresh = true;
                        }
                        if(Global[obj.login].privatedata.oldLon == Global[obj.login].privatedata.lon){

                        }else{
                            Global.georefresh = true;
                        }
                    }
                }
            },
            error:function(){
                console.log("error to load last private data ajax");
            }
        });

    }
    //Setters---------
    var dataQueryEmocore = {};
    dataQueryEmocore['t_user'] = Global[obj.login].login;
    if(newemo){
        dataQueryEmocore['setemo'] = newemo.n;
        dataQueryEmocore['emo_title'] = newemo.title;
        dataQueryEmocore['emo_desc'] = newemo.desc;
    }
    if(obj.newstatus){
        dataQueryEmocore['status_code'] = obj.newstatus.code;
        dataQueryEmocore['danger'] = obj.newstatus.danger;
        dataQueryEmocore['status_msg'] = obj.newstatus.status_msg;

        if(obj.newstatus.old_emo){
            dataQueryEmocore['setemo'] = obj.newstatus.old_emo;
            dataQueryEmocore['emo_title'] = obj.newstatus.title;
            dataQueryEmocore['emo_desc'] = obj.newstatus.desc;
        }
    }
    if(obj.newplayed){
        dataQueryEmocore['played'] = obj.newplayed.state;
    }
    if(obj.newcode_o){
        dataQueryEmocore['o_code'] = obj.newcode_o.state;
        dataQueryEmocore['code_msg'] = obj.newcode_o.user_msg
    }
    if(obj.newcode_r){
        dataQueryEmocore['r_code'] = obj.newcode_r.state;
        dataQueryEmocore['code_msg'] = obj.newcode_r.user_msg
    }
    if(obj.newcode_g){
        dataQueryEmocore['g_code'] = obj.newcode_g.state;
        dataQueryEmocore['code_msg'] = obj.newcode_g.user_msg
    }
    //---------------
    $.ajax({
        url:"emocore.php",
        dataType:"text",
        method:'GET',
        data:dataQueryEmocore,
        success:function(raw){
            if(raw){
                var data = JSON.parse(raw);
                if(data.errors){
                    console.log("есть ошибка:"+data.errormsg);
                }
                else {
                    Global[obj.login].emotion = data.last_emo;
                    Global[obj.login].oldEmotion = data.prev_emo;
                    var tend = Global[obj.login].emotion - Global[obj.login].oldEmotion;
                    if (tend>0){
                        Global[obj.login].tendention = "+"+tend;
                    }
                    else if(tend<0){
                        Global[obj.login].tendention = tend;
                    }
                    else{
                        Global[obj.login].tendention = 0;
                    }

                    Global[obj.login].trend = [];
                    Global[obj.login].flags = [];
                    for(var snap in data.trend){
                        var shot = data.trend[snap][0];
                        var tempval = Number(data.trend[snap][1]);
                        var utc_arr = [];
                        utc_arr = shot.split(',');
                        (utc_arr[1]>0)?utc_arr[1]-=1:utc_arr[1]=0;
                        var utctime = Date.UTC(Number(utc_arr[0]),Number(utc_arr[1]),Number(utc_arr[2]),Number(utc_arr[3]),
                            Number(utc_arr[4]),Number(utc_arr[5]));
                        Global[obj.login].trend.push([utctime,tempval]);
                        var tempTitle = data.trend[snap][2];
                        var tempDesc = data.trend[snap][3];
                        if(tempTitle){
                            Global[obj.login].flags.push({"x":utctime,"title":tempTitle,"text":tempDesc});
                        }
                    }
                    if(data.msg){
                        showSysMsg(data.msg,true);
                    }
                }
                refresher();
            }

        },
        error:function(){
            console.log("error to load emocore ajax");
        }
    });

}
