(function($){
    $(".container").gradientify({
        gradients: [
            {start:[167,8,6], stop:[116,8,11]},
            {start:[167,8,6], stop:[89,4,8]},
        ]
    });

    var mainCurtain = $("body").curtainify({
        swapModeOnOrientationChange: true,
        animationDuration: 700,
        portrait: {
            heightRatioCurtainA : 0.3,
            heightRatioCurtainB : 0.7,
        },
        landscape:{
            widthRatioCurtainA : 0.5,
            widthRatioCurtainB : 0.5,
        }
    });

    mainCurtain.curtainA.addClass("main-curtain");
    mainCurtain.curtainB.addClass("main-curtain");

    var downloadCurtain = $("body").curtainify({
        swapModeOnOrientationChange: true,
        animationDuration: 500,
        id: "download-curtain",
        portrait: {
            heightRatioCurtainB : 0.35,
        },
    });
    downloadCurtain.curtainB.addClass("download-curtain");

    $("#install").click(function(e){
        e.stopPropagation();
        e.preventDefault();
        downloadCurtain.open();
        if(!downloadCurtain.curtainB.find(".row").length){
            downloadCurtain.curtainB.append($("#download-panel").html());
            $(".command").on("click",function(e){
                var targetElQ = $(this);
                copyToClipboard(targetElQ, targetElQ.text());
            });
        }
    });

    var backButton = $("<button class='back-btn'>back</button>");
    mainCurtain.append(backButton);

    setTimeout(function(){
        mainCurtain.close();
    },500);

    $("#demo").on("click", function(e){
        e.stopPropagation();
        e.preventDefault();
        mainCurtain.open();
        backButton.fadeIn(3000);
        backButton.addClass("active");
        downloadCurtain.close();
    });

    backButton.on("click", function(){
        mainCurtain.close();
        backButton.removeClass("active");
    });

    $(window).on("resize", function(){
        backButton.removeClass("active");
    });

    var curtain1ParentElQ = $("<div id='curtain1'>");
    $(".panel").prepend(curtain1ParentElQ);
    curtain1ParentElQ.append($("#cdn-panel").html());

    var curtain1 =  curtain1ParentElQ.curtainify({
        landscape:{
            widthRatioCurtainA:0.5,
            widthRatioCurtainB:0.5
        },
        initState:"open"
    });


    curtain1ParentElQ.on("mouseenter", function(){
        curtain1.close();
        downloadCurtain.close();
    });

    curtain1ParentElQ.on("mouseleave", function(){
        curtain1.open();
    });

    $(".container").on("click", function(e){
        downloadCurtain.close();
    });

    var cdnScriptTagsString = '<script src=https://cdn.rawgit.com/jahnestacado/curtainjs/94a1069aaa4d4416ca9c37b19c9e1526f95e933c/js/jquery.curtain.min.js></script>\n<link rel=stylesheet type=text/css href=https://cdn.rawgit.com/jahnestacado/curtainjs/94a1069aaa4d4416ca9c37b19c9e1526f95e933c/css/jquery.curtain.min.css>';
    $(".script-icon").on("click",function(e){
        copyToClipboard($(this),cdnScriptTagsString);
    });

    function copyToClipboard(elQ, text){
        var $temp = $("<textarea>");
        $("body").append($temp);
        $temp.val(text).select();
        document.execCommand("copy");
        $temp.remove();

        var offset = elQ.offset();
        var topPosition = offset.top - 40;
        var leftPosition = $(window).width() - (offset.left + elQ.outerWidth()) <= 140 ? $(window).width() - 170 : offset.left + elQ.outerWidth();
        var bubble = $($("#notification-bubble").html()).text("copied to clipboard!").css({
            top: topPosition,
            left: leftPosition
        });
        bubble.appendTo(".container")
        .fadeOut(3500, function () {
            $(this).remove();
        });
    }


}(jQuery));
