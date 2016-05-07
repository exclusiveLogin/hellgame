$(document).ready(function () {
    $.ajax({
        url:"/refresher.php",
        dataType:"json",
        method:'GET',
        //data:Global.loginData,
        success:function(data){
            //console.log("refresher data received");
            var uc;
            Global.users = [];
            for(uc in data.r_users){
                globalUpdate(data.r_users[uc]);
                refreshLogged();
            }
        },
        error:function(){
            alert("error to load refresher ajax");
        }
    });

});

function globalUpdate(obj) {//сначала proto потом вне условия все остальное
    if(!Global[obj.login]){
        Global[obj.login] = {};
        for(var key in Global.blank){
            Global[obj.login][key] = Global.blank[key];
        }
        
    }
    Global.users.push(obj.login);
    Global[obj.login].id = obj.id_user;
    Global[obj.login].name = obj.name;
    Global[obj.login].email = obj.email;
    Global[obj.login].title = obj.title;
    Global[obj.login].o_code = obj.o_code;
    Global[obj.login].r_code = obj.r_code;
    Global[obj.login].played = obj.played;
    Global[obj.login].online = obj.online;
    //Global[obj.login].emotion = obj.emotion;
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
    //Global[obj.login].oldEmotion = obj.old_emotion;
    //Global[obj.login].tendention = Number(obj.old_emotion) - Number(obj.emotion);
    Global[obj.login].msg_code = obj.msg_code;
    Global[obj.login].login = obj.login;
    Global[obj.login].img_big = obj.img_big;
    Global[obj.login].img_min = obj.img_min;
    var dataQueryEmocore = {};
    dataQueryEmocore['t_user'] = Global[obj.login].login;
    $.ajax({
        url:"/emocore.php",
        dataType:"json",
        method:'GET',
        data:dataQueryEmocore,
        //data:Global.loginData,
        success:function(data){
            //alert("load emocore ajax ok");
            console.log("парсим json");
            if(data.errors){
                console.log("есть ошибка:"+data.errormsg);
            }
            else {
                console.log("нет ошибок, данные: "+data);
                Global[obj.login].emotion = data.last_emo;
                Global[obj.login].oldEmotion = data.prev_emo;
                Global[obj.login].tendention = Global[obj.login].emotion - Global[obj.login].oldEmotion;
                Global[obj.login].trend = [];
                for(var snap in data.trend){
                    var shot = data.trend[snap][0];
                    var tempval = Number(data.trend[snap][1]);
                    var utc_arr = [];
                    utc_arr = shot.split(',');
                    (utc_arr[1]>0)?utc_arr[1]-=1:utc_arr[1]=0;
                    var utctime = Date.UTC(Number(utc_arr[0]),Number(utc_arr[1]),Number(utc_arr[2]),Number(utc_arr[3]),
                        Number(utc_arr[4]),Number(utc_arr[5]));
                    Global[obj.login].trend.push([utctime,tempval]);
                }
            }
        },
        error:function(){
            alert("error to load emocore ajax");
        }
    });
    
    refresher();
}
