function getSuggestion(self, keyword) {
    $.ajax({
        url: apiUrl + "myapp/quickSearch/suggestData/index.php?code="+ localStorage.getItem("code") +"&t=" + t + "&q=" + encodeURIComponent(keyword),
        success: function (data) {
            if (data) {
                try {
                    //taobao,google [[ ]],
					var firMatches = data.match(/(.*?)\[\[(.*)\]\]\,/);
					if(firMatches){
						var matche = firMatches[2];
						if(matche){
							data = JSON.parse("[[" + matche + "]]");
						}
					}else{
						//taobao [[ ]]
						var firMatches = data.match(/(.*?)\[\[(.*)\]\]/);
						if(firMatches){
							var matche = firMatches[2];
							if(matche){
								data = JSON.parse("[[" + matche + "]]");
							}
						}else{
							firMatches = data.match(/(.*?)\[(.*)\]/);
							if(firMatches){
								var matche = firMatches[2];
								var secMatches = matche.match(/(.*?)\[\{(.*)\}\]/);
								if(secMatches){
									//bing
									matche = secMatches[2];
									if(matche){
										data = JSON.parse("[{" + matche + "}]");
									}
								}else{
									if(matche){
										//mail_ru
										var thiMatche = matche.match(/\{"text":"(.*?),"/g);
										if(thiMatche){
											var reg = new RegExp('"text":"(.*?)"',"g");
											var resutl = [];
											while (_result = reg.exec(matche)) {
												resutl.push(_result[1]);
											}
											data = resutl;
										}else{
											//yahoo,baidu,!google
											if(matche.indexOf("[]") == -1){
												data = JSON.parse("[" + matche + "]");
											}else{
												//yandex
												thiMatche = matche.match(/(.*?)\[(.*?)\]/);
												if(thiMatche){
													data = JSON.parse("[" + thiMatche[2] + "]");
												}
											}
										}
									}
								}
							}
						}
					}
                } catch (err) {
                    $(".suggest").hide();
                }

                try {
                    if (data.length > 0) {
                        var suggestContent = '<ul>';
						$.each(data, function(i,n){
							if(i < 8){
								if(typeof n == 'object'){
									var firVal = '';
									var secVal = '';
									$.each(n,function(p,q){
										if(firVal == '' && secVal == ''){
											firVal = q.replace(/<\/?b>(.*?)/g,'\1');
										}else if(secVal == ''){
											secVal = q;
										}
									});
									suggestContent += '<li keyword="' + firVal + '">' + firVal.replace(keyword,'<label>' + keyword + '</label>') + '</li>';
								}else{
									n = n.replace(/<\/?b>(.*?)/g,'\1');
									suggestContent += '<li keyword="' + n + '">' + n.replace(keyword,'<label>' + keyword + '</label>') + '</li>';
								}
							}
						});
						suggestContent += '</ul>';
                        if ($('.suggest').css('display') == 'none') {
                            $('.suggest').show();
                        }
                        $('.suggest').html(suggestContent);
                        $('.suggest li').unbind('click').bind('click',function () {
                            self.val(S2S($(this).attr('keyword')));
                            self.focus();
                            $('.suggest').hide();
                            setTimeout(function () {
                                $("#searchForm").submit();
                            }, 200);
                        }).unbind('mouseover').bind('mouseover', function () {
                            $('.suggest li').removeClass('selected');
                            $(this).addClass('selected');
                        });
                    } else {
                        $('.suggest').hide();
                    }
                } catch (err) {
                    $('.suggest').hide();
                }
            } else {
                $('.suggest').hide();
            }
        }
    });
}