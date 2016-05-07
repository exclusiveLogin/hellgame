function refresher() {
    var user;
    for (user in Global.users){
        var user_name = Global.users[user];
        var widget_obj = $("#widget_uc_"+user_name);
        widget_obj.find(".card_title").text(Global[user_name].login);
        //online
        if(Number(Global[user_name].online)){
            widget_obj.find(".card_status").text("online").removeClass("green_code red_code").addClass("card_status_on");    
        }
        else {
            widget_obj.find(".card_status").text("offline").removeClass("green_code red_code").addClass("card_status_off");
        }
        //red code
        if(Number(Global[user_name].r_code)){
            widget_obj.find(".red_code").removeClass("code_off");
        }
        else {
            widget_obj.find(".red_code").addClass("code_off");
        }
        //orange code
        if(Number(Global[user_name].o_code)){
            widget_obj.find(".orange_code").removeClass("code_off");
        }
        else {
            widget_obj.find(".orange_code").addClass("code_off");
        }
        //played
        if(Number(Global[user_name].played)){
            widget_obj.find(".uc_played").removeClass("emo_up emo_down").addClass("emo_up").data("tooltip","Сейчас играет").attr('data-tooltip',"Сейчас играет");
            tooltipHandler();
        }
        else {
            widget_obj.find(".uc_played").removeClass("emo_up emo_down").addClass("emo_down").data("tooltip","Сейчас не играет").attr('data-tooltip',"Сейчас не играет");
            tooltipHandler();
        }
        //Аватарка
        if(Global[user_name].img_min){
            widget_obj.find(".user_card_photo").css({"backgroundImage":'url("/photo/'+Global[user_name].img_min+'")'});
        }
        //StatusCode
        if(Global[user_name].status_code){
            widget_obj.find(".uc_status_code").html('<i class="fa '+Global[user_name].status_code+'" aria-hidden="true"></i>');
        }
        //emo
        if(Global[user_name].emotion){
            widget_obj.find(".emo_n").text(Global[user_name].tendention);
            if(Global[user_name].tendention>0){
                widget_obj.find(".glyphicon-triangle-top").addClass("emo_up");
                widget_obj.find(".glyphicon-triangle-bottom").removeClass("emo_down");
            }else {
                widget_obj.find(".glyphicon-triangle-top").removeClass("emo_up");
                widget_obj.find(".glyphicon-triangle-bottom").addClass("emo_down");
            }
        }
        /*trends
        if(Global[user_name].trend){
            Global.trend.series[0].setData(Global[user_name].trend);
        }*/
        
    }
    //Global.trend.series[0].setData(Global.ssv.trend);    
}

function refreshUC(user) {
    //trends
    Global.trend.series[0].setData(Global[user].trend);
    //Left SIDE
    if(Number(Global[user].online)){
        $(".label-online").removeClass("label-disabled");
    }else {
        $(".label-online").addClass("label-disabled");
    }
    $(".uc_login").text(Global[user].login);
    $(".uc_name").text(Global[user].name);
    $(".uc_title").text(Global[user].title);
    if(Number(Global[user].played)){
        $(".label-played").removeClass("label-disabled");
    }else {
        $(".label-played").addClass("label-disabled");
    }
    if(Number(Global[user].r_code)){
        $(".label-rc").removeClass("label-disabled");
    }else {
        $(".label-rc").addClass("label-disabled");
    }
    if(Number(Global[user].o_code)){
        $(".label-oc").removeClass("label-disabled");
    }else {
        $(".label-oc").addClass("label-disabled");
    }
    //Right SIDE
    if(Global[user].status_code){
        $(".uc_weather_icon").html('<i class="fa '+Global[user].status_code+' fa-5x"></i>');
    }else {
        $(".uc_weather_icon").html('<i class="fa fa-terminal fa-5x"></i>');
    }
    if(Global[user].status_msg){
        $(".weather_title").text(Global[user].status_msg);
    }else {
        $(".weather_title").text("Не определено");
    }
    if(Number(Global[user].danger)){
        $(".weather-label-dng").html('<i class="label label-danger">опасно</i>');
    }else {
        $(".weather-label-dng").html('<i class="label label-success">не опасно</i>');
    }
    if(Global[user].danger){
        $(".weather_time_val").text(Global[user].upd);
    }else {
        $(".weather_time_val").text(Global[user].upd);
    }
    if(Global[user].emotion){
        $(".emo_val").text(Global[user].emotion);
    }else {
        $(".emo_val").text("---");
    }
    if(Global[user].tendention){
        if(Global[user].tendention>=0){
            $(".emo_val_tend").html('<div class="glyphicon glyphicon-triangle-top emo_up"></div> +'+Global[user].tendention);
        }
        else {
            $(".emo_val_tend").html('<div class="glyphicon glyphicon-triangle-bottom emo_down"></div> '+Global[user].tendention);
        }
    
    }else {
        $(".emo_val_tend").text("---");
    }
    if(Global[user].img_big){
        $(".uc_photo").css({"backgroundImage":'url("/photo/'+Global[user].img_big+'")'});
    }else {
        $(".uc_photo").css({"backgroundImage":'url("/style/nophoto.png")'});
    }
    
}