setInterval(refreshEvents,30000);
function refreshEvents() {
    let request = {};
    if(Global.loggedAs){
        request = {
            getlast:true,
            getfor:Global.loggedAs
        };
    }else {
        request = {
            getlast:true,
            getfor:"once"
        };
    }
    $.ajax({
        url:"eventcore.php",
        dataType:"json",
        data:request,
        success:function (data) {
            data.data = JSON.parse(data.data);
            if(!data.error && data.data.length){
                for(var i = 0;i<data.data.length;i++){
                    var tmp_title = data.data[i].title;
                    var tmp_desc = data.data[i].desc;
                    var tmp_status = data.data[i].status;
                    if(data.data[i].img){
                        createNotify(tmp_title,tmp_desc,tmp_status,data.data[i].img);
                    }else {
                        createNotify(tmp_title,tmp_desc,tmp_status);
                    }

                }
            }
        },
        error:function () {
            console.log("error event create");
        }
    });
}
function createEvent(user,title,desc,status,img) {
    //console.log(Global.users.indexOf(user));
    if((Global.users.indexOf(user)>=0 || user == "all") && (Global.loggedAs != "akellared") && (Global.loggedAs != "once")){
        var request = {
            add:true,
            add_title:title,
            add_desc:desc,
            add_status:"",
            img:img,
            for:[]
        };
        if(status){
            request.add_status = status;
        }
        else {
            request.add_status = "ok";
        }
        if(user == "all"){
            for(var i in Global.users){
                if(Global.users[i]!=Global.loggedAs){
                    request.for.push(Global.users[i]);
                }                
            }            
        }else {
            request.for.push(user);
        }
        $.ajax({
            url:"eventcore.php",
            dataType:"json",
            data:request,
            success:function (data) {
                request.for.forEach(function (user) {
                   emitPushTo(user);
                });
                //emitPushAll();
            },
            error:function () {
                console.log("error event create");
            }
        });
        // request.for.forEach(function (el) {
            //emitPushAll();
        // });
    }
}