$(function () {
    $(".btnAddNews").on("click",function () {
        $(".newsAddFormEditContainer").show(500).animate({opacity:1},500);
        $(this).addClass("active");
    });
    $(".btnAddNewsSubmit").on("click",function () {
        //SUBMIT BTN
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
        })
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