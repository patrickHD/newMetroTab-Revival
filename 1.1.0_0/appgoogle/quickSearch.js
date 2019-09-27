var ui_locale = chrome.i18n.getMessage("@@ui_locale");
var apiUrl = "http://hao.newtabplus.com/"
var googleType = "google";
if (ui_locale == "zh" || ui_locale == "zh_CN") {
    apiUrl = "http://hao.weidunewtab.com/";
	googleType = "google_cn"
}

//去除特殊字符
function S2S(str){
	var re = "";
	for(i=0;i<str.length;i++){
		if(str[i].charCodeAt() == 1){
			continue;
		}
		re += str[i];
	}
	return re;
}

$(function () {

    function setItem(){
        $("ul").hide();
        $("ul." + now.cm).not(".gcm2").show();
        $("#logo").attr("src",now.img);
        $("#autumn").css("display",now.tool);
        $("#searchForm").attr("action",now.url);
        $("#scroll").html(now.scroll);
        t = now.t;
        $(".scroll").unbind("click").bind("click", function () {
            var tmp = engine[$(this).index()];
            if(tmp!=now){
                now  = tmp;
                setItem();
            }
        });
    }
	
    var engine = [
        {"t":googleType,"cm":"gcm","tool":"","url":"http://www.google.com","img":"/appgoogle/google.png","next":1,"before":2,"scroll":"<span class='scroll' style='background-position: 0px -16px;'></span><span class='scroll' style='background-position: -18px -16px;'></span><span class='scroll' style='background-position: -18px -16px;'></span>"},
        {"t":"bing","cm":"bcm","tool":"","url":"http://www.bing.com","img":"/appgoogle/bing.png","next":2,"before":0,"scroll":"<span class='scroll' style='background-position: -18px -16px;'></span><span class='scroll' style='background-position: 0px -16px;'></span><span class='scroll' style='background-position: -18px -16px;'></span>"},
        {"t":"yahoo","cm":"ycm","tool":"","url":"https://search.yahoo.com/search","img":"/appgoogle/yahoo.png","next":0,"before":1,"scroll":"<span class='scroll' style='background-position: -18px -16px;'></span><span class='scroll' style='background-position: -18px -16px;'></span><span class='scroll' style='background-position: 0px -16px;'></span>"}
    ];

    $("#help").click(function(){
        var offset = $("#iright").offset();
        $("#ceshi").css("left", offset.left - 15).css("top", offset.top - 95).show().click(function(){localStorage.setItem("tishi","true");$(this).hide()});
        localStorage.setItem("tishi","false");
    });

    window.onresize=function(){
        var offset = $("#iright").offset();
        $("#ceshi").css("left", offset.left - 15).css("top", offset.top - 95).show().click(function(){localStorage.setItem("tishi","true");$(this).hide()});
    };
    var img = document.getElementById("logo");
    img.onload = function(){
        if(!(localStorage.getItem("tishi") === "true")){
            var offset = $("#iright").offset();
            $("#ceshi").css("left", offset.left - 15).css("top", offset.top - 95).show().click(function(){localStorage.setItem("tishi","true");$(this).hide()});
        }
    };
    var now = engine[0];
    var tishi = (localStorage.getItem("tishi") === "true");
    if(!tishi){
        var offset = $("#iright").offset();
        $("#ceshi").css("left", offset.left - 15).css("top", offset.top - 95).show().click(function(){localStorage.setItem("tishi","true");$(this).hide()});
    }
    setItem();
    var searchInput = $("#kw");
    //联想
    $(document).bind('click', function () {
        $('.suggest').hide();
    });
    searchInput.unbind('keydown').bind('keydown', function (e) {
        if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
            if ($('.suggest').css('display') != 'none') {
                var index = $('.suggest ul li').index($('.suggest ul li.selected'));
                if (e.keyCode == 38 || e.keyCode == 40) {
                    var nextIndex = 0;
                    if (index == -1) {
                        if (e.keyCode == 38) {
                            nextIndex = $('.suggest ul li').length - 1;
                        }
                    } else {
                        nextIndex = e.keyCode == 38 ? (index - 1) : (index + 1);
                    }
                    $('.suggest ul li').removeClass('selected');
                    var nextObj = $('.suggest ul li')[nextIndex];
                    if (typeof nextObj != 'undefined') {
                        $(nextObj).addClass('selected');
                        searchInput.val(S2S($(nextObj).attr('keyword')));
                    }
                } else if (e.keyCode == 13) {
                    searchInput.get().focus();
                    $('.suggest').hide();
                    setTimeout(function () {
                        $("#searchForm").get().submit();
                    }, 200);
                    return false;
                }
            }
        }
    });
    searchInput.unbind('keyup').bind('keyup', function (e) {
        if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 27) {
            if (e.keyCode == 27) {
                $('.suggest').hide();
            }
            return false;
        }
        var self = $(this);
        var keyword = self.val();
        if(keyword!=""){
            getSuggestion(self, keyword);
        }else{
            $(".suggest").hide();
        }

    });

    setTimeout(function () {
        searchInput.focus();
    }, 200);

    $("#more").unbind("click").bind("click", function (e) {
        $(this).hide();
        $("#more2").show();
        $("#morecon").show();
        $(".gcm2").removeClass("gcm2");
    });

    $("#iright").unbind("click").bind("click", function (e) {
        now = engine[now.next];
        setItem();
    });
    $("#ileft").unbind("click").bind("click", function (e) {
        now = engine[now.before];
        setItem();
    });
    $("#search").unbind("click").bind("click", function () {
        $("#searchForm").submit();
    });


});