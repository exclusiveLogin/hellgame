function refreshAuth(){
    if(Global.authkey){//************************Авторизован****************
        var pr_menuADM = fetch("/components/menuadmin.html").then(
            function (response) {
                return response.text();
            }
        ).then(
            function (menu) {
                $('#menu').html(menu);
            }
        );
        var pr_menuPDAADM = fetch("/components/menupdaadmin.html").then(
            function (response) {
                return response.text();
            }
        ).then(
            function (menupda) {
                $('#menupda').html(menupda);
            }
        );
        var pr_amc = fetch("/components/addmc.html").then(
            function (response) {
                return response.text();
            }
        ).then(
            function (addmc) {
                $('#addmc').html(addmc);
                $('#mc_temp').slider({
                    range:true,
                    min:-30,
                    max:50,
                    values:[1,15],
                    slide:function(event,ui){
                        $('#mc_temp_val').val("От "+ui.values[0]+" до "+ui.values[1]+" градусов Цельсия");
                    },
                    create:function(){
                        $('#mc_temp_val').val("Установите температуру (1-15)");
                    }
                });
                $('#mc_wind_speed').slider({
                    range:true,
                    min:0,
                    max:150,
                    values:[0,15],
                    slide:function(event,ui){
                        $('#mc_wind_speed_val').val("От "+ui.values[0]+" до "+ui.values[1]+" м/с.");
                    },
                    create:function(){
                        $('#mc_wind_speed_val').val("Установите скорость ветра(0-15)");
                    }
                });
                $('#mc_speed').slider({
                    range:false,
                    min:0,
                    max:5000,
                    value:100,
                    slide:function(event,ui){
                        $('#mc_speed_val').val("Скорость:"+ui.value+" м/ч.");
                    },
                    create:function(){
                        $('#mc_speed_val').val("Установите скорость (100м/ч)");
                    }
                });
                // $('#mc_distance').slider({
                //     range:false,
                //     min:1,
                //     max:500,
                //     value:15,
                //     slide:function(event,ui){
                //         $('#mc_distance_val').val("Расстояние:"+ui.value+" км.");
                //     },
                //     create:function(){
                //         $('#mc_distance_val').val("Установите расстояние");
                //     }
                // });
                $('#mc_respawn').slider({
                    range:false,
                    min:0,
                    max:500,
                    value:24,
                    slide:function(event,ui){
                        $('#mc_respawn_val').val("Воскр. через:"+ui.value+" час.");
                    },
                    create:function(){
                        $('#mc_respawn_val').val("Установите время воскр.(24)");
                    }
                });
                $('#mc_livetime').slider({
                    range:false,
                    min:1,
                    max:72,
                    value:1,
                    slide:function(event,ui){
                        $('#mc_livetime_val').val("Живет:"+ui.value+" час.");
                    },
                    create:function(){
                        $('#mc_livetime_val').val("Установите время жизни. (1час)");
                    }
                });
                // $('#mc_direction').slider({
                //     range:false,
                //     min:1,
                //     max:360,
                //     value:1,
                //     slide:function(event,ui){
                //         $('#mc_direction_val').val("Цель на:"+ui.value+" градусов.");
                //     },
                //     create:function(){
                //         $('#mc_direction_val').val("Установите направление.");
                //     }
                // });
            }
        );

        Promise.all([pr_menuADM,pr_menuPDAADM,pr_amc]).then(function () {
            updList();
            resetHandlers();
            setHandlers();
            refreshLogged();
        });
        
    }else{//************************Гость****************
        ucmapToggle(false);
        ucmapLock(true);
        ucMsgLock(true);

        var pr_menu = fetch("/components/menu.html").then(
            function (response) {
                return response.text();
            }
        ).then(
            function (menu) {
                $('#menu').html(menu);
            }
        );
        var pr_menuPDA = fetch("/components/menupda.html").then(
            function (response) {
                return response.text();
            }
        ).then(
            function (menupda) {
                $('#menupda').html(menupda);
            }
        );

        Promise.all([pr_menu, pr_menuPDA]).then(function () {
            $('#addmc').html('').hide(500);
            resetHandlers();
            setHandlers();
            refreshLogged();
            updList();
        });
    }
}
function setCardFooterHandler(){
    $('.btn_deletemc').off();
    $('.btn_deletemc').on('click', function () {
        var id = $(this).parentsUntil('','.monster').attr('id').substr(9);
        var quest = confirm("Вы уверены что хотите удалить монстра из базы?(Это вас не спасет)");
        if(quest){deletemc(id);}
    });
}
function refreshLogged() {
    for (var user in Global.users){
        $("#widget_uc_"+Global.users[user]).off("click");
        
        if(Global.users[user] == Global.loggedAs){
            $("#widget_uc_"+Global.users[user]).on("click",function () {
                var id = $(this).attr("id").substr(-3);
                Global.opened = id;
                ucToggle(false,true,refreshUC,id);
                ucToggle(true,false,refreshUC,id);
            });
        }
        else {
            $("#widget_uc_"+Global.users[user]).on("click",function () {
                var id = $(this).attr("id").substr(-3);
                Global.opened = id;
                ucToggle(true,true,refreshUC,id);
                ucToggle(false,false,refreshUC,id);
            });
        }
    }
}
function resetHandlers() {
    $('.btnadmintools').off('click');
    $('.btnadmintoolscl').off('click');
    $('.btnlogin').off('click');
    $('.btnfx95').off('click');
    $('.btnlogincl').off('click');
    $('.btnlogout').off('click');
    $('.btn-hgmap').off('click');
}
function setHandlers(){
    $('.btn-hgmap').on('click',function () {
        if($(this).hasClass('disabled')){
            
        }else{
            $(this).addClass('disabled active');
            $('#hgmap').show(500,function(){
				window.dispatchEvent(Global.bugFixEv);
				Global.HgMap.HGmapObj.panTo(Global.HgMap.markerHome.getPosition());
			});
        }        
    });
    $('.btnlogin').on('click',function(){
        $(this).addClass('disabled active');
        $('#loginform').show(500);
    });
    $('.btnfx95').on('click',function(){
        window.open("/3d/index.html");
    });
    $('.btnlogincl').on('click',function(){
        $('.btnlogin').removeClass('disabled active');
        $('#loginform').hide(500);
    });
    $('.btnlogout').on('click',function(){
        Global.authkey = false;
        Global.loggedAs = "";
        Global.HgMap.oldMonsters=[];
        refreshAuth();
        deleteUserFromLocalStorage();
        showSysMsg("Вы успешно вышли из системы",true);
    });
}
function f_moreToggle(state) {
    var pr_moreToggle = new Promise(function(complete,error){
        var width_obj = Global.trend_forecast.options.chart.renderTo.offsetWidth;
        if(state){
            $(".btn_f_item_more").addClass("active");
            $(".forecast_item").find(".row").show(500);
            $(".forecast_item").find(".f_item_desc_val").show(500);
            Global.trend_forecast.setSize(width_obj,300);
            Global.f_more_min = false;
        }
        else {
            $(".btn_f_item_more").removeClass("active");
            $(".forecast_item").find(".row").hide(500);
            $(".forecast_item").find(".f_item_desc_val").hide(500);
            Global.trend_forecast.setSize(width_obj,450);
            Global.f_more_min = true;
        }
        setTimeout(function () {
            complete();
        },1000);
    });
    pr_moreToggle.then(function () {
        Global.trend_forecast.reflow();
        Global.trend_forecast.redraw();
    });
    
}
function windroseToggle(state) {
    if(state){
        $(".btn_f_wind").addClass("active");
        Global.windrose_show = true;
        $(".wind_rose_trend").show(function () {
            Global.trend_windrose_obj.reflow();
        });
        $(".main_weather").hide();
    }
    else {
        $(".btn_f_wind").removeClass("active");
        Global.windrose_show = false;
        $(".wind_rose_trend").hide();
        $(".main_weather").show();
    }
}
function windToggle(state) {
    var width_forecast = Global.trend_forecast.options.chart.renderTo.offsetWidth;
    if(state){
        f_moreToggle(false);
        $(".btn_f_wind_a").addClass("active");
        $(".btn_f_item_more").addClass("disabled");
        Global.windanalytics_show = true;
        $(".wind_trend").show(function () {
            var width_wind = Global.trend_windobj.options.chart.renderTo.offsetWidth;
            if(Global.trend_wind_dataok){
                //set data для тренда аналитики ветра
                Global.trend_windobj.series[0].setData([],false);
                Global.trend_windobj.series[0].setData(Global.trend_wind_real,false);
                Global.trend_windobj.series[1].setData([],false);
                Global.trend_windobj.series[1].setData(Global.trend_wind_current,false);
                Global.trend_windobj.series[2].setData([],false);
                Global.trend_windobj.series[2].setData(Global.trend_wind_dir,false);
                Global.trend_wind_dataok = false;
            }
            else {
                //alert("Данные аналитики ветра еще не получены попробуйте еще раз");
            }
            Global.trend_windobj.redraw();
            Global.trend_windobj.setSize(width_forecast,300);
        });
        $(".forecast_container").hide();
        Global.trend_forecast.setSize(width_forecast,300);

    }
    else {
        $(".btn_f_wind_a").removeClass("active");
        $(".btn_f_item_more").removeClass("disabled");
        Global.windanalytics_show = false;
        $(".wind_trend").hide();
        $(".forecast_container").show();
        Global.trend_forecast.setSize(width_forecast,450);
    }
}
function ucmapLock(state) {
    if(state){//блокируем кнопку
        $(".btn_uc_map").addClass("disabled");
        $(".btn_uc_msg").addClass("disabled");
        $(".btn_uc_map").off("click");
        $(".btn_uc_msg").off("click");
    }else {
        $(".btn_uc_map").removeClass("disabled");
        $(".btn_uc_msg").removeClass("disabled");
        $(".btn_uc_map").on("click",function () {
            ucmapToggle(true);
        });
        $(".btn_uc_msg").on("click",function () {
            ucmapToggle(false);
        });
    }
}
function ucMsgLock(state) {
    if(!state){//блокируем панель ввода сообщения
        $(".btn_ucmsg_submit").on("click",function () {
            //получаем данные с FrontEnd
            var tmp_title = $(".uc_email_title").val();
            $(".uc_email_title").val("");
            var tmp_desc = $(".uc_email_body").val();
            $(".uc_email_body").val("");
            var tmp_user = Global.opened;
            createEvent(tmp_user,tmp_title,tmp_desc);
            showSysMsg("Ваше cообщение отправлено",true);
        });
        $(".btn_ucmsg_submit").removeClass("disabled");
    }else {
        $(".btn_ucmsg_submit").off("click");
        $(".btn_ucmsg_submit").addClass("disabled");
    }
}
function ucmapToggle(state) {
    if(state){//показать
        $(".uc_map_container").show(500,function () {
            window.dispatchEvent(Global.bugFixEv);
            Global.georefresh = true;
            if(Global.hgmapsrc && Global.opened){
                if(Global.hgmapsrc.uc_map){
                    Global.hgmapsrc.uc_map.panTo({lat: Global[Global.opened].privatedata.lat, lng: Global[Global.opened].privatedata.lon});
                }
            }
        });
        $(".uc_msg_container").hide(500);
        if($(".btn_uc_map").hasClass("active disabled")){

        }else {
            $(".btn_uc_map").addClass("active disabled");
        }
    }else {//скрыть
        $(".uc_map_container").hide(500);
        $(".uc_msg_container").show(500);
        $(".btn_uc_map").removeClass("active disabled");
    }
}
function trendToggle(state, user) {
    if(state){
        $("#trend").show(1000, function () {
            Global.trend.reflow();
            $(this).removeClass("transparent");
            Global.trend.series[0].setData([]);
            Global.trend.series[1].setData([]);

            Global.trend.series[0].setData(Global[user].trend);
            Global.trend.series[1].setData(Global[user].flags);
        });
    }else {
        $("#trend").hide(1000,function(){
            $(this).addClass("transparent");
        });
    }
}
function ucToggle(guest,state,callback,id) {
    if(state)Global.georefresh = true;
    if(guest){
        if(state){
            $("#usercard").fadeIn(500,function () {
                if(callback && id){
                    callback(id);
                }
            });
        }
        else {
            $("#usercard").fadeOut(500);
        }
    }else {
        if(state){
            $("#usercard-g").fadeIn(500,function () {
                if(callback && id){
                    callback(id);
                }
            });
        }
        else {
            $("#usercard-g").fadeOut(500);
        }
    }
}
function loginToggle(state){
    if(state){
        $(this).addClass('disabled active');
        $('#loginform').show(500);
    }
    else{
        $('.btnlogin').removeClass('disabled active');
        $('#loginform').hide(500);
    }
}
function addmcformToggle(state){
    if(state){
        $("#addmc").show(500);
        if(Global.hgmapsrc.newMonsterLat && Global.hgmapsrc.newMonsterLng){
            $(".btn_addmonsterHgmap").addClass("hidden");
            $("#mc_btnsub").removeClass("hidden");
        }else {
            alert("Где чухан то твой, скажи еб.");
        }
        Global.hgmapsrc.openedCreatePlane = true;
    }
    else{
        $("#addmc").hide(500);
        $('#hgmap').hide(500);
        Global.HgMap.markerHome.setVisible(false);
        $('.btn-hgmap').removeClass('disabled active');
        $("#mc_btnsub").addClass("hidden");
        $(".btn_addmonsterHgmap").addClass("hidden");
        Global.hgmapsrc.newMonsterLat = false;
        Global.hgmapsrc.newMonsterLng = false;
        Global.hgmapsrc.openedCreatePlane = false;
    }
}
function wcToggle(state) {
    var wc = $("#weather_card");
    if(state){
        wc.show(500,function(){
            //f_moreToggle(false);
            history.pushState("","","#meteo");
            f_moreToggle(false);
            windToggle(false);
        });
    }else {
        wc.hide(500);
        history.pushState("","","/");
    }
}
//con.addstr("auth.js подключен");
//con.work();
//con.scheduller();