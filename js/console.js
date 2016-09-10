HGConsole = function(){
    this.HGconsoleObj = {};
    this.Stack = [];
    this.buffer = [];

    this.initiate = function (id) {
        if(id){
            this.HGconsoleObj=$("#"+id);
        }
    };
    this.addstr = function (str) {
        this.Stack.push(str);
    };
    this.work = function () {
        if(this.Stack.length && this.HGconsoleObj){
            for(var indexStr = 0; indexStr<this.Stack.length;indexStr++) {
                for (var indexLetter = 0; indexLetter<this.Stack[indexStr].length;indexLetter++) {
                    this.buffer.push(this.Stack[indexStr][indexLetter]);
                }
                this.buffer.push("<br>");
            }
            this.Stack = [];
        }
        else {
            console.log("HG object init error OR Stack is empty");
        }
    };
    this.scheduller = function () {
        if(this.buffer.length){
            var wrp = this.printLetter.bind(this);
            setTimeout(function () {//запускаем обертку
                wrp();
            },50);
        }
    }
    this.printLetter = function (letter) {
        if(this.buffer.length && this.HGconsoleObj){
            this.openconsole();
            this.HGconsoleObj.append(this.buffer.shift());//изымаем элемент
            if(this.buffer.length){
                this.scheduller();
            }else {
                console.log("вывод console завершен");
                var wrp = this.closeconsole.bind(this);
                setTimeout(wrp,2000);
            }
        }else {
            console.log("вывод console завершился ошибкой");
        }
    };

    this.openconsole = function () {
        this.HGconsoleObj.removeClass("hideconsole");
    };
    this.closeconsole = function () {
        this.HGconsoleObj.addClass("hideconsole");
    };
    this.clearconsole = function () {
        this.HGconsoleObj.html("");
    }
};
con = new HGConsole();
$(document).ready(function () {
    con.initiate("console");
    con.scheduller();
});
