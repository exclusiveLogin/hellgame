Global = {
    trend_temp:[],
    trend_humidity:[],
    trend_rain:[],
    trend_pressure:[],
    z_plane:{},   
    forecast:{},
    f_more_min:true,
    emer:{
        state:false,
        color:"",
        msg:"",
        users:[],
        user_msg:[]
    },
    loggedAs:"",		windcore_con:false,
    opened:false,
    users:[],
    blank:{
        danger:false,
        status_msg:"не определено",
        //flags:[],
        //trend:{},
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
        img_min:""
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

