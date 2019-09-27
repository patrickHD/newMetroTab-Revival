var ui_locale = chrome.i18n.getMessage("@@ui_locale");
var apiUrl = "http://hao.newtabplus.com/";
var webUrl = "http://www.newmetrotab.com/";
if (ui_locale == "zh" || ui_locale == "zh_CN") {
    apiUrl = "http://hao.weidunewtab.com/";
    webUrl = "http://cn.newmetrotab.com/";
}
String.prototype.rTrim = function () {
    var re_r = /([.\w]+)[\/]*$/
    return this.replace(re_r, "$1")
};
var windowLoad = "load";
var mousewheel = "mousewheel";
var transitionEnd = "webkitTransitionEnd";
var animationEnd = "webkitAnimationEnd";

var getI18nMsg = function (msgname) {
    try {
        return chrome.i18n.getMessage(msgname);
    } catch (err) {
        return msgname;
    }
};

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
})();

var matcheSelector = function (obj, tag) {
    return obj.webkitMatchesSelector(tag);
};

(function () {
    var direccion, stytam, pivot, base;

    function traducirTodo() {
        var i, itm, msg,
            nl = new RegExp('<newline>', 'g'),
            labels = document.getElementsByClassName('i18n'),
            titulos = {
                inicio: 'newtabh1',
                opciones: 'opcionesh1',
                clima: 'h1tile_clima',
                camara: 'h1tile_camara'
            };

        // Change the label for each element with classname .i18n
        for (i = 0; itm = labels[i]; i++) {
            msg = getI18nMsg(itm.dataset.i18n).replace(nl, '\n');
            if (itm.tagName == 'INPUT') {
                if (itm.type == 'text')
                    itm.placeholder = msg;
                else
                    itm.value = msg;
            } else {
                itm.innerHTML = msg;
            }
        }

        // Change title according to page/miniapp
        msg = titulos[location.pathname.substr(1).split('.')[0]];
        documentTitle = localStorage.getItem("apar_newtabh1") ? localStorage.getItem("apar_newtabh1") : getI18nMsg('aext_name');
        if (msg == 'newtabh1')
            document.title = documentTitle;
        else if (msg)
            document.title = documentTitle + ' // ' + getI18nMsg(msg);

        // Cleaning
        labels = itm = null;
    }

    function comprimir() {
        if (!pivot.querySelector('.tile') || pivot.style.display == 'none' || pivot.classList.contains('aplastado'))
            return;

        var bloque, tile, target, newpos, dimant, col, coln, a, b,
            coord = {},
        //posfin = {},
            dict = {},
            margen = 4,
        //base = (parseInt(modelo.width) + 2 * margen) / tilemod.dataset.ancho,
            bloques = pivot.getElementsByClassName('bloque'),
            altocont = Math.max(base * 4 + 1, bloques[0].offsetHeight);

        console.warn('Base: ', base, ' | Altura: ', altocont, ' | Bloques: ', bloques.length); // Debugging

        // Absolute column number, allows opening animation
        coln = -1;

        // For every block
        for (a = 0; bloque = bloques[a]; a++) {
            if (bloque.childElementCount == 0)
                continue;

            bloque.style.minWidth = 2 * base + 'px';

            coln++;
            // Position of the upper start corner
            target = [0, 0];
            // Dimensions of the previous tile
            dimant = [0, 0];
            // Position of the current column inside this block
            col = 0;

            // For every tile in the block
            for (b = 0; tile = bloque.children[b]; b++) {
                if (tile.style.display == 'none')
                    continue;
                // Calculate position of the lower end corner
                newpos = [target[0] + (base * tile.dataset.ancho), target[1] + (base * tile.dataset.alto)];

                //console.log(tile.id, target, newpos, col); // Debugging

                // If target is at the end of the column or it's wider than the available space
                if (newpos[0] > col + (4 * base)) {
                    // ...put it in the next line
                    target = [col, target[1] + dimant[1]];
                    // and recalculate for this tile
                    b--;
                    continue;
                }

                // If target is lower than the screen size
                if (newpos[1] >= altocont) {
                    // Move the column position to the next column
                    col += 4 * base;
                    // Add one to the absolute column count
                    coln++;
                    // Move tile to the next column
                    target = [col, 0];
                    // And recalculate for this tile
                    b--;
                    continue;
                }

                tile.style[direccion] = target[0] + 'px';
                tile.style.top = target[1] + 'px';
                dimant = [base * tile.dataset.ancho, base * Math.max(2, tile.dataset.alto)];

                coord[tile.id] = coln;
                tile.dataset.colum = coln;
                delete tile.dataset.medio;
                if (tile.dataset.ancho == 2)
                    tile.dataset.medio = (target[0] != col ? 'der' : 'izq');

                target[0] = newpos[0];// mover el target uno al lado
                if (newpos[0] == 4 * base)// si el siguiente se va a poner al final
                    target = [col, newpos[1]];// indicar que lo ponga abajo
            }
            bloque.style.width = (!!target[1] ? col + 4 * base : target[0]) + 'px';
            dict[bloque.id] = [base * 4, col];
            if (bloque.dataset.titulo)
                dict[bloque.id].push(bloque.dataset.titulo);
        }
        localStorage.setItem('bloques_info', JSON.stringify(dict));
        localStorage.setItem('tiles_col', JSON.stringify(coord));
    }

    function genSize(base) {
        stytam.innerText = '\
.tile.tam11 { width: ' + (base - 8) + 'px;  height: ' + (base - 8) + 'px; }\
.tile.tam22 { width: ' + (2 * base - 8) + 'px; height: ' + (2 * base - 8) + 'px;}\
.tile.tam42 { width: ' + (4 * base - 8) + 'px; height: ' + (2 * base - 8) + 'px;}\
.tile.tam44 { width: ' + (4 * base - 8) + 'px; height: ' + (4 * base - 8) + 'px;}';
    }

    function cargaGlobal() {
        pivot = document.getElementById('pivot');
        base = 60;//Math.min(100, Math.max(50, parseInt(localStorage.getItem('apar_tambase') || 60)));
        direccion = (getComputedStyle(document.body).direction == 'ltr' ? 'left' : 'right');
        var est = document.createElement('link');
        est.rel = 'stylesheet';
        est.type = 'text/css';
        est.href = localStorage.getItem('apar_miniscrollbar') == 'true' ? '/scrollmin.css' : '/scrollnor.css';
        document.head.appendChild(est);
        est = null;
        traducirTodo();

        if (pivot && pivot.classList.contains('comprimir')) {
            if (base != 60) {
                stytam = document.createElement('style');
                document.head.appendChild(stytam);
                genSize(base);
            }
            document.addEventListener('comprimir', comprimir, false);
            window.addEventListener('resize', comprimir, false);
        }

        document.addEventListener('appCargada', function () {
            var spl = document.getElementById('splash');
            if (spl) {
                spl.addEventListener(transitionEnd, function () {
                    this.parentNode.removeChild(this);
                }, false);
                spl.classList.add('saliendo');
            }
        }, false);

        window.removeEventListener(windowLoad, cargaGlobal, false);
    }

    window.addEventListener(windowLoad, cargaGlobal, false);
})();