/**
 * Created by SavinSV on 07.07.16.
 */
$(document).ready(function () {
    if(location.hash == "#meteo"){
        if(Global.pr_WC){
            Global.pr_WC.then(function () {
                wcToggle(true);
            })
        }else {
            
        }
        
    }
});
con.addstr("router.js подключен");
con.work();