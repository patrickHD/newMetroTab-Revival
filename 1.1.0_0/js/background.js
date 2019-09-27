var listadoCerrado, listadoCompleto;
var getI18nMsg = function (msgname) {
    try {
        return chrome.i18n.getMessage(msgname);
    } catch (err) {
        return msgname;
    }
};
chrome.management.onInstalled.addListener(function (info) {
    if (!info.isApp)
        return;

    var dict = {
        hashid: info.id,
        etiqueta: info.name,
        link: info.appLaunchUrl,
        isApp: info.isApp,
        chromeapp: {
            tipo: info.type,
            descr: info.description,
            homepg: info.homepageUrl,
            version: info.version,
            options: info.optionsUrl,
            type: info.type
        }
    };

    var icono = [0, ''];
    for (j in info.icons) {
        if (info.icons[j].size > icono[0])
            icono = [info.icons[j].size, info.icons[j].url];
    }
    dict.icono = icono[1];

    var text = JSON.stringify(dict);
    localStorage.setItem('appendiente', text);

    var tabid = parseInt(localStorage.getItem('ultidpest'));
    chrome.tabs.sendMessage(tabid, dict, function (response) {
        console.log(response);
    });
});

chrome.runtime.onStartup.addListener(function () {
    if (localStorage.getItem('opcional_pcrsesiones') === 'true') {
        chrome.storage.local.remove('cerradas', function (result) {
            console.log('Estado del borrado de sesiones', result);
            localStorage.setItem('borrado', JSON.stringify(result));
        });
    }
});

chrome.permissions.contains({ permissions: ['tabs'] }, function (result) {
    if (result) {
        var ignorar = new RegExp('about:blank|chrome://newtab/|chrome-devtools://'),
            limite = Math.min(25, localStorage.getItem('opcional_pcrnum'));

        listadoCompleto = JSON.parse(localStorage.getItem('listadoCompleto') || '{}');

        chrome.storage.local.get('cerradas', function (item) {
            listadoCerrado = item.cerradas || [];
        });

        chrome.tabs.onUpdated.addListener(function (id, cambios, tab) {
            if (!tab)
                return;
            //console.log(tab);
            if (tab.url && cambios.status == 'complete')
                listadoCompleto[id] = tab;
        });

        chrome.tabs.onRemoved.addListener(function (id, info) {
            var tab = listadoCompleto[id];
            if (!(id in listadoCompleto) || ignorar.test(tab.url))
                return;

            listadoCerrado.unshift(tab);
            while (listadoCerrado.length > limite)
                listadoCerrado.pop();

            chrome.storage.local.set({
                cerradas: listadoCerrado
            });
            delete listadoCompleto[id];
        });

        chrome.runtime.onSuspend.addListener(function () {
            localStorage.setItem('listadoCompleto', JSON.stringify(listadoCompleto));
        });
    }
});

if (chrome.runtime) {
    if (chrome.runtime.onInstalled) {
        chrome.runtime.onInstalled.addListener(function (details) {
            var instalado = (localStorage.getItem('instalado') === 'true');
            if (!instalado) {
                //Eventos de instalación
                localStorage.setItem('instalado', false);
                MT.miniDB.abrir().then(function () {

                    chrome.management.getAll(function (lista) {
                        lista.forEach(function (itm, i) {
                            if (!itm.isApp || !itm.enabled) return;
                            var dict = {
                                hashid: itm.id,
                                etiqueta: itm.name,
                                link: itm.appLaunchUrl,
                                chromeapp: {
                                    descr: itm.description,
                                    homepg: itm.homepageUrl,
                                    version: itm.version,
                                    options: itm.optionsUrl,
                                    type: itm.type
                                }
                            };
                            var icono = [0, ''];
                            for (j in itm.icons) {
                                if (itm.icons[j].size > icono[0]) icono = [itm.icons[j].size, itm.icons[j].url];
                            }
                            dict.icono = icono[1];
                            //从倒数第二个开始添加APP应用
                            tilebkp.splice(-1, 0, dict);
                        });


                        tilebkp.forEach(function (itm, i) {
                            var tile = new Tile(itm);
                            tile.orden = i;
                            tile.bloque = !!itm.bloque?itm.bloque:"group_2";
                            tile.guardar();
                        });
                    });

                    localStorage.setItem('apar_animarapertura', true);
                    localStorage.setItem('apar_animartiles', true);
                    localStorage.setItem('apar_newtabh1', getI18nMsg('newtabh1'));
                    localStorage.setItem('apar_bgcolor', '#004D60;#008287;#004050;#306772');
                    localStorage.setItem('apar_bgimg', '/img/burbujas.svg');
                    localStorage.setItem('apar_miniscrollbar', 'true');
                    localStorage.setItem('livet_zonahora', '[{"pais":"CL","lugar":"Santiago","offnor":"-3.0","offdst":"-4.0","dston":"false"}]');
                    localStorage.setItem('livet_tiempo', 3);
                    localStorage.setItem('apar_usuariobig', getI18nMsg('apar_usuariobig'));
                    localStorage.setItem('apar_usuariosmall', getI18nMsg('apar_usuariosmall'));
                    localStorage.setItem('opcional_pcrnum', 15);
                    localStorage.setItem("code", parseInt(new Date().getTime() / 1000) + '' + parseInt(1000 + Math.round(Math.random() * 8999)));
                    localStorage.setItem('instalado', true);
                });
            } else {
                //Eventos de actualización
                if (!'apar_parallaxbg' in localStorage)
                    localStorage.setItem('apar_parallaxbg', true);
            }
        });
    }
}