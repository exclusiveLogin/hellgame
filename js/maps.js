Global.hgmapsrc.domobjjq;
Global.hgmapsrc.uc_map;
Global.hgmapsrc.uc_marker;
Global.hgmapsrc.uc_circleAccuracy;

//con.addstr("maps.js подключен");
//con.work();

$(document).ready(function () {
    Global.hgmapsrc.domobjjq = $("#usermap");
	Global.HgMap = new HGMap("hgmapcontainer");

    Global.HgMap.HGmapObj.addListener("rightclick",function(e){
        console.log("click on HGmap",e);
        Global.hgmapsrc.newMonsterLat = e.latLng.lat();
        Global.hgmapsrc.newMonsterLng = e.latLng.lng();
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        $("#addmcLat").text(e.latLng.lat());
        $("#addmcLng").text(e.latLng.lng());
        Global.HgMap.markerHome.setPosition(e.latLng);
        Global.HgMap.markerHome.setVisible(true);
        if(Global.hgmapsrc.newMonsterLat && Global.hgmapsrc.newMonsterLng && !Global.hgmapsrc.openedCreatePlane){
            Global.hgmapsrc.openedCreatePlane = true;
            $(".btn_addmonsterHgmap").removeClass("hidden");
            $(".addmclabel").addClass("ok");
        }
    });

    InitMap();
});

function InitMap() {
    //con.addstr("Система геопозиционирования активирована");
    //con.work();
    Global.hgmapsrc.uc_map = new google.maps.Map(Global.hgmapsrc.domobjjq[0], {
        center: {lat: 53.167097, lng: 48.477003},
        zoom: 15        
    });
    //animation = new google.map.Animation.DROP;
    Global.hgmapsrc.uc_marker = new google.maps.Marker({
        map:Global.hgmapsrc.uc_map,
        position:{lat: 53.167097, lng: 48.477003},
        title:"Вас засекли здесь",
        animation:google.maps.Animation.DROP
    });
    Global.hgmapsrc.uc_circleAccuracy = new google.maps.Circle({
        map:Global.hgmapsrc.uc_map,
        center:{lat: 53.167097, lng: 48.477003},
        radius:30000,
        fillColor:"#009999",
        fillOpacity:0.2,
        strokeColor:"#004444",
        strokeOpacity:0.3,
        strokeWeight:2
    });
}
