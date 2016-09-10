Global = {
    swready:false,
    notifyallow:false,
    georefresh:true,
    private_data:{
        user:"",
        ip:"",
        user_agent:"",
        geo:{
            lon:0,
            lat:0,
            accuracy:30000,
            alt:0,
            status:false,
            nav:false
        },
        ipinfo:{},
        token:0,
        sended:false
    },
    private_complete:false,
    trend_temp:[],
    trend_humidity:[],
    trend_rain:[],
    trend_pressure:[],
    trend_windrose:[],
    trend_windrose_obj:[],
    trend_windobj:{},
    trend_wind_dir:[],
    trend_wind_real:[],
    trend_wind_current:[],
    trend_wind_dataok:false,
    z_plane:{},   
    forecast:{},
    f_more_min:true,
    windrose_show:false,
    windanalytics_show:false,
    emer:{
        state:false,
        color:"",
        msg:"",
        users:[],
        user_msg:[]
    },
    loggedAs:"",		
    windcore_con:false,
    opened:false,
    users:[],
    blank:{
        refresh:true,//now is unused value
        danger:false,
        status_msg:"не определено",
        name:"",
        title:"",
        login:"",
        id:"",
        email:"",
        o_code:false,
        r_code:false,
        played:false,
        online:false,
        emotion:0,
        status_code:"fa-refresh",//придумать иконку на недоступную эмоцию
        upd:"не получено",
        upd_status:"не получено",
        code_msg:"",
        oldEmotion:0,
        tendention:0,
        img_big:"",
        img_min:"",
        privatedata:{
            oldLat:0,
            oldLon:0,
            lat:0,
            lon:0,
            ip:"",
            user_agent:"",
            accuracy:0,
            alt:0,
            datetime:"",
            region:"",
            city:"",
            provider:""
        }
    }
};

Global.z_plane["wind"]=888;
Global.z_plane["temp0"]=888;
Global.z_plane["temp15"]=888;
Global.z_plane["temp60"]=888;
Global.z_plane["tempavg"]=888;
Global.z_plane["wind_p"]=888;
Global.z_plane["windavg"]=888;
Global.z_plane["upd"]="---";

