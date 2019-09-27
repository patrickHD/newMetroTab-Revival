var MT = MT || {};
MT.status = MT.status || {};
var remindData = null;
(function () {
    var titular;

    function desactivarMenu() {
        var lateral = document.getElementById('lateral');
        lateral.classList.remove('visible');
        $(lateral).children().removeClass('visible').html('');
        //lateral.firstElementChild.innerHTML = '';

        [].forEach.call(document.querySelectorAll('a.tile'), function (til, i) {
            MT.modelBase[til.id].bloque = til.parentNode.id;
            MT.modelBase[til.id].orden = i;
            MT.modelBase[til.id].guardar();
        });

        lateral = null;
    }

    function fijarColor(color) {
        var tester = document.createElement('div'),
            newColors = 'A4C400,60A917,008A00,00ABA9,1BA1E2,0050EF,6A00FF,AA00FF,F472D0,D80073,A20025,E51400,FA6800,F0A30A,E3C800,825A2C,6D8764,647687,76608A,87794E'.split(',');

        if (this.nodeName)
            color = this.value;
        else if (!color)
            color = '#' + newColors[Math.floor(Math.random() * newColors.length)];

        tester.style.backgroundColor = color;
        if (tester.style.backgroundColor) {
            document.getElementById('addt-bgcolor').value = color;
            document.getElementById('addt-bgcolorsel').value = color;
            document.getElementById('newtilepreview-icono').style.backgroundColor = color;
        }
    }

    function fijarIcono(img) {
        img = !!img.src ? img : this;
        if (!img.src && img.id != "icono") {
            img = document.createElement("img");
            img.id = "icono";
            img.onload = fijarIcono;
            img.src = '/img/space.png';
            return;
        }

        var canv = document.createElement("canvas");
        canv.width = Math.min(img.width, 400);
        canv.height = img.height * canv.width / img.width;
        canv.getContext("2d").drawImage(img, 0, 0, canv.width, canv.height);

        var fin = MT.utiles.cropCanv(canv).toDataURL();
        document.getElementById('newtilepreview-icono').style.backgroundImage = 'url(' + fin + ')';
        document.getElementById('addt-icono').value = fin;

        var color = canv.getContext("2d").getImageData(0, Math.floor(img.height * 2 / 3), 1, 1).data;
        //color = [].splice.call(color, 0);
        var _color = [];
        for(var i in color){
            _color.push(color[i]);
        }
        color = _color;
        if (color.pop() == 255) {
            fijarColor('#' + color.map(toHex).join(''));
        }
    }

    function procesarIcono(url, icono) {
        var img = new Image();
        img.onload = fijarIcono;
        img.src = (typeof url == 'string') ? URLabsrel(url, icono) : url.target.result;
    }

    function subirIcono() {
        var reader = new FileReader();
        reader.onload = function () {
            var img = new Image();
            img.onload = fijarIcono;
            img.src = reader.result;
        };
        reader.readAsDataURL(this.files[0]);
        return false;
    }

    function toHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    }

    function URLabsrel(host, path) {
        var a = document.createElement('a'),
            b = document.createElement('a');
        a.href = path;
        b.href = host;

        if (a.protocol == 'chrome-extension:') {
            if (a.hostname == chrome.runtime.id) {
                var txt1 = a.pathname;
                a.href = host;
                a.pathname = txt1;
            } else {
                a.protocol = b.protocol;
            }
        }
        return a.href;
    }

    function getMetaTags(req) {
        var itm, tag, title, reg = new RegExp('<(?:link|meta)[^>]+?>', 'gi'),
            lista = {},
            tester = document.createElement('div');
        while (tag = reg.exec(req.responseText)) {
            tester.innerHTML = tag;
            itm = tester.firstElementChild;
            if (itm.nodeName == 'META') {
                if (itm.name) lista[itm.name.toLowerCase()] = itm.content;
                else if (itm.getAttribute('property')) lista[itm.getAttribute('property').toLowerCase()] = itm.content;
                else if (itm.getAttribute('itemprop')) lista[itm.getAttribute('itemprop').toLowerCase()] = itm.content;
                else if (itm.getAttribute('http-equiv')) lista[itm.getAttribute('http-equiv').toLowerCase()] = itm.content;
                else lista.undef = itm.content;
            } else if (itm.nodeName == 'LINK') {
                if (itm.href.indexOf('comments/') == -1)
                    lista[itm.rel.toLowerCase() || 'undef'] = URLabsrel(req.canal, itm.href);
            }
        }
        title = new RegExp('<title>(.+)</title>', 'i').exec(req.responseText);
        if (title) lista.title = title[1];
        lista['MTURL'] = req.canal;
        return lista;
    }

    function verURL(evt) {
        var tester = document.createElement('a');
        tester.href = evt.target.value;
        var url = tester.href;

        if (url.indexOf('chrome://') === 0) {
            console.log('Link Interno de Chrome');
            return;
        } else if (url.indexOf('chrome-extension://') === 0) {
            console.log('Link Inter-extensión');
            return;
        } else if (url.indexOf('file://') === 0) {
            console.log('Link Intra-sistema');
            document.getElementById('addt-etiqueta').value = url.split('/').pop();
            document.getElementById('newtilepreview-icono').style.backgroundImage = 'url(/iconos/carpeta.svg)';
            document.getElementById('addt-icono').value = '/iconos/carpeta.svg';
            return;
        }
        asyncXHR(url)
            .then(getMetaTags,function (error) {
                //alert(getI18nMsg('load_urlerror').replace('<newline>','\n'));
                //evt.target.value = 'http://';
            }).then(function (tags) {
                var form = document.forms.agregartile,
                    txt1;

                // http://blogs.msdn.com/b/ie/archive/2012/06/08/high-quality-visuals-for-pinned-sites-in-windows-8.aspx
                if ('msapplication-tileimage' in tags) {
                    asyncIMG(URLabsrel(url, tags['msapplication-tileimage'])).then(fijarIcono);
                    document.getElementById("addt-customico").value = null;
                } else {
                    var iconlist = [];
                    ['apple-touch-icon', 'apple-touch-icon-precomposed', 'og:image', 'image_src', 'shortcut icon', 'icon'].forEach(function (opt) {
                        if (opt in tags)
                            iconlist.push(asyncIMG(URLabsrel(url, tags[opt])));
                    });
                    Q.allSettled(iconlist).then(function (icnlist) {
                        var actual = {naturalWidth: 0, src: ''};
                        icnlist.forEach(function (promise) {
                            if (promise.state == 'rejected')
                                return;
                            if (promise.value.naturalWidth > actual.naturalWidth)
                                actual = promise.value;
                        });
                        fijarIcono(actual);
                        document.getElementById("addt-customico").value = null;
                    }).done();
                }

                if ('msapplication-tilecolor' in tags) {
                    form['addt_bgcolor'].value = tags['msapplication-tilecolor'];
                    form['addt_bgcolorsel'].value = tags['msapplication-tilecolor'];
                    document.getElementById('newtilepreview-icono').style.backgroundColor = tags['msapplication-tilecolor'];
                }

                ['application-name', 'og:site_name', 'title'].some(function (opt) {
                    if (opt in tags) {
                        if (!form['addt_etiqueta'].value) {
                            form['addt_etiqueta'].value = tags[opt];
                            document.getElementById('newtilepreview-etiq').textContent = tags[opt];
                        }
                    }
                    return (opt in tags);
                });

                //if ('msapplication-starturl' in tags) form['addt_link'].value = tags['msapplication-starturl'];
                //if ('canonical' in tags) form['addt_link'].value = tags['canonical'];

                // http://ietestdrive2.com/pinnedsites/
                if ('msapplication-badge' in tags) {
                    txt1 = {};
                    tags['msapplication-badge'].split(';').forEach(function (itm, i) {
                        var dupla = itm.split('=');
                        if (dupla.length == 2) txt1[dupla[0].trim()] = URLabsrel(url, dupla[1].trim());
                    });
                    form['addt-rssurl'].value = txt1['polling-uri'];
                }

                if ('alternate' in tags) {
                    asyncXHR(tags['alternate']).then(function (req) {
                        if (!req.responseXML) return;
                        form['addt-rssurl'].value = tags['alternate'];
                    }).done();
                }
            }).done();
    }

    //新建磁贴
    function crearTile(evt) {
        evt.preventDefault();
        if (!this.checkValidity()) return false;
        var i, el, tile,
            dict = {},
            bloque = document.querySelector('.bloque');//获取第一个分组节点

        //如果没有节点就新建一个分组
        if (!bloque) {
            bloque = document.createElement('div');
            bloque.id = MT.utiles.genID();//生成一个分组ID号
            bloque.className = 'bloque';
            document.getElementById('pivot').appendChild(bloque);//append 分组
        }

        //["addt_etiqueta", "addt_link", "addt_doble", "addt_bloque", "addt_xhricon", "addt_customico"]
        for (i = 0; el = this.elements[i]; i++) {
            dict[el.name.replace('addt_', '')] = (el.type == 'checkbox' ? el.checked : el.value);
        }
        dict.livetile = !!dict.rssurl;//是否为动态
        dict.dimens = dict.dimens.split('');//磁贴大小
        dict.bloque = bloque.id;//ID号

        tile = new Tile(dict);
        //显示DOM元素
        bloque.appendChild(tile.DOM.tile);
        //加入数据库
        tile.guardar();
        //如元素不可见，滚动使其可见
        try {
            tile.DOM.tile.scrollIntoViewIfNeeded();
        } catch (e) {
        }
        //删除回退按钮
        $("#lateral h2 ").empty();
        //
        document.dispatchEvent(new CustomEvent('comprimir'));
        $('#lateral').add(this).removeClass('visible');
    }

    function generarAddTile() {
        var target, etiq, icono, label, itm, i,
            titular = document.getElementById('lateral').firstElementChild,
            form = document.getElementById('agregartile');

        // Procedimiento de rutina del lateral
        form.innerHTML = '';
        new DOMgen('div', null, 'btnregreso').on('click', desactivarMenu).appTo(titular);
        new DOMgen('span').i18n('menu_addt').appTo(titular);

        // Vista previa
        label = new DOMgen('div').clase('label clear').appTo(form).item;
        //new DOMgen('span').clase('sidelabel').i18n('vistaprevia').attr('style','display: block;').appTo(label);
        target = new DOMgen('div', 'newtilepreview', 'tile tam22').appTo(label).item;
        icono = new DOMgen('div', 'newtilepreview-icono', 'icono').appTo(target).item;
        etiq = new DOMgen('div', 'newtilepreview-etiq', 'etiqueta').appTo(target).item;

        // Link
        label = new DOMgen('label').attr('for', 'addt-link').appTo(form).item;
        new DOMgen('span').clase('sidelabel').i18n('addt_link').appTo(label);
        var link = new DOMgen('input', 'addt-link', 'addtileinput fullwidth').on('change', verURL).attr({
            type: 'url',
            name: 'addt_link',
            placeholder: 'http://',
            required: true
        }).appTo(label).item;
        link.value = 'http://';
        new DOMgen('small').clase('label clear').i18n('addt_avisoxhr').appTo(form);

        // Etiqueta
        label = new DOMgen('label').attr('for', 'addt-etiqueta').appTo(form).item;
        new DOMgen('span').clase('sidelabel').i18n('addt_etiqueta').appTo(label);
        new DOMgen('input').id('addt-etiqueta').clase('addtileinput fullwidth').on('change',function () {
            etiq.textContent = this.value;
        }).attr({
            type: 'text',
            name: 'addt_etiqueta',
            required: true
        }).appTo(label);

        // Color de fondo
        label = new DOMgen('label').attr('for', 'addt-bgcolor').appTo(form).item;
        new DOMgen('span').clase('sidelabel').i18n('addt_bgcolor').appTo(label);
        new DOMgen('input').id('addt-bgcolorsel').clase('addtileinput').on('change', fijarColor).attr({
            type: 'color',
            name: 'addt_bgcolorsel'
        }).appTo(label);
        new DOMgen('input').id('addt-bgcolor').clase('addtileinput').on('change', fijarColor).attr({
            type: 'text',
            name: 'addt_bgcolor'
        }).appTo(label);
        fijarColor();

        // Tamaño
        new DOMgen('input').id('addt-dimens').clase('addtileinput').attr({
            type: 'hidden',
            name: 'addt_dimens'
        }).appTo(form).item;
        label = new DOMgen('label').attr('for', 'addt-dimens').appTo(form).item;
        new DOMgen('span').clase('sidelabel').i18n('addt_tamano').appTo(label);
        var hold = new DOMgen('div').attr('style', 'text-align: center;').appTo(label).item;
        var btntamano = [
            new DOMgen('input', 'addt-tam22', 'btntamano').i18n('action_sizenormal'),
            new DOMgen('input', 'addt-tam42', 'btntamano').i18n('action_sizewide').attr('style', 'margin: 0 10px;'),
            new DOMgen('input', 'addt-tam44', 'btntamano').i18n('action_sizelarge')
        ];

        function selTamano(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var i, itm,
                elems = this.form.querySelectorAll('.btntamano');
            for (i = 0; itm = elems[i]; i++)
                itm.classList.remove('submit');
            this.classList.add('submit');
            this.form.addt_dimens.value = this.id.replace(/\D/g, '');
            document.getElementById('newtilepreview').className = 'tile ' + this.id.split('-')[1];
        }

        for (i = 0; itm = btntamano[i]; i++)
            itm.clase('btn btntamano').attr('type', 'button').on('click', selTamano).appTo(hold);
        btntamano[0].item.click();

        // Icono
        new DOMgen('input').id('addt-icono').clase('addtileinput').attr({
            type: 'hidden',
            name: 'addt_icono'
        }).appTo(form);
        label = new DOMgen('label').attr('for', 'addt-customico').appTo(form).item;
        new DOMgen('span').clase('sidelabel').i18n('addt_customico').appTo(label);
        new DOMgen('small').clase('label').i18n('addt_tipxhrico').appTo(label);
        new DOMgen('input').id('addt-customico').clase('fullwidth').attr({
            type: 'file',
            name: 'addt_customico',
            accept: 'image/*'
        }).on('change', subirIcono).appTo(label);

        // Live tiles
        label = new DOMgen('label').attr('for', 'addt-rssurl').appTo(form).item;
        new DOMgen('span').clase('sidelabel').i18n('addt_rssurl').appTo(label);
        new DOMgen('input').id('addt-rssurl').clase('addtileinput').attr({
            type: 'url',
            name: 'addt_rssurl'
        }).appTo(label);
        label = new DOMgen('div').clase('botonesfin').appTo(form).item;
        new DOMgen('input').id('addt-crear').clase('btn submit').attr('type', 'submit').i18n('addt_crear').appTo(label);
        label.appendChild(document.createTextNode(' '));
        new DOMgen('input').id('addt-reset').clase('btn').attr('type', 'reset').i18n('opcion_cancelar').appTo(label);
        form.onsubmit = crearTile;
        form.onreset = desactivarMenu;
        $('#lateral').add(form).addClass('visible');
        target = null;
    }
    function cloudSiteBind(){
        var menushow = false;
        $('.hType').unbind("mouseover").bind("mouseover",function () {
            menushow = true;
            $(".cwMenu").show();
        });
        $('.hType').unbind("mouseleave").bind("mouseleave",function () {
            menushow = false;
            setTimeout(function(){
                if(menushow == false){
                    $(".cwMenu").hide();
                }
            },300);
        });
        $(".cwMenu").unbind("mouseover").bind("mouseover",function () {
            menushow = true;
            $(".cwMenu").show();
        });
        $(".cwMenu").unbind("mouseleave").bind("mouseleave",function () {
            menushow = false;
            setTimeout(function(){
                if(menushow == false){
                    $(".cwMenu").hide();
                }
            },300);
        });
        $(".cwMenu div").unbind("click").bind("click", function () {
            getCloudSite($(this).attr("flag"));
        });
    }
    function SiteView(json){
        var html = "";
        for (var i = 0; i < json.length; i++) {
            var icono = json[i].icono;
            var etiqueta = json[i].etiqueta;
            var description = typeof json[i].description != 'undefined' ? json[i].description : '';
            var live = typeof json[i].live != 'undefined' ? '<div class="rss"></div>' : '';
            var newhtml = typeof json[i].pubTime != 'undefined' ? '<div class="new"></div>' : '';
            if(description.length > 100){
                description = description.substr(0,100) + "...";
            }
            var background = json[i].bgcolor;
            var install = json[i].hashid in MT.modelBase ? 'Installed' : 'Install';
            html += '<li><div class="bLeft" style="background-color: ' + background + '">' + newhtml + '<img src="' + icono + '"/></div><div class="bRight">' +
                '<div class="h"><a style="color:black" href="' + json[i].link + '"><div>' + etiqueta + '</div>' + live + '</a></div><div class="b">' + description + '</div>' +
                '<div class="' + install + '" index=' + i + '>' + getI18nMsg(install) + '</div></div></li>';
        }
        html += '</ul></div>';
        $("#restaurarbkp").find("ul").html(html);
        $(".hSearch input").unbind("keyup").bind("keyup",function(){
            var self = this;
            $(".cwBody ul li").hide();
            $(".h a").each(function(i,n){
                if($(this).find("div").html().toLowerCase().search($(self).val().toLowerCase())!=-1){
                    $(this).parents("li").show();
                }
            });
        });
        $(".Install").unbind("click").bind("click",function(){
            var i, el, tile,
                dict = {},
                bloque = document.querySelector('.bloque');//获取第一个分组节点
            if (!bloque) {
                bloque = document.createElement('div');
                bloque.id = MT.utiles.genID();//生成一个分组ID号
                bloque.className = 'bloque';
                document.getElementById('pivot').appendChild(bloque);//append 分组
            }
            var index = $(this).attr("index");
            json[index].bloque = bloque.id;
            var tile = new Tile(json[index]);
            //显示DOM元素
            bloque.appendChild(tile.DOM.tile);
            //加入数据库
            tile.guardar();
            //如元素不可见，滚动使其可见
            document.dispatchEvent(new CustomEvent('comprimir'));
            try {
                tile.DOM.tile.scrollIntoViewIfNeeded();
            } catch (e) {
            }
            $(this).html(getI18nMsg("Installed"));
            $(this).removeClass("Install").addClass("Installed");
            $(this).unbind("click");
        });
    }
    function getCloudSite(flag) {
        if(flag == 4){
            var json = [];
            chrome.management.getAll(function (lista) {
                lista.forEach(function (itm, i) {
                    if (!itm.isApp || !itm.enabled) return;
                    var dict = {
                        hashid: itm.id,
                        etiqueta: itm.name,
                        link: itm.appLaunchUrl,
                        description:itm.description,
                        icono: [0, ''],
                        chromeapp: {
                            descr: itm.description,
                            homepg: itm.homepageUrl,
                            version: itm.version,
                            options: itm.optionsUrl,
                            type: itm.type
                        }
                    };
                    Object.keys(itm.icons).forEach(function (j) {
                        if (itm.icons[j].size > dict.icono[0])
                            dict.icono = [itm.icons[j].size, itm.icons[j].url];
                    });
                    dict.icono = dict.icono[1];
                    json.push(dict);
                });
                SiteView(json);
            });
        }else{
            $.get(webUrl + "cloudsites/index.php?flag=" + flag, function (data) {
                try {
                    var json = JSON.parse(data);
                    SiteView(json);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    }
    function generarRestoreTiles() {
        if(remindData && remindData.gameTile.num > 0){
            $("#menu-restaurarTiles").removeClass("redPoint");
            $("#redPoint").remove();
            remindData.gameTile.num = 0;
            localStorage.setItem("remindData",JSON.stringify(remindData));
        }
        var hold = document.getElementById('restaurarbkp'),
            titular = document.getElementById('lateral').firstElementChild;
        var html = '<div class="cwHead"><div class="hType"></div><div class="hSearch"><input type="text" placeholder="'+ getI18nMsg("search") +'"/></div></div>' +
            '<div class="cwBody"><ul></ul></div><div class="cwMenu"><div class="game" flag="1">'+ getI18nMsg("games") +'</div><div class="shop" flag="2">'+ getI18nMsg("shopping") +'</div><div class="myapps" flag="4">'+ getI18nMsg("myapps") +'</div><div class="hot" flag="3">'+ getI18nMsg("hotsites") +'</div><div class="all" flag="0">'+ getI18nMsg("allsites") +'</div></div>';
        hold.innerHTML = html;
        cloudSiteBind();
        $('#lateral').add(hold).addClass('visible');
        new DOMgen('div', null, 'btnregreso').on('click', desactivarMenu).appTo(titular);
        new DOMgen('span').i18n('menu_rest').appTo(titular);
        getCloudSite(0);
        hold = titular = null;
        return false;
    }
    function obtenerPCR() {
        var hold = document.getElementById('cerradas'),
            titular = document.getElementById('lateral').firstElementChild;
        hold.innerHTML = '';

        new DOMgen('div', null, 'btnregreso').on('click', desactivarMenu).appTo(titular);
        new DOMgen('span').i18n('opcional_activpcrh2').appTo(titular);
        chrome.storage.local.get('cerradas', function (item) {
            console.warn('Elementos guardados PCR', item);
            var listadoCerrado = item.cerradas || [];
            listadoCerrado.forEach(function (tab) {
                var elem = new DOMgen('a', 'pcr' + tab.id, 'listlat').attr('href', tab.url).attr('title', tab.title).appTo(hold).item;
                new DOMgen('div').clase('icono').attr('style', 'background-image: url(' + (tab.favIconUrl || 'chrome://favicon/' + tab.url) + '); background-size: 24px;').appTo(elem);
                new DOMgen('span').txt(tab.title).appTo(elem);
                new DOMgen('span').clase('subtxt').txt(tab.url).appTo(elem);
            });
            $('#lateral').add(hold).addClass('visible');
            hold = titular = null;
        });
        return false;
    }
    function cargarMarcadores() {
        document.dispatchEvent(new CustomEvent('marcadores'));
    }

    window.addEventListener(windowLoad, function () {
        //取右上角个人信息节点
        var avtrmenu = document.getElementById('desplegable').parentNode;

        //高级定义属性方法
        Object.defineProperty(MT.status, 'lateral', {
            get: function () {
                return document.getElementById('lateral').classList.contains('visible');
            }
        });

        Object.defineProperty(MT.status, 'avatarmenu', {
            get: function () {
                return document.getElementById('desplegable').classList.contains('visible');
            }
        });

        function toggleMenuVisible() {
            document.getElementById('desplegable').classList.toggle('visible');
        }

        var perms = ['tabs', 'bookmarks'].map(tengoPermiso);
        Q.allSettled(perms).spread(function (tabs, bkmr) {
            var avtrmenu = document.getElementById('desplegable');
            avtrmenu.style.webkitTransitionDuration = '0.2s';

            new DOMgen('span').id('menu-agregarTile').i18n('menu_addt').on('click', generarAddTile).appTo(avtrmenu);
            new DOMgen('span').id('menu-restaurarTiles').i18n('menu_rest').on('click', generarRestoreTiles).appTo(avtrmenu);

            if (tabs.value)
                new DOMgen('span').id('menu-pcr').i18n('menu_pcr').on('click', obtenerPCR).appTo(avtrmenu);

            if (bkmr.value) {
                new DOMgen('link').attr({rel: 'stylesheet', type: 'text/css', href: '/tiles_bkmr.css'}).prepTo(document.getElementById('varsty'));
                new DOMgen('script').attr({type: 'text/javascript', async: true, src: '/js/bookmarks.js'}).appTo(document.head);
                new DOMgen('span').id('menu-bkmr').i18n('menu_bkmr').on('click', cargarMarcadores).appTo(avtrmenu);
            }
            new DOMgen('span').id('menu-opciones').i18n('opcionesh1').on('click',function () {
                location.pathname = '/opciones.html';
                return false;
            }).appTo(avtrmenu);
            new DOMgen('span').id('menu-opciones').i18n('acerca_apoyo').on('click',function () {
                location.href = '/opciones.html#acercade';
                return false;
            }).appTo(avtrmenu);
            avtrmenu = null;
        });
        document.addEventListener('desactLateral', desactivarMenu, false);
        document.addEventListener('desactAvatar', function () {
            document.getElementById('desplegable').classList.remove('visible');
        }, false);
    }, false);
})();