var MT = MT || {};
MT.utiles = {};

MT.registrar = function (a) {
    console.log(arguments);
};
MT.negar = function () {
    return false;
};
MT.recargar = function () {
    location.reload();
};

MT.utiles.genID = function () {
    return 'mtabyyxyxxxyxyxyxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};
MT.utiles.unsortList = function (lista) {
    var tmp, current, top = lista.length;
    while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = elems[current];
        lista[current] = elems[top];
        lista[top] = tmp;
    }
    return lista;
};

MT.utiles.cropCanv = function (c) {
    // https://gist.github.com/remy/784508
    var i, x, y, ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d'),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
        };
    //console.log(c.width, c.height);
    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~((i / 4) / c.width);
            if (bound.top === null) bound.top = y;
            if (bound.left === null || x < bound.left) bound.left = x;
            if (bound.right === null || bound.right < x) bound.right = x;
            if (bound.bottom === null || bound.bottom < y) bound.bottom = y;
        }
    }
    bound.bottom++;
    bound.right++;
    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left;
    if (pixels.data[3] === 255 && trimWidth == c.width && trimHeight == c.height)
        return c;

    //console.log(trimWidth, trimHeight, bound);
    var trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);
    if (trimmed.data[3] === 255 && trimmed.data[4 * trimWidth - 1] === 255 && trimmed.data[4 * trimWidth + 3] === 255)
        return copy.canvas;

    var borde = Math.floor((c.width + c.height) * 0.12);
    copy.canvas.width = trimWidth + (borde * 2);
    copy.canvas.height = trimHeight + (borde * 2);
    copy.putImageData(trimmed, borde, borde);//borde - bound.left, borde - bound.top);

    return copy.canvas;
};

MT.utiles.lang = {
    get: function () {
        var i = arguments[0] || window.navigator.language;
        i = i.replace('-', '_').toLowerCase();
        return this[i.substr(0, 2)] || this[i] || i.substr(0, 2).toUpperCase();
    },
    getex: function () {
        var i = arguments[0] || window.navigator.language;
        i = i.replace('-', '_').toLowerCase();
        return this[i] || this[i.substr(0, 2)] || 'EN';
    },
    en: 'EN',
    es: 'SP',
    de: 'DL',
    ja: 'JP',
    pt: 'BR',
    zh_cn: 'CN',
    zh_tw: 'TW',
    ar: 'AR',
    it: 'IT',
    fr: 'FR',
    ru: 'RU'
};

MT.utiles.instalacion = function (arg, fn) {
    fn = fn || function () {
    };
    console.log('instalacion a la antigua en progreso');

    if (arg || !chrome.runtime || !chrome.runtime.onInstalled) {
        !localStorage.getItem('apar_animarapertura') && localStorage.setItem('apar_animarapertura', true);
        !localStorage.getItem('apar_animartiles') && localStorage.setItem('apar_animartiles', true);
        !localStorage.getItem('apar_newtabh1') && localStorage.setItem('apar_newtabh1', getI18nMsg('newtabh1'));
        !localStorage.getItem('apar_bgcolor') && localStorage.setItem('apar_bgcolor', '#004D60;#008287;#004050;#306772');
        !localStorage.getItem('apar_bgimg') && localStorage.setItem('apar_bgimg', '/img/burbujas.svg');
        !localStorage.getItem('apar_miniscrollbar') && localStorage.setItem('apar_miniscrollbar', 'true');
        !localStorage.getItem('livet_zonahora') && localStorage.setItem('livet_zonahora', '[{"pais":"CL","lugar":"Santiago","offnor":"-3.0","offdst":"-4.0","dston":"false"}]');
        !localStorage.getItem('livet_tiempo') && localStorage.setItem('livet_tiempo', 3);
        !localStorage.getItem('apar_usuariobig') && localStorage.setItem('apar_usuariobig', getI18nMsg('apar_usuariobig'));
        !localStorage.getItem('apar_usuariosmall') && localStorage.setItem('apar_usuariosmall', getI18nMsg('apar_usuariosmall'));
        !localStorage.getItem('opcional_pcrnum') && localStorage.setItem('opcional_pcrnum', 15);
        !localStorage.getItem('code') && localStorage.setItem("code", parseInt(new Date().getTime() / 1000) + '' + parseInt(1000 + Math.round(Math.random() * 8999)));
        !localStorage.getItem('apar_tilegrad') && localStorage.setItem('apar_tilegrad', 'true');
    }
    chrome.management.getAll(function (lista) {
        lista.forEach(function (itm, i) {
            if (!itm.isApp || !itm.enabled || MT.modelBase[itm.id]) return;
			if(typeof itm.icons == 'undefined') return;
            var dict = {
                hashid: itm.id,
                etiqueta: itm.name,
                link: itm.appLaunchUrl,
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
            dict.bloque = "group_2";
            tilebkp.splice(-1, 0, dict);
        });
        MT.miniDB.abrir().then(function () {
        }).then(MT.miniDB.cursor).then(function (lista) {
            if (lista.length == 0) {
                var pivot = document.getElementById('pivot');
                var bloque = null;
                var tileCount = 0;
                var tileOrden = 0;
                tilebkp.forEach(function (itm) {
                    var tile = new Tile(itm);
                    tile.orden = tileOrden;
                    tileOrden++;
                    MT.miniDB.setTile(tile).then(function () {
                        tileCount++;
                        if (tileCount == tilebkp.length) {
                            localStorage.setItem('instalado', true);
                            fn();
                        }
                    });
                });
            }
        });
    });
};