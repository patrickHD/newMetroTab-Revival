var subfun = {};
(function() {
    'use strict';
    var arg = localStorage.getItem("remindData") ? localStorage.getItem("remindData") : '{"gameTile":{"pubDateTime":"0","num":"0"}}';
    $.get(apiUrl + "metroApi/getRemind.php?arg=" + arg + "&t=" + new Date().getDay(), function(data) {
        if (data) {
            remindData = JSON.parse(data);
            if (remindData.gameTile.num > 0) {
                $("#menu-restaurarTiles").addClass("redPoint");
                $("#usuario").append('<div id ="redPoint" style="height:11px;width:11px;background: url(/img/circle.png);right:20px;top:20px;position: absolute"></div>');
            }
        }
    });
    console.log('Iniciando la carga de LiveTiles predefinidas');
    var activfun = [],
        imgRegex = (/(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[a-zA-Z0-9_])+\.(?:jpg|jpeg|png)(\?[\w=&;]+)?)(?="|'|&quot;)/i);
    //notif = ['outlook', 'facebook', 'tumblr', 'btcwatch', 'gmail', 'devart', 'flickr', 'rss', 'gplus', 'clima'];

    function errorHandler(error) {
        console.error(error.message);
    }

    function HTMLparser(codigo) {
        var docu = document.implementation.createHTMLDocument('');
        docu.write(codigo);
        //docu.documentElement.setAttribute("xmlns", docu.documentElement.namespaceURI);
        return docu; //new XMLSerializer().serializeToString(docu);
    }

    subfun.tilebtcwatch = {
        url: 'http://bitcoin-otc.com/quotes.json',
        iniciar: function() {
            asyncXHR(this.url).then(function(req) {
                if (req.status === 200)
                    return JSON.parse(req.responseText);
                else
                    throw new Error('Error en la carga del API Bitcoin');
            }, errorHandler).done(function(json) {
                if (!json) return;

                new LiveCards(MT.modelBase.tilebtcwatch).unico().genCard({
                    subtitle: 'Act: ' + new Date(json.timestamp * 1000).toLocaleTimeString(),
                    text: ['USD: ' + json.ticker.USD.ask, 'EUR: ' + json.ticker.EUR.ask]
                });
            }, errorHandler);
        }
    };

    subfun.tilefacebook = {
        url: 'https://www.facebook.com/desktop_notifications/counts.php?latest=0&latest_read=0',
        cambiarTile: function(res) {
            if (!res) return;
            var i, b,
                dest = MT.modelBase.tilefacebook.DOM;
            dest.tile.classList.add('notificacion');
            for (i = 0; i < 3; i++) {
                if (res[i] > 0) {
                    b = document.createElement('div');
                    b.className = 'item' + i;
                    b.setAttribute('data-numero', res[i]);
                    dest.icon.appendChild(b);
                }
            }
        },
        iniciar: function() {
            asyncXHR(this.url).then(function(req) {
                if (req.status === 200) {
                    try {
                        var cont = JSON.parse(req.responseText),
                            res = [];
                        res[0] = 0;
                        res[1] = cont.inbox.unread || 0;
                        res[2] = cont.notifications.num_unread || 0;
                        if (res.reduce(function(a, b) { return a + b; }) > 0)
                            return res;
                    } catch (e) {}
                } else
                    throw new Error('Error en la carga del API de notificaciones de Facebook');
            }, errorHandler).done(this.cambiarTile, errorHandler);
        }
    };

    subfun.tileyahoomail = {
        url: 'http://us.mg5.mail.yahoo.com/ws/mail/v2.0/formrpc?appid=YahooMailNeo&m=ListFolders&o=json&resetMessengerUnseen=true&wssid=',
        cambiarTile: function(num) {
            if (num > 0)
                new LiveCards(MT.modelBase.tileyahoomail).genNumero(num);
        },
        iniciar: function() {
            this.url = (localStorage.getItem('yahoomailurl') || this.url);
            localStorage.removeItem('urlyahoomail');
            asyncXHR(this.url).then(function(req) {
                if (req.status === 200) {
                    var i, fol,
                        data = JSON.parse(req.responseText),
                        unread = 0;
                    //console.log('Datos desde la API de Yahoo', data.folder);
                    for (i = 0; fol = data.folder[i]; i++) {
                        //if(fol.isSystem === "false" || fol.folderInfo.name === "Inbox") {
                        if (fol.folderInfo.name === "Inbox") {
                            unread = parseInt(fol.unread);
                            break;
                        }
                    }
                    return unread;
                } else if (req.status == 500) {
                    var data = JSON.parse(req.responseText.replace(/<!\-\-.*?\-\->/, ""));
                    if (data.code == "Client.ClientRedirect.SessionIdReissue") {
                        subfun.tileyahoomail.url = data.detail.url;
                        localStorage.setItem('yahoomailurl', data.detail.url);
                        subfun.tileyahoomail.iniciar();
                    } else if (data.code == "Client.ExpiredCredentials") {
                        throw new Error('El usuario no ha iniciado sesión');
                    } else {
                        throw new Error('Error desconocido en la carga del API de Yahoo Mail');
                    }
                } else {
                    throw new Error('Error en la carga del API de Yahoo Mail');
                }
            }, errorHandler).then(this.cambiarTile, errorHandler);
        }
    }

    subfun.tilegplus = {
        url: 'https://plus.google.com/u/0/_/n/gsuc?origin=https%3A%2F%2Fplus.google.com',
        procesar: function(req) {
            if (req.status === 200) {
                var nuevos = req.responseText.split('\n')[1] || '[X]';
                nuevos = parseInt(JSON.parse(nuevos)[0]);
                //console.log('G+', nuevos);
                if (!Number.isNaN(nuevos))
                    return nuevos;
                else
                    throw new Error('Error en el parseo de la API de Google+');
            } else
                throw new Error('Error en la carga del API de notificaciones de Google+');
        },
        cambiarTile: function(num) {
            if (num == undefined) return;

            var dest = MT.modelBase.tilegplus.DOM,
                a = document.createElement('div');
            a.className = 'eventos';
            if (num === 0)
                a.classList.add('nulo');
            a.textContent = num;
            dest.icon.appendChild(a);
            //dest.tile.classList.add('notificacion');
        },
        iniciar: function() {
            asyncXHR(this.url)
                .then(this.procesar, errorHandler)
                .done(this.cambiarTile, errorHandler);
        }
    };

    subfun.tiledevart = {
        url: 'http://www.deviantart.com/global/difi.php?c[]=MessageCenter;get_folders&t=json',
        items: {
            fbcomm: "fb_comments:0:20:f",
            fbrepl: "fb_replies:0:20:f",
            fbcrit: "fb_critiques:0:20:f",
            notes: "notes_unread:0:20:f",
            notices: "notices:0:20:f",
            contest: "contests:0:20:f",
            activity: "fb_activity:0:20:f",
            corresp: "correspondence:0:20:f",
            devwdev: "devwatch:0:20:f:tg=deviations",
            devwnews: "devwatch:0:20:f:tg=news",
            devwjour: "devwatch:0:20:f:tg=journals",
            devwcrit: "devwatch:0:20:f:tg=critiques",
            devwpoll: "devwatch:0:20:f:tg=polls",
            devwforum: "devwatch:0:20:f:tg=forums",
            bulletin: "bulletins:0:20:f",
            zendesk: "zendesk:0:20:f"
        },
        procesoUno: function(req) {
            if (req.status === 200) {
                var todo = JSON.parse(req.responseText);
                if ((todo.DiFi.status == 'SUCCESS' || todo.DiFi.response.status == 'SUCCESS') && todo.DiFi.response.calls[0].response.status == 'SUCCESS')
                    return todo.DiFi.response.calls[0].response.content[0].folderid;
                else {
                    console.error(todo);
                    throw new Error('Error inesperado en el sistema DiFi de deviantArt');
                }
            } else
                throw new Error('Error en la carga del API DiFi de deviantArt');
        },
        procesoTres: function(req) {
            if (req.status === 200) {
                var num = 0,
                    data = JSON.parse(req.responseText);

                data.DiFi.response.calls.forEach(function(itm) {
                    if (itm.response.status != 'FAIL')
                        num += parseInt(itm.response.content[0].result.matches);
                });
                return num;
            } else
                throw new Error('Error en la segunda llamada al DiFi de deviantArt');
        },
        cambiarTile: function(num) {
            if (num > 0)
                new LiveCards(MT.modelBase.tiledevart).genNumero(num);
        },
        iniciar: function() {
            var incluir = localStorage.getItem('livet_da_include') || '';
            if (!incluir.length) return;

            asyncXHR(this.url)
                .then(this.procesoUno)
                .then(function(fid) {
                    var newurl = 'http://www.deviantart.com/global/difi.php?';
                    Object.keys(subfun.tiledevart.items).forEach(function(itm) {
                        newurl += (incluir.indexOf(itm) > -1 ? 'c[]=MessageCenter;get_views;' + fid + ',oq:' + subfun.tiledevart.items[itm] + '&' : '');
                    });
                    return newurl + 't=json';
                })
                .then(asyncXHR)
                .then(this.procesoTres, errorHandler)
                .done(this.cambiarTile, errorHandler);
        }
    };

    subfun.tileflickr = {
        url: 'http://www.flickr.com/explore/interesting/7days/show/',
        /*gensrc: function(elem, modo) {
         var tmp = 'http://farm{farm}.staticflickr.com/{server}/{id}_{secret}{modo}.jpg',
         i;
         for(i=0; i<elem.attributes.length; i++)
         tmp = tmp.replace('{'+ elem[i].name +'}', elem.nodeValue);
         return tmp.replace('{modo}', modo);
         },*/
        genDict: function(xmldom) {
            var i, j, dict,
                attrs = ['farm', 'height_k', 'id', 'owner', 'secret', 'server', 'title', 'url_k', 'url_n', 'width_k'],
                lista = [];
            for (i = 0; i < xmldom.length; i++) {
                dict = {};
                for (j = 0; j < attrs.length; j++)
                    dict[attrs[j]] = xmldom[i].getAttribute(attrs[j]);
                lista.push(dict);
            }
            return lista;
        },
        procesoUno: function(req) {
            if (req.status === 200) {
                var api = req.responseText.match(/global_magisterLudi = '(.+)',$/m),
                    hash = req.responseText.match(/global_auth_hash = '(.+)',$/m);
                if (api && hash) {
                    return 'http://api.flickr.com/services/rest/?method=flickr.interestingness.getRandomWeekList' +
                        '&extras=media,url_n,url_k&content_type=1&per_page=20&api_key=' + api[1] + '&auth_hash=' + hash[1];
                }
            } else
                throw new Error('Error en el parseo de la página Interesante de flickr');
        },
        procesoDos: function(req) {
            if (req.status === 200) {
                if (req.responseXML.getElementsByTagName('rsp')[0].getAttribute('stat') != 'ok') return;

                var dict = subfun.tileflickr.genDict(req.responseXML.getElementsByTagName('photo'));
                /*for(i = 0; i < fotos.length; i++) {
                 //<photo id="8012773061" owner="42463786@N06" secret="e0037b2b45" server="8448" farm="9" title="Sunrise Ratcliffe-On-Soar Lock" ispublic="1" isfriend="0" isfamily="0" media="photo" media_status="ready" url_m="http://farm9.staticflickr.com/8448/8012773061_e0037b2b45.jpg" height_m="333" width_m="500" />
                 if(fotos[i].getAttribute('media') != 'photo')
                 continue;
                 this.origen.elems.push([fotos[i].getAttribute('title'), fotos[i].getAttribute('url_n'), fotos[i].getAttribute('url_k')]);
                 }*/
                localStorage.setItem('livet_flickr_tmp', JSON.stringify(dict));
                localStorage.setItem('livet_flickr_stamp', Date.now());
                return dict;
            } else
                throw new Error('Error en la carga del API de flickr');
        },
        cambiarTile: function(lista) {
            var i, tmp, current;
            if (typeof lista == 'undefined') {
                return false;
            }
            var top = lista.length;
            if (top)
                while (--top) {
                    current = Math.floor(Math.random() * (top + 1));
                    tmp = lista[current];
                    lista[current] = lista[top];
                    lista[top] = tmp;
                }

            var slider = new LiveCards(MT.modelBase.tileflickr);
            for (i = 0; i < 8; i++)
                slider.genFoto({ img: lista[i].url_n, link: 'http://www.flickr.com/photo.gne?id=' + lista[i].id });

            slider.activar(i);
        },
        iniciar: function() {
            var tmp = localStorage.getItem('livet_flickr_tmp'),
                stamp = localStorage.getItem('livet_flickr_stamp');

            if (tmp && (new Date().getTime() - stamp < 86400000)) {
                var lista = JSON.parse(tmp);
                subfun.tileflickr.cambiarTile(lista);
            } else {
                asyncXHR(this.url)
                    .then(this.procesoUno, errorHandler)
                    .then(asyncXHR)
                    .then(this.procesoDos, errorHandler)
                    .done(this.cambiarTile, errorHandler);
            }
        }
    };

    //动态图
    subfun.tiledpx = {
        url: 'http://feed.500px.com/500px-best?format=xml',
        cambiarTile: function(lista) {
            if (!lista) return;

            var slider = new LiveCards(MT.modelBase.tiledpx);
            [].forEach.call(lista, function(itm) {
                //console.log(itm);
                var img = matchImg(itm);
                if (img)
                    slider.genFoto({ img: img, link: parseLink(itm) });
            });
            slider.activar(lista.length);
        },
        iniciar: function() {
            asyncXHR(this.url)
                .then(function(req) {
                    if (req.status === 200)
                        return req.responseXML.getElementsByTagName('item');
                    else
                        throw new Error('Error en el parseo de la página Interesante de flickr');
                })
                .done(this.cambiarTile, errorHandler);
        }
    };

    subfun.tile8vs = {
        url: apiUrl + 'metroApi/tileApi/8vs/8vs.json?t=' + new Date().getTime(),
        cambiarTile: function(lista) {
            lista = JSON.parse(lista);
            var slider = new LiveCards(MT.modelBase.tile8vs);
            for (var i = 0; i < lista.length; i++) {
                slider.genFoto({ img: lista[i].img, link: lista[i].link });
            }
            slider.activar(lista.length);
        },
        iniciar: function() {
            asyncXHR(this.url)
                .then(function(req) {
                    if (req.status === 200) {
                        return req.responseText;
                    } else {
                        throw new Error('8vs livtile error!');
                    }
                })
                .done(this.cambiarTile, errorHandler);

        }
    };

    subfun.tileam5 = {
        url: apiUrl + "metroApi/xhrRequest.php?url=" + encodeURIComponent('http://www.am5.com/ajax.php?action=feed&t=' + new Date().getTime()),
        cambiarTile: function(lista) {
            console.log(lista);
            lista = JSON.parse(lista);
            var slider = new LiveCards(MT.modelBase.tileam5);
            for (var i = 0; i < lista.length; i++) {
                slider.genFoto({ img: lista[i].img, link: lista[i].link });
            }
            slider.activar(lista.length);
        },
        iniciar: function() {
            asyncXHR(this.url)
                .then(function(req) {
                    if (req.status === 200) {
                        return req.responseText;
                    } else {
                        throw new Error('8vs livtile error!');
                    }
                })
                .done(this.cambiarTile, errorHandler);
        }
    };

    subfun.tilegmail = {
        cambiarTile: function(lista) {
            if (!lista) return;

            var mail, name, i,
                slider = new LiveCards(MT.modelBase.tilegmail);

            for (i = 0; i < lista.length; i++) {
                mail = lista[i].getElementsByTagName('email')[0].firstChild.textContent;
                name = lista[i].getElementsByTagName('name')[0].firstChild.textContent;
                slider.genCard({
                    title: (mail.split('@')[0] == name ? mail : name),
                    subtitle: lista[i].getElementsByTagName('title')[0].firstChild.textContent,
                    text: lista[i].getElementsByTagName('summary')[0].firstChild.textContent
                });
            }

            slider.activar(i);
        },
        iniciar: function() {
            if (!MT.modelBase.tilegmail.livetile) return;

            asyncXHR('https://mail.google.com/mail/feed/atom?date=' + Math.floor(Math.random() * 1000))
                .then(function(req) {
                    if (req.status === 200) {
                        var elems = req.responseXML.getElementsByTagName('entry');
                        if (elems.length > 0)
                            return elems;
                    } else
                        throw new Error('Error en la conexión en el feed de Google');
                })
                .done(this.cambiarTile, errorHandler);
        }
    };

    subfun.tileoutlook = {
        url: 'https://mail.live.com/default.aspx',
        iniciar: function() {
            asyncXHR(this.url)
                .then(function(req) {
                    if (req.status == 200) {
                        var num,
                            extrc = new RegExp('<!--item-->(.+?)<!--\/item-->', 'g'),
                            curr = extrc.exec(req.responseText);
                        if (curr) {
                            num = curr[0].match(/count="(.*?)"/);
                            if (num)
                                return num[1];
                        }
                    } else
                        throw new Error('Error en el parseo de Outlook');
                }, errorHandler)
                .done(this.cambiarTile);
        },
        cambiarTile: function(num) {
            if (num > 0)
                new LiveCards(MT.modelBase.tileoutlook).genNumero(num);
        }
    };

    subfun.tileclima = {
        //url: 'http://www.wunderground.com/cgi-bin/findweather/getForecast?brand=wxmap&ajax=1&query=',
        iniciar: function() {
            var url,
                ubic = localStorage.getItem('livet_clima_ubic');

            if (ubic) {
                ubic = ubic.split(':').pop().split('.');
                if (ubic[0] == '00000') {
                    if (!ubic[2] || isNaN(ubic[2])) return;
                    url = 'http://www.wunderground.com/auto/wxmap/global/stations/' + ubic[2] + '.html';
                } else {
                    if (!ubic[0] || isNaN(ubic[0]))
                        return 'cancelar';
                    url = 'http://www.wunderground.com/cgi-bin/findweather/getForecast?brand=wxmap&ajax=1&query=' + ubic[0] + "&t=" + new Date().getTime();
                }
                asyncXHR(url).then(this.procesar, errorHandler).done(this.cambiarTile);
            }
        },
        procesar: function(req) {
            if (req.status === 200) {
                var salida,
                    datos = HTMLparser(req.response, true),
                    actual = datos.querySelector('#condsTable'),
                    observ = datos.querySelector('#obsTable').rows,
                    forec = datos.querySelectorAll('#forecast td');

                salida = {
                    ubic: datos.querySelector('#wuSearchCity').value,
                    icono: actual.querySelector('.ico img').alt.replace(/\s/g, '').toLowerCase(),
                    temp: actual.querySelector('#temp').textContent.replace(/\s/g, ''),
                    cond: actual.querySelector('#condition').textContent,
                    hume: observ[0].textContent.trim().replace(/\s{2,}/g, ' '),
                    vien: observ[1].textContent.trim().replace(/\s{2,}/g, ' '),
                    pres: observ[3].textContent.trim().replace(/\s{2,}/g, ' ')
                };
                //console.log(forec);
                if (forec.length) {
                    salida.forec = [].map.call(forec, function(dia) {
                        return {
                            dia: dia.firstElementChild.textContent,
                            cond: dia.querySelector('img').alt,
                            max: dia.querySelector('.red').textContent,
                            min: dia.querySelector('.blue').textContent
                        }
                    });
                }

                return salida;
            } else
                throw new Error('Error en la carga de datos desde Wunderground');
        },
        cambiarTile: function(datos) {
            if (!datos) return;
            console.log('Icono Clima', datos.icono);
            //console.log('Clima', JSON.stringify(datos));

            var tlnfo = {},
                tile = MT.modelBase.tileclima,
                hora = new Date().getHours();

            if (tile.esDoble) {
                tlnfo.title = datos.ubic;
                tlnfo.subtitle = datos.temp + ' | ' + datos.cond;
                tlnfo.text = [datos.hume, datos.pres, datos.vien];
                tlnfo.img = '/appclima/' + subfun.tileclima.iconos[datos.icono][(hora > 6 && hora < 20) ? 0 : 1] + '.png';
            } else {
                tlnfo.title = datos.temp + ' | ' + datos.hume.split(' ').pop();
                tlnfo.subtitle = datos.ubic;
                tlnfo.text = [datos.cond, datos.pres, datos.vien];
            }

            var slider = new LiveCards(tile);
            slider.genCard(tlnfo);

            if (datos.forec) {
                var grilla = slider.genHolder();
                datos.forec.forEach(function(itm) {
                    var img, txt,
                        grid = document.createElement('div');
                    grid.className = 'grid grid14';

                    txt = document.createElement('div');
                    txt.textContent = itm.dia;
                    grid.appendChild(txt);

                    txt = document.createElement('div');
                    txt.textContent = [itm.min, itm.max].join(' / ');
                    grid.appendChild(txt);

                    img = new Image();
                    img.src = '/appclima/' + subfun.tileclima.iconos[itm.cond][0] + '.png';
                    grid.appendChild(img);

                    grilla.appendChild(grid);
                });
            }

            slider.activar(2);
        },
        iconos: {
            "sunny": [1, 33],
            "clear": [1, 33],
            "mostly_sunny": [3, 34],
            "mostlysunny": [3, 34],
            "partlycloudy": [4, 36],
            "partly_cloudy": [4, 36],
            "scatteredclouds": [4, 36],
            "partlysunny": [4, 36],
            "mostly_cloudy": [6, 38],
            "mostlycloudy": [6, 38],
            "cloudy": [7, 7],
            "overcast": [7, 7],
            "lightdrizzle": [12, 12],
            "rainshowers": [12, 12],
            "lightrainshowers": [12, 12],
            "lightrain": [12, 12],
            "rain": [12, 12],
            "heavyrain": [13, 40],
            "storm": [13, 13],
            "thunderstorm": [15, 15],
            "tstorms": [15, 15],
            "snow": [22, 22],
            "sleet": [19, 19],
            "flurries": [26, 26],
            "icy": [19, 19],
            "patchesoffog": [11, 11],
            "partialfog": [11, 11],
            "fog": [11, 11],
            "mist": [5, 37],
            "dust": [11, 11],
            "smoke": [11, 11],
            "haze": [11, 11],
            "hazy": [11, 11],
            "chance_of_rain": [14, 40],
            "chancerain": [14, 40],
            "chance_of_storm": [16, 42],
            "chance_of_snow": [21, 43],
            "chancesnow": [21, 43],
            "chance_of_tstorm": [17, 41],
            "chancetstorms": [17, 41],
            "chanceflurries": [26, 26],
            "chancesleet": [19, 19]
        }
    };

    subfun.tilecalendario = {
        obtener: function() {
            asyncXHR('https://www.google.com/calendar/feeds/default/allcalendars/full').then(function(req) {
                if (req.status === 200) {
                    var lista = [].map.call(req.responseXML.querySelectorAll('entry'), function(item) {
                        var over = item.getElementsByTagNameNS('http://schemas.google.com/gCal/2005', 'overridename');
                        return [
                            (over.length ? over.item(0).getAttribute('value') : item.querySelector('title').textContent),
                            item.getElementsByTagNameNS('http://schemas.google.com/gCal/2005', 'color').item(0).getAttribute('value'),
                            item.querySelector('content').getAttribute('src')
                        ];
                    });
                    localStorage.setItem('livet_urlscalendar', JSON.stringify(lista));
                }
            });
        },
        iniciar: function() {}
    };

    subfun.tilelinkedin = {
        iniciar: function() {
            return;
            asyncXHR('http://www.linkedin.com/inbox/activity/notifications/v2')
                .done(function(req) {
                    if (req.status !== 200)
                        throw new Error('Problema en la conexión con la API de linkedin');

                    var i, itm, slider,
                        cont = HTMLparser(req.response).querySelectorAll('li');

                    if (cont.length) {
                        slider = new LiveCards(MT.modelBase.tilelinkedin);
                        for (i = 0; itm = cont[i]; i++) {
                            slider.genCard({
                                img: itm.querySelector('img').src.replace('40_40', '80_80'),
                                subtitle: itm.querySelector('.name').textContent,
                                text: itm.querySelector('strong').textContent
                            });
                        }
                        slider.activar();
                    }
                }, errorHandler);
        }
    };

    subfun.hhglljfmpijadbpkalkclnhlncncdono = {
        iniciar: function() {
            var datos = (localStorage.getItem('rssauthhead') || '').split(',');
            if (datos.length < 3 || datos[0] != 'ino') return;

            if ('hhglljfmpijadbpkalkclnhlncncdono' in MT.modelBase)
                subfun.tilerss.tiletarget = MT.modelBase.hhglljfmpijadbpkalkclnhlncncdono;

            asyncXHR('https://www.inoreader.com/reader/atom/user/' + datos[2] + '/state/com.google/reading-list?output=json&n=15', {
                headers: { 'Authorization': 'GoogleLogin auth=' + datos[1] }
            }).then(function(req) {
                if (req.status === 200) {
                    var info = JSON.parse(req.responseText);
                    return info.items.map(function(itm) {
                        return {
                            body: (itm.summary.content || itm.content),
                            title: itm.title,
                            feed_title: itm.origin.title,
                            url: (itm.canonical || itm.alternate)[0].href
                        }
                    });
                }
            }).done(subfun.tilerss.procesar, errorHandler);
        }
    };

    subfun.tilerss = {
        tiletarget: MT.modelBase.tilerss,
        iniciar: function() {
            if ('hhglljfmpijadbpkalkclnhlncncdono' in MT.modelBase)
                return;

            var opcion = subfun.tilerss.tiletarget.link;
            if (opcion.indexOf('digg.com') > -1) {
                subfun.rssdigg.iniciar();
            } else if (opcion.indexOf('inoreader') > -1) {
                subfun.hhglljfmpijadbpkalkclnhlncncdono.iniciar();
            }
        },
        procesar: function(lista) {
            if (!lista) return;

            var slider = new LiveCards(subfun.tilerss.tiletarget);

            lista.every(function(data, i) {
                var itm = {};
                itm.img = matchImg(data.body);
                itm.title = data.title;
                itm.subtitle = data.feed_title;
                itm.link = data.url;

                asyncIMG(itm.img)
                    .then(function(img) {
                        if (img.naturalWidth > 150)
                            return img;
                        else
                            throw new Error('Imagen pequeña');
                    }, function(img) {
                        throw new Error('Fallo en la URL');
                    }).done(function(img) {
                        slider.genFoto(itm);
                    }, function(err) {
                        //console.warn(err.message, itm.img);
                        itm.text = itm.subtitle;
                        itm.subtitle = itm.title;
                        delete itm.title;
                        delete itm.img;
                        slider.genCard(itm);
                    });
                return i < 15;
            });

            slider.activar(lista.length);
        }
    };

    subfun.rssdigg = {
        url: 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://www.digg.com/rss/index.xml',
        intentos: 3,
        procesar: function(req) {
            if (req.status === 200) {
                try {
                    var info = JSON.parse(req.responseText);
                    var data = info.responseData.feed.entries;
                    return data.map(function(itm) {
                        var _itm = {};
                        _itm['body'] = itm.content || '';
                        _itm['url'] = itm.link || "#";
                        _itm['title'] = (itm.title && itm.title.replace(/\"/g, "")) || "";
                        _itm['feed_title'] = _itm['title'];
                        return _itm;
                    });
                } catch (e) {
                    throw new Error('Error en la carga del API de Digg: ' + info.mesg);
                }
            } else {
                throw new Error('Error en la carga del API de Digg');
            }
        },
        iniciar: function() {
            asyncXHR(this.url).then(this.procesar, function(req) {
                if (!!(subfun.rssdigg.intentos--))
                    subfun.rssdigg.iniciar();
            }).done(subfun.tilerss.procesar, errorHandler);
        }
    };

    //匹配item中的图片
    function matchImg(nodo) {
        var div, res;
        if (nodo) {
            if (typeof nodo == 'string') {
                res = imgRegex.exec(nodo);
            } else if ('nodeName' in nodo) {
                div = document.createElement('div');
                div.appendChild(nodo);
                res = imgRegex.exec(div.innerHTML);
            }
        }
        return (res ? res[0] : null);
        //var img = div.querySelector('img');
        //return (img ? img.src : null);
    }

    function genDict(xmldom) {
        var itm, j,
            dict = {};
        for (itm = xmldom.firstElementChild; itm; itm = itm.nextElementSibling) {
            dict[itm.nodeName] = {};
            dict[itm.nodeName].txt = itm.textContent;
            if (itm.attributes.length > 0) {
                for (j = 0; j < itm.attributes.length; j++)
                    dict[itm.nodeName][itm.attributes[j].nodeName] = itm.attributes[j].value ? itm.attributes[j].value : itm.attributes[j].nodeValue;
            }
        }
        return dict;
    }

    //获取链接地址
    function parseLink(xmlitem) {
        var dato = xmlitem.getElementsByTagName('feedburner:origLink');
        if (dato.length)
            return dato[0].textContent;

        dato = xmlitem.getElementsByTagName('link');
        if (dato.length)
            return dato[0].getAttribute('href') || dato[0].textContent;
    }

    function liveRSSReqHandler(req) {
        var esquema;
        if (req.status == 200 && req.responseXML) {
            esquema = {};
            esquema.badge = req.responseXML.getElementsByTagName('badge')[0];
            esquema.entries = req.responseXML.getElementsByTagName('item');
            if (!esquema.entries.length)
                esquema.entries = req.responseXML.getElementsByTagName('entry');
        }
        return esquema;
    }

    function liveRSSCardGen(tile, lista) {
        if (!lista) return;

        var elem, itm, i,
            slider = new LiveCards(tile);

        if (lista.badge) {
            slider.genNumero(lista.badge.value);
            return;
        }

        [].every.call(lista.entries, function(data, i) {
            var elem = genDict(data),
                itm = {};
            itm.img = matchImg(data);
            itm.title = elem.title.txt;
            itm.link = parseLink(data);

            asyncIMG(itm.img)
                .then(function(img) {
                    if (img.naturalWidth > 150)
                        return img;
                    else
                        throw new Error('Imagen pequeña');
                }, function(img) {
                    throw new Error('Fallo en la URL');
                }).done(function(img) {
                    slider.genFoto(itm);
                }, function(img) {
                    itm.subtitle = itm.title;
                    //itm.title = tile.etiqueta;
                    itm.text = (elem.content || elem.summary || elem['content:encoded'] || elem.description || { txt: null }).txt;
                    if (itm.text)
                        itm.text = itm.text.replace(/<[^>]+?>/g, '').replace(/&nbsp;|[\n\r]+/g, ' '),
                        delete itm.title;
                    delete itm.img;
                    slider.genCard(itm);
                });
            return i < 20;
        });

        slider.activar(lista.entries.length);
    }

    [].forEach.call(document.querySelectorAll('.tile.app'), function(itm) {
        var tam = (itm.dataset.ancho == 4 ? (itm.dataset.alto == 2 ? 'wide' : 'large') : 'normal');
        chrome.extension.sendMessage(itm.id, { type: 'livetile', size: tam }, function(info) {
            if (!info || !info.items || info.items.length === 0)
                return;
            console.log('Respuesta desde la extensión ' + itm.id, info);

            var slider = new LiveCards(MT.modelBase[itm.id]);

            [].every.call(info.items, function(elem, i) {
                switch (elem.type || info.type) {
                    case 'photo':
                        slider.genFoto(elem);
                        break;
                    case 'card':
                        slider.genCard(elem);
                        break;
                    case 'bignum':
                        slider.granNumero(elem);
                        break;
                    case 'number':
                        slider.genNumero(elem);
                        break;
                }
                return i < 20;
            });

            slider.activar(info.items.length);
        });
    });

    Object.keys(subfun).forEach(function(tile) {
        if (tile in MT.modelBase)
            subfun[tile].iniciar();
    });

    Object.keys(MT.modelBase).forEach(function(id) {
        if (!MT.modelBase[id].livetile) return;
        if (MT.modelBase[id].rssurl) {
            asyncXHR(MT.modelBase[id].rssurl || MT.modelBase[id].notificador)
                .then(function(req) {
                    return [MT.modelBase[id], liveRSSReqHandler(req)];
                }, errorHandler)
                .spread(liveRSSCardGen)
                .done();
        }
    });
})();