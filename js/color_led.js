function RefreshColor(){
    if(Global.z_plane.humidity>40 && Global.z_plane.humidity<60){
        $('#wh_humidity_led').removeClass();
        $('#wh_humidity_led').addClass('h_led led_green');
    }
    else if(Global.z_plane.humidity>30 && Global.z_plane.humidity<70){
        $('#wh_humidity_led').removeClass();
        $('#wh_humidity_led').addClass('h_led led_yellow');
    }else{
		$('#wh_humidity_led').removeClass();
        $('#wh_humidity_led').addClass('h_led led_red');
    }
    if(Global.z_plane.pressure>755 && Global.z_plane.pressure<765){
        $('#wh_pressure_led').removeClass();
        $('#wh_pressure_led').addClass('h_led led_green');
    }else if(Global.z_plane.pressure>740 && Global.z_plane.pressure<780){
        $('#wh_pressure_led').removeClass();
        $('#wh_pressure_led').addClass('h_led led_yellow');
    }else{
        $('#wh_pressure_led').removeClass();
        $('#wh_pressure_led').addClass('h_led led_red');
    }
    if(Global.z_plane.temp0<-10){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.temp0>=-10&&Global.z_plane.temp0<0){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.temp0>=0&&Global.z_plane.temp0<10){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_green');
    }
    if(Global.z_plane.temp0>=10&&Global.z_plane.temp0<20){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.temp0>=20&&Global.z_plane.temp0<30){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.temp0>=30){
        $('#wh_temp0_led').removeClass();
        $('#wh_temp0_led').addClass('h_led led_red');
    }


    if(Global.z_plane.temp15<-10){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.temp15>=-10 && Global.z_plane.temp15<0){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.temp15>=0 && Global.z_plane.temp15<10){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_green');
    }
    if(Global.z_plane.temp15>=10&&Global.z_plane.temp15<20){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.temp15>=20&&Global.z_plane.temp15<30){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.temp15>=30){
        $('#wh_temp15_led').removeClass();
        $('#wh_temp15_led').addClass('h_led led_red');
    }

    if(Global.z_plane.temp60<=-10){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.temp60>=-10&&Global.z_plane.temp60<0){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.temp60>=0&&Global.z_plane.temp60<10){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_green');
    }
    if(Global.z_plane.temp60>=10&&Global.z_plane.temp60<20){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.temp60>=20&&Global.z_plane.temp60<30){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.temp60>=30){
        $('#wh_temp60_led').removeClass();
        $('#wh_temp60_led').addClass('h_led led_red');
    }

    if(Global.z_plane.tempavg<-10){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_blue');
    }
    if(Global.z_plane.tempavg>=-10&&Global.z_plane.tempavg<0){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_cyan');
    }
    if(Global.z_plane.tempavg>=0&&Global.z_plane.tempavg<10){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_green');
    }
    if(Global.z_plane.tempavg>=10&&Global.z_plane.tempavg<20){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_yellow');
    }
    if(Global.z_plane.tempavg>=20&&Global.z_plane.tempavg<30){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_orange');
    }
    if(Global.z_plane.tempavg>=30){
        $('#wh_tempavg_led').removeClass();
        $('#wh_tempavg_led').addClass('h_led led_red');
    }
}