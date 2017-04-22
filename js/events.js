/**
 * Created by alter on 27.06.2016.
 */

setInterval(function () {
    checkLoginAndEvents();
},20000);

function checkLoginAndEvents() {
    if(Global.loggedAs){
        refreshEvents(Global.loggedAs)
    }else{
        refreshEvents("once");
    }
}


function refreshEvents(user) {
    if(Global.users.indexOf(user)>=0 || user == "once"){
        var request = {
            getlast:true,
            getfor:user
        };
        $.ajax({
            url:"/eventcore.php",
            dataType:"json",
            data:request,
            success:function (data) {
                data.data = JSON.parse(data.data);
                if(!data.error && data.data.length){
                    for(var i = 0;i<data.data.length;i++){
                        var tmp_title = data.data[i].title;
                        var tmp_desc = data.data[i].desc;
                        var tmp_status = data.data[i].status;
                        createNotify(tmp_title,tmp_desc,tmp_status);
                    }
                }
                //console.log("stop");
            },
            error:function () {
                console.log("error event create");
            }
        });
    }
}
function createEvent(user,title,desc,status) {
    //console.log(Global.users.indexOf(user));
    if(Global.users.indexOf(user)>=0 || user == "all"){
        var request = {
            add:true,
            add_title:title,
            add_desc:desc,
            add_status:"",
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
            url:"/eventcore.php",
            dataType:"json",
            data:request,
            success:function (data) {
                //console.log("stop");
            },
            error:function () {
                console.log("error event create");
            }
        });
    }
}
//con.addstr("Система событий включена на портале");
//con.work();