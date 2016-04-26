var Global={};
Global.authkey=false;
Global.loginData={
    "login":"",
    "password":""
};
$(document).ready(function(){
    $.ajaxSetup({
        cache:false,
        async:false
    });
    updList();
    refreshAuth();

    $('#btnloginenter').on('click',function(){
        Global.loginData.login = $('#loginName').val();
        Global.loginData.password = $('#passwordName').val();
        $.ajax({
            url:"/login.php",
            dataType:"json",
            method:'POST',
            data:Global.loginData,
            success:function(data){
                Global.authkey=data.auth;
                refreshAuth();
                loginToggle(0);
            },
            error:function(){
                alert("error to load auth ajax");
            }
        });
    });
});
function deletemc(indexid){
    $.ajax({
        url:"addmcdb.php",
        type:"POST",
        dataType:"text",
        data:{"mcid":indexid,"deletemc":true},
        success:function(text){
            updList();
        },
        //complete:
        error:function(x,textst,y){
            alert("error:"+textst);
        }
    });
}
function updList(){
    $('#container').empty();
    $.ajax({
        url:"/dbq.php",
        mode:"json",
        success:function(json){
            user(json);
        },
        complete: function () {
            refreshAuth();
        },
        error:function(){
            alert("error ajax");
        }
    });

    $('#container').on('click','.headermc',function(event){
        $('#fancytemp').html($(this).parent().parent().html());
        $('#fancytemp').find('.card').attr('style','margin:15px;');
        $('#fancytemp').fancybox();
        $('#fancytemp').click();
    });
}
function user(data){
    var json = $.parseJSON(data);
    var un;
    for(un in json.units){
        createcard(json.units[un]);
    }
}
function createcard(card){
    var Text={};
    if(card.active==='1'){
        Text.act="Активен";
    }
    else{
        Text.act="Не активен";
    }
    $('#container').append('<div class="monster col-lg-4 col-md-6 col-sm-12 col-xs-12" id="monstermc'+card.id+'">'+
        '<div class="card panel panel-danger">'+
        '<div class="headermc col-lg-12 panel-heading"><p class="headermctext panel-title">'+card.name+'</p></div>'+
        '<div class="panel-body">'+
        '<div class="leftmc col-sm-6">'+
        '<div class="photomc text-center thumbnail">'+
        '<img src="style/nophoto.png"></div>'+
        '<div class="dangermc">Класс опасности:'+card.class+'</div></div>'+
        '<div class="rightmc col-sm-6">'+
        '<div class="namemc">Уровень:'+card.level+'</div>'+
        '<textarea class="descriptionmc" readonly>'+card.description+'</textarea>'+
        '<div class="statusmc">'+card.status+'</div>'+
        '<div class="activemc">'+Text.act+'</div>'+
        '<div class="weathermc container-fluid">'+
        '<div class="snowmc col-lg-3 col-md-3 col-sm-3"><i class="fa fa-cog"></i></div>'+
        '<div class="rainmc col-lg-3 col-md-3 col-sm-3"><i class="fa fa-tint"></i></div>'+
        '<div class="overcastmc col-lg-3 col-md-3 col-sm-3"><i class="fa fa-cloud"></i></div>'+
        '<div class="clearskymc col-lg-3 col-md-3 col-sm-3"><i class="fa fa-sun-o"></i></div></div></div></div>'+
        '<div class="panel-footer cardmanage">'+
        '</div></div></div>'
    );

    if(card.snow==='1'){
        $('#monstermc'+card.id).find('.snowmc').addClass('wactmc');
    }
    else{
        $('#monstermc'+card.id).find('.snowmc').removeClass('wactmc');
    }
    if(card.rain==='1'){
        $('#monstermc'+card.id).find('.rainmc').addClass('wactmc');
    }
    else{
        $('#monstermc'+card.id).find('.rainmc').removeClass('wactmc');
    }
    if(card.overcast==='1'){
        $('#monstermc'+card.id).find('.overcastmc').addClass('wactmc');
    }
    else{
        $('#monstermc'+card.id).find('.overcastmc').removeClass('wactmc');
    }
    if(card.clearsky==='1'){
        $('#monstermc'+card.id).find('.clearskymc').addClass('wactmc');
    }
    else{
        $('#monstermc'+card.id).find('.clearskymc').removeClass('wactmc');
    }
}