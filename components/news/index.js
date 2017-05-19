$(function () {
    setInterval(refreshNews,30000);

    $(document).on("scroll",function (e) {
        refreshNews();
    });
    $(".btnAddNews").on("click",function () {
        $(".newsAddFormEditContainer").show(500).animate({opacity:1},500);
        $(this).addClass("active");
        var dua = detect.parse(navigator.userAgent);
        //alert(dua.device.type);
        // if((dua.device.type == "Mobile") || (dua.device.type == "mobile")){
        //     $("#news .newsContainer").empty();
        //     Global.newsLast = false;
        // }
        $("#news .newsContainer").empty();
        Global.newsLast = false;
        Global.lastID = false;
        Global.topNewsId = false;
    });
    $(".btnNewsStatusShowAll").addClass("active");
    var newsStatus = "showall";
    $(".btnNewsStatus").on("click",function () {
        $(".btnNewsStatus").removeClass("active");
        $(this).addClass("active");
    });
    $(".btnNewsStatusShowAll").on("click",function () {
        newsStatus = "showall";
    });
    $(".btnNewsStatusShowAuth").on("click",function () {
        newsStatus = "showauth";
    });
    $(".btnNewsStatusFromHG").on("click",function () {
        newsStatus = "fromhg";
    });
    $(".btnNewsStatusFromHGAll").on("click",function () {
        newsStatus = "fromhgall";
    });
    $(".btnAddNewsSubmit").on("click",function () {
        //SUBMIT BTN
        if(Global.loggedAs){
            let author = Global.loggedAs;

            var title = $("#newsFormTitle").val();
            var text = $("#newsFormText").val();
            var fd = new FormData();

            if($("#newsImgFile")[0].files.length){
                var file = $("#newsImgFile")[0].files[0];
                fd.append("myFile",file);
            }
            fd.append("newsauthor",author);
            fd.append("newsadd",true);
            fd.append("newstitle",title);
            fd.append("newstext",text);
            fd.append("newsprivate",newsStatus);

            var xhr = new XMLHttpRequest();
            xhr.open("POST","components/news/newsbackend.php");

            xhr.send(fd);
            xhr.onreadystatechange = function() {
                if (this.readyState != 4) return;
                console.log("XHR RESPONSE:",this.responseText);
                refreshNews();
                if (this.responseText){
                    try {
                        let resp = JSON.parse(this.responseText);
                        if(!resp.error){
                            if(!title)title="Без названия";
                            if(resp.img){
                                createEvent("all","Пользователь "+author+" создал новость",title,"ok","components/news/"+resp.img);
                            }else {
                                createEvent("all","Пользователь "+author+" создал новость",title,"ok");
                            }
                        }else{
                            console.log("ошибка при добавлении новости:",resp.error_string);
                        }
                    }catch (e){
                        console.log("Парсинг ответа сервера при добавлении новости вернул ошибку:",e);
                    }
                }
            };
        }
        closeNewsAddForm();
    });
    $(".btnAddNewsCancel").on("click",function () {
        //Close BTN
        //var dua = detect.parse(navigator.userAgent);
        // if(dua.device.type == "Mobile" || dua.device.type == "mobile"){
        //     downloadNews();
        // }
        refreshNews();
        closeNewsAddForm();
    });
    function closeNewsAddForm() {
        $(".btnAddNews").removeClass("active");
        $(".newsAddFormEditContainer").animate({opacity:0},500,function () {
            $(this).hide(500);
            $("#newsAddImgPreview")[0].src="style/nophoto.png";
            $("#newsAddImgPreview").animate({opacity:1},500);
            $("#newsFormTitle").val("");
            $("#newsFormText").val("");
            $("#newsImgFile").val("");
            $("body").animate({scrollTop:0},1000);
        })
    }

    //Скачиваем  TPL для новости
    Global.newsTplPromise = fetch("components/news/newsItem.tpl").then(function (data) {
        if(data.status==200){
            return data.text();
        }
    });
    Global.newsTplPromise.then(function (dataResp) {
        return dataResp;
    }).catch(function (e) {
        Global.newsDownloading = false;
        console.log("fetch TPL с ошибкой");
        console.log(e);
    });
    refreshNews();//initial download news

    function refreshNews() {
        if(Global.authkey){
            downloadNews("showauth");
        }else {
            downloadNews();
        }

    }

    function downloadNews(privateSt) {
        function download(lastid) {
            var privat = false;
            if(!privateSt)privat = "showall";
            var fd = new FormData();
            if(lastid){
                fd.append("newslastid",lastid);
            }
            fd.append("newslist",true);
            fd.append("newsprivate",privat);
            fetch("components/news/newsbackend.php",{
                method:"POST",
                body:fd
            }).then(function (data) {
                if(data.status==200){
                    return data.text();
                }
            }).then(function (dataResp) {
                if(Global.newsLast != dataResp){
                    var json = [];
                    try{
                        json = JSON.parse(dataResp);
                        if(json.length){
                            if(Global.lastID){//оценка последнего ID
                                if(Number(Global.lastID) > Number(json[json.length-1].id)){
                                    Global.lastID = json[json.length-1].id;
                                }
                            }else {
                                Global.lastID = json[json.length-1].id;
                            }
                            if(lastid){
                                //когда новости скролят вниз
                                renderNews(json,true);
                            }else {
                                //когда новости сверху
                                if(Global.topNewsId){
                                    if(Global.topNewsId != json[0].id){
                                        renderNews(json);
                                        Global.lastNewsDownloaded = false;
                                        Global.topNewsId = json[0].id;
                                        Global.lastID = json[json.length-1].id;
                                    }
                                }else {
                                    renderNews(json);
                                    Global.topNewsId = json[0].id;
                                }
                            }
                        }else {
                            Global.lastNewsDownloaded = true;
                            renderNews(false,false,true);
                        }
                    }catch(e) {
                        console.log("Парсинг не удался по причине:",e);
                    }
                }
                Global.newsLast = dataResp;
                Global.newsDownloading = false;
            }).catch(function (e) {
                Global.newsDownloading = false;
                console.log("fetch с ошибкой");
                console.log(e);
            });
        }
        if($("#news")[0].getBoundingClientRect().top > 0){
            download();
            console.log("Загружен top block");
        }
        var bottomNews = $("#news")[0].getBoundingClientRect().bottom;
        var bottomScreen = document.documentElement.clientHeight;
        if(bottomNews < bottomScreen && Global.lastID){
            if(!Global.lastNewsDownloaded){
                if(!Global.newsDownloading){
                    Global.newsDownloading = true;
                    download(Global.lastID);
                }else {
                    console.log("newsDownloading");
                }
            }else {
                console.log("lastNewsDownloaded");
            }
        }else {
            console.log("Загружен контейнер полностью");
        }
    }
    $(".newsFancyLink").fancybox();
    $("#newsImgFile").on("change",function (event) {
        if(window.FileReader){
            var fr = new FileReader();
            fr.onerror = function () {
                console.log("Загрузка не удалась");
                $("#newsAddImgPreview")[0].src="style/nophoto.png";
                $("#newsAddImgPreview").animate({opacity:1},500);
            };
            fr.onabort = function () {
                console.log("Загрузка прервана");
                $("#newsAddImgPreview")[0].src="style/nophoto.png";
                $("#newsAddImgPreview").animate({opacity:1},500);
            };
            fr.onloadstart = function () {
                console.log("Загрузка началась");
                $("#newsAddImgPreview").animate({opacity:0},500);
            };
            fr.onload = function () {
                console.log("Загрузка завершена");
                $("#newsAddImgPreview")[0].src=fr.result;
                $("#newsAddImgPreview").animate({opacity:1},500);
            };
            fr.onloadend = function () {

            };
            if(event.target.files.length){
                var file = event.target.files[0];
                console.log("file:",file);
                fr.readAsDataURL(file);
            }
        }
    });
    function renderNews(news,addnews,nonews) {
        if(nonews){
            var tpl = `<div class="col-md-12">
                <div class="addNewForm form-horizontal">
                    <span class="label label-default label-lg">Новостей больше нет</span>
                </div>
            </div>`;
            $(tpl).appendTo("#newsEnd");
            return;
        }
        if(!addnews)$("#news .newsContainer").empty();
        if(!addnews)$("#newsEnd").empty();

        news.forEach(function (element,idx) {
            Global.newsTplPromise.then(function (dataResp) {
                let pr_RenderNewsQuery = new Promise(function (resolve) {
                    let NewsItemInstance = $(dataResp).appendTo("#news .newsContainer");
                    setTimeout(function(){
                        NewsItemInstance.find(".newsAuthorName").text(element.author);
                        if(Global[element.author]){
                            if(Global[element.author].img_min){
                                NewsItemInstance.find(".newsAuthorImg")[0].src="photo/"+Global[element.author].img_min;
                            }
                        }
                        NewsItemInstance.find(".newsTimeCreate").text(element.datetime);
                        if(element.img_min){
                            NewsItemInstance.find(".newsImg")[0].src="components/news/"+element.img_min;
                            NewsItemInstance.find(".newsImg")[0].onload = function () {
                                $(this).removeClass("transparent");
                                if(idx == news.length-1)resolve();
                            };
                            if(element.img){
                                NewsItemInstance.find(".newsFancyLink")[0].href="components/news/"+element.img;
                            }
                        }else if(element.img){
                            NewsItemInstance.find(".newsImg")[0].src="components/news"+element.img;
                            NewsItemInstance.find(".newsImg")[0].onload = function () {
                                $(this).removeClass("transparent");
                                if(idx == news.length-1)resolve();
                            }
                        }else {
                            NewsItemInstance.find(".newsImg").removeClass("transparent");
                            NewsItemInstance.find(".newsImg").addClass("hidden-xs");
                            if(idx == news.length-1)resolve();
                        }
                        NewsItemInstance.find(".newsTitleH").text(element.title);
                        NewsItemInstance.find(".newsText").text(element.text);
                        NewsItemInstance.find(".newsItem").removeClass("transparent");

                        console.log("private:",element.private);
                        if(element.private){
                            if(element.private == "showall"){
                                NewsItemInstance.find(".newsPrivateLabel").addClass("label-success").text("Всем");
                                NewsItemInstance.find(".newsTitle").addClass("showall");
                            }
                            if(element.private == "showauth"){
                                NewsItemInstance.find(".newsPrivateLabel").addClass("label-primary").text("Участникам");
                                NewsItemInstance.find(".newsTitle").addClass("showauth");
                            }
                            if(element.private == "fromhgall"){
                                NewsItemInstance.find(".newsPrivateLabel").addClass("label-warning").text("HG24");
                                NewsItemInstance.find(".newsTitle").addClass("fromhgall");
                            }
                            if(element.private == "fromhg"){
                                NewsItemInstance.find(".newsPrivateLabel").addClass("label-danger").text("HG24 Участникам");
                                NewsItemInstance.find(".newsTitle").addClass("fromhg");
                            }
                        }
                    },idx*100);
                    Global.newsDownloading = false;
                });
                return pr_RenderNewsQuery;
            }).then(function () {
                //тут блок после полной прогрузки очереди новостей
                console.log("fetch завершен");
                refreshNews();
            }).catch(function (e) {
                Global.newsDownloading = false;
                console.log("fetch Render News с ошибкой");
                console.log(e);
            });
        });
    }
});