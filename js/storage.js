/**
 * Created by SavinSV on 20.07.16.
 */


function checkLastLogin() {
    var tmp_user = "";
    if(tmp_user = localStorage.getItem("username")){
        if(tmp_user != "once"){
            userEnter(tmp_user);
            con.addstr("Вы вошли как "+tmp_user);
            //con.work();
        }
        else {
            con.addstr("Вы зашли как гость");
            //con.work();
        }
        con.work();
    }
}
function addUserToLocalStorage(user){
    if(user){
        localStorage.setItem("username",user);
    }
}
function deleteUserFromLocalStorage(){
    localStorage.setItem("username","once");
}
//con.addstr("storage.js подключен");
//con.work();