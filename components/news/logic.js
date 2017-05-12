$(function () {
    $(".btnAddNews").on("click",function () {
        $(".newsAddFormEditContainer").show(500).animate({opacity:1},500);
        $(this).addClass("active");
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
            };
        }
        closeNewsAddForm();
    });
    $(".btnAddNewsCancel").on("click",function () {
        //Close BTN
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
        })
    }

    uploadNews();

    function uploadNews(privateSt) {
        privat = false;
        if(!privateSt)privat = "showall";

        var fd = new FormData();

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
            console.log("response:",dataResp);
            var json = {};
            try{
                json = JSON.parse(dataResp);
                renderNews(json);
            }catch(e) {
                console.log("Парсинг не удался по причине:",e);
            }
        }).catch(function (e) {
            console.log("fetch с ошибкой");
            console.log(e);
        });
        function renderNews(news) {

            console.log("render news :",news);
            news.forEach(function (element,idx) {
                fetch("components/news/newsItem.tpl").then(function (data) {
                    if(data.status==200){
                        console.log("foreach id:",idx,"element:",element);
                        return data.text();
                    }
                }).then(function (dataResp) {
                    let NewsItemInstance = $(dataResp).appendTo("#news .newsContainer");

                }).catch(function (e) {
                    console.log("fetch с ошибкой");
                    console.log(e);
                });
            });
        }
    }
    $("#newsImgFile").on("change",function (event) {
        console.log("ev:",event);

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
});