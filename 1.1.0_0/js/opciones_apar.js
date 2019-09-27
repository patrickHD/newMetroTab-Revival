(function () {
    "use strict";

    function cargarOpciones(cont) {
        var data, indi, radb, def, itm, i;

        data = localStorage.getItem('apar_usuarioimg');
        document.getElementById('avataractual').src = data ? data : '/img/avatar.svg';

        def = "burbujas,tribal,circulos,cuadrados,bgbetafish,bgflowers,bgnight,bgnighttown,\
bgdna,bgbird,bgcurves,bgbrush,bgrobots,bgease,bgnaturelines".split(',').map(function (itm) {
                return '/img/' + itm + '.svg';
            });
        radb = document.getElementById('bgimgradios');
        data = localStorage.getItem('apar_bgimg') || '/img/circulos.svg';
        if (data != "on") {
            cont.style.backgroundImage = 'url(' + data + ')';
        }
        if (def.indexOf(data) === -1) {
            def.push(data);
        }
        def.push(null);
        indi = Object.keys(def);
        var hasOn = false;
        for (i = 0; i < indi.length; i++) {
            itm = document.createElement('input');
            itm.type = 'radio';
            itm.className = 'cuadro';
            itm.name = 'apar_bgimg';
            itm.value = def[indi[i]];
            if (itm.value != 'on') {
                    itm.style.backgroundImage = 'url(' + itm.value + ')';
            }else{
                if(hasOn){
                    break;
                }else{
                    hasOn = true;
                }
            }
            if (itm.value == data)
                itm.checked = true;
            radb.appendChild(itm);
        }
        radb.innerHTML += '<div class="like5"><a href="http://www.like5.com/?ref=metro" target="_blank"><image src="http://www.like5.com/images/moreWallpapers.png" border="0" width="260" height="80" /></a></div>';
        radb.addEventListener('click', function (evt) {
            if (evt.target.nodeName == 'INPUT') {
                if(evt.target.value == "on")
                    cont.style.backgroundImage = "none";
                else
                    cont.style.backgroundImage = 'url(' + evt.target.value + ')';
                localStorage.setItem('apar_bgimg', evt.target.value);
                document.getElementById("apar_custombg").value = null;
            }
        }, false);

        //itm.checked ? 'contain' : 'cover';
        data = localStorage.getItem('apar_ajustbg') == 'true';
        cont.style.backgroundSize = data ? 'contain' : null;
        document.getElementById('apar-ajustbg').checked = data;

        radb = data = indi = null;
    }

    function redon(i) {
        return Math.round(i * 255);
    }

    function hsv2rgb(arr) {
        var h, s, v, ans, i, f, p, q, t;
        // Make sure our arguments stay in-range
        h = Math.max(0, Math.min(360, arr[0]));
        s = Math.max(0, Math.min(1, arr[1]));
        v = Math.max(0, Math.min(1, arr[2]));
        // Achromatic (grey)
        if (s === 0) {
            return 'rgb(' + [v, v, v].map(redon) + ')';
        }
        h /= 60; // sector 0 to 5
        i = Math.floor(h);
        f = h - i; // factorial part of h
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));
        if (i === 1)
            ans = [q, v, p];
        else if (i === 2)
            ans = [p, v, t];
        else if (i === 3)
            ans = [p, q, v];
        else if (i === 4)
            ans = [t, p, v];
        else if (i === 5)
            ans = [v, p, q];
        else
            ans = [v, t, p];

        return 'rgb(' + ans.map(redon) + ')';
    }

    function cuatricromia(hsv) {
        return [
            hsv2rgb(hsv.slice(0, 3)),
            hsv2rgb(hsv.slice(3, 6)),
            hsv2rgb([hsv[0], hsv[1], hsv[2] - 0.15]),
            hsv2rgb([hsv[3], hsv[4] - 0.2, (hsv[5] + 1) / 3])
        ];
    }

    var preTemas = [
        //'#252525,#F3B200,#202020,#363636', '#252525,#77B900,#202020,#363636', '#252525,#2572EB,#202020,#363636', '#252525,#AD103C,#202020,#363636',
        //'#2E1700,#632F00,#261300,#543A24', '#4E0000,#B01E00,#380000,#61292B', '#4E0038,#C1004F,#40002E,#662C58', '#2D004E,#7200AC,#250040,#4C2C66',
        //'#1F0068,#4617B4,#180052,#423173', '#001E4E,#006AC1,#001940,#2C4566', '#004D60,#008287,#004050,#306772', '#004A00,#199900,#003E00,#2D652B',
        //'#15992A,#00C13F,#128425,#3A9548', '#E56C19,#FF981D,#C35D15,#C27D4F', '#B81B1B,#FF2E12,#9E1716,#AA4344', '#B81B6C,#FF1D77,#9E165B,#AA4379',
        //'#691BB8,#AA40FF,#57169A,#7F6E94', '#1B58B8,#1FAEFF,#16499A,#6E7E94', '#569CE3,#56C5FF,#4294DE,#6BA5E7', '#00AAAA,#00D8CC,#008E8E,#439D9A',
        //'#83BA1F,#91D100,#7BAD18,#94BD4A', '#D39D09,#E1B700,#C69408,#CEA539', '#E064B7,#FF76BC,#DE4AAD,#E773BD', '#696969,#00A3A3,#424242,#40D6D6',
        //'#696969,#FE7C22,#424242,#FF8C3B'
        [0, 0, 0.114, 0, 0, 0.369],
        [350, 1, 0.553, 350, 1, 0.745],
        [0, 1, 0.675, 12.6, 1, 0.969],
        [19.6, 1, 0.827, 26.6, 0.831, 1],
        [39.1, 1, 0.922, 42.4, 0.827, 1],
        [40.3, 0.910, 1, 45.9, 0.898, 1],
        [77.5, 0.665, 0.608, 79.2, 1, 0.796],
        [85.2, 1, 0.635, 79.2, 1, 0.796],
        [87.5, 1, 0.471, 82.8, 1, 0.690],
        [98.5, 1, 0.318, 111, 1, 0.600],
        [120, 1, 0.235, 111, 1, 0.600],
        [153, 0.578, 0.631, 139, 0.569, 0.800],
        [181, 1, 0.561, 180, 1, 0.824],
        [180, 1, 0.663, 180, 1, 0.824],
        [201, 1, 0.941, 199, 0.745, 1],
        [206, 1, 0.718, 202, 1, 0.882],
        [213, 1, 0.506, 196, 1, 1],
        [223, 0.870, 0.271, 205, 1, 0.776],
        [258, 1, 0.322, 258, 0.872, 0.706],
        [270, 1, 0.565, 275, 1, 0.702],
        [283, 0.830, 0.576, 283, 0.706, 0.788],
        [283, 0.686, 0.686, 283, 0.624, 0.898],
        [321, 1, 0.549, 324, 0.792, 0.753],
        [325, 1, 0.671, 320, 1, 0.976],
        [321, 1, 0.918, 313, 0.627, 1]
    ];

    window.addEventListener(windowLoad, function () {
        var tabpreview = document.getElementById('tabpreview'),
            styledir = document.getElementById('themecolor'),
            slidbg = document.getElementById('apar-bgcolor'),
            slidfg = document.getElementById('apar-fgcolor');

        cargarOpciones(tabpreview);

// ########################
// Usuario
        document.getElementById('usuarioimg').addEventListener('change', function (evt) {
            evt.preventDefault();

            var file = this.files[0],
                reader = new FileReader();
            reader.onload = function (evt) {
                var img = new Image();
                img.onload = function () {
                    var canv = document.createElement("canvas"),
                        h = Math.ceil(img.height / img.width * 96);
                    canv.width = 96;
                    canv.height = h;
                    canv.getContext("2d").drawImage(img, 0, 0, 96, h);
                    h = canv.toDataURL();
                    localStorage.setItem('apar_usuarioimg', h);
                    document.getElementById('avataractual').src = h;
                };
                img.src = evt.target.result;
                console.log(evt.target);
            };
            reader.readAsDataURL(this.files[0]);
        }, false);

        function aplicarTema(val) {
            var color;

            if (typeof val == 'string') {
                color = val.split(';');
                slidbg.value = color[4];
                slidfg.value = color[5];
            } else if ('value' in this) {
                //color[0] = 'hsl('+ this.value +', 100%, 20%)';
                //color[1] = 'hsl('+ this.value +', 55%, 30%)';
                //color[2] = 'hsl('+ this.value +', 100%, 10%)';
                //color[3] = 'hsl('+ this.value +', 100%, 40%)';
                color = cuatricromia([slidbg.valueAsNumber, 1, 0.35, slidfg.valueAsNumber, 1, 0.65]);
            } else {
                color = cuatricromia(preTemas[this.rel]);
                slidbg.value = preTemas[this.rel][0];
                slidfg.value = preTemas[this.rel][3];
            }

            var txt = '.experimental::after { content: "' + getI18nMsg('experimental') + '"; font-size: 0.75em; line-height: 1em; vertical-align: text-top; color: #F00;}';
            txt += '#tabpreview, #bgimgradios input { background-color: ' + color[2] + '; }\n';
            txt += '#apar-bgcolor::-webkit-slider-thumb { background-color: ' + color[0] + '; }\n';
            txt += '#apar-fgcolor::-webkit-slider-thumb { background-color: ' + color[1] + '; }\n';
            txt += 'h1, h2, h3, a, nav.subseccion a.activo { color: ' + color[1] + ' ;}\n';
            txt += 'header a.activo, input[type=checkbox]:checked { background-color: ' + color[1] + '; }\n';
            txt += '#tabpreview span, .relojtzreg { background-color: ' + color[3] + '; }\n';
            txt += 'input[type=radio].cuadro:checked, .seleccionado { outline-color: ' + color[1] + '; }\n';
            txt += 'input[type=radio].cuadro:checked::before, .seleccionado::before { border-top-color: ' + color[1] + '; }\n';

            styledir.innerHTML = txt;
            color.push(slidbg.value);
            color.push(slidfg.value);
            localStorage.setItem('apar_bgcolor', color.join(';'));
        }

        slidbg.addEventListener('change', aplicarTema, false);
        slidfg.addEventListener('change', aplicarTema, false);

        var schemes = document.getElementById('colorschemes');
        preTemas.forEach(function (tema, i) {
            var cor = cuatricromia(tema),
                cua = document.createElement('span');
            cua.className = 'schemeopcion';
            cua.rel = i;
            cua.style.borderColor = cor[0];
            cua.style.backgroundColor = cor[1];

            cua.addEventListener('click', aplicarTema, false);
            schemes.appendChild(cua);
        });
        aplicarTema(localStorage.getItem('apar_bgcolor'));

        document.getElementById('apar_custombg').addEventListener('change', function () {
            var that = this,
                fr = new FileReader();
            fr.onload = function (evt) {
                var actual = document.getElementById('apar-bgimgact'),
                    uri = evt.target.result;
                tabpreview.style.backgroundImage = 'url(' + uri + ')';
                localStorage.setItem('apar_bgimg', uri);
                actual.style.backgroundImage = 'url(' + uri + ')';
                actual.value = uri;
                actual.checked = true;

                that = null;
            };
            fr.readAsDataURL(this.files[0]);
        }, false);

        // Detalles
        document.getElementById('apar-ajustbg').addEventListener('change', function () {
            tabpreview.style.backgroundSize = this.checked ? 'contain' : null;
        }, false);

        document.querySelector('nav.subseccion').addEventListener(mousewheel, function (evt) {
            evt.stopPropagation();
            this.scrollLeft -= evt.wheelDelta / 1.5;
        }, false);

    }, false);

})();