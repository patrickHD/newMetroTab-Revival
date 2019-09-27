(function () {
    'use strict';
    function cargarTodo() {
        [].forEach.call(document.getElementsByClassName('autoload'), function (itm) {
            var a, b, c, d, i;

            if (itm.type == 'file')
                return;

            var dato = localStorage.getItem(itm.name);
            if (!dato)
                return;

            try {
                if (itm.classList.contains('base64'))
                    dato = atob(dato);
            } catch (e) {
            }

            if (itm.type == 'checkbox')
                itm.checked = !!(dato != 'false');
            else
                itm.value = dato;

            var dep = document.querySelectorAll('[data-dependencias]');
            [].forEach.call(dep, function (itm) {
                var dependencias = itm.dataset.dependencias.split(',').map(function (d) {
                    return document.getElementById(d);
                });
                itm.addEventListener('change', function () {
                    dependencias.forEach(function (el) {
                        el.disabled = !itm.checked;
                    });
                }, false);
            });
        });
    }

    function guardarOpcion(evt) {
        var target = evt.target;
        while (!target.classList.contains('autosave')) {
            target = target.parentNode;
            if (!this.contains(target)) return;
        }
        evt.stopPropagation();
        //evt.preventDefault();

        var val = (target.type == 'checkbox') ? target.checked : target.value;

        if (target.classList.contains('base64'))
            val = btoa(val);

        localStorage.setItem(target.name, val);
    }

    window.addEventListener(windowLoad, function () {
        document.body.addEventListener('change', guardarOpcion, false);
        document.getElementById("back").onclick = function(){
            location.href = "inicio.html";
        };
        var navpan = document.querySelectorAll('nav');
        [].forEach.call(navpan, function (nav) {

            nav.addEventListener('click', function (evt) {
                if (evt.target.nodeName == 'NAV') return;
                if (evt.target.id == 'rDefault') {
                    if (confirm(getI18nMsg("RestoreDefault") + "?")) {
                        localStorage.clear();
                        MT.miniDB.abrir();
                        try{
                            var store = MT.miniDB.objStore("readwrite");
                            var req = store.clear();
                            req.onsuccess = function (evt) {
                                MT.utiles.instalacion(1,function(){
                                    location.href = "inicio.html";
                                });
                            };
                            req.onerror = function (evt) {
                                console.log(evt);
                            };
                        }catch(e){
                            MT.utiles.instalacion(1,function(){
                                location.href = "inicio.html";
                            });
                        }
                    }
                    return;
                }
                evt.preventDefault();

                var i, itm, acc;
                for (i = nav.firstElementChild; i; i = i.nextElementSibling) {
                    acc = (i.hash == evt.target.hash) ? 'add' : 'remove';
                    i.classList[acc]('activo');
                    if (!!i.hash) {
                        itm = document.querySelector(i.hash);
                        itm.style.cssText = null;
                        itm.classList[acc]('visible');
                    }
                }
            }, false);
        });
        if(!!location.hash){
            [].forEach.call(navpan, function (itm) {
                itm.firstElementChild.click();
            });
            var lateral = document.querySelector("#lateral");
            var i;
            for (i = lateral.firstElementChild; i; i = i.nextElementSibling) {
                if(i.getAttribute("href")==location.hash){
                    i.click();
                }
            }
        }else{
            [].forEach.call(navpan, function (itm) {
                itm.firstElementChild.click();
            });
        }

        cargarTodo();

        setTimeout(function () {
            var apiline = document.getElementById('acerca_infoapi');
            apiline.innerHTML = apiline.textContent.replace('API', '<a style="text-decoration:underline" href="http://dev.frabarz.cl/metrotab/#api" target="_blank">API</a>');
        }, 2000);

        document.querySelector('.btnfeedback').addEventListener('click', function (e) {
            e.preventDefault();
            if (e.target.href)
                window.open(e.target.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=no,height=600,width=600');
        });
    }, false);

})();