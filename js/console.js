HGConsole = {
    HGconsoleObj:{},
    Stack:[],
    initiate:function (id) {
        if(id){
            this.HGconsoleObj=$("#"+id);
        }
    },    
    addstr:function (str) {
        this.Stack.push(str);
    },
    work:function () {
        if(this.Stack.length){
            
        }
        else {
            
        }
    },
    render:{
        openconsole:function () {
            
        },
        closeconsole:function () {
            
        },
        clearconsole:function () {
            
        },
        printstr:function () {
            
        }
    }
};

