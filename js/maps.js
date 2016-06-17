var domobj;
var domobjjq;
var map;
var marker;

$(document).ready(function () {
    domobj = document.getElementById('usermap');
    domobjjq = $("#usermap");
    InitMap();
});

function InitMap() {
    map = new google.maps.Map(domobjjq[0], {
        center: {lat: 53.167097, lng: 48.477003},
        zoom: 15        
    });
    //animation = new google.map.Animation.DROP;
    marker = new google.maps.Marker({
        map:map,
        position:{lat: 53.167097, lng: 48.477003},
        title:"Вас засекли здесь",
        animation:google.maps.Animation.DROP
    });
}
