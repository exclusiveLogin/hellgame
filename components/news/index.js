class NewsEngine{
    constructor(DOMcontainerID,interval){
        this.refreshNewsWrapper = this.refreshNews.bind(this);
        this.renderNewsWrapper = this.renderNews.bind(this);
        this.newsStatus = "showall";
        this.newsDownloading = false;
        this.lastNewsDownloaded = false;
        if(DOMcontainerID){
            this.DOMcontainerID = DOMcontainerID;
        }else{
            return new Error("Нет контейнера");
        }
        this.interval = interval || 30000;
        //Скачиваем  TPL для новости
        this.newsTplPromise = fetch("components/news/newsItem.tpl").then(function (data) {
            if(data.status==200){
                return data.text();
            }
        });
        this.newsTplPromise.then(function (newsTplItem) {
            return newsTplItem;
        }).catch(function (e) {
            this.newsDownloading = false;
            console.log("fetch TPL с ошибкой");
            console.log(e);
        });

        this.newsTplAddPromise = fetch("components/news/newsFormAdd.html").then(function (data) {
            if(data.status==200){
                return data.text();
            }
        }).then(function (newsAddTplForm) {
            return newsAddTplForm;
        }).catch(function (e) {
            console.error("Не удалось загрузить TPL news form",e);
        });
        var context = this;
        var newsReady = Promise.all([this.newsTplPromise, this.newsTplAddPromise]);
        newsReady.then(function (tpls) {

            console.log("this:",this,"tpl:",tpls);
            if(!$("#"+context.DOMcontainerID)[0])return new Error("Контейнер не найден");
            $("#"+context.DOMcontainerID).html(tpls[1]);

            //вот тут уже загружены ассерты
            $(document).on("scroll",function (e) {
                //console.log("this:",this);
                context.refreshNewsWrapper();
            });
            $("#news .btnAddNews").on("click",function () {
                $(".newsAddFormEditContainer").show(500).animate({opacity:1},500);
                $(this).addClass("active");
                var dua = detect.parse(navigator.userAgent);
                //alert(dua.device.type);
                // if((dua.device.type == "Mobile") || (dua.device.type == "mobile")){
                //     $("#news .newsContainer").empty();
                //     Global.newsLast = false;
                // }
                $("#news .newsContainer").empty();
                context.newsLast = false;
                context.lastID = false;
                context.topNewsId = false;
            });
            $("#news .btnNewsStatusShowAll").addClass("active");
            $("#news .btnNewsStatus").on("click",function () {
                $(".btnNewsStatus").removeClass("active");
                $(this).addClass("active");
            });
            $("#news .btnNewsStatusShowAll").on("click",function () {
                context.newsStatus = "showall";
            });
            $("#news .btnNewsStatusShowAuth").on("click",function () {
                context.newsStatus = "showauth";
            });
            $("#news .btnNewsStatusFromHG").on("click",function () {
                context.newsStatus = "fromhg";
            });
            $("#news .btnNewsStatusFromHGAll").on("click",function () {
                context.newsStatus = "fromhgall";
            });
            $("#news .btnAddNewsSubmit").on("click",function () {
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
                    fd.append("newsprivate",context.newsStatus);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST","components/news/newsbackend.php");
                    xhr.send(fd);
                    xhr.onreadystatechange = function() {
                        if (this.readyState != 4) return;
                        //console.log("XHR RESPONSE:",this.responseText);
                        context.refreshNews();
                        if (context.responseText){
                            try {
                                let resp = JSON.parse(context.responseText);
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
                context.closeNewsAddForm();
            });
            $("#news .btnAddNewsCancel").on("click",function () {
                context.refreshNews();
                context.closeNewsAddForm();
            });

            $("#news .newsFancyLink").fancybox();
            $("#news #newsImgFile").on("change",function (event) {
                if(window.FileReader){
                    var fr = new FileReader();
                    fr.onerror = function () {
                        console.log("Загрузка не удалась");
                        $("#news #newsAddImgPreview")[0].src="style/nophoto.png";
                        $("#news #newsAddImgPreview").animate({opacity:1},500);
                    };
                    fr.onabort = function () {
                        console.log("Загрузка прервана");
                        $("#news #newsAddImgPreview")[0].src="style/nophoto.png";
                        $("#news #newsAddImgPreview").animate({opacity:1},500);
                    };
                    fr.onloadstart = function () {
                        //console.log("Загрузка началась");
                        $("#news #newsAddImgPreview").animate({opacity:0},500);
                    };
                    fr.onload = function () {
                        //console.log("Загрузка завершена");
                        $("#news #newsAddImgPreview")[0].src=fr.result;
                        $("#news #newsAddImgPreview").animate({opacity:1},500);
                    };
                    fr.onloadend = function () {

                    };
                    if(event.target.files.length){
                        var file = event.target.files[0];
                        //console.log("file:",file);
                        fr.readAsDataURL(file);
                    }
                }
            });
            setInterval(function () {//запуск шедуллера
                context.refreshNewsWrapper();
            },context.interval);
            context.refreshNewsWrapper();//запуск первой обновы
        });
    }
    refreshNews() {
        if(Global){
            if(Global.authkey){
                this.downloadNews("showauth");
            }else {
                this.downloadNews();
            }
        }else {
            this.downloadNews();
        }
    }
    closeNewsAddForm() {
        $("#news .btnAddNews").removeClass("active");
        $("#news .newsAddFormEditContainer").animate({opacity:0},500,function () {
            $(this).hide(500);
            $("#news #newsAddImgPreview")[0].src="style/nophoto.png";
            $("#news #newsAddImgPreview").animate({opacity:1},500);
            $("#news #newsFormTitle").val("");
            $("#news #newsFormText").val("");
            $("#news #newsImgFile").val("");
            $("body").animate({scrollTop:0},1000);
        })
    }
    downloadNews(privateSt) {
        var context = this;
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
                console.log("this of download:",this);
                if(this.newsLast != dataResp){
                    var json = [];
                    try{
                        json = JSON.parse(dataResp);
                        if(json.length){
                            if(this.lastID){//оценка последнего ID
                                if(Number(this.lastID) > Number(json[json.length-1].id)){
                                    this.lastID = json[json.length-1].id;
                                }
                            }else {
                                this.lastID = json[json.length-1].id;
                            }
                            if(lastid){
                                //когда новости скролят вниз
                                this.renderNews(json,true);
                            }else {
                                //когда новости сверху
                                if(this.topNewsId){
                                    if(this.topNewsId != json[0].id){
                                        this.renderNews(json);
                                        this.lastNewsDownloaded = false;
                                        this.topNewsId = json[0].id;
                                        this.lastID = json[json.length-1].id;
                                    }
                                }else {
                                    this.renderNews(json);
                                    this.topNewsId = json[0].id;
                                }
                            }
                        }else {
                            this.lastNewsDownloaded = true;
                            this.renderNews(false,false,true);
                        }
                    }catch(e) {
                        console.log("Парсинг не удался по причине:",e);
                    }
                }
                this.newsLast = dataResp;
                this.newsDownloading = false;
            }.bind(context)).catch(function (e) {
                this.newsDownloading = false;
                console.log("fetch с ошибкой");
                console.log(e);
            }.bind(context));
        }
        if($("#news")[0].getBoundingClientRect().top > 0){
            download();
            console.log("Загружен top block");
        }
        var bottomNews = $("#news")[0].getBoundingClientRect().bottom;
        var bottomScreen = document.documentElement.clientHeight;
        if(bottomNews < (bottomScreen + 50) && this.lastID){
            if(!this.lastNewsDownloaded){
                if(!this.newsDownloading){
                    this.newsDownloading = true;
                    download(this.lastID);
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
    renderNews(news,addnews,nonews) {
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
        //console.log("renderNews this:",this);
        news.forEach(function (element,idx) {
            //console.log("forEach this:",this);
            this.newsTplPromise.then(function (dataResp) {
                //console.log("newsTpl this:",this);
                var context = this;
                var pr_RenderNewsQuery = new Promise(function (resolve) {
                    //console.log("newsTplRender this:",this);
                    let NewsItemInstance = $(dataResp).appendTo("#news .newsContainer");

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

                    this.newsDownloading = false;
                }.bind(this));
                return pr_RenderNewsQuery;
            }.bind(this)).then(function () {
                //тут блок после полной прогрузки очереди новостей
                console.log("fetch завершен this:",this);
                this.refreshNews();
            }.bind(this)).catch(function (e) {
                console.log("fetch Render News с ошибкой this:",this);
                console.log(e);
                this.newsDownloading = false;
            }.bind(this));
        },this);
    }
}