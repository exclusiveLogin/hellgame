function checkFormAddmc(){
    var form={
        'tempMin':0,
        'tempMax':0,
        'windMin':0,
        'windMax':0,
        'speed':0,
        'distance':0,
        'respawn':0,
        'liveTime':0,
        'direction':0,
        'name':"",
        'class':"",
        'description':"",
        'level':0
    };
    form.addmc = true;
    form.tempMin=$('#mc_temp').slider('option','values')[0];
    form.tempMax=$('#mc_temp').slider('option','values')[1];
    form.windMin=$('#mc_wind_speed').slider('option','values')[0];
    form.windMax=$('#mc_wind_speed').slider('option','values')[1];
    form.speed=$('#mc_speed').slider('option','value');
    form.respawn=$('#mc_respawn').slider('option','value');
    form.liveTime=$('#mc_livetime').slider('option','value');
    form.namemc=$('#mc_name').val();
    form.descriptionmc=$('#mc_desc').val();
    if(Global.hgmapsrc.newMonsterLat && Global.hgmapsrc.newMonsterLng){
        form.lat = Global.hgmapsrc.newMonsterLat;
        form.lng = Global.hgmapsrc.newMonsterLng;
    }
    if(form.namemc){
        $.ajax({
            url:"addmcdb.php",
            type:"POST",
            dataType:"text",
            data:form,
            success:function(text){
                //console.log("ADD:",text);
                updList();
            },
            complete:function () {
                Global.hgmapsrc.newMonsterLat = false;
                Global.hgmapsrc.newMonsterLng = false;
                addmcformToggle(false);
            },
            error:function(x,textst){
                alert("error:"+textst);
            }
        });
    }else {
        alert("Имя за тебя мать должна писать Еб ?");
    }

}
//con.addstr("checkform.js подключен");
//con.work();