var $ = window.jQuery;
$(function() {
    console.log('jqgood');
});
(function() {

    function onerror(e) {
        console.error(e);
    }

    function configuraciones() {
        // instalado realiza la comprobacion del tipo de archivo en la importacion
        var contenido,
            lista = 'instalado,bloques_info,apar_bgcolor,apar_bgimg,livet_clima_ubic,livet_da_include,livet_zonahora'.split(','),
            salida = {};

        lista.forEach(function(itm) {
            salida[itm] = localStorage.getItem(itm);
        });

        [].forEach.call(document.querySelectorAll('.autosave'), function(itm) {
            !!localStorage.getItem(itm.name) && (salida[itm.name] = localStorage.getItem(itm.name));
        });

        return salida;
    }

    function downloadfile(output, name) {
        $("<a/>", {
                "download": name,
                "href": "data:application/json," + encodeURIComponent(JSON.stringify(output))
            }).appendTo("body")
            .click(function() {
                $(this).remove()
            })[0].click()
    }

    function bajarArchivo(salida, nombre) {
        downloadfile(salida, nombre);
        var a = document.createElement('a'),
            event = new CustomEvent('click'),
            contenido = new Blob([JSON.stringify(salida, null, 2)], { type: 'text/plain;charset=UTF-8' });
        a.download = nombre;
        if (typeof window.webkitURL != "undefined") {
            a.href = window.webkitURL.createObjectURL(contenido);
        } else if (typeof window.URL != "undefined") {
            a.href = window.URL.createObjectURL(contenido);
        }
        console.log(event);
        a.dispatchEvent(event);
    }

    var archivo = {
        tiles: function() {
            MT.miniDB.cursor().then(function(lista) {
                //console.log(JSON.stringify(lista));
                return [lista, 'metrotab_tiles.json'];
            }).spread(bajarArchivo);
        },
        config: function() {
            Q.fcall(configuraciones).then(function(lista) {
                return [lista, 'metrotab_config.json'];
            }).spread(bajarArchivo);
        }
    };

    function guardarSync(obj) {
        var defer = Q.defer();
        chrome.storage.sync.set(obj, function(res) {
            defer.resolve(res);
        });
        return defer.promise;
    }

    var nube = {
        config: function() {
            Q.fcall(configuraciones).then(function(lista) {
                if ('apar_usuarioimg' in lista && lista.apar_usuarioimg.length > 50)
                    delete lista.apar_usuarioimg;
                if ('apar_bgimg' in lista && lista.apar_bgimg.length > 50)
                    delete lista.apar_bgimg;
                return { configuracion: lista };
            }).then(guardarSync);
        }
    };

    function importar() {
        var fr = new FileReader();
        fr.onload = function(evt) {
            try {
                var elem = JSON.parse(evt.target.result);
            } catch (e) {
                alert(getI18nMsg("data_error"));
                return;
            }
            // Listado de Tiles
            if (isFinite(elem.length)) {
                var a = Array();
                for (var i = 0; i < elem.length; i++) {
                    if (typeof elem[i].chromeapp == "undefined") {
                        a.push(elem[i]);
                    }
                }
                elem = a;
                var proms = elem.map(MT.miniDB.setTile);
                Q.allSettled(proms).done(function(res) {
                    var errores = 0;
                    res.forEach(function(itm) {
                        if (!itm) errores++;
                    });
                    setTimeout(function() {
                        location.href = "inicio.html";
                    }, 3000);

                }, onerror);
                // Listado de configuración
            } else if (elem.instalado) {
                Object.keys(elem).forEach(function(itm) {
                    localStorage.setItem(itm, elem[itm]);
                });
                setTimeout(function() {
                    location.href = "inicio.html";
                }, 3000);
            }
        };
        fr.readAsText(this.files[0], 'UTF-8');
    }

    window.addEventListener(windowLoad, function() {
        MT.miniDB.abrir();
        document.getElementById('ioconfig_outbtntiles').addEventListener('click', archivo.tiles, false);
        document.getElementById('ioconfig_outbtnconfig').addEventListener('click', archivo.config, false);
        document.getElementById('ioconfig_inbtnfile').addEventListener('change', importar, false);
    }, false);
})();