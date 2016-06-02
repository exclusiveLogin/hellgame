$(document).ready(function () {
    refresh_weather();
    refresh_z_plane();
    setInterval(refresh_weather,120000);
    setInterval(refresh_z_plane,30000);
});

function w_code2img(weather_code) {
    var weather_c = (weather_code/100)-((weather_code/100)%1);
    var path_code_img = "/weather/codes/";
    var ret = {
        img:{},
        dng:false,
        warn:false
    };
    switch (weather_c){
        case 2:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w200.png")'
            };
            ret.dng = true;
            ret.warn = false;
            break;
        case 3:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w300.png")'
            };
            ret.dng = true;
            ret.warn = false;
            break;

        case 5:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w500.png")'
            };
            ret.dng = false;
            ret.warn = true;
            break;
        case 6:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w600.png")'
            };
            ret.dng = true;
            ret.warn = false;
            break;
        case 7:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w700.png")'
            };
            ret.dng = true;
            ret.warn = false;
            break;
        case 8:
            if(weather_code==800){
                ret.img = {
                    'backgroundImage':'url("'+path_code_img+'w800.png")'
                };
            }
            else if(weather_code>800&&weather_code<803){
                ret.img = {
                    'backgroundImage':'url("'+path_code_img+'w801.png")'
                };
            }
            else if(weather_code==803){
                ret.img = {
                    'backgroundImage':'url("'+path_code_img+'w803.png")'
                };
            }
            else{
                ret.img = {
                    'backgroundImage':'url("'+path_code_img+'w804.png")'
                };
            }
            ret.dng = false;
            break;
        case 9:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w900.png")'
            };
            ret.dng = true;
            break;
        default:
            ret.img = {
                'backgroundImage':'url("'+path_code_img+'w1000.png")'
            };
            ret.dng = false;
            ret.warn = true;
            break;
    }
    return ret;
}
function refresh_weather() {
    $.ajax({
        url:"/weathercore.php",
        dataType:"json",
        success:function (data) {
            if(data.weather.cod == 200){
                //console.log("compare:"+data.compare);
                var icon = {
                    code:data.weather.weather[0].icon,
                    url:"http://openweathermap.org/img/w/",
                    desc:data.weather.weather[0].description
                };
                var weather_data = {
                    temp_main_val:data.weather.main.temp.toFixed(1),
                    temp_min_val:data.weather.main.temp_min.toFixed(1),
                    temp_max_val:data.weather.main.temp_max.toFixed(1),
                    sun_up:data.weather.sys.sunrise*1000,
                    sun_down:data.weather.sys.sunset*1000,
                    humidity:data.weather.main.humidity,
                    wind_force:data.weather.wind.speed,
                    wind_direction:data.weather.wind.deg,
                    pressure:Math.round(data.weather.main.pressure*0.75006375541921),
                    upd:data.weather.dt*1000,
                    clouds:data.weather.clouds.all
                };
                //console.log("compare:"+data.compare);
                var widget = $("#widget_weather");
                var wc = $("#weather_card");
                widget.hover(
                    function () {
                        $(this).find(".code_msg").stop().show(500);
                    },
                    function () {
                        $(this).find(".code_msg").stop().hide(500);
                    });
                widget.click(function () {
                    $("#weather_card").show(500,function(){
                        Global.trend_forecast.reflow();
                    });
                });
                widget.find(".weather_icon").css({
                    'backgroundImage':'url("'+icon.url+icon.code+'.png")'
                });
                widget.find(".code_msg").text(icon.desc).delay(1000).hide(1000);

                //Высчисляем код погоды
                var weather_code = data.weather.weather[0].id;
                var weather_icon_obj = w_code2img(weather_code);
                wc.find(".wc_weather_icon").css(weather_icon_obj.img);
                (weather_icon_obj.dng)?wc.find(".wc_weather_dng").show(500):wc.find(".wc_weather_dng").hide(500);

                wc.find(".wc_weather_desc").text(icon.desc);

                wc.find(".wc_main_temp").html(weather_data.temp_main_val+" C&deg;");

                wc.find(".wc_temp_min_val").html(weather_data.temp_min_val+" C&deg;");
                wc.find(".wc_temp_max_val").html(weather_data.temp_max_val+" C&deg;");
                var tmp_css_rotate = {
                    "transform":"rotate("+weather_data.wind_direction+"deg)"
                };
                wc.find(".wc_wind_dir").css(tmp_css_rotate);

                //парсинг даты и времени
                var sunrise_daytime = {
                    utc:{},
                    hour:0,
                    minutes:0,
                    seconds:0
                };
                var sunset_daytime = {
                    utc:{},
                    hour:0,
                    minutes:0,
                    seconds:0
                };
                var updated = {
                    utc:{},
                    hour:0,
                    minutes:0,
                    seconds:0,
                    year:0,
                    month:0,
                    date:0
                };
                sunrise_daytime.utc = new Date(Number(weather_data.sun_up));
                sunset_daytime.utc = new Date(Number(weather_data.sun_down));
                updated.utc = new Date(Number(weather_data.upd));

                sunrise_daytime.hour = sunrise_daytime.utc.getHours();
                sunrise_daytime.minutes = sunrise_daytime.utc.getMinutes();
                sunrise_daytime.seconds = sunrise_daytime.utc.getSeconds();

                if(sunrise_daytime.hour<10){
                    sunrise_daytime.hour="0"+sunrise_daytime.hour;
                }

                if(sunrise_daytime.minutes<10){
                    sunrise_daytime.minutes="0"+sunrise_daytime.minutes;
                }

                if(sunrise_daytime.seconds<10){
                    sunrise_daytime.seconds = "0"+sunrise_daytime.seconds;
                }

                sunset_daytime.hour = sunset_daytime.utc.getHours();
                sunset_daytime.minutes = sunset_daytime.utc.getMinutes();
                sunset_daytime.seconds = sunset_daytime.utc.getSeconds();


                if(sunset_daytime.hour<10){
                    sunset_daytime.hour="0"+sunset_daytime.hour;
                }

                if(sunset_daytime.minutes<10){
                    sunset_daytime.minutes="0"+sunset_daytime.minutes;
                }

                if(sunset_daytime.seconds<10){
                    sunset_daytime.seconds = "0"+sunset_daytime.seconds;
                }

                updated.hour = updated.utc.getHours();
                if(updated.hour<10){
                    updated.hour="0"+updated.hour;
                }
                updated.minutes = updated.utc.getMinutes();
                if(updated.minutes<10){
                    updated.minutes="0"+updated.minutes;
                }
                updated.seconds = updated.utc.getSeconds();
                if(updated.seconds<10){
                    updated.seconds = "0"+updated.seconds;
                }
                updated.year = updated.utc.getFullYear();
                updated.month = updated.utc.getMonth()+1;
                if(updated.month<10){
                    updated.month = "0"+updated.month;
                }
                updated.date = updated.utc.getDate();

                wc.find(".wc_upd").text("обновлено "+updated.date+"."+updated.month+"."+updated.year+" в "+updated.hour+":"+updated.minutes+":"+updated.seconds);

                wc.find(".wc_sun_up_val").text(sunrise_daytime.hour+":"+sunrise_daytime.minutes+":"+sunrise_daytime.seconds);
                wc.find(".wc_sun_down_val").text(sunset_daytime.hour+":"+sunset_daytime.minutes+":"+sunset_daytime.seconds);


                wc.find(".wc_drop_val").text(weather_data.humidity+" %");
                wc.find(".wc_wind_val").text(weather_data.wind_force+" м/с");
                wc.find(".wc_baro_val").text(weather_data.pressure+" мм.рт.ст");
                wc.find(".wc_clouds_val").text(weather_data.clouds+" %");


                var dir_temp = {
                    wind_direction_deg : "",
                    wind_direction_str_en : "",
                    wind_direction_str_ru : ""
                };

                if(Global.windcore_con){
                    dir_temp = windparser(weather_data.wind_direction);
                    wc.find(".wc_wind_dir_val").html(dir_temp.wind_direction_deg+" &deg;"+"("+dir_temp.wind_direction_str_ru+")");
                }else wc.find(".wc_wind_dir_val").html(weather_data.wind_direction+" &deg;");

                
            }
            else {
                console.log("погода по данному запросу не найдена");
            }
            Global.forecast = data.forecast;
            if(Number(Global.forecast.cod)==200){
                Global.trend_temp = [];
                Global.trend_humidity = [];
                Global.trend_pressure = [];
                Global.trend_rain = [];
                var forecast_container = $(".forecast_container");
                var blnk;
                
                $.ajax({
                    async:false,
                    url:"/components/forecastItem_blnk.html",
                    dataType:"html",
                    success:function (blank) {
                        blnk = blank;
                    },
                    error:function () {
                        console.log("Не удалось загрузить шаблон");
                    }
                });
                forecast_container.empty();//чистим старые данные с контейнера
                for(var item in Global.forecast.list){
                    var tmp_item = {
                        temperature:0,
                        desc:"",
                        humidity:0,
                        windval:0,
                        winddir:0,
                        baro:0,
                        dt:0,
                        id:0
                    };
                    var tmp_dt = {
                        utc:{},
                        hour:0,
                        minutes:0,
                        year:0,
                        month:0,
                        date:0
                    };
                    tmp_item.temperature = Global.forecast.list[item].main.temp.toFixed(1);
                    tmp_item.desc = Global.forecast.list[item].weather[0].description;
                    tmp_item.humidity = Global.forecast.list[item].main.humidity;
                    tmp_item.windval = Global.forecast.list[item].wind.speed.toFixed(1);
                    tmp_item.winddir = Global.forecast.list[item].wind.deg.toFixed(0);
                    tmp_item.baro = Math.round(Global.forecast.list[item].main.pressure*0.75006375541921).toFixed(0);
                    tmp_item.dt = Global.forecast.list[item].dt;
                    tmp_item.id = Global.forecast.list[item].weather[0].id;
                    
                    Global.trend_temp.push([tmp_item.dt*1000,Number(tmp_item.temperature)]);
                    Global.trend_humidity.push([tmp_item.dt*1000,Number(tmp_item.humidity)]);
                    //Global.trend_rain.push([tmp_item.dt*1000,tmp_item.]);
                    Global.trend_pressure.push([tmp_item.dt*1000,tmp_item.baro]);

                    tmp_dt.utc = new Date(Number(tmp_item.dt)*1000);
                    tmp_dt.year = tmp_dt.utc.getFullYear();
                    tmp_dt.month = tmp_dt.utc.getMonth()+1;
                    tmp_dt.date = tmp_dt.utc.getDate();
                    tmp_dt.hour = tmp_dt.utc.getHours();
                    tmp_dt.minutes = tmp_dt.utc.getMinutes();
                    //fix null
                    if(tmp_dt.hour<10){
                        tmp_dt.hour="0"+tmp_dt.hour;
                    }
                    if(tmp_dt.minutes<10){
                        tmp_dt.minutes="0"+tmp_dt.minutes;
                    }
                    if(tmp_dt.seconds<10){
                        tmp_dt.seconds = "0"+tmp_dt.seconds;
                    }
                    if(tmp_dt.month<10){
                        tmp_dt.month = "0"+tmp_dt.month;
                    }
                    if(tmp_dt.date<10){
                        tmp_dt.date = "0"+tmp_dt.date;
                    }

                    
                    var obj = $(blnk).appendTo(".forecast_container");
                    //console.log("item:"+item);

                    if(Global.windcore_con){
                        dir_temp = windparser(tmp_item.winddir);
                        obj.find(".f_item_winddir_val").html(dir_temp.wind_direction_deg+" &deg;"+"("+dir_temp.wind_direction_str_ru+")");
                    }else obj.find(".f_item_winddir_val").html(tmp_item.winddir+" &deg;");

                    var tmp_icon_obj = w_code2img(tmp_item.id);
                    obj.find(".f_item_icon").css(tmp_icon_obj.img);
                    if(tmp_icon_obj.dng)obj.addClass("forecast_item_dng");
                    if(tmp_icon_obj.dng)obj.find(".f_item_header").addClass("f_item_header_dng");
                    if(tmp_icon_obj.warn)obj.addClass("forecast_item_warn");
                    if(tmp_icon_obj.warn)obj.find(".f_item_header").addClass("f_item_header_warn");

                    obj.find(".f_item_desc_val").text(tmp_item.desc);
                    obj.find(".f_item_temperature").html(tmp_item.temperature+"<span class='f_t_small'>&deg;C</span>");
                    obj.find(".f_item_humidity_val").html(tmp_item.humidity+"<small> %</small>");
                    obj.find(".f_item_wind_val").html(tmp_item.windval+"<small> м/с</small>");
                    //obj.find(".f_item_winddir_val").html(tmp_item.winddir+"<small> &deg;</small>");
                    obj.find(".f_item_baro_val").html(tmp_item.baro+"<small> мм.рт.ст</small>");
                    obj.find(".f_item_timestamp_val").html(tmp_dt.hour+":"+tmp_dt.minutes);
                    obj.find(".f_item_header").html(tmp_dt.date+"."+tmp_dt.month+"."+tmp_dt.year);

                }
                Global.trend_forecast.series[0].setData([]);
                Global.trend_forecast.series[0].setData(Global.trend_temp);
                Global.trend_forecast.series[1].setData([]);
                Global.trend_forecast.series[1].setData(Global.trend_humidity);
                //console.log("debug stop");
            }
        },
        error:function () {
            console.log("Проблема получения AJAX с погодой");
        }
    });
}
function refresh_z_plane() {
    $.ajax({//берем данные с zasyzran
        url:"/zasyzran.php",
        dataType:"json",
        success:function (data) {
            Global.z_plane.wind = Number(data.plane.widget[0].value);
            Global.z_plane.temp0 = Number(data.plane.widget[1].value);
            Global.z_plane.temp15 = Number(data.plane.widget[2].value);
            Global.z_plane.temp60 = Number(data.plane.widget[3].value);
            Global.z_plane.tempavg = Number(data.plane.avg.value);
            Global.z_plane.wind_p = Number(data.plane.widget[4].value);
            Global.z_plane.upd = data.plane.widget[5].value.substring(11);
            Global.z_plane.windavg = (Global.z_plane.wind + Global.z_plane.wind_p)/2;
        },
        error:function () {
            console.log("Проблема получения AJAX с zasyzran.ru");
        },
        complete:function(){
            refresh_widget();
            RefreshColor();
        }
    });
}
function refresh_widget(){
    var setlamp = function () {
        $('.refresh_led').addClass('refresh_led_ok');
        $('#wh_refresh_led').addClass('led_ok');
    };
    var refresh = function () {
        $('#w_wind_val, #wh_wind_val').text(Global.z_plane.windavg.toFixed(1));
        $('#w_temp1_val, #wh_temp1_val').text(Global.z_plane.temp0);
        $('#w_temp2_val, #wh_temp2_val').text(Global.z_plane.temp15);
        $('#w_temp3_val, #wh_temp3_val').text(Global.z_plane.temp60);
        $('#w_tempavg_val, #wh_tempavg_val').text(Global.z_plane.tempavg);
        $('#w_upd_val, #wh_upd_val').text(Global.z_plane.upd);

        $('.refresh_led').removeClass('refresh_led_ok');
        $('#wh_refresh_led').removeClass('led_ok');
        RefreshColor();
    };
    var start = function () {
        setlamp();        
        setTimeout(refresh,500);
    };
    start();
}