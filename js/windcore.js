//обработка направления ветра используется для вывода строки либо коспаса.
Global.windcore_con = true;
function windparser(deg){
	var wind = {
		wind_direction_deg : Math.round(deg),
		wind_direction_str_en : "NA",
		wind_direction_str_ru : "NA",
	};
	if(deg>0 && deg<11.25){//0
		wind.wind_direction_str_en = "N";
		wind.wind_direction_str_ru = "С";
	}
	else if(deg>11.25 && deg<33.75){
		wind.wind_direction_str_en = "NNE";
		wind.wind_direction_str_ru = "ССВ";
	}
	else if(deg>33.75 && deg<56.25){//45
		wind.wind_direction_str_en = "NE";
		wind.wind_direction_str_ru = "СВ";
	}
	else if(deg>56.25 && deg<78.75){
		wind.wind_direction_str_en = "ENE";
		wind.wind_direction_str_ru = "ВСВ";
	}
	else if(deg>78.75 && deg<101.25){//90
		wind.wind_direction_str_en = "E";
		wind.wind_direction_str_ru = "В";
	}
	else if(deg>101.25 && deg<123.75){
		wind.wind_direction_str_en = "ESE";
		wind.wind_direction_str_ru = "ВЮВ";
	}
	else if(deg>123.75 && deg<146.25){//135
		wind.wind_direction_str_en = "SE";
		wind.wind_direction_str_ru = "ЮВ";
	}
	else if(deg>146.25 && deg<168.75){
		wind.wind_direction_str_en = "SSE";
		wind.wind_direction_str_ru = "ЮЮВ";
	}
	else if(deg>168.75 && deg<191.25){//180
		wind.wind_direction_str_en = "S";
		wind.wind_direction_str_ru = "Ю";
	}
	else if(deg>191.25 && deg<213.75){
		wind.wind_direction_str_en = "SSW";
		wind.wind_direction_str_ru = "ЮЮЗ";
	}
	else if(deg>213.75 && deg<236.25){//225
		wind.wind_direction_str_en = "SW";
		wind.wind_direction_str_ru = "ЮЗ";
	}
	else if(deg>236.25 && deg<258.75){
		wind.wind_direction_str_en = "WSW";
		wind.wind_direction_str_ru = "ЗЮЗ";
	}
	else if(deg>258.75 && deg<281.25){//270
		wind.wind_direction_str_en = "W";
		wind.wind_direction_str_ru = "З";
	}
	else if(deg>281.25 && deg<303.75){
		wind.wind_direction_str_en = "WWN";
		wind.wind_direction_str_ru = "ЗЗС";
	}
	else if(deg>303.75 && deg<326.25){//315
		wind.wind_direction_str_en = "NW";
		wind.wind_direction_str_ru = "СЗ";
	}
	else if(deg>326.25 && deg<348.75){
		wind.wind_direction_str_en = "NNW";
		wind.wind_direction_str_ru = "ССВ";
	}
	else if(deg>348.75 && deg<360){//360
		wind.wind_direction_str_en = "N";
		wind.wind_direction_str_ru = "С";
	}
	else{
		wind.wind_direction_str_en = "ERR";
		wind.wind_direction_str_ru = "ERR";
	}
	
	return wind;
}
con.addstr("windcore.js подключен");
con.work();