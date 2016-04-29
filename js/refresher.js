$(document).ready(function () {
    $.ajax({
        url:"/refresher.php",
        dataType:"json",
        method:'GET',
        //data:Global.loginData,
        success:function(data){
            //console.log("refresher data received");
            var uc;
            for(uc in data.r_users){
                globalUpdate(data.r_users[uc]);
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
        Global[obj.login] = Global.proto;
        
    }
    Global[obj.login].id = obj.id_user;
    Global[obj.login].name = obj.name;
    Global[obj.login].email = obj.email;
    Global[obj.login].title = obj.title;
    Global[obj.login].o_code = obj.o_code;
    Global[obj.login].r_code = obj.r_code;
    Global[obj.login].played = obj.played;
    Global[obj.login].online = obj.online;
    Global[obj.login].emotion = obj.emotion;
    Global[obj.login].status_code = obj.status_code;
    Global[obj.login].upd = obj.upd;
    Global[obj.login].oldEmotion = obj.old_emotion;
    Global[obj.login].tendention = Number(obj.old_emotion) - Number(obj.emotion);
    Global[obj.login].msg_code = obj.msg_code;
}
