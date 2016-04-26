function refreshAuth(){
    if(Global.authkey){//************************Авторизован****************
        $.ajax({
            url:"/components/menuadmin.html",
            mode:"html",
            success:function(menu){
                $('#menu').html(menu);
            },
            complete:function(){
            },
            error:function(){
                alert("error to load menuadmin ajax");
            }
        });
        $.ajax({
            url:"/components/menupdaadmin.html",
            mode:"html",
            success:function(menupda){
                $('#menupda').html(menupda);
            },
            complete:function(){

            },
            error:function(){
                alert("error to load menuadmin ajax");
            }
        });
        $.ajax({
            url:"/components/admintools.html",
            mode:"html",
            success:function(at){
                $('#admintools').html(at);
            },
            complete:function(){
                $('#admintools').on('click','#btn_addmc',function(){
                    $('#addmc').show(500)
                });
            },
            error:function(){
                alert("error to load menuadmin ajax");
            }
        });
        $.ajax({
            url:"/components/cardfooteradmin.html",
            mode:"html",
            success:function(cf){
                renderCardFooter(cf);
            },
            complete:function(){
            },
            error:function(){
                alert("error to load cardfooteradmin ajax");
            }
        });
        $.ajax({
            url:"/components/addmc.html",
            mode:"html",
            success:function(addmc){
                $('#addmc').html(addmc);
            },
            complete:function(){
                $('#addmc').off('click');
                $('#addmc').on('click','#mc_btncancel',function(){
                    $('#addmc').hide(500);
                });
                $('#addmc').on('click','#mc_btnsub',function(){
                    checkFormAddmc();
                    addmcformToggle(0);
                });
                $('#mc_temp').slider({
                    range:true,
                    min:-30,
                    max:50,
                    values:[1,15],
                    slide:function(event,ui){
                        $('#mc_temp_val').val("От "+ui.values[0]+" до "+ui.values[1]+" градусов Цельсия");
                    },
                    create:function(){
                        $('#mc_temp_val').val("Установите температуру");
                    }
                });
                $('#mc_wind_speed').slider({
                    range:true,
                    min:0,
                    max:150,
                    values:[0,15],
                    slide:function(event,ui){
                        $('#mc_wind_speed_val').val("От "+ui.values[0]+" до "+ui.values[1]+" километров в час");
                    },
                    create:function(){
                        $('#mc_wind_speed_val').val("Установите скорость ветра");
                    }
                });
                $('#mc_speed').slider({
                    range:false,
                    min:0,
                    max:15000,
                    value:100,
                    slide:function(event,ui){
                        $('#mc_speed_val').val("Скорость:"+ui.value+" м/ч.");
                    },
                    create:function(){
                        $('#mc_speed_val').val("Установите скорость");
                    }
                });
                $('#mc_distance').slider({
                    range:false,
                    min:1,
                    max:500,
                    value:15,
                    slide:function(event,ui){
                        $('#mc_distance_val').val("Расстояние:"+ui.value+" км.");
                    },
                    create:function(){
                        $('#mc_distance_val').val("Установите расстояние");
                    }
                });
                $('#mc_respawn').slider({
                    range:false,
                    min:0,
                    max:8760,
                    value:0,
                    slide:function(event,ui){
                        $('#mc_respawn_val').val("Воскр. через:"+ui.value+" час.");
                    },
                    create:function(){
                        $('#mc_respawn_val').val("Установите время воскр.");
                    }
                });
                $('#mc_livetime').slider({
                    range:false,
                    min:1,
                    max:72,
                    value:1,
                    slide:function(event,ui){
                        $('#mc_livetime_val').val("Живет:"+ui.value+" час.");
                    },
                    create:function(){
                        $('#mc_livetime_val').val("Установите время жизни.");
                    }
                });
                $('#mc_direction').slider({
                    range:false,
                    min:1,
                    max:360,
                    value:1,
                    slide:function(event,ui){
                        $('#mc_direction_val').val("Цель на:"+ui.value+" градусов.");
                    },
                    create:function(){
                        $('#mc_direction_val').val("Установите направление.");
                    }
                });
            },
            error:function(){
                alert("error to load addmc ajax");
            }
        });
        setHandlers();
    }
    else{//************************Гость****************
        $.ajax({
            url:"/components/menu.html",
            mode:"html",
            success:function(menu){
                $('#menu').html(menu);
            },
            complete:function(){
                setHandlers();
            },
            error:function(){
                alert("error to load menu ajax");
            }
        });
        $.ajax({
            url:"/components/menupda.html",
            mode:"html",
            success:function(menupda){
                $('#menupda').html(menupda);
            },
            complete:function(){
                setHandlers();
            },
            error:function(){
                alert("error to load menuadmin ajax");
            }
        });
        $.ajax({
            url:"/components/cardfooter.html",
            mode:"html",
            success:function(cf){
                renderCardFooter(cf);
            },
            error:function(){
                alert("error to load cardfooter ajax");
            }
        });
        $('#addmc').html('').hide(500);
        $('#admintools').html('').hide(500);

    }
}
function renderCardFooter(cf){
    $('.cardmanage').each(function(){
        $(this).html(cf);
    });
    $('.btn_deletemc').on('click', function () {
        var id = $(this).parentsUntil('','.monster').attr('id').substr(9);
        var quest = confirm("Вы уверены что хотите удалить монстра из базы?(Это вас не спасет)");
        if(quest){deletemc(id);}
    });
}
function setHandlers(){
    $('.btnadmintools').on('click',function(){
        $(this).addClass('disabled active');
        $('#admintools').show(500);
    });
    $('.btnadmintoolscl').on('click',function(){
        $('.btnadmintools').removeClass('disabled active');
        $('#admintools').hide(500);
    });
    $('.btnlogin').on('click',function(){
        $(this).addClass('disabled active');
        $('#loginform').show(500);
    });
    $('.btnlogincl').on('click',function(){
        $('.btnlogin').removeClass('disabled active');
        $('#loginform').hide(500);
    });
}
function loginToggle(state){
    if(state){
        $(this).addClass('disabled active');
        $('#loginform').show(500);
    }
    else{
        $('.btnlogin').removeClass('disabled active');
        $('#loginform').hide(500);
    }
}
function addmcformToggle(state){
    if(state){
        $("#addmc").show(500);
    }
    else{
        $("#addmc").hide(500);
    }
}