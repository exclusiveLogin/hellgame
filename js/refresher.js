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
    }
}