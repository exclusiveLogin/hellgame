$(document).ready(function () {
});

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
    form.tempMin=$('#mc_temp').slider('option','values')[0];
    form.tempMax=$('#mc_temp').slider('option','values')[1];
    form.windMin=$('#mc_wind_speed').slider('option','values')[0];
    form.windMax=$('#mc_wind_speed').slider('option','values')[1];
    form.speed=$('#mc_speed').slider('option','value');
    form.distance=$('#mc_distance').slider('option','value');
    form.respawn=$('#mc_respawn').slider('option','value');
    form.liveTime=$('#mc_livetime').slider('option','value');
    form.direction=$('#mc_direction').slider('option','value');
    form.name=$('#mc_name').val();
    form.description=$('#mc_desc').val();

    $.ajax({
        url:"addmcdb.php",
        type:"POST",
        dataType:"text",
        data:{"namemc":form.name,"descriptionmc":form.description,"addmc":true},
        success:function(text){
            updList();
        },
        //complete:
        error:function(x,textst,y){
            alert("error:"+textst);
        }
    });
}
con.addstr("checkform.js подключен");
con.work();