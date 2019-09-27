var MT = MT || {};
MT.status = MT.status || {};
MT.contextual = {
    apps: {}
};

window.addEventListener(windowLoad, function () {
    var flyoutbox, ult,
        pivot = document.getElementById('pivot'),
        menucont = document.getElementById('contextual'),
        pretiles = tilebkp.map(function (i) {
            return i.hashid
        }).join(',');

    MT.status.__defineGetter__('contextual', function () {
        return menucont.childElementCount > 0;
    });

    function desactivarFlyout() {
        if (flyoutbox) {
            flyoutbox.parentNode.removeChild(flyoutbox);
            flyoutbox = null;
        }
    }

    function desactivarMenu() {
        menucont.innerHTML = '';
        ult = null;
        desactivarFlyout();
        [].forEach.call(document.querySelectorAll('.seleccionado'), function (itm) {
            itm.classList.remove('seleccionado');
        });
    }

    function procesarImg(img) {
        var color, datauri,
            tileid = document.querySelector('.tile.seleccionado').id,
            canv = document.createElement("canvas");

        canv.width = Math.min(img.width, 400);
        canv.height = img.height * canv.width / img.width;
        canv.getContext("2d").drawImage(img, 0, 0, canv.width, canv.height);

        datauri = MT.utiles.cropCanv(canv).toDataURL();
        MT.modelBase[tileid].setIcono(datauri);

        color = canv.getContext("2d").getImageData(0, Math.floor(img.height * 2 / 3), 1, 1).data;
        //color = [].splice.call(color, 0);
        var _color = [];
        for(var i in color){
            _color.push(color[i]);
        }
        color = _color;
        if (color.pop() == 255) {
            MT.modelBase[tileid].setColor('rgb(' + color.join(',') + ')');
        }
        desactivarMenu();
    }

    function cambiarIcono(evt) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            asyncIMG(evt.target.result).done(procesarImg);
        };
        reader.readAsDataURL(this.files[0]);
        return false;
    }

    function cambiarColor() {
        var color = this.value;
        console.log(color);
        [].forEach.call(document.querySelectorAll('.tile.seleccionado'), function (tile) {
            MT.modelBase[tile.id].setColor(color);
        });
        desactivarMenu();
    }

    function preguntarColor() {
        var sel = document.querySelectorAll('.tile.seleccionado'),
            tester = document.createElement('div');
        tester.style.backgroundColor = prompt(getI18nMsg('ingresarcolor').replace('<newline>', '\n'), MT.modelBase[sel[0].id].bgcolor);
        color = tester.style.backgroundColor;
        if (color) {
            [].forEach.call(sel, function (tile) {
                MT.modelBase[tile.id].setColor(color);
            });
            desactivarMenu();
        }
    }

    function esApp(itm) {
        return itm.classList.contains('app');
    }

    function seleccionTile(evt) {
        var target = evt.target;
        evt.preventDefault();
        while (!matcheSelector(target,'a.tile')) {
            target = target.parentNode;
            if (!this.contains(target)) return;
        }
        evt.stopPropagation();

        target.classList.toggle('seleccionado');
        var del,
            selecao = document.querySelectorAll('.tile.seleccionado');

        if (evt.shiftKey && ult) {
            var i,
                st = [].splice.call(document.querySelectorAll('a.tile'), 0),
                ini = st.indexOf(ult),
                fin = st.indexOf(target);
            for (i = Math.min(ini, fin); i < Math.max(ini, fin); i++) {
                st[i].classList.add('seleccionado');
            }
            selecao = document.querySelectorAll('.tile.seleccionado');
        }
        ult = target;

        function genOpcion(id, i18nlabel, subclase) {
            var i,
                btn = document.createElement('span');
            btn.id = id;
            btn.className = 'ctxnormal';
            if (subclase) {
                subclase = subclase.split('.');
                for (i = 0; i < subclase.length; i++)
                    btn.classList.add(subclase[i]);
            }
            btn.textContent = getI18nMsg(i18nlabel);
            menucont.appendChild(btn);
            return btn;
        }

        if (selecao.length == 0) {
            desactivarMenu();
        } else {
            requestAnimFrame(function () {
                menucont.innerHTML = '';
                genOpcion('ctxtile-deselec', 'action_deselect', 'ico-deselec.principio');

                if (selecao.length === 1)
                    genOpcion('ctxbloque-nombBloque', 'ctxbloque_nombBloque', 'ico-btitle.principio');
                genOpcion('ctxtile-opennewtab', 'action_opennewtab', 'ico-newtab.principio');

                if (selecao.length == 1) {
                    var tile = MT.modelBase[selecao[0].id];

                    if (selecao[0].href.indexOf('chrome-extension://') !== 0)
                        genOpcion('ctxtile-copylink', 'action_copylink', 'ico-copiar.principio');

                    // Option to change RSS feed URL only for user created tiles
                    if (pretiles.indexOf(tile.id) === -1)
                        genOpcion('ctxtile-cambiarss', 'action_cambiarss', 'ico-rss');

                    if (tile.rssurl || tile.id == 'tilegmail')
                        genOpcion('ctxtile-livetoggle', 'action_live' + (tile.livetile ? 'desac' : 'activ'), 'ico-livetile.' + (tile.livetile ? 'off' : 'on'));

                    genOpcion('ctxtile-etiquetar', 'action_rename', 'ico-etiqueta');
                    genOpcion('ctxtile-editarurl', 'action_editurl', 'ico-lapiz');
                    genOpcion('ctxtile-cambiaicono', 'action_changeicon', 'ico-icono.hasflyout');
                }
                genOpcion('ctxtile-cambiacolor', 'action_changebgcolor', 'ico-color.hasflyout');
                genOpcion('ctxtile-cambiatam', 'action_changesize', 'ico-tamano.hasflyout');
                del = genOpcion('ctxtile-eliminar', 'action_delete', 'ico-sacar');
                if ([].every.call(selecao, esApp)) {
                    genOpcion('ctxtile-desinstalarApp', 'action_uninstallapp', 'ico-eliminar');
                    del.classList.add('app');
                }
            });
        }
    }

    pivot.addEventListener('contextmenu', seleccionTile, false);

    menucont.addEventListener('click', function (evt) {
        var target = evt.target;
        while (!matcheSelector(target,'span.ctxnormal')) {
            target = target.parentNode;
            if (!this.contains(target)) return;
        }
        evt.stopPropagation();

        var label, inp,
            accion = target.id.split('-');
        desactivarFlyout();

        // Actions for bookmarks' contextual menu
        if (accion[0] == 'ctxbkmr') {
            switch (accion[1]) {
                case 'eliminar':
                    [].forEach.call(document.querySelectorAll('.bkmrlink.seleccionado'), function (tile) {
                        chrome.bookmarks.remove(tile.dataset.id, function () {
                            tile.parentNode.removeChild(tile);
                            window.dispatchEvent(new CustomEvent('resize'));
                        });
                    });
                    break;

                case 'opennewwin':
                    var pase,
                        lista = document.querySelectorAll('#bookmarks .seleccionado');

                    if (lista[0].classList.contains('bkmrcarp')) {
                        chrome.bookmarks.getChildren(lista[0].dataset.id, function (li) {
                            var i,
                                list = [];
                            for (i = 0; i < li.length; i++) {
                                if (li[i].url)
                                    list.push(li[i].url);
                            }
                            pase = list.length > 12 ? confirm(getI18nMsg('warn_manytabs').replace('<num>', list.length)) : true;
                            if (pase)
                                chrome.windows.create({ url: list });
                        });
                        lista = null;
                    } else {
                        lista = [].map.call(lista, function (i) {
                            return i.href;
                        });
                        pase = lista.length > 12 ? confirm(getI18nMsg('warn_manytabs').replace('<num>', lista.length)) : true;
                        if (pase)
                            chrome.windows.create({ url: lista });
                    }
                    break;

                case 'renombrar':
                    var tile = document.querySelector('#bookmarks .seleccionado'),
                        newtitle = prompt(getI18nMsg('ingresaretiqueta'), tile.textContent);
                    if (newtitle && newtitle != tile.textContent) {
                        chrome.bookmarks.update(tile.dataset.id, { title: newtitle }, function () {
                            tile.lastElementChild.textContent = newtitle;
                        });
                    }
                    break;

                case 'copylink':
                    var txtarea = new DOMgen('textarea').txt(document.querySelector('.bkmrlink.seleccionado').href).appTo(menucont).item;
                    txtarea.select();
                    document.execCommand('copy');
                    menucont.removeChild(txtarea);
                    txtarea = null;
                    break;
            }
            // Actions for normal tiles contextual menu
        } else {
            switch (accion[1]) {
                case 'deselec':
                    break;

                case 'opennewtab':
                    var i,
                        lista = document.querySelectorAll('.tile.seleccionado'),
                        pase = lista.length > 12 ? confirm(getI18nMsg('warn_manytabs').replace('<num>', lista.length)) : true;
                    if (pase) {
                        for (i = 0; i < lista.length; i++) {
                            chrome.tabs.create({url: lista[i].href, selected: false});
                        }
                    }
                    break;

                case 'editarurl':
                    var tile = MT.modelBase[document.querySelector('.tile.seleccionado').id],
                        url = prompt(getI18nMsg('ctxinstr_inputurl'), tile.link);
                    if (url) {
                        tile.link = url;
                        tile.actualizar();
                        tile.guardar();
                    }
                    break;

                case 'cambiatam':
                    flyoutbox = document.createElement('div');
                    flyoutbox.className = 'flyoutbox';
                    target.appendChild(flyoutbox);

                    //['smallx1x1', 'normalx2x2', 'anchox4x2', 'grandex4x4'].forEach(function(itm) {
                    ['normalx2x2', 'widex4x2', 'largex4x4'].forEach(function (itm) {
                        var dt = itm.split('x'),
                            label = document.createElement('span');
                        label.textContent = getI18nMsg('action_size' + dt[0]);
                        label.dataset.ancho = dt[1];
                        label.dataset.alto = dt[2];
                        label.addEventListener('click', function (evt) {
                            var i, tile,
                                lista = document.querySelectorAll('.tile.seleccionado');
                            for (i = 0; tile = lista[i]; i++)
                                MT.modelBase[tile.id].cambiaTam(evt.target.dataset.ancho, evt.target.dataset.alto);
                            document.dispatchEvent(new CustomEvent('comprimir'));
                            desactivarMenu();
                            lista = tile = null;
                        }, false);
                        flyoutbox.appendChild(label);
                        dt = label = null;
                    });

                    flyoutbox.classList.add('visible');
                    return;

                case 'cambiacolor':
                    flyoutbox = document.createElement('div');
                    flyoutbox.className = 'flyoutbox';
                    target.appendChild(flyoutbox);

                    label = document.createElement('span');
                    label.textContent = getI18nMsg('action_transparent');
                    label.addEventListener('click', function transparentar(e) {
                        e.stopPropagation();
                        [].forEach.call(document.querySelectorAll('.tile.seleccionado'), function (tile) {
                            MT.modelBase[tile.id].setColor('transparent');
                        });
                        desactivarMenu();
                    }, false);
                    flyoutbox.appendChild(label);

                    label = document.createElement('label');
                    label.setAttribute('for', 'ctxtile-colorinp');
                    label.textContent = getI18nMsg('action_colorpick');
                    label.addEventListener('click', function (e) {
                        e.stopPropagation()
                    }, false);
                    flyoutbox.appendChild(label);

                    inp = document.createElement('input');
                    inp.type = 'color';
                    inp.id = 'ctxtile-colorinp';
                    inp.value = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    inp.addEventListener('change', cambiarColor, false);
                    label.appendChild(inp);

                    label = document.createElement('span');
                    label.textContent = getI18nMsg('action_incsscolor');
                    label.addEventListener('click', preguntarColor, false);
                    flyoutbox.appendChild(label);

                    flyoutbox.classList.add('visible');
                    return;

                case 'cambiaicono':
                    flyoutbox = document.createElement('div');
                    flyoutbox.className = 'flyoutbox';
                    target.appendChild(flyoutbox);

                    label = document.createElement('label');
                    label.setAttribute('for', 'ctxtile-colorinp');
                    label.textContent = getI18nMsg('load_file');
                    label.onclick = function (e) {
                        e.stopPropagation()
                    };
                    flyoutbox.appendChild(label);

                    inp = document.createElement('input');
                    inp.type = 'file';
                    inp.id = 'ctxtile-colorinp';
                    inp.accept = 'image/*';
                    inp.addEventListener('change', cambiarIcono, false);
                    label.appendChild(inp);

                    label = document.createElement('span');
                    label.textContent = getI18nMsg('load_url');
                    label.addEventListener('click', function cargarIcono(evt) {
                        var url = prompt('Enter the image URL');
                        if (url) {
                            asyncIMG(url).done(procesarImg, function () {
                                alert(getI18nMsg('invalid_url'));
                            });
                        }
                    }, false);
                    flyoutbox.appendChild(label);

                    label = document.createElement('span');
                    label.textContent = getI18nMsg('action_icondeletion');
                    label.addEventListener('click', function borrarIcono(evt) {
                        asyncIMG('/img/pix.gif').done(procesarImg);
                    }, false);
                    flyoutbox.appendChild(label);

                    flyoutbox.classList.add('visible');
                    return;

                case 'cambiarss':
                    var model = MT.modelBase[document.querySelector('.tile.seleccionado').id],
                        url = prompt(getI18nMsg('ctxinstr_cambiarss'), model.rssurl);
                    if (url && url.indexOf('http') === 0) {
                        model.rssurl = url;
                        model.DOM.icon.innerHTML = '';
                        model.DOM.name.style.display = 'block';
                        model.guardar();
                    }
                    break;

                case 'copylink':
                    var txtarea = new DOMgen('textarea').txt(document.querySelector('.tile.seleccionado').href).appTo(menucont).item;
                    txtarea.select();
                    document.execCommand('copy');
                    menucont.removeChild(txtarea);
                    txtarea = null;
                    break;

                case 'livetoggle':
                    var model = MT.modelBase[document.querySelector('.tile.seleccionado').id];
                    model.livetile = !model.livetile;
                    model.guardar();
                    break;

                case 'nombBloque':
                    var reg,
                        target = document.querySelector('.tile.seleccionado').parentNode,
                        nombre = prompt(getI18nMsg('ctxinstr_nombloque'), target.dataset.titulo);
                    if (nombre !== null && nombre !== false) {
                        target.dataset.titulo = nombre;
                        reg = JSON.parse(localStorage.getItem('bloques_info'));
                        reg[target.id][2] = nombre;
                        localStorage.setItem('bloques_info', JSON.stringify(reg));
                    }
                    break;

                default:
                    [].forEach.call(document.querySelectorAll('.tile.seleccionado'), function (tile) {
                        MT.modelBase[tile.id][accion[1]]();
                    });
                    break;
            }
        }

        desactivarMenu();
    }, false);

    document.addEventListener('desactContextual', desactivarMenu, false);
}, false);