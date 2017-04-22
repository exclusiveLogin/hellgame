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


        this.addMonsterHG = function(){

        };
        this.removeMosterHG  = function () {

        };
    }

}