class HGMap{
    constructor(id){
        if(id){
            var idDOM = $("#"+id)[0];
        }else {
            throw new Error("Нет ID");
        }

        //HG Map
        this.HGmapObj = new google.maps.Map(idDOM, {
            center: {lat: 53.167097, lng: 48.477003},
            zoom:13
        });

        this.markerHome = new google.maps.Marker({
            map:this.HGmapObj,
            position:{lat: 53.167097, lng: 48.477003},
            title:"Вас засекли здесь",
            animation:google.maps.Animation.DROP,
            visible:false
        });

        let sizeIcon = new google.maps.Size(32,32);
        let iconSSV = {
            url:"/photo/ssv_min.jpg",
            scaledSize:sizeIcon
        };
        let iconMSN = {
            url:"/photo/msn_min.jpg",
            scaledSize:sizeIcon
        };

        this.citadelSV = new google.maps.Marker({
            map:this.HGmapObj,
            position:{lat: 53.168090, lng: 48.469405},
            title:"Цитадель SSV",
            animation:google.maps.Animation.DROP,
            visible:true,
            icon:iconSSV
        });

        this.citadelMS = new google.maps.Marker({
            map:this.HGmapObj,
            position:{lat: 53.155740, lng: 48.479233},
            title:"Цитадель MSN",
            animation:google.maps.Animation.DROP,
            visible:true,
            icon:iconMSN
        });


        this.addMonsterHG = function(lat,lng,name){
            let monsterMarker = new google.maps.Marker({
                map:this.HGmapObj,
                position:{lat: Number(lat), lng: Number(lng)},
                title:name,
                animation:google.maps.Animation.DROP,
                visible:true,
                label:"M"
            });
            monsterMarker.addListener("click",function (e) {
                this.setLabel(this.title);
                console.log("title:",this.title);
                console.log("label:",this.label);
                var context = this;
                setTimeout(function(){
                    context.setLabel("M");
                },5000);
            });
            this.monsterMarkers.push(monsterMarker);

        };
        this.removeMosterHG  = function () {

        };
        this.resetMonsters = function(){
            this.monsterMarkers.forEach(function (elem) {
                elem.setMap(null);
            });
            this.monsterMarkers = [];
        };
        this.monsterMarkers = [];

    }

}