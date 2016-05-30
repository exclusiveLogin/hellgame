function RefreshColor(){
    if(Global.z_plane.windavg > 0 && Global.z_plane.windavg < 10){
        $('#wh_wind_led').removeClass();
        $('#wh_wind_led').addClass('h_led led_green');
    }
    if(Global.z_plane.windavg > 5 && Global.z_plane.windavg < 10){
        $('#wh_wind_led').removeClass();
        $('#wh_wind_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.windavg > 10 && Global.z_plane.windavg < 15){
        $('#wh_wind_led').removeClass();
        $('#wh_wind_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.windavg > 15){
        $('#wh_wind_led').removeClass();
        $('#wh_wind_led').addClass('h_led led_red');
    }



    if(Global.z_plane.temp0 < -10){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.temp0 >= -10 && Global.z_plane.temp0 < 0){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.temp0 >= 0 && Global.z_plane.temp0 < 10){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_green');
    }
    if(Global.z_plane.temp0 >= 10 && Global.z_plane.temp0 < 20){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.temp0 >= 20 && Global.z_plane.temp0 < 30){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.temp0 >= 30){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_red');
    }


    if(Global.z_plane.temp15 < -10){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.temp15 >= -10 && Global.z_plane.temp15 < 0){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.temp15 >=0 && Global.z_plane.temp15 < 10){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_green');
    }
    if(Global.z_plane.temp15 >= 10 && Global.z_plane.temp15 < 20){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.temp15 >= 20 && Global.z_plane.temp15 < 30){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.temp15 >= 30){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_red');
    }

    if(Global.z_plane.temp60 <= -10){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.temp60 >= -10 && Global.z_plane.temp60 < 0){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.temp60 >= 0 && Global.z_plane.temp60 < 10){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_green');
    }
    if(Global.z_plane.temp60 >= 10 && Global.z_plane.temp60 < 20){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.temp60 >= 20 && Global.z_plane.temp60 < 30){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.temp60 >= 30){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_red');
    }

    if(Global.z_plane.tempavg < -10){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.tempavg >= -10 && Global.z_plane.tempavg < 0){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.tempavg >= 0 && Global.z_plane.tempavg < 10){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_green');
    }
    if(Global.z_plane.tempavg >= 10 && Global.z_plane.tempavg < 20){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.tempavg >= 20 && Global.z_plane.tempavg < 30){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.tempavg >= 30){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_red');
    }
}
