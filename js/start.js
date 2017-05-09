Global.authkey=false;
Global.loginData={
    "login":"",
    "password":""
};
Global.bugFixEv = new Event("resize");

Global.demo = true;
Global.version = {};
Global.version.v = "1.0.2";
Global.version.build = "10200";
Global.version.desc = "<li>...</li>" +
    "<li>Версия Service Worker 0.3.2</li>" +
    "<li>Исправлен алгоритм расчета баланса</li>" +
    "<li>Добавлен алгоритм потокового слежение</li>" +
    "<li>Добавлен дампер базы данных</li>" +
    "<li>Исправлены мелкие недочеты</li>";

function tooltipHandler() {
    $("[data-tooltip]").mousemove(function (eventObject) {

        var data_tooltip = $(this).attr("data-tooltip");

        var tmpoffset = $("#tooltip").offset().left;
        var tmpw = $("#tooltip").width();
        var tmppanelw = $("body").outerWidth();
        //console.log("offset:"+tmpoffset+"width:"+tmpw+"bodywidth:"+tmppanelw);

        if((tmpoffset+tmpw+100)>tmppanelw){
            $("#tooltip").text(data_tooltip)
                .css({
                    "top" : eventObject.pageY + 10,
                    "left" : eventObject.pageX - 10 - tmpw
                })
                .show();
        }else {
            $("#tooltip").text(data_tooltip)
                .css({
                    "top" : eventObject.pageY + 10,
                    "left" : eventObject.pageX + 10
                })
                .show();
        }

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
    if(Global.demo){
        $("#fancydemo").fancybox({
            modal:true
        }).click();
         setTimeout(function(){
            $.fancybox.close();
         },5000);
    }

    checkLastLogin();
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
    $('#mc_btncancel').on('click',function(){
        addmcformToggle(false);
    });
	$(".btn_addmonsterHgmap").on("click",function () {
        if($(this).hasClass("disabled")){
            
        }else {
            addmcformToggle(true);
        }        
    });
	$("#mc_btnsub").on("click",function () {
        checkFormAddmc();
    });

    $(".btn_f_item_more").on("click",function(){
        if(!$(this).hasClass("disabled")){
            f_moreToggle(Global.f_more_min);
        }        
    });
    $(".btn_f_wind").on("click",function () {
        if(!$(this).hasClass("disabled")){
            windroseToggle(!Global.windrose_show);
        }
        //console.log("windrose:"+Global.windrose_show);
    });
    $(".btn_f_wind_a").on("click",function () {
        if(!$(this).hasClass("disabled")){
            windToggle(!Global.windanalytics_show);
        }        
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
    //setTimeout(refreshAuth,5000);
    refreshAuth();
    

    $('#btnloginenter').on('click',function(){
        Global.loginData.login = $('#loginName').val();
        Global.loginData.password = $('#passwordName').val();
        $.ajax({
            url:"/enter.php",
            dataType:"json",
            method:'GET',
            data:Global.loginData,
            success:function(data){
                if(data.auth)userEnter(data.login);
                loginToggle(0);
                if(data.msg){
                    var state = false;
                    if(data.auth){
                        state=true;
                    } 
                    showSysMsg(data.msg,state);
                }
                Global.HgMap.oldMonsters = [];
                refreshAuth();
            },
            error:function(){
                console.log("error to load auth ajax");
            }
        });
    });
});
function userEnter(user) {
    Global.authkey=true;
    Global.loggedAs = user;
    if(Global.simplePrivateEnded){
        privateDetail();
    }else{
        setTimeout(privateDetail,10000);
    }
    addUserToLocalStorage(user);
    ucmapToggle(true);
    ucmapLock(false);
    ucMsgLock(false);
    createEvent("all","Пользователь "+Global.loggedAs+" зашел на сайт","Для подробностей посетите сайт игры","ok");
    sendUserName(user);
    refreshAuth();
    refreshEvents();
}
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
            console.log("error:"+textst);
        }
    });
}
function updList(){
    $.ajax({
        url:"/dbq.php",
        mode:"json",
        success:function(data){
            if(Global.HgMap.oldMonsters != data){
                Global.HgMap.resetMonsters();
                $('#container').empty();
                var json = $.parseJSON(data);
                var un;
                for(un in json.units){
                    createcard(json.units[un]);
                }
            }
            setTimeout(updList,10000);
            setCardFooterHandler();
            Global.HgMap.oldMonsters = data;
        },
        complete: function () {
        },
        error:function(){
            console.log("error ajax");
        }
    });
    $('#container').off('click','.headermc');
    $('#container').on('click','.headermc',function(event){
        // $('#fancytemp').html($(this).parent().parent().html());
        // $('#fancytemp').find('.card').attr('style','margin:15px;');
        // $('#fancytemp').fancybox();
        // $('#fancytemp').click();

        if($(this).hasClass("active")){
            $(this).removeClass("active");
            $(this).next().hide();
        }else {
            $(this).addClass("active");
            $(this).next().show();
        }
    });
}
function createcard(card){
    if(card.lat && card.lng && card.name){
        Global.HgMap.addMonsterHG(card.lat,card.lng,card.name);
    }
    let Text={};
    if(card.active==='1'){
        Text.act="Активен";
    }
    else{
        Text.act="Не активен";
    }
    let onmapTpl = '<div class="label label-success hidden"></div>' ;
    if(card.lat && card.lng){
        onmapTpl = '<div class="label label-success">На карте</div>' ;
    }else {
        onmapTpl = '<div class="label label-danger">Нет на карте</div>' ;
    }

    let cardFooterTpl = `<p>Управление:<span class="label label-default">Режим гостя</span></p>`;

    if(Global.authkey){
        cardFooterTpl = `<p>Управление:<span class="label label-danger">Режим администратора</span></p>
            <div class="managetools text-center">
                <div class="btn-group">
                    <button class="btn btn-warning btn-group-sm disabled">Редактировать</button>
                    <button class="btn btn-danger btn-group-sm btn_deletemc">Удалить</button>
                </div>
            </div>`;
    }


    $('#container').append(
        `<div class="monster col-lg-4 col-md-6 col-sm-12 col-xs-12" id="monstermc${card.id}">
            <div class="card panel panel-danger">
                <div class="headermc col-lg-12 panel-heading">
                    <p class="headermctext panel-title">${card.name}</p>
                </div>
                <div class="panel-body">
                    <div class="leftmc col-sm-6">
                        <div class="photomc text-center thumbnail hidden-xs">
                            <img src="style/nophoto.png">
                        </div>
                        <div class="dangermc">Класс опасности:${card.class}</div>
                    </div>
                    <div class="rightmc col-sm-6">
                        <div class="namemc">Уровень:${card.level}</div>
                        <textarea class="descriptionmc" readonly>${card.description}</textarea>
                        <div class="statusmc">${card.status}</div>
                        <div class="activemc">${Text.act}</div>
                        <div class="weathermc container-fluid">
                            <div class="snowmc col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                <i class="fa fa-cog"></i>
                            </div>
                            <div class="rainmc col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                <i class="fa fa-tint"></i>
                            </div>
                            <div class="overcastmc col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                <i class="fa fa-cloud"></i>
                            </div>
                            <div class="clearskymc col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                <i class="fa fa-sun-o"></i>
                            </div>
                        </div>
                        <div class="mc_lat">Широта: 
                            <span class="value">${card.lat}</span>
                        </div>
                        <div class="mc_lng">Долгота: 
                            <span class="value">${card.lng}</span>
                        </div>
                        ${onmapTpl}
                    </div>
                </div>
                <div class="panel-footer cardmanage">
                    ${cardFooterTpl}
                </div>
            </div>
        </div>`
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