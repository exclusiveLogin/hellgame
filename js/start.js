Global.authkey=false;
Global.loginData={
    "login":"",
    "password":""
};
Global.bugFixEv = new Event("resize");

function tooltipHandler() {
    $("[data-tooltip]").mousemove(function (eventObject) {

        var data_tooltip = $(this).attr("data-tooltip");

        $("#tooltip").text(data_tooltip)
            .css({
                "top" : eventObject.pageY + 5,
                "left" : eventObject.pageX + 5
            })
            .show();

    }).mouseout(function () {

        $("#tooltip").hide()
            .text("")
            .css({
                "top" : 0,
                "left" : 0
            });
    });
}
$(document).ready(function(){
    $.ajaxSetup({
        cache:false
    });
    //$("#hgmap").delay(1000).hide(500);
    ucmapToggle(false);
    $(".btn_clsuc").on("click",function () {
        ucToggle(false,false);
        ucToggle(true,false);
        trendToggle(false);
        Global.opened = false;
    });
    $(".btn_clswc").on("click",function () {
        //$(this).closest("#weather_card").hide(500);
        wcToggle(false);
    });
    $(".btn_uc_map").on("click",function () {
        if($(this).hasClass("disabled")){
            
        }else {
            console.log("test");
        }        
    });

    $(".btn_clshgmap").on("click",function () {
        $(this).closest("#hgmap").hide(500);
        $('.btn-hgmap').removeClass('disabled active');
    });

    $(".btn_f_item_more").on("click",function(){
        f_moreToggle(Global.f_more_min);
    });
    $(".btn_f_wind").on("click",function () {
        windroseToggle(!Global.windrose_show);
        //console.log("windrose:"+Global.windrose_show);
    });
    $(".btn_f_wind_a").on("click",function () {
        windToggle(!Global.windanalytics_show);
        //console.log("windrose:"+Global.windrose_show);
    });

    tooltipHandler();
    $('.uc_emo_slider').slider({
        range:false,
        min:0,
        max:100,
        value:50,
        orientation:"vertical",
        slide:function(event,ui){
            $('.uc_emo_val').val(ui.value);
            $('.btn_emo_submit').removeClass("disabled");
        },
        create:function(){
            $('.uc_emo_val').val("---");
        }
    });
    $(".btn_emo_submit").on("click", function () {
        $(this).addClass("disabled");

        var emoval = {};
        emoval['n'] = Number($(".uc_emo_val").val());
        emoval['title'] = $(".uc_emo_title").val();
        emoval['desc'] = $(".uc_emo_description").val();
        var temp = {};
        temp['login'] = Global.loggedAs;
        globalUpdate(temp,emoval);
        var offset = new Date().getTimezoneOffset()*60000;
        var now = Date.now();
        utc = now - offset;
        Global.trend.series[0].addPoint([utc,emoval.n]);
        startUpdater();
        createEvent("all","Пользователь "+Global.loggedAs+" настроение: "+emoval['n'],emoval["title"]+" "+emoval["desc"]);
    });
    $('.btn-played').on("click",function () {
        var played = $(this).data("played");
        var req = {};
        req['newplayed'] = {};
        req.newplayed['state']= played;
        req['login']= Global.loggedAs;
        var tmp_str;
        if(played){
            tmp_str = " начал игру ";
        }else {
            tmp_str = " больше не играет ";
        }
        globalUpdate(req);
        createEvent("all","Пользователь "+Global.loggedAs+tmp_str,"для подробностей посетите сайт игры");
    });
    $('.btn-red-code').on("click",function () {
        var oldState;
        var newState;
        if($(this).hasClass("active")){
            oldState = true;
            newState = !oldState;
        }
        else {
            oldState = false;
            newState = !oldState;
        }
        var req = {};
        req['login']= Global.loggedAs;
        req['newcode_r'] = {};
        req.newcode_r.state = newState;
        var t_uc_msg = $('.uc_code_msg').val();
        req.newcode_r.user_msg = t_uc_msg;
        globalUpdate(req);
        var tmp_str;
        if(newState){
            tmp_str = " ввел ";
        }else {
            tmp_str = " отменил ";
        }
        var tmp_code = "";
        if(t_uc_msg){
            tmp_code = " с сообщением "+t_uc_msg;
        }
        createEvent("all","Пользователь "+Global.loggedAs+tmp_str+"Красный код",tmp_code+" Для подробностей посетите сайт игры","red");
    });
    $('.btn-orange-code').on("click",function () {
        var oldState;
        var newState;
        if($(this).hasClass("active")){
            oldState = true;
            newState = !oldState;
        }
        else {
            oldState = false;
            newState = !oldState;
        }
        var req = {};
        req['login']= Global.loggedAs;
        req['newcode_o'] = {};
        req.newcode_o.state = newState;
        var t_uc_msg = $('.uc_code_msg').val();
        req.newcode_o.user_msg = t_uc_msg;
        globalUpdate(req);
        var tmp_str;
        if(newState){
            tmp_str = " ввел ";
        }else {
            tmp_str = " отменил ";
        }
        var tmp_code = "";
        if(t_uc_msg){
            tmp_code = " с сообщением "+t_uc_msg;
        }
        createEvent("all","Пользователь "+Global.loggedAs+tmp_str+"Оранжевый код",tmp_code+" Для подробностей посетите сайт игры","orange");
    });
    $('.btn-green-code').on("click",function () {
        var oldState;
        var newState;
        if($(this).hasClass("active")){
            oldState = true;
            newState = !oldState;
        }
        else {
            oldState = false;
            newState = !oldState;
        }
        var req = {};
        req['login']= Global.loggedAs;
        req['newcode_g'] = {};
        req.newcode_g.state = newState;
        var t_uc_msg = $('.uc_code_msg').val();
        req.newcode_g.user_msg = t_uc_msg;
        globalUpdate(req);
        var tmp_code = "";
        if(t_uc_msg){
            tmp_code = "Пользователь "+Global.loggedAs+" сообщает: "+t_uc_msg;
        }
        createEvent("all",tmp_code,"Для подробностей посетите сайт игры","ok");
    });
    $(".btn_status_submit").on("click",function () {
        var thisobj = $(this);
        var st_danger = thisobj.data("danger");
        var icoobj = thisobj.find(".fa");
        var status = icoobj[0].classList[3];
        var msg = icoobj.next().text();
        //console.log("status:"+status+" danger:"+st_danger);
        var temp = {};
        temp['login'] = Global.loggedAs;
        temp['newstatus'] = {};
        temp.newstatus['code'] = status;
        temp.newstatus['danger'] = st_danger;
        temp.newstatus['status_msg'] = msg;
        
        if(Global.loggedAs){
            temp.newstatus['old_emo'] = Global[Global.loggedAs].emotion;
            temp.newstatus['title'] = msg;
            temp.newstatus['desc'] = "Установлен новый статус "+msg;
            var tmp_str_dng = "ok";
            if(st_danger)tmp_str_dng = "danger";
            createEvent("all","Пользователь "+Global.loggedAs," Установлен новый статус "+msg,tmp_str_dng)
        }
        
        var containerSt = thisobj.parent().parent();
        //var destination = containerSt.scrollTop();
        containerSt.animate({"scrollTop":0},1000);
        globalUpdate(temp);
    });
    
    var widget = $("#widget_weather");
    widget.hover(
        function () {
            $(this).find(".code_msg").stop().show(500);
        },
        function () {
            $(this).find(".code_msg").stop().hide(500);
        });
    widget.on("click",function () {
        wcToggle(true);
    });

    //updList();
    setTimeout(updList,10000);
    setTimeout(refreshAuth,5000);
    //refreshAuth();
    

    $('#btnloginenter').on('click',function(){
        Global.loginData.login = $('#loginName').val();
        Global.loginData.password = $('#passwordName').val();
        $.ajax({
            url:"/enter.php",
            dataType:"json",
            method:'GET',
            data:Global.loginData,
            success:function(data){                
                if(data.auth){
                    Global.authkey=data.auth;
                    showSysMsg("all ok",true);
                }else{
                    showSysMsg("error");
                }
                loginToggle(0);
                if(data.msg){
                    var state = false;
                    if(data.auth){
                        state=true;
                        Global.loggedAs = data.login;
                        privateDetail();
                        ucmapToggle(true);
                        ucmapLock(false);
                        ucMsgLock(false);
                        createEvent("all","Пользователь "+Global.loggedAs+" зашел на сайт","Для подробностей посетите сайт игры","ok");
                        //createNotify("Новый визит","Пользователь "+Global.loggedAs+" зашел на сайт","ok");
                    } 
                    showSysMsg(data.msg,state);
                }
                refreshAuth();
            },
            error:function(){
                console.log("error to load auth ajax");
            }
        });
    });
});
function showSysMsg(msg,state) {
    if(state){
        $("#sysmsg").removeClass("sys_err");
        $("#sysmsg").addClass("sys_ok");
    }
    else {
        $("#sysmsg").removeClass("sys_ok");
        $("#sysmsg").addClass("sys_err");
    }
    //$("#sysmsg").show();
    $("#sysmsg").removeClass("myhide");
    $("#sysmsg_val").html(msg);
    setTimeout(hideSysMsg,5000);
    function hideSysMsg() {
        $("#sysmsg").addClass("myhide");
        
    }
    
}
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