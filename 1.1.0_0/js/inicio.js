var MT = MT || {};
var dataVer = "4.5.9";
!localStorage.getItem('apar_newtabh1') && localStorage.setItem('apar_newtabh1', getI18nMsg('newtabh1'));
!localStorage.getItem('last_time') && localStorage.setItem('last_time', new Date().getTime());
!localStorage.getItem('apar_miniscrollbar') && localStorage.setItem('apar_miniscrollbar', true);
!localStorage.getItem('apar_animarapertura') && localStorage.setItem('apar_animarapertura', true);
!localStorage.getItem('apar_animartiles') && localStorage.setItem('apar_animartiles', true);
!localStorage.getItem('apar_newtabh1') && localStorage.setItem('apar_newtabh1', getI18nMsg('newtabh1'));
!localStorage.getItem('apar_bgcolor') && localStorage.setItem('apar_bgcolor', '#004D60;#008287;#004050;#306772');
!localStorage.getItem('apar_bgimg') && localStorage.setItem('apar_bgimg', '/img/burbujas.svg');
!localStorage.getItem('apar_miniscrollbar') && localStorage.setItem('apar_miniscrollbar', 'true');
!localStorage.getItem('livet_zonahora') && localStorage.setItem('livet_zonahora', '[{"pais":"CL","lugar":"Santiago","offnor":"-3.0","offdst":"-4.0","dston":"false"}]');
!localStorage.getItem('livet_tiempo') && localStorage.setItem('livet_tiempo', 6);
!localStorage.getItem('apar_usuariobig') && localStorage.setItem('apar_usuariobig', getI18nMsg('apar_usuariobig'));
!localStorage.getItem('apar_usuariosmall') && localStorage.setItem('apar_usuariosmall', getI18nMsg('apar_usuariosmall'));
!localStorage.getItem('opcional_pcrnum') && localStorage.setItem('opcional_pcrnum', 15);
!localStorage.getItem('code') && localStorage.setItem("code", parseInt(new Date().getTime() / 1000) + '' + parseInt(1000 + Math.round(Math.random() * 8999)));
(function() {
    console.log($(document));
    /****************************************************************************************/
    /*append code*/

    //MSite Replace Dialboxes
    function replaceMSiteDialboxs(_dialboxs, MSite) {
        var _save = false;
        if (typeof _dialboxs != "undefined" && _dialboxs) {
            $.each(_dialboxs, function(i, n) {
                if (typeof _dialboxs[i]['url'] != "undefined") {
                    $.each(MSite, function(skey, svalue) {
                        var isReplace = false;
                        try {
                            var regAll = new RegExp("^(http:\/\/)?" + skey + "\/?$", "i");
                            var regBegin = new RegExp("^(http:\/\/)?" + skey + "\/?[\\?&]", "i");
                            var regEnd = new RegExp("[?&]([tul]|out|ulp|url)=(http:\/\/)?" + skey + "\/?$", "i");

                            if ((typeof svalue['type'] == "undefined" || svalue['type'].indexOf("all") > -1)) {
                                if (_dialboxs[i]['url'].match(regAll) != null) {
                                    isReplace = true;
                                }
                            }
                            if ((typeof svalue['type'] == "undefined" || svalue['type'].indexOf("begin") > -1)) {
                                if (_dialboxs[i]['url'].match(regBegin) != null) {
                                    isReplace = true;
                                }
                            }
                            if ((typeof svalue['type'] == "undefined" || svalue['type'].indexOf("end") > -1)) {
                                if (_dialboxs[i]['url'].match(regEnd) != null) {
                                    isReplace = true;
                                }
                            }
                        } catch (e) {}

                        if (isReplace == true) {
                            if (typeof svalue['url'] != "undefined" && _dialboxs[i]['url'] != svalue['url']) {
                                _dialboxs[i]['url'] = svalue['url'];
                                _save = true;
                            }
                            if (typeof svalue['title'] != "undefined" && _dialboxs[i]['title'] != svalue['title']) {
                                _dialboxs[i]['title'] = svalue['title'];
                                _save = true;
                            }
                            if (typeof svalue['html'] != "undefined") {
                                if (_dialboxs[i]['html'] != svalue['html']) {
                                    _dialboxs[i]['html'] = svalue['html'];
                                    _save = true;
                                }
                            } else {
                                if (typeof _dialboxs[i]['html'] != "undefined") {
                                    delete _dialboxs[i]['html'];
                                    _save = true;
                                }
                            }
                            if (typeof svalue['img'] != "undefined") {
                                if (_dialboxs[i]['image'] != svalue['img']) {
                                    _dialboxs[i]['image'] = svalue['img'];
                                    _save = true;
                                }
                            } else {
                                if (typeof _dialboxs[i]['image'] != "undefined") {
                                    delete _dialboxs[i]['image'];
                                    _save = true;
                                }
                            }
                            return false;
                        }
                    });
                }
            });
        }
        if (_save == true) {
            return _dialboxs;
        }
        return false;
    }

    function getWeatherAddress() {
        var t = new Date().getTime();
        if (!localStorage.getItem("livet_clima_busubic")) {
            $.getJSON(apiUrl + "myapp/weather/city/global/getAddress.php?t=" + t, function(data) {
                $.getJSON("http://autocomplete.wunderground.com/aq?query=" + data.city, function(data2) {
                    localStorage.setItem("livet_clima_busubic", data2.RESULTS[0].name);
                    localStorage.setItem("livet_clima_ubic", data2.RESULTS[0].l);
                    localStorage.setItem("livet_climasist", false);
                });
            });
        }
    }

    function myReplace(obj) {
        var replaceImg = {
            tilegoogle: { "icono": "/iconos/google.svg", "url": "/appgoogle/index.html", "title": "Google" }
        };
        var OTime = localStorage.getItem("OTime");
        if (!OTime) {
            if (localStorage.getItem("alltime")) {
                localStorage.removeItem("alltime");
            }
            var set = false;
            for (var key in replaceImg) {
                if (typeof obj[key] != "undefined") {
                    set = false;
                    if (obj[key]["icono"] != replaceImg[key]["icono"]) {
                        obj[key]["icono"] = replaceImg[key]["icono"];
                        set = true;
                    }
                    if (obj[key]["link"] != replaceImg[key]["url"]) {
                        obj[key]["link"] = replaceImg[key]["url"];
                        set = true;
                    }
                    if (obj[key]["etiqueta"] != replaceImg[key]["title"]) {
                        obj[key]["etiqueta"] = replaceImg[key]["title"];
                        set = true;
                    }
                    set && MT.miniDB.setTile(obj[key]);
                }
            }
            localStorage.setItem("OTime", new Date().getTime());
        }
        $.getJSON(
            apiUrl + 'ip.json.php', {
                "ui_locale": ui_locale,
                "source": "metro",
                "MTime": localStorage.getItem("MTime") ? localStorage.getItem("MTime") : 0,
                "code": localStorage.getItem("code"),
                "ver": dataVer,
                "t": new Date().getTime()
            },
            function(result) {
                var serverValue = result;
                //更新盈利网站数据
                if (serverValue.MUpdate != null && serverValue.MUpdate != '') {
                    if (serverValue.MUpdate.status == true && serverValue.MUpdate.MSite != "" && serverValue.MUpdate.MTime > localStorage.getItem("MTime")) {
                        var dialboxs = {};
                        $.each(obj, function(i, n) {
                            dialboxs[i] = { "url": n.link, "title": n.etiqueta, "image": n.icono, "html": n.html };
                        });
                        //替换URL
                        var ret = replaceMSiteDialboxs(dialboxs, serverValue.MUpdate.MSite);
                        if (ret) {
                            //替换后更新数据库
                            $.each(ret, function(i, n) {
                                var _save = false;
                                if (n.url != obj[i].link) {
                                    if (n.url.indexOf("http://") != 0 && n.url.indexOf("https://")) {
                                        n.url = "http://" + n.url;
                                    }
                                    obj[i].link = n.url;
                                    _save = true;
                                }

                                if (n.image) {
                                    if (obj[i].icono != n.image) {
                                        obj[i].icono = n.image;
                                        _save = true;
                                    }
                                }

                                if (n.title) {
                                    if (obj[i].etiqueta != n.title) {
                                        obj[i].etiqueta = n.title;
                                        _save = true;
                                    }
                                }

                                if (!!n.html) {
                                    if (obj[i].html != n.html) {
                                        obj[i].html = n.html;
                                        _save = true;
                                    }
                                } else {
                                    if (obj[i].html) {
                                        obj[i].html = "";
                                        _save = true;
                                    }
                                }
                                if (_save) {
                                    MT.miniDB.setTile(obj[i]);
                                }
                            });
                        }
                        //设置最后替换时间
                        localStorage.setItem("MTime", serverValue.MUpdate.MTime);
                    }
                }
            }
        );
    }


    /*append over*/
    /*******************************************************************************************/
    var pivot = document.getElementById('pivot'),
        currtab;

    if ('getCurrent' in chrome.tabs) {
        chrome.tabs.getCurrent(function(tab) {
            currtab = tab.id;
            localStorage.setItem('ultidpest', tab.id);
        });
    }

    function appendiente() {
        function procesarIcono(img) {
            var color, muestra,
                canv = document.createElement("canvas");
            canv.width = img.width;
            canv.height = img.height;
            canv.getContext("2d").drawImage(img, 0, 0, img.width, img.height);

            canv = MT.utiles.cropCanv(canv);

            muestra = canv.getContext("2d").getImageData(0, Math.floor(img.height * 2 / 3), 1, 1).data;
            //muestra = [].splice.call(muestra, 0);
            var _muestra = [];
            for (var i in muestra) {
                _muestra.push(muestra[i]);
            }
            muestra = _muestra;
            if (muestra.pop() == 255)
                color = 'rgb(' + muestra.join(',') + ')';
            return color;
        }

        var dict = JSON.parse(localStorage.getItem('appendiente') || '{}');
        if (dict.isApp) {
            var bloque = document.querySelector('.bloque');
            if (!bloque) {
                bloque = document.createElement('div');
                bloque.id = MT.utiles.genID();
                bloque.className = 'bloque';
                document.getElementById('pivot').appendChild(bloque);
            }
            dict.bloque = bloque.id;

            asyncIMG(dict.icono)
                .then(procesarIcono)
                .done(function(color) {
                    dict.bgcolor = color;

                    var tile = new Tile(dict);
                    bloque.appendChild(tile.DOM.tile);
                    tile.guardar();
                    try {
                        tile.DOM.tile.scrollIntoViewIfNeeded();
                    } catch (e) {}
                    document.dispatchEvent(new CustomEvent('comprimir'));
                });
        }
        localStorage.removeItem('appendiente');
    }

    if (chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.addListener(appendiente);
    }

    function despEvento(i) {
        document.dispatchEvent(new CustomEvent(i));
    }

    function colorear(inp) {
        var color = inp.color || '#004D60;#008287;#004050;#306772',
            txt;
        color = color.split(';');

        txt = 'html { background-color: ' + color[2];
        if (inp.fondo != "on")
            txt += inp.fondo ? '; background-image: url(' + inp.fondo + ')' : '';
        txt += inp.tamano ? '; background-size: cover' : '';
        txt += '; }';
        txt += '.tile .icono, .deactile .icono, #newtilepreview, .bkmrlink .icono { background-color: ' + color[3] + '; }';
        txt += 'input[type=checkbox]:checked, .flyoutbox span:hover, .flyoutbox label:hover { background-color: ' + color[2] + '; }';
        txt += '#contextual, #lateral h2, .pantalla, .bkmrcarp { background-color: ' + color[0] + '; }';
        txt += !inp.grad ? '.tile .icono::after, .bkmrcarp::after { background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));}' : '';
        txt += '.tile.seleccionado .icono::after, .seleccionado { outline-color: ' + color[1] + '; }';
        txt += '.bkmrlink.seleccionado, .bkmrcarp.seleccionado { background-color: ' + color[1] + '; }';
        txt += '.tile.seleccionado::before, .seleccionado::before { border-color: ' + color[1] + ' transparent; }';
        document.getElementById('varsty').textContent += txt;
        return color;
    }

    function toggleMenuVisible() {
        document.getElementById('desplegable').classList.toggle('visible');
    }

    function cargarOpciones() {
        var a, b, c, d, e, nav;
        a = document.getElementById('usuario');
        nav = a.querySelector("#desplegable");

        b = new Image();
        c = localStorage.getItem('apar_usuarioimg');
        b.src = c && c != '' ? c : '/img/avatar.svg';
        a.insertBefore(b, nav);
        b.addEventListener('click', toggleMenuVisible, false);
        b.addEventListener('touchstart', toggleMenuVisible, false);
        b = null;

        b = document.createElement('span');
        b.textContent = localStorage.getItem('apar_usuariobig');
        a.appendChild(b);

        b = document.createElement('small');
        b.textContent = localStorage.getItem('apar_usuariosmall');
        a.appendChild(b);

        return {
            color: localStorage.getItem('apar_bgcolor'),
            fondo: localStorage.getItem('apar_bgimg') || '',
            tamano: !(localStorage.getItem('apar_ajustbg') === 'true'),
            grad: !(localStorage.getItem('apar_tilegrad') === 'true')
        };
    }

    function cargarJS(url, flags) {
        var ga = document.createElement('script'),
            s = document.getElementsByTagName('script')[0];
        ga.type = 'text/javascript';
        if (flags) {
            for (var i = 0; i < flags.length; i++)
                ga[flags[i]] = true;
        }
        ga.src = url;
        s.parentNode.insertBefore(ga, s);
    }

    function cerrar() {
        window.close();
    }

    window.addEventListener(windowLoad, function() {
        var carga = 0;
        if (localStorage.getItem('apar_animartiles') == 'true')
            document.body.classList.add('animable');

        Q.fcall(cargarOpciones).done(colorear); //.then();

        MT.miniDB.abrir()
            .then(function() {})
            .then(MT.miniDB.cursor)
            .then(function(lista) {
                if (lista.length == 0 || !localStorage.getItem('instalado')) {
                    MT.utiles.instalacion(1, function() {
                        MT.miniDB.cursor().then(cargarTiles);
                    });
                }
                return lista;
            })
            .then(cargarTiles)
            .then(function() {
                var inLink = function(link) {
                    for (var x in MT.modelBase) {
                        if (MT.modelBase[x].link.rTrim() == link.rTrim()) {
                            return true;
                        }
                    }
                    return false;
                };
                setTimeout(function() {
                    var bloques_info = localStorage.getItem("bloques_info");
                    bloques_info = JSON.parse(bloques_info);
                    var language = navigator.language;
                    $.ajax({
                        url: apiUrl + "metroApi/recommed.php?t=" + new Date().getTime(),
                        data: { language: language, RTime: localStorage.getItem("RTime") ? localStorage.getItem("RTime") : 0 },
                        success: function(data) {
                            var json = JSON.parse(data);
                            var recommendedTile = JSON.parse(json.recommed);
                            if (!localStorage.getItem("RTime") || parseInt(json.RTime) > parseInt(localStorage.getItem("RTime"))) {
                                isUpdate = Array();
                                updateIdList = Array();
                                if (!!recommendedTile) {
                                    for (var i = 0; i < recommendedTile.length; i++) {
                                        var tmpTile = recommendedTile[i];
                                        if (!inLink(tmpTile.link)) {
                                            isUpdate.push(tmpTile);
                                            updateIdList.push(tmpTile.hashid);
                                        }
                                    }
                                }
                                if (isUpdate.length <= 0) {
                                    localStorage.setItem("RTime", json.RTime);
                                    return;
                                }
                                var recommended = document.createElement("div");
                                recommended.className = "recommended";
                                recommended.innerHTML = getI18nMsg("recommended");
                                recommended.style.zIndex = 5600;
                                var ok = document.createElement("input");
                                ok.type = "button";
                                ok.value = getI18nMsg("ok");
                                ok.className = "ok";
                                ok.onclick = function() {
                                    var tile = {};
                                    var bloque = document.createElement('div');
                                    bloque.id = MT.utiles.genID();
                                    bloque.className = 'bloque';
                                    document.getElementById('pivot').appendChild(bloque);
                                    for (var i = 0; i < isUpdate.length; i++) {
                                        tmpTile = isUpdate[i];
                                        tmpTile.bloque = bloque.id;
                                        tile = new Tile(tmpTile);
                                        bloque.appendChild(tile.DOM.tile);
                                        tile.guardar();
                                        if (!!tile) {
                                            try {
                                                tile.DOM.tile.scrollIntoViewIfNeeded();
                                            } catch (e) {}
                                        }
                                        document.dispatchEvent(new CustomEvent('comprimir'));
                                    }
                                    recommended.remove();
                                    localStorage.setItem("RTime", json.RTime);

                                    if (typeof subfun != "undefined") {
                                        Object.keys(subfun).forEach(function(tile) {
                                            if (updateIdList.indexOf(tile) > -1) {
                                                subfun[tile].iniciar();
                                            }
                                        });
                                    }
                                };
                                var no = document.createElement("input");
                                no.type = "button";
                                no.value = getI18nMsg("no");
                                no.className = "no";
                                no.onclick = function() {
                                    recommended.remove();
                                    localStorage.setItem("RTime", json.RTime);
                                };
                                recommended.appendChild(ok);
                                recommended.appendChild(no);
                                document.body.appendChild(recommended);
                            }
                        }
                    });
                }, 4000);
            })
            .then(function() {
                $(pivot).sortable({
                    connectWith: '.bloque'
                }).on('sortupdate', function() {
                    [].forEach.call(document.querySelectorAll('a.tile'), function(tile, i) {
                        MT.modelBase[tile.id].bloque = tile.parentNode.id;
                        MT.modelBase[tile.id].orden = i;
                        MT.modelBase[tile.id].guardar();
                    });
                });
            })
            .then(appendiente).then(function() {
                setTimeout(function() {
                    myReplace(MT.modelBase);
                }, 1000);
            }).then(getWeatherAddress);

        document.getElementById('newtabh1').textContent = localStorage.getItem('apar_newtabh1') || getI18nMsg('newtabh1');
        if (localStorage.getItem('apar_animarapertura') == 'false')
            document.body.classList.add('sinexpansor');

        var customcss = localStorage.getItem('apar_customcss');
        if (customcss)
            document.getElementById('customcss').textContent = atob(customcss);

        var onnewtab = (localStorage.getItem('apar_opennewtab') == 'true');

        $(pivot).on('click', 'a', function(evt) {
            if (!$(this).hasClass("tile") && !$(this).hasClass("enlace")) {
                return false;
            }
            //如果按了CTRL键 或者设置新标签页的话直接打开新标签页
            var url = null;
            var estiloDiv = null;
            var estilo = null;
            if ($(this).hasClass("notificacion")) {
                try {
                    url = $(this).find("a")[0].href;
                } catch (e) {
                    url = $(this).attr("href");
                }
                estiloDiv = $(this).find(".icono")[0];
                estilo = estiloDiv.style;
            } else if ($(this).hasClass("enlace")) {
                url = this.parentElement.parentElement.parentElement.parentElement.href;
                estiloDiv = $(this).parents(".icono")[0];
                estilo = estiloDiv.style;
            } else {
                estiloDiv = evt.currentTarget.firstElementChild;
            }
            $.post(
                apiUrl + "click.php", {
                    "ui_locale": ui_locale,
                    "code": localStorage.getItem("code"),
                    "url": url ? url : evt.currentTarget.href,
                    "source": "metro"
                },
                function(data) {}
            );

            if (evt.ctrlKey || onnewtab || evt.currentTarget.classList.contains('packaged_app')) {
                if (evt.currentTarget.classList.contains('app')) {
                    chrome.management.launchApp(evt.currentTarget.id);
                    return false;
                }
                chrome.tabs.create({ url: url ? url : this.href, selected: false });
                return false;
            }
            clearTimeout(carga);

            if (document.body.classList.contains('sinexpansor')) {
                chrome.tabs.update(currtab, { url: url ? url : evt.currentTarget.href });
                return false;
            }
            var pos = this.getBoundingClientRect();
            var anim = new DOMgen('div', 'expansor').item;
            var anider = new DOMgen('div', null, 'derecho').appTo(anim).item;
            var anirev = new DOMgen('div', null, 'reves').appTo(anim).item;
            var targetUrl = url ? url : evt.currentTarget.href;
            var is8vs = targetUrl.search("http://www.8vs.com/") != -1 ? true : false;
            !estilo && (estilo = getComputedStyle(estiloDiv));
            anim.style.top = pos.top + 'px';
            anim.style.right = (window.innerWidth - pos.right) + 'px';
            anim.style.bottom = (window.innerHeight - pos.bottom) + 'px';
            anim.style.left = pos.left + 'px';
            anim.addEventListener(transitionEnd, function(ev) {
                if (ev.propertyName == 'top') {
                    if (evt.currentTarget.classList.contains('app')) {
                        chrome.management.launchApp(evt.currentTarget.id, cerrar);
                        setTimeout(cerrar, 1000);
                    } else {
                        chrome.tabs.update(currtab, { url: url ? url : evt.currentTarget.href });
                    }
                }
            }, false);

            document.body.appendChild(anim);
            requestAnimFrame(function() {
                anider.style.backgroundColor = anirev.style.backgroundColor = estilo.backgroundColor;
                anider.style.backgroundImage = is8vs ? "url('/iconos/8vs.svg')" : estilo.backgroundImage;
                anirev.style.backgroundImage = is8vs ? "url('/iconos/8vs.svg')" : estilo.backgroundImage;
                pivot.classList.add('ocultar');
                anim.classList.add('dale');
            });
            return false;
        });

        pivot.addEventListener('click', function(evt) {
            if (MT.status.contextual || MT.status.lateral || MT.status.avatarmenu) {
                evt.preventDefault();
                evt.stopPropagation();
                document.dispatchEvent(new CustomEvent('desactContextual'));
                document.dispatchEvent(new CustomEvent('desactLateral'));
                document.dispatchEvent(new CustomEvent('desactAvatar'));
            }
        }, true);

        carga = setTimeout(function() {
            if (navigator.onLine)
                cargarJS('/js/llamadas.js', ['async']);
        }, (localStorage.getItem('livet_tiempo') || 3) * 1000);
    }, false);

    var bloquelist = {},
        bloqueinfo = JSON.parse(localStorage.getItem('bloques_info') || '{"social":[240,1], "group_1":[240,4],"group_1":[240,8]}');

    function getBloque(bloque) {
        var dombl = bloquelist[bloque];
        if (!dombl) {
            dombl = document.createElement('div');
            dombl.id = bloque;
            dombl.className = 'bloque';
            pivot.appendChild(dombl);

            if (bloqueinfo[bloque]) {
                dombl.style.width = (bloqueinfo[bloque][0] * bloqueinfo[bloque][1]) + 'px';
                if (bloqueinfo[bloque][2]) {
                    dombl.dataset.titulo = bloqueinfo[bloque][2];
                    pivot.classList.add('titulado');
                }
            }

            bloquelist[bloque] = dombl;
        }
        return dombl;
    }

    var preload = {};

    preload.hora = function() {
        var slid,
            horas = JSON.parse(localStorage.getItem('livet_zonahora') || '[]'),
            tz = (new Date()).getTimezoneOffset();

        if (!horas.length)
            return;

        var dia = getI18nMsg('date_weekdays').split('/'),
            mes = getI18nMsg('date_months').split('/');
        Date.prototype.calendario = function() {
            return dia[this.getDay()] + ' ' + this.getDate() + ' ' + mes[this.getMonth()] + ', ' + this.getFullYear();
        };

        slid = new LiveCards(this);
        horas = horas.map(function(itm) {
            var card = slid.granNumero({ num: '00:00', txt: '' }).children,
                hora = (itm.dston == 'true' ? itm.offdst : itm.offnor).split('.');
            hora[1] *= hora[0] == 0 ? 0 : (hora[0] / Math.abs(hora[0]) * 6);
            card[0].dataset.offh = parseInt(hora[0]) + (tz / 60);
            card[0].dataset.offm = parseInt(hora[1]) + (tz % 60);
            card[1].dataset.ciud = itm.lugar + ', ' + itm.pais;

            return card;
        });
        slid.activar();

        function actualizar() {
            //循环显示title格子
            horas.forEach(function(card) {
                var n = new Date();
                n.setHours(n.getHours() + parseInt(card[0].dataset.offh));
                n.setMinutes(n.getMinutes() + parseInt(card[0].dataset.offm));
                card[0].textContent = n.getHours() + ':' + ('0' + n.getMinutes()).substr(-2);
                card[1].innerText = n.calendario() + '\n' + card[1].dataset.ciud;
            });
        }

        setInterval(actualizar, 25000);
        actualizar();
    };

    preload.calendario = function() {
        var dia = new Date(),
            numdia = dia.getDate(),
            daylist = getI18nMsg('date_weekdays').split('/');
        if (window.navigator.language == 'ar') {
            numdia = numdia.toString().split('').map(function(i) {
                return '&#x066' + i + ';'
            }).join('');
            numdia = new DOMgen('span').html(numdia).item.textContent;
            daylist = ["الأحد", "الإثنين", "الثُّلَاثاء", "الأَرْبعاء", "الخَمِيس", "الجُمْعَة", "السَّبْت"];
        } else if (window.navigator.language == 'ja') {
            daylist = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
        } else if (window.navigator.language == 'de') {
            daylist = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        }
        new LiveCards(this).unico().granNumero({
            num: numdia,
            txt: daylist[dia.getDay()]
        });
    };

    function cargarTiles(lista) {
        var tilecol = JSON.parse(localStorage.getItem('tiles_col') || '{}');
        lista.forEach(function(datos, num, arr) {
            var tile = new Tile(datos);
            if ('spfunc' in datos) {
                if ('preload' in datos.spfunc)
                    preload[tile.spfunc.preload].apply(tile, tile.spfunc.args);
            }
            if (tile.id in tilecol) {
                tile.DOM.tile.dataset.colum = tilecol[tile.id];
            }
            getBloque(datos.bloque).appendChild(tile.DOM.tile);
        });
        document.dispatchEvent(new CustomEvent('comprimir'));
        delete bloquelist;
        setTimeout(function() {
            document.body.classList.remove('animable');
        }, 1000);
    }
})();